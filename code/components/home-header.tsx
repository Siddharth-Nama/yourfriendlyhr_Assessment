"use client"

import { Card } from "@/components/ui/card"
import { Zap, TrendingUp, ZapIcon } from "lucide-react"

export function HomeHeader() {
  return (
    <Card className="relative premium-card p-8 mb-12 overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-transparent to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-600/5 rounded-full blur-3xl -z-10" />

      <div className="relative z-10 flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-600/20 rounded-xl border border-purple-600/50 hover:border-purple-500 transition-colors">
              <Zap className="w-7 h-7 text-purple-500" />
            </div>
            <h2 className="text-5xl font-black gradient-text glow-pulse">FitAI Coach</h2>
          </div>
          <p className="text-gray-400 text-lg font-light tracking-wide">Your AI-Powered Personal Fitness Assistant</p>
        </div>
      </div>

      {/* Feature cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-4 rounded-lg bg-purple-600/5 border border-purple-600/20 hover:border-purple-600/50 hover:bg-purple-600/10 transition-all">
          <div className="bg-purple-600/30 p-3 rounded-lg border border-purple-600/50">
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">100% Custom</div>
            <div className="text-xs text-gray-400">AI-Generated Plans</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-lg bg-purple-600/5 border border-purple-600/20 hover:border-purple-600/50 hover:bg-purple-600/10 transition-all">
          <div className="bg-purple-600/30 p-3 rounded-lg border border-purple-600/50">
            <ZapIcon className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">Voice & Images</div>
            <div className="text-xs text-gray-400">Visual Guides</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-lg bg-purple-600/5 border border-purple-600/20 hover:border-purple-600/50 hover:bg-purple-600/10 transition-all">
          <div className="bg-purple-600/30 p-3 rounded-lg border border-purple-600/50">
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">Progress Tracking</div>
            <div className="text-xs text-gray-400">Built-In Tools</div>
          </div>
        </div>
      </div>
    </Card>
  )
}
