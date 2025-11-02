"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, RotateCcw, AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExerciseImageGallery } from "./exercise-image-gallery"
import { ExportMenu } from "./export-menu"
import { PlanProgressTracker } from "./plan-progress-tracker"
import { GalaxyBackground } from "./galaxy-background"

export function PlanDisplay({ profile, onBack }: { profile: any; onBack: () => void }) {
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("workout")
  const [copied, setCopied] = useState(false)
  const [needsSetup, setNeedsSetup] = useState(false)

  useEffect(() => {
    generatePlan()
  }, [])

  const generatePlan = async () => {
    setLoading(true)
    setError(null)
    setNeedsSetup(false)
    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })
      const data = await response.json()
      if (data.success && data.plan) {
        setPlan(data.plan)
      } else {
        setError(data.error || "Failed to generate plan")
        if (data.needsSetup) {
          setNeedsSetup(true)
        }
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.")
      console.error("Error generating plan:", err)
    }
    setLoading(false)
  }

  const handleCopy = () => {
    if (plan) {
      const fullText = `${plan.workout}\n\n${plan.diet}\n\n${plan.tips}\n\n${plan.motivation}`
      navigator.clipboard.writeText(fullText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center">
        <GalaxyBackground />
        <div className="relative z-10">
          <Card className="bg-black/40 backdrop-blur-md border border-purple-600/30 p-8 text-center shadow-xl">
            <div className="animate-spin mb-4 flex justify-center">
              <div className="w-12 h-12 border-4 border-purple-600/30 border-t-purple-500 rounded-full" />
            </div>
            <p className="text-white font-semibold">Creating your personalized fitness plan...</p>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <GalaxyBackground />
        <div className="relative z-10 p-4 md:p-8 max-w-4xl mx-auto min-h-screen flex flex-col justify-center">
          <Button
            onClick={onBack}
            variant="ghost"
            className="flex items-center gap-2 text-white hover:bg-purple-600/20 mb-8 w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Card className="bg-black/40 backdrop-blur-md border-2 border-purple-600/50 p-8 shadow-xl">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-purple-500 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-white mb-2">
                  {needsSetup ? "Setup Required" : "Error Generating Plan"}
                </h2>
                <p className="text-gray-300 mb-4">{error}</p>
                {needsSetup && (
                  <div className="bg-purple-600/20 border border-purple-600/50 rounded p-4 mb-4">
                    <p className="text-sm text-gray-200 mb-3">
                      To use the AI fitness plan generator, you need to set up your Gemini API key. Add{" "}
                      <code className="bg-black/40 px-2 py-1 rounded text-xs font-mono">GEMINI_API_KEY</code> to your
                      environment variables.
                    </p>
                    <a
                      href="https://makersuite.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-medium transition-colors"
                    >
                      Get Gemini API Key →
                    </a>
                  </div>
                )}
                <Button
                  onClick={generatePlan}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={needsSetup}
                >
                  {needsSetup ? "Setup Required" : "Try Again"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  const currentContent = activeTab === "workout" ? plan?.workout : activeTab === "diet" ? plan?.diet : plan?.tips

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <GalaxyBackground />

      <div className="relative z-10 max-w-4xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <Button
            onClick={onBack}
            variant="ghost"
            className="flex items-center gap-2 text-white hover:bg-purple-600/20"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold gradient-text">Your Fitness Plan</h1>
          <div className="flex gap-2 flex-wrap">
            <ExportMenu fullPlan={plan?.fullPlan || ""} profile={profile} />
            <Button
              onClick={generatePlan}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
            >
              <RotateCcw className="w-4 h-4" />
              Regenerate
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <PlanProgressTracker />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-black/40 backdrop-blur-sm rounded-lg border border-purple-600/30 p-1">
            <TabsTrigger
              value="workout"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-white rounded transition-colors"
            >
              💪 Workout
            </TabsTrigger>
            <TabsTrigger
              value="diet"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-white rounded transition-colors"
            >
              🥗 Diet
            </TabsTrigger>
            <TabsTrigger
              value="tips"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-white rounded transition-colors"
            >
              ✨ Tips
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workout" className="space-y-4">
            <Card className="bg-black/40 backdrop-blur-md border border-purple-600/30 p-6 shadow-lg hover:border-purple-600/60 transition-all">
              <h2 className="text-2xl font-bold gradient-text mb-4">Weekly Workout Plan</h2>
              <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">{plan?.workout}</div>
            </Card>
          </TabsContent>

          <TabsContent value="diet" className="space-y-4">
            <Card className="bg-black/40 backdrop-blur-md border border-purple-600/30 p-6 shadow-lg hover:border-purple-600/60 transition-all">
              <h2 className="text-2xl font-bold gradient-text mb-4">Personalized Diet Plan</h2>
              <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">{plan?.diet}</div>
            </Card>
          </TabsContent>

          <TabsContent value="tips" className="space-y-4">
            <Card className="bg-black/40 backdrop-blur-md border border-purple-600/30 p-6 shadow-lg hover:border-purple-600/60 transition-all">
              <h2 className="text-2xl font-bold gradient-text mb-4">Tips & Lifestyle Advice</h2>
              <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">{plan?.tips}</div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <ExerciseImageGallery
            exercises={["Barbell Squat", "Push Ups", "Bench Press", "Deadlift", "Pull Ups", "Plank"]}
            mealItems={["Grilled Chicken Salad", "Oatmeal Bowl", "Protein Shake", "Brown Rice", "Salmon"]}
          />
        </div>

        {/* Daily Motivation Quote */}
        <Card className="bg-gradient-to-r from-purple-600/40 to-cyan-600/40 backdrop-blur-md border border-purple-600/30 text-white p-8 mt-8 shadow-xl hover:border-purple-600/60 transition-all">
          <h3 className="text-xl font-bold mb-2">Today's Motivation</h3>
          <p className="text-lg italic text-gray-100">
            "{plan?.motivation || "Your only limit is you. Push harder today than yesterday!"}"
          </p>
        </Card>

        {/* Save Options */}
        <div className="mt-8 bg-black/40 backdrop-blur-md rounded-lg p-6 border border-purple-600/30">
          <h3 className="text-lg font-bold text-white mb-4">Save Your Plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={handleCopy} className="bg-purple-600 hover:bg-purple-700 text-white">
              {copied ? "Copied!" : "Copy to Clipboard"}
            </Button>
            <Button
              onClick={() => {
                const link = document.createElement("a")
                link.href = "data:text/plain;charset=utf-8," + encodeURIComponent(plan?.fullPlan || "")
                link.download = "fitness-plan.txt"
                link.click()
              }}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              Download as Text
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
