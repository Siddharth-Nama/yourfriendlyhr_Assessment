export async function POST(request: Request) {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY
    if (!apiKey) {
      return Response.json(
        {
          success: false,
          error: "ElevenLabs API key not configured. Please add ELEVENLABS_API_KEY to your environment variables.",
          needsSetup: true,
        },
        { status: 402 },
      )
    }

    const { text, voiceId = "21m00Tcm4TlvDq8ikWAM" } = await request.json() // Default to Rachel voice

    if (!text) {
      return Response.json({ success: false, error: "Text is required" }, { status: 400 })
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("ElevenLabs API error:", error)
      return Response.json(
        {
          success: false,
          error: "Failed to generate speech",
          details: error,
        },
        { status: response.status },
      )
    }

    const audioBuffer = await response.arrayBuffer()
    const base64Audio = Buffer.from(audioBuffer).toString("base64")

    return Response.json({
      success: true,
      audio: `data:audio/mpeg;base64,${base64Audio}`,
    })
  } catch (error) {
    console.error("Error generating speech:", error)

    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    const isMissingKey = errorMessage.includes("API key") || errorMessage.includes("401")

    return Response.json(
      {
        success: false,
        error: isMissingKey ? "ElevenLabs API key is invalid or missing." : "Failed to generate speech",
        details: errorMessage,
        needsSetup: isMissingKey,
      },
      { status: isMissingKey ? 401 : 500 },
    )
  }
}
