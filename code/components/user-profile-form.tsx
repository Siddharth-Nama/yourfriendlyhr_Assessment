"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { planStorage } from "@/lib/storage"

const STEPS = [
  { id: 1, title: "Basic Info", fields: ["name", "age", "gender"] },
  { id: 2, title: "Measurements", fields: ["height", "weight"] },
  { id: 3, title: "Fitness Goals", fields: ["goal", "level"] },
  { id: 4, title: "Preferences", fields: ["location", "diet"] },
  { id: 5, title: "Additional", fields: ["medicalHistory", "stressLevel"] },
]

export function UserProfileForm({ onSubmit }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [showSaved, setShowSaved] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Male",
    height: "",
    weight: "",
    goal: "Weight Loss",
    level: "Beginner",
    location: "Home",
    diet: "Non-Veg",
    medicalHistory: "",
    stressLevel: "Moderate",
  })

  useEffect(() => {
    const savedProfile = planStorage.getProfile()
    if (savedProfile) {
      setFormData(savedProfile)
    }
  }, [])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    planStorage.saveProfile(formData)
    onSubmit(formData)
  }

  const step = STEPS[currentStep - 1]
  const progress = (currentStep / STEPS.length) * 100

  return (
    <div className="relative z-20">
      <Card className="premium-card p-8 backdrop-blur-md">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-gray-300">
              Step {currentStep} of {STEPS.length}
            </span>
            <span className="text-sm font-bold text-purple-500">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden border border-purple-600/20">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-violet-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Title */}
        <div className="mb-8 slide-up">
          <h2 className="text-3xl font-black gradient-text mb-2">{step.title}</h2>
          <p className="text-gray-400 font-light">Let's get to know your fitness profile</p>
        </div>

        {/* Form Fields */}
        <div className="space-y-6 mb-8">
          {currentStep === 1 && (
            <>
              <div>
                <Label htmlFor="name" className="text-white font-bold mb-2 block">
                  Full Name
                </Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="h-12 bg-gray-900 border-purple-600/30 text-white placeholder-gray-500 focus:border-purple-600 focus:ring-purple-600"
                />
              </div>
              <div>
                <Label htmlFor="age" className="text-white font-bold mb-2 block">
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  className="h-12 bg-gray-900 border-purple-600/30 text-white placeholder-gray-500 focus:border-purple-600 focus:ring-purple-600"
                />
              </div>
              <div>
                <Label className="text-white font-bold mb-3 block">Gender</Label>
                <div className="flex gap-4">
                  {["Male", "Female", "Other"].map((option) => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="gender"
                        value={option}
                        checked={formData.gender === option}
                        onChange={(e) => handleInputChange("gender", e.target.value)}
                        className="w-5 h-5 accent-purple-600"
                      />
                      <span className="text-gray-300 group-hover:text-white transition-colors">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div>
                <Label htmlFor="height" className="text-white font-bold mb-2 block">
                  Height (cm)
                </Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="180"
                  value={formData.height}
                  onChange={(e) => handleInputChange("height", e.target.value)}
                  className="h-12 bg-gray-900 border-purple-600/30 text-white placeholder-gray-500 focus:border-purple-600 focus:ring-purple-600"
                />
              </div>
              <div>
                <Label htmlFor="weight" className="text-white font-bold mb-2 block">
                  Weight (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="75"
                  value={formData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  className="h-12 bg-gray-900 border-purple-600/30 text-white placeholder-gray-500 focus:border-purple-600 focus:ring-purple-600"
                />
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <div>
                <Label className="text-white font-bold mb-3 block">Fitness Goal</Label>
                <div className="space-y-3">
                  {["Weight Loss", "Muscle Gain", "Endurance", "Strength", "Flexibility"].map((option) => (
                    <label
                      key={option}
                      className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.goal === option
                          ? "border-purple-600 bg-purple-600/10"
                          : "border-purple-600/20 bg-gray-900/50 hover:border-purple-600/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="goal"
                        value={option}
                        checked={formData.goal === option}
                        onChange={(e) => handleInputChange("goal", e.target.value)}
                        className="w-5 h-5 accent-purple-600"
                      />
                      <span className="text-white font-medium">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-white font-bold mb-3 block">Current Level</Label>
                <div className="flex gap-3">
                  {["Beginner", "Intermediate", "Advanced"].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleInputChange("level", option)}
                      className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${
                        formData.level === option
                          ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg shadow-purple-600/50"
                          : "bg-gray-900 text-gray-300 border border-purple-600/20 hover:border-purple-600/50"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {currentStep === 4 && (
            <>
              <div>
                <Label className="text-white font-bold mb-3 block">Workout Location</Label>
                <div className="grid grid-cols-3 gap-3">
                  {["Home", "Gym", "Outdoor"].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleInputChange("location", option)}
                      className={`py-3 rounded-lg font-bold transition-all ${
                        formData.location === option
                          ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg shadow-purple-600/50"
                          : "bg-gray-900 text-gray-300 border border-purple-600/20 hover:border-purple-600/50"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-white font-bold mb-3 block">Dietary Preference</Label>
                <div className="space-y-2">
                  {["Veg", "Non-Veg", "Vegan", "Keto"].map((option) => (
                    <label key={option} className="flex items-center gap-3 p-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="diet"
                        value={option}
                        checked={formData.diet === option}
                        onChange={(e) => handleInputChange("diet", e.target.value)}
                        className="w-5 h-5 accent-purple-600"
                      />
                      <span className="text-gray-300 group-hover:text-white transition-colors">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {currentStep === 5 && (
            <>
              <div>
                <Label htmlFor="medical" className="text-white font-bold mb-2 block">
                  Medical History (Optional)
                </Label>
                <textarea
                  id="medical"
                  placeholder="Any injuries or health conditions?"
                  value={formData.medicalHistory}
                  onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
                  className="w-full h-24 p-3 border-2 border-purple-600/30 bg-gray-900 text-white rounded-lg focus:outline-none focus:border-purple-600 placeholder-gray-500"
                />
              </div>
              <div>
                <Label className="text-white font-bold mb-3 block">Stress Level</Label>
                <div className="flex gap-3">
                  {["Low", "Moderate", "High"].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleInputChange("stressLevel", option)}
                      className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                        formData.stressLevel === option
                          ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg shadow-purple-600/50"
                          : "bg-gray-900 text-gray-300 border border-purple-600/20 hover:border-purple-600/50"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <Button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="px-6 bg-gray-900 text-white border-2 border-purple-600/30 hover:border-purple-600/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            variant="outline"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>
          {currentStep === STEPS.length ? (
            <Button onClick={handleSubmit} className="premium-button flex items-center gap-2">
              Generate My Plan <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleNext} className="premium-button flex items-center gap-2">
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
