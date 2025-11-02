"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Loader } from "lucide-react"

export function ExerciseImageGallery({ exercises, mealItems }) {
  const [images, setImages] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("exercises")

  useEffect(() => {
    generateImages()
  }, [])

  const generateImages = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/generate-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exercises: exercises || ["Barbell Squat", "Push Ups", "Bench Press"],
          meals: mealItems || ["Grilled Chicken Salad", "Oatmeal Bowl", "Protein Shake"],
        }),
      })
      const data = await response.json()
      if (data.success) {
        setImages(data.images)
      } else {
        console.warn("Image generation warning:", data.error)
        setError(data.error || "Using placeholder images")
      }
    } catch (error) {
      console.error("Error generating images:", error)
      setError("Failed to generate images. Using placeholders instead.")
    }
    setLoading(false)
  }

  const allItems =
    activeTab === "exercises"
      ? exercises || ["Barbell Squat", "Push Ups", "Bench Press"]
      : mealItems || ["Grilled Chicken Salad", "Oatmeal Bowl", "Protein Shake"]

  return (
    <Card className="bg-black/40 backdrop-blur-md border border-purple-600/30 p-6 shadow-lg hover:border-purple-600/60 transition-all">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold gradient-text">Visual Guide</h3>
        <div className="flex gap-2">
          <Button
            onClick={() => setActiveTab("exercises")}
            className={`${activeTab === "exercises" ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"} rounded-full px-4 py-2 transition-colors`}
          >
            Exercises
          </Button>
          <Button
            onClick={() => setActiveTab("meals")}
            className={`${activeTab === "meals" ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"} rounded-full px-4 py-2 transition-colors`}
          >
            Meals
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-purple-600/20 border-l-4 border-purple-400 p-4 mb-6 flex gap-3 rounded">
          <AlertCircle className="w-5 h-5 text-purple-300 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-200">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-2" />
            <p className="text-gray-400">Generating visual guides...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {allItems.map((item, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="bg-black/60 border border-purple-600/30 rounded-lg overflow-hidden h-48 mb-2 relative hover:border-purple-600/60 transition-all">
                <img
                  src={images[item] || `/placeholder.svg?height=200&width=200&query=${encodeURIComponent(item)}`}
                  alt={item}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src =
                      `/placeholder.svg?height=200&width=200&query=${encodeURIComponent(item)}`
                  }}
                />
              </div>
              <p className="text-sm font-semibold text-gray-300 text-center">{item}</p>
            </div>
          ))}
        </div>
      )}

      <Button onClick={generateImages} className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white">
        Regenerate Images
      </Button>
    </Card>
  )
}
