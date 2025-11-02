"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"

interface PlanDetailsProps {
  title: string
  content: string
  icon: string
}

export function PlanDetails({ title, content, icon }: PlanDetailsProps) {
  const [expanded, setExpanded] = useState(true)

  // Parse content into structured sections
  const sections = content.split(/(?=^#{1,3}\s)/m).filter((s) => s.trim())

  return (
    <div className="space-y-4">
      {sections.map((section, idx) => {
        const [heading, ...body] = section.split("\n")
        return (
          <Card
            key={idx}
            className="bg-black/40 backdrop-blur-md border border-purple-600/30 shadow-md overflow-hidden hover:border-purple-600/60 transition-all"
          >
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full flex items-center justify-between p-4 hover:bg-purple-600/10 transition-colors"
            >
              <div className="text-left">
                <h3 className="font-semibold text-white text-lg">{heading.replace(/^#+\s/, "")}</h3>
              </div>
              {expanded ? (
                <ChevronUp className="w-5 h-5 text-purple-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expanded && (
              <div className="px-4 pb-4 text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">
                {body.join("\n").trim()}
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}
