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

    const profile = await request.json()

    // Validate required fields
    if (!profile.name || !profile.age || !profile.goal) {
      return Response.json({ success: false, error: "Missing required profile fields" }, { status: 400 })
    }

    const client = new GoogleGenerativeAI(apiKey)
    const model = client.getGenerativeModel({ model: "gemini-2.5-flash" })

    const prompt = `You are an expert fitness coach and nutritionist. Create a personalized fitness plan based on the following user profile:

Name: ${profile.name}
Age: ${profile.age}
Gender: ${profile.gender}
Height: ${profile.height}cm
Weight: ${profile.weight}kg
Fitness Goal: ${profile.goal}
Current Level: ${profile.level}
Workout Location: ${profile.location}
Dietary Preference: ${profile.diet}
Medical History: ${profile.medicalHistory || "None"}
Stress Level: ${profile.stressLevel}

IMPORTANT: Format your response EXACTLY as follows with these headers:

## WORKOUT PLAN
[Provide a detailed weekly workout plan with exercises, sets, reps, and rest times appropriate for their goal and level. Include daily breakdown.]

## DIET PLAN
[Provide personalized meal plan with breakfast, lunch, dinner, and snacks that matches their dietary preference and fitness goal. Include macro recommendations.]

## TIPS & MOTIVATION
[Provide 5-7 lifestyle tips, posture advice, hydration tips, sleep recommendations, and stress management techniques specific to their profile.]

## DAILY MOTIVATION
[Provide ONE powerful, personalized motivational quote that speaks directly to their fitness journey.]`

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    // Parse sections from response
    const workoutMatch = text.match(/## WORKOUT PLAN\n([\s\S]*?)(?=## DIET PLAN|$)/)
    const dietMatch = text.match(/## DIET PLAN\n([\s\S]*?)(?=## TIPS & MOTIVATION|$)/)
    const tipsMatch = text.match(/## TIPS & MOTIVATION\n([\s\S]*?)(?=## DAILY MOTIVATION|$)/)
    const motivationMatch = text.match(/## DAILY MOTIVATION\n([\s\S]*?)$/)

    return Response.json({
      success: true,
      plan: {
        workout: workoutMatch?.[1]?.trim() || "Unable to parse workout plan",
        diet: dietMatch?.[1]?.trim() || "Unable to parse diet plan",
        tips: tipsMatch?.[1]?.trim() || "Unable to parse tips",
        motivation: motivationMatch?.[1]?.trim() || "Your journey begins today!",
        fullPlan: text,
      },
    })
  } catch (error) {
    console.error("Error generating fitness plan:", error)

    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    const isMissingKey =
      errorMessage.includes("API key") || errorMessage.includes("401") || errorMessage.includes("403")

    return Response.json(
      {
        success: false,
        error: isMissingKey
          ? "Gemini API key is invalid or missing. Please check your GEMINI_API_KEY environment variable."
          : "Failed to generate fitness plan. Please try again.",
        details: errorMessage,
        needsSetup: isMissingKey,
      },
      { status: isMissingKey ? 401 : 500 },
    )
  }
}
