// Removed - functionality moved to API route
export async function generateFitnessPlan(profile: any) {
  const response = await fetch("/api/generate-plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  })
  return response.json()
}
