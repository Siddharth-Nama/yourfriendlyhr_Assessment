import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return Response.json(
        {
          success: false,
          error: "Gemini API key not configured. Please add GEMINI_API_KEY to your environment variables.",
          needsSetup: true,
        },
        { status: 402 },
      )
    }

    const { exercises, meals } = await request.json()

    const client = new GoogleGenerativeAI(apiKey)
    const model = client.getGenerativeModel({ model: "gemini-2.5-flash" })

    const images: Record<string, string> = {}
    const allItems = [...exercises, ...meals]

    // Generate images for each exercise and meal
    for (const item of allItems) {
      try {
        const result = await model.generateContent({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Generate a clear, realistic image showing a person doing the exercise or eating the meal: "${item}". Make it professional and appropriate for a fitness app. Show proper form if it's an exercise.`,
                },
              ],
            },
          ],
        })

        // Extract image from response if available
        const response = result.response
        if (response.candidates && response.candidates[0]?.content?.parts) {
          const part = response.candidates[0].content.parts.find((p: any) => p.inlineData)
          if (part && part.inlineData) {
            images[item] = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`
          } else {
            // Fallback to placeholder if image generation didn't produce an image
            images[item] = `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(item + " fitness")}`
          }
        } else {
          images[item] = `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(item + " fitness")}`
        }
      } catch (itemError) {
        console.error(`Error generating image for ${item}:`, itemError)
        // Use placeholder on error
        images[item] = `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(item + " fitness")}`
      }
    }

    return Response.json({
      success: true,
      images,
    })
  } catch (error) {
    console.error("Error generating images:", error)

    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    const isMissingKey =
      errorMessage.includes("API key") || errorMessage.includes("401") || errorMessage.includes("403")

    return Response.json(
      {
        success: false,
        error: isMissingKey
          ? "Gemini API key is invalid or missing. Please check your GEMINI_API_KEY environment variable."
          : "Failed to generate images. Using placeholders instead.",
        details: errorMessage,
      },
      { status: isMissingKey ? 401 : 200 }, // Return 200 with placeholders if image generation fails
    )
  }
}
