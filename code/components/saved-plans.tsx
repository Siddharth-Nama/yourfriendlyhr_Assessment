"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { planStorage, type SavedPlan } from "@/lib/storage"
import { Trash2, ArrowRight } from "lucide-react"

interface SavedPlansProps {
  onSelect?: (plan: SavedPlan) => void
}

export function SavedPlans({ onSelect }: SavedPlansProps) {
  const [plans, setPlans] = useState<SavedPlan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setPlans(planStorage.getAllPlans())
    setLoading(false)
  }, [])

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this plan?")) {
      planStorage.deletePlan(id)
      setPlans(planStorage.getAllPlans())
    }
  }

  if (loading) return null

  if (plans.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900">Your Saved Plans</h3>
      <div className="grid gap-4">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className="bg-white p-4 border-2 border-gray-200 hover:border-orange-500 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">{plan.profile.name}</p>
                <p className="text-sm text-gray-600">
                  {plan.profile.goal} • {plan.profile.level}
                </p>
                <p className="text-xs text-gray-500 mt-1">{new Date(plan.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => onSelect?.(plan)}
                  className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
                >
                  View <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => handleDelete(plan.id)}
                  variant="outline"
                  className="text-red-500 hover:bg-red-50 border-red-200"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
