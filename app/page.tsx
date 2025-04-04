import { ContentModerationDashboard } from "@/components/content-moderation-dashboard"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8">
        <div className="z-10 w-full max-w-6xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
              AI-Powered Content Moderation
            </h1>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Advanced content analysis and moderation powered by artificial intelligence
            </p>
          </div>
          <ContentModerationDashboard />
        </div>
      </main>
    </div>
  )
}

