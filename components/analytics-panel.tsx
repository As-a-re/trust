"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts"
import { Download, Calendar, Clock } from "lucide-react"
import type { ContentItem } from "@/components/content-moderation-dashboard"

interface AnalyticsPanelProps {
  content: ContentItem[]
  recentActivity: { time: Date; action: string }[]
}

export function AnalyticsPanel({ content, recentActivity }: AnalyticsPanelProps) {
  const [timeRange, setTimeRange] = useState("7d")

  // Prepare data for charts
  const statusData = [
    { name: "Approved", value: content.filter((item) => item.status === "approved").length },
    { name: "Flagged", value: content.filter((item) => item.status === "flagged").length },
    { name: "Pending", value: content.filter((item) => item.status === "pending").length },
  ]

  const categoryData = getCategoryData(content)
  const confidenceData = getConfidenceData(content)
  const timelineData = getTimelineData(content)

  const COLORS = ["#10b981", "#ef4444", "#f59e0b", "#6366f1", "#8b5cf6", "#ec4899"]

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-200">Content Moderation Analytics</h2>
          <p className="text-sm text-slate-400">Insights and trends from your moderation data</p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px] bg-slate-700 border-slate-600 text-slate-200">
              <Calendar className="h-4 w-4 mr-2 text-slate-400" />
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              <SelectItem value="24h" className="text-slate-200 focus:bg-slate-600 focus:text-white">
                Last 24 hours
              </SelectItem>
              <SelectItem value="7d" className="text-slate-200 focus:bg-slate-600 focus:text-white">
                Last 7 days
              </SelectItem>
              <SelectItem value="30d" className="text-slate-200 focus:bg-slate-600 focus:text-white">
                Last 30 days
              </SelectItem>
              <SelectItem value="all" className="text-slate-200 focus:bg-slate-600 focus:text-white">
                All time
              </SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-200">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="bg-slate-700 border-slate-600">
          <TabsTrigger value="overview" className="data-[state=active]:bg-slate-600">
            Overview
          </TabsTrigger>
          <TabsTrigger value="categories" className="data-[state=active]:bg-slate-600">
            Categories
          </TabsTrigger>
          <TabsTrigger value="timeline" className="data-[state=active]:bg-slate-600">
            Timeline
          </TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-slate-600">
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-200">Content Status Distribution</CardTitle>
                <CardDescription className="text-slate-400">Breakdown of content by moderation status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value} items`, "Count"]}
                        contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#e2e8f0" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex justify-center gap-4 mt-4">
                  {statusData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm text-slate-300">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-200">Confidence Levels</CardTitle>
                <CardDescription className="text-slate-400">
                  AI confidence in content moderation decisions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={confidenceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        formatter={(value) => [`${value} items`, "Count"]}
                        contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#e2e8f0" }}
                      />
                      <Bar dataKey="value" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="pt-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-200">Content Categories</CardTitle>
              <CardDescription className="text-slate-400">
                Distribution of content across different categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis type="number" stroke="#94a3b8" />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" width={80} />
                    <Tooltip
                      formatter={(value) => [`${value} items`, "Count"]}
                      contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#e2e8f0" }}
                    />
                    <Bar dataKey="value" fill="#6366f1">
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="pt-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-200">Moderation Timeline</CardTitle>
              <CardDescription className="text-slate-400">Content moderation activity over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="time" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      formatter={(value) => [`${value} items`, "Count"]}
                      contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#e2e8f0" }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="flagged" stroke="#ef4444" strokeWidth={2} />
                    <Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="pt-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-200">Recent Activity</CardTitle>
              <CardDescription className="text-slate-400">Latest actions in the moderation system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start p-3 rounded-lg border border-slate-700 bg-slate-800/50">
                    <div className="bg-slate-700 rounded-full p-2 mr-3">
                      <Clock className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-300">{activity.action}</p>
                      <p className="text-xs text-slate-400 mt-1">{formatDate(activity.time)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function getCategoryData(content: ContentItem[]) {
  const categories: Record<string, number> = {}

  content.forEach((item) => {
    item.categories.forEach((category) => {
      categories[category] = (categories[category] || 0) + 1
    })
  })

  return Object.entries(categories)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

function getConfidenceData(content: ContentItem[]) {
  const ranges = [
    { name: "90-100%", min: 0.9, max: 1.0, value: 0 },
    { name: "80-90%", min: 0.8, max: 0.9, value: 0 },
    { name: "70-80%", min: 0.7, max: 0.8, value: 0 },
    { name: "60-70%", min: 0.6, max: 0.7, value: 0 },
    { name: "<60%", min: 0, max: 0.6, value: 0 },
  ]

  content.forEach((item) => {
    const range = ranges.find((r) => item.confidence >= r.min && item.confidence < r.max)
    if (range) range.value++
  })

  return ranges
}

function getTimelineData(content: ContentItem[]) {
  // For demo purposes, create some timeline data
  // In a real app, this would be derived from actual timestamps

  const now = new Date()
  const timePoints = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now)
    date.setDate(date.getDate() - (6 - i))
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  })

  return timePoints.map((time) => ({
    time,
    approved: Math.floor(Math.random() * 10) + 5,
    flagged: Math.floor(Math.random() * 8) + 1,
    pending: Math.floor(Math.random() * 5) + 1,
  }))
}

