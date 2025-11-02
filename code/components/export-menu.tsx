"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, Copy, Share2 } from "lucide-react"

interface ExportMenuProps {
  fullPlan: string
  profile: any
  onExport?: (format: string) => void
}

export function ExportMenu({ fullPlan, profile, onExport }: ExportMenuProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  const exportAsJSON = () => {
    const dataStr = JSON.stringify({ plan: fullPlan, profile }, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `fitness-plan-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
    setFeedback("JSON exported successfully!")
    onExport?.("json")
  }

  const exportAsMarkdown = () => {
    const md = `# Your Fitness Plan
## User Profile
- Name: ${profile.name}
- Age: ${profile.age}
- Goal: ${profile.goal}
- Level: ${profile.level}

## Plan
${fullPlan}
`
    const dataBlob = new Blob([md], { type: "text/markdown" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `fitness-plan-${new Date().toISOString().split("T")[0]}.md`
    link.click()
    URL.revokeObjectURL(url)
    setFeedback("Markdown exported successfully!")
    onExport?.("markdown")
  }

  const exportAsText = () => {
    const dataBlob = new Blob([fullPlan], { type: "text/plain" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `fitness-plan-${new Date().toISOString().split("T")[0]}.txt`
    link.click()
    URL.revokeObjectURL(url)
    setFeedback("Text exported successfully!")
    onExport?.("text")
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullPlan)
      setFeedback("Copied to clipboard!")
      setTimeout(() => setFeedback(null), 2000)
    } catch {
      setFeedback("Failed to copy to clipboard")
    }
  }

  const shareLink = () => {
    const shareText = `Check out my personalized AI fitness plan! Generated with FitAI Coach.`
    if (navigator.share) {
      navigator.share({
        title: "My Fitness Plan",
        text: shareText,
      })
    } else {
      setFeedback("Share feature not available on this device")
      setTimeout(() => setFeedback(null), 2000)
    }
  }

  return (
    <div className="relative">
      <Button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:shadow-lg hover:shadow-purple-600/50 transition-all"
      >
        <Download className="w-4 h-4" />
        Export & Share
      </Button>

      {feedback && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm text-center">
          {feedback}
        </div>
      )}

      {showMenu && (
        <Card className="absolute top-full mt-2 right-0 z-50 bg-black/80 backdrop-blur-md shadow-xl border border-purple-600/30 p-0 min-w-max">
          <div className="grid grid-cols-1 gap-1 p-2">
            <button
              onClick={() => {
                exportAsText()
                setShowMenu(false)
              }}
              className="flex items-center gap-2 px-4 py-2 hover:bg-purple-600/30 rounded transition-colors text-gray-300"
            >
              <Download className="w-4 h-4" />
              <span>Export as TXT</span>
            </button>
            <button
              onClick={() => {
                exportAsJSON()
                setShowMenu(false)
              }}
              className="flex items-center gap-2 px-4 py-2 hover:bg-purple-600/30 rounded transition-colors text-gray-300"
            >
              <Download className="w-4 h-4" />
              <span>Export as JSON</span>
            </button>
            <button
              onClick={() => {
                exportAsMarkdown()
                setShowMenu(false)
              }}
              className="flex items-center gap-2 px-4 py-2 hover:bg-purple-600/30 rounded transition-colors text-gray-300"
            >
              <Download className="w-4 h-4" />
              <span>Export as Markdown</span>
            </button>
            <hr className="my-1 border-purple-600/30" />
            <button
              onClick={() => {
                copyToClipboard()
                setShowMenu(false)
              }}
              className="flex items-center gap-2 px-4 py-2 hover:bg-purple-600/30 rounded transition-colors text-gray-300"
            >
              <Copy className="w-4 h-4" />
              <span>Copy to Clipboard</span>
            </button>
            <button
              onClick={() => {
                shareLink()
                setShowMenu(false)
              }}
              className="flex items-center gap-2 px-4 py-2 hover:bg-purple-600/30 rounded transition-colors text-gray-300"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </Card>
      )}
    </div>
  )
}
