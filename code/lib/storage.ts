// Local storage utility for saving fitness plans
export const storageKeys = {
  PLANS: "fitness_plans",
  CURRENT_PLAN: "current_plan",
  PROFILE: "user_profile",
}

export interface SavedPlan {
  id: string
  profile: any
  plan: any
  createdAt: string
  updatedAt: string
}

export const planStorage = {
  getAllPlans: (): SavedPlan[] => {
    if (typeof window === "undefined") return []
    try {
      const plans = localStorage.getItem(storageKeys.PLANS)
      return plans ? JSON.parse(plans) : []
    } catch (error) {
      console.error("Error reading plans:", error)
      return []
    }
  },

  savePlan: (profile: any, plan: any): SavedPlan => {
    const newPlan: SavedPlan = {
      id: Date.now().toString(),
      profile,
      plan,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (typeof window !== "undefined") {
      const allPlans = planStorage.getAllPlans()
      allPlans.push(newPlan)
      try {
        localStorage.setItem(storageKeys.PLANS, JSON.stringify(allPlans))
      } catch (error) {
        console.error("Error saving plan:", error)
      }
    }

    return newPlan
  },

  getPlan: (id: string): SavedPlan | null => {
    const plans = planStorage.getAllPlans()
    return plans.find((p) => p.id === id) || null
  },

  deletePlan: (id: string): boolean => {
    if (typeof window === "undefined") return false
    try {
      const allPlans = planStorage.getAllPlans()
      const filtered = allPlans.filter((p) => p.id !== id)
      localStorage.setItem(storageKeys.PLANS, JSON.stringify(filtered))
      return true
    } catch (error) {
      console.error("Error deleting plan:", error)
      return false
    }
  },

  saveProfile: (profile: any): void => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKeys.PROFILE, JSON.stringify(profile))
      } catch (error) {
        console.error("Error saving profile:", error)
      }
    }
  },

  getProfile: (): any => {
    if (typeof window === "undefined") return null
    try {
      const profile = localStorage.getItem(storageKeys.PROFILE)
      return profile ? JSON.parse(profile) : null
    } catch (error) {
      console.error("Error reading profile:", error)
      return null
    }
  },
}
