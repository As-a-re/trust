"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContentAnalyzer } from "@/components/content-analyzer"
import { ModeratedContentList } from "@/components/moderated-content-list"
import { ModeratorSettings } from "@/components/moderator-settings"
import { AnalyticsPanel } from "@/components/analytics-panel"
import { UserManagement } from "@/components/user-management"
import { AlertTriangle, CheckCircle, Clock, Settings, BarChart3, Users, Zap, Shield } from "lucide-react"
import { motion } from "framer-motion"
import { analyzeContent } from "@/lib/content-analyzer"

export type ContentItem = {
  id: string
  content: string
  timestamp: Date
  status: "approved" | "flagged" | "pending"
  confidence: number
  categories: string[]
  source?: string
  moderatedBy?: string
}

export type User = {
  id: string
  name: string
  role: "admin" | "moderator" | "viewer"
  avatar: string
}

export function ContentModerationDashboard() {
  const [activeTab, setActiveTab] = useState("analyze")
  const [moderatedContent, setModeratedContent] = useState<ContentItem[]>([
    {
      id: "1",
      content: "Great article about sustainable energy solutions!",
      timestamp: new Date(),
      status: "approved",
      confidence: 0.95,
      categories: ["positive", "environment"],
      source: "Website",
      moderatedBy: "AI System",
    },
    {
      id: "2",
      content: "This product is terrible and the company is a scam.",
      timestamp: new Date(Date.now() - 3600000),
      status: "flagged",
      confidence: 0.82,
      categories: ["negative", "accusation"],
      source: "Social Media",
      moderatedBy: "AI System",
    },
    {
      id: "3",
      content: "Check out this amazing deal on our new products.",
      timestamp: new Date(Date.now() - 7200000),
      status: "pending",
      confidence: 0.65,
      categories: ["promotional"],
      source: "Email",
      moderatedBy: null,
    },
    {
      id: "4",
      content: "I hate this service, it never works properly!",
      timestamp: new Date(Date.now() - 10800000),
      status: "flagged",
      confidence: 0.78,
      categories: ["negative", "complaint"],
      source: "Customer Review",
      moderatedBy: "AI System",
    },
    {
      id: "5",
      content: "The new update includes several bug fixes and performance improvements.",
      timestamp: new Date(Date.now() - 14400000),
      status: "approved",
      confidence: 0.92,
      categories: ["neutral", "informational"],
      source: "Release Notes",
      moderatedBy: "AI System",
    },
  ])

  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Admin User",
      role: "admin",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      name: "Moderator 1",
      role: "moderator",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "3",
      name: "Viewer User",
      role: "viewer",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ])

  const [settings, setSettings] = useState({
    sensitivityLevel: "medium",
    autoModeration: true,
    categories: {
      hate: true,
      violence: true,
      harassment: true,
      spam: true,
      misinformation: true,
      adult: true,
      profanity: true,
    },
    sources: {
      website: true,
      socialMedia: true,
      email: true,
      customerReview: true,
      forum: true,
    },
    aiModel: "advanced",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [recentActivity, setRecentActivity] = useState<{ time: Date; action: string }[]>([
    { time: new Date(Date.now() - 120000), action: "Content approved by AI" },
    { time: new Date(Date.now() - 300000), action: "Settings updated by Admin" },
    { time: new Date(Date.now() - 600000), action: "New user added: Moderator 1" },
  ])

  const handleNewContent = async (content: string, source: string) => {
    setIsLoading(true)

    try {
      // Simulate AI analysis
      const result = await analyzeContent(content, settings)

      const newItem: ContentItem = {
        id: Date.now().toString(),
        content,
        timestamp: new Date(),
        status: result.status,
        confidence: result.confidence,
        categories: result.categories,
        source,
        moderatedBy: settings.autoModeration && result.status !== "pending" ? "AI System" : null,
      }

      setModeratedContent((prev) => [newItem, ...prev])

      // Add to recent activity
      setRecentActivity((prev) => [
        { time: new Date(), action: `New content ${result.status} (${source})` },
        ...prev.slice(0, 9),
      ])
    } catch (error) {
      console.error("Error analyzing content:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateContentStatus = (id: string, status: "approved" | "flagged", moderator = "Human Moderator") => {
    setModeratedContent(
      moderatedContent.map((item) => (item.id === id ? { ...item, status, moderatedBy: moderator } : item)),
    )

    // Add to recent activity
    setRecentActivity((prev) => [
      { time: new Date(), action: `Content ${status} by ${moderator}` },
      ...prev.slice(0, 9),
    ])
  }

  const updateSettings = (newSettings: typeof settings) => {
    setSettings(newSettings)

    // Add to recent activity
    setRecentActivity((prev) => [{ time: new Date(), action: "Moderation settings updated" }, ...prev.slice(0, 9)])
  }

  const addUser = (user: Omit<User, "id">) => {
    const newUser = {
      ...user,
      id: Date.now().toString(),
    }

    setUsers((prev) => [...prev, newUser])

    // Add to recent activity
    setRecentActivity((prev) => [
      { time: new Date(), action: `New user added: ${user.name} (${user.role})` },
      ...prev.slice(0, 9),
    ])
  }

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(users.map((user) => (user.id === id ? { ...user, ...updates } : user)))

    // Add to recent activity
    const updatedUser = users.find((u) => u.id === id)
    setRecentActivity((prev) => [
      { time: new Date(), action: `User updated: ${updatedUser?.name}` },
      ...prev.slice(0, 9),
    ])
  }

  const deleteUser = (id: string) => {
    const userToDelete = users.find((u) => u.id === id)
    setUsers(users.filter((user) => user.id !== id))

    // Add to recent activity
    setRecentActivity((prev) => [
      { time: new Date(), action: `User deleted: ${userToDelete?.name}` },
      ...prev.slice(0, 9),
    ])
  }

  const stats = {
    approved: moderatedContent.filter((item) => item.status === "approved").length,
    flagged: moderatedContent.filter((item) => item.status === "flagged").length,
    pending: moderatedContent.filter((item) => item.status === "pending").length,
    total: moderatedContent.length,
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-400">Approved Content</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">{stats.approved}</div>
            <p className="text-xs text-slate-400 mt-1">
              {Math.round((stats.approved / Math.max(stats.total, 1)) * 100)}% of total content
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-400">Flagged Content</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.flagged}</div>
            <p className="text-xs text-slate-400 mt-1">
              {Math.round((stats.flagged / Math.max(stats.total, 1)) * 100)}% of total content
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-400">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{stats.pending}</div>
            <p className="text-xs text-slate-400 mt-1">
              {Math.round((stats.pending / Math.max(stats.total, 1)) * 100)}% of total content
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-400">AI Confidence</CardTitle>
            <Zap className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">
              {Math.round(
                (moderatedContent.reduce((acc, item) => acc + item.confidence, 0) /
                  Math.max(moderatedContent.length, 1)) *
                  100,
              )}
              %
            </div>
            <p className="text-xs text-slate-400 mt-1">Average confidence score</p>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="analyze" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-4">
          <TabsTrigger value="analyze" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden md:inline">Analyze</span>
          </TabsTrigger>
          <TabsTrigger value="moderated" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span className="hidden md:inline">Content</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden md:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden md:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden md:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <TabsContent value="analyze">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-200">Content Analysis</CardTitle>
                <CardDescription className="text-slate-400">
                  Submit content to be analyzed by our AI moderation system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContentAnalyzer onSubmit={handleNewContent} isLoading={isLoading} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="moderated">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-200">Moderated Content</CardTitle>
                <CardDescription className="text-slate-400">
                  Review and manage content that has been processed by the AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ModeratedContentList items={moderatedContent} onUpdateStatus={updateContentStatus} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-200">Analytics & Insights</CardTitle>
                <CardDescription className="text-slate-400">
                  View trends and patterns in content moderation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsPanel content={moderatedContent} recentActivity={recentActivity} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-200">User Management</CardTitle>
                <CardDescription className="text-slate-400">Manage moderators and system users</CardDescription>
              </CardHeader>
              <CardContent>
                <UserManagement users={users} onAddUser={addUser} onUpdateUser={updateUser} onDeleteUser={deleteUser} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-200">Moderator Settings</CardTitle>
                <CardDescription className="text-slate-400">
                  Configure the AI moderation system parameters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ModeratorSettings settings={settings} onUpdateSettings={updateSettings} />
              </CardContent>
            </Card>
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  )
}

