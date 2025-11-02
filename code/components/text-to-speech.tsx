"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, AlertCircle } from "lucide-react"

interface TextToSpeechProps {
  text: string
  title?: string
  className?: string
}

export function TextToSpeech({ text, title = "Listen", className = "" }: TextToSpeechProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)

  const handleSpeak = async () => {
    if (isPlaying && audioElement) {
      if (isPaused) {
        audioElement.play()
        setIsPaused(false)
      } else {
        audioElement.pause()
        setIsPaused(true)
      }
      return
    }

    setError(null)
    try {
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || "Failed to generate speech")
        return
      }

      const audio = new Audio(data.audio)
      setAudioElement(audio)
      setIsPlaying(true)
      setIsPaused(false)

      audio.onended = () => {
        setIsPlaying(false)
        setIsPaused(false)
      }

      audio.onerror = () => {
        setIsPlaying(false)
        setIsPaused(false)
        setError("Failed to play audio")
      }

      audio.play()
    } catch (err) {
      setError("Error generating speech. Please try again.")
      console.error("TTS Error:", err)
    }
  }

  const handleStop = () => {
    if (audioElement) {
      audioElement.pause()
      audioElement.currentTime = 0
    }
    setIsPlaying(false)
    setIsPaused(false)
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {error && (
        <div className="flex items-center gap-2 bg-red-50 text-red-700 p-2 rounded text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
      <div className="flex gap-2">
        <Button
          onClick={handleSpeak}
          disabled={!text}
          className={`flex items-center gap-2 ${
            isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-orange-500 hover:bg-orange-600"
          } text-white`}
        >
          {isPlaying ? (
            <>
              <VolumeX className="w-4 h-4" />
              {isPaused ? "Resume" : "Pause"}
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              {title}
            </>
          )}
        </Button>
        {isPlaying && (
          <Button onClick={handleStop} className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white">
            Stop
          </Button>
        )}
      </div>
    </div>
  )
}
