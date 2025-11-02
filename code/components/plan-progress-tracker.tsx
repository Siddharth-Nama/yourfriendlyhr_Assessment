"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { CheckCircle, Circle } from "lucide-react"

interface ProgressTrackerProps {
  onSave?: (data: any) => void
}

export function PlanProgressTracker({ onSave }: ProgressTrackerProps) {
  const [checkedDays, setCheckedDays] = useState<number[]>([])
  const [currentStreak, setCurrentStreak] = useState(0)

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  const toggleDay = (index: number) => {
    setCheckedDays((prev) => {
      const newChecked = prev.includes(index) ? prev.filter((d) => d !== index) : [...prev, index]

      // Calculate streak
      let streak = 0
      for (let i = 0; i < newChecked.length; i++) {
        if (newChecked[i] === i) streak++
        else break
      }
      setCurrentStreak(streak)

      if (onSave) {
        onSave({ checkedDays: newChecked, streak })
      }

      return newChecked
    })
  }

  return (
    <Card className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 backdrop-blur-sm p-6 border border-purple-600/30 hover:border-purple-600/60 transition-all">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">This Week's Progress</h3>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text">{currentStreak}</div>
            <div className="text-sm text-gray-400">Day Streak</div>
          </div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-600 to-cyan-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(checkedDays.length / 7) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => (
          <button
            key={index}
            onClick={() => toggleDay(index)}
            className="flex flex-col items-center justify-center p-3 rounded-lg bg-black/40 border-2 border-purple-600/30 hover:border-purple-600/60 hover:bg-purple-600/20 transition-all cursor-pointer"
          >
            {checkedDays.includes(index) ? (
              <CheckCircle className="w-5 h-5 text-purple-500 mb-1" />
            ) : (
              <Circle className="w-5 h-5 text-gray-500 mb-1" />
            )}
            <span className="text-xs font-semibold text-gray-300">{day.slice(0, 3)}</span>
          </button>
        ))}
      </div>
    </Card>
  )
}
