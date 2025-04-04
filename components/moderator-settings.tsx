"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { AlertTriangle, Save, RefreshCw, Shield, Database, Zap, Info } from "lucide-react"

interface ModeratorSettingsProps {
  settings: {
    sensitivityLevel: string
    autoModeration: boolean
    categories: {
      hate: boolean
      violence: boolean
      harassment: boolean
      spam: boolean
      misinformation: boolean
      adult: boolean
      profanity: boolean
    }
    sources: {
      website: boolean
      socialMedia: boolean
      email: boolean
      customerReview: boolean
      forum: boolean
    }
    aiModel: string
  }
  onUpdateSettings: (settings: ModeratorSettingsProps["settings"]) => void
}

export function ModeratorSettings({ settings, onUpdateSettings }: ModeratorSettingsProps) {
  const [localSettings, setLocalSettings] = useState(settings)
  const [sensitivityValue, setSensitivityValue] = useState(
    localSettings.sensitivityLevel === "low" ? 25 : localSettings.sensitivityLevel === "medium" ? 50 : 75,
  )
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    // Check if settings have changed
    setHasChanges(JSON.stringify(settings) !== JSON.stringify(localSettings))
  }, [settings, localSettings])

  const handleSensitivityChange = (value: number[]) => {
    const level = value[0] <= 33 ? "low" : value[0] <= 66 ? "medium" : "high"
    setSensitivityValue(value[0])
    setLocalSettings({
      ...localSettings,
      sensitivityLevel: level,
    })
  }

  const handleCategoryToggle = (category: keyof typeof settings.categories) => {
    setLocalSettings({
      ...localSettings,
      categories: {
        ...localSettings.categories,
        [category]: !localSettings.categories[category],
      },
    })
  }

  const handleSourceToggle = (source: keyof typeof settings.sources) => {
    setLocalSettings({
      ...localSettings,
      sources: {
        ...localSettings.sources,
        [source]: !localSettings.sources[source],
      },
    })
  }

  const handleAutoModerationToggle = () => {
    setLocalSettings({
      ...localSettings,
      autoModeration: !localSettings.autoModeration,
    })
  }

  const handleAIModelChange = (model: string) => {
    setLocalSettings({
      ...localSettings,
      aiModel: model,
    })
  }

  const handleSave = () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      onUpdateSettings(localSettings)
      setIsSaving(false)
    }, 800)
  }

  const handleReset = () => {
    setLocalSettings(settings)
    setSensitivityValue(settings.sensitivityLevel === "low" ? 25 : settings.sensitivityLevel === "medium" ? 50 : 75)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general">
        <TabsList className="bg-slate-700 border-slate-600">
          <TabsTrigger value="general" className="data-[state=active]:bg-slate-600">
            <Shield className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="categories" className="data-[state=active]:bg-slate-600">
            <Database className="h-4 w-4 mr-2" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="sources" className="data-[state=active]:bg-slate-600">
            <Zap className="h-4 w-4 mr-2" />
            Sources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="pt-4">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-slate-200">Sensitivity Level</h3>
                <Badge level={localSettings.sensitivityLevel} />
              </div>

              <div className="space-y-4">
                <Slider
                  value={[sensitivityValue]}
                  onValueChange={handleSensitivityChange}
                  max={100}
                  step={1}
                  className="py-4"
                />
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
              </div>

              <Card className="bg-slate-700/50 border-slate-600">
                <CardContent className="p-4 text-sm text-slate-400">
                  <div className="flex items-start">
                    <Info className="h-4 w-4 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                    <p>
                      Higher sensitivity levels will flag more content but may increase false positives. Lower
                      sensitivity levels may miss some problematic content but reduce false flags.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-700">
              <h3 className="text-lg font-medium text-slate-200">AI Model</h3>
              <RadioGroup value={localSettings.aiModel} onValueChange={handleAIModelChange} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="basic" id="ai-basic" className="border-slate-500 text-purple-500" />
                  <Label htmlFor="ai-basic" className="text-slate-300">
                    Basic
                  </Label>
                  <span className="text-xs text-slate-400 ml-2">(Faster, less accurate)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="standard" id="ai-standard" className="border-slate-500 text-purple-500" />
                  <Label htmlFor="ai-standard" className="text-slate-300">
                    Standard
                  </Label>
                  <span className="text-xs text-slate-400 ml-2">(Balanced performance)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="advanced" id="ai-advanced" className="border-slate-500 text-purple-500" />
                  <Label htmlFor="ai-advanced" className="text-slate-300">
                    Advanced
                  </Label>
                  <span className="text-xs text-slate-400 ml-2">(Most accurate, slower)</span>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-700">
              <h3 className="text-lg font-medium text-slate-200">Automation Settings</h3>
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-moderation"
                  checked={localSettings.autoModeration}
                  onCheckedChange={handleAutoModerationToggle}
                  className="data-[state=checked]:bg-purple-600"
                />
                <Label htmlFor="auto-moderation" className="text-slate-300">
                  Automatically moderate content without human review
                </Label>
              </div>

              {localSettings.autoModeration && (
                <Card className="bg-amber-500/10 border-amber-500/20">
                  <CardContent className="p-4 text-sm flex items-start">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-amber-200">
                      Automatic moderation will apply decisions based on AI confidence levels. Content with low
                      confidence will still be marked for human review.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="pt-4">
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-slate-200">Content Categories to Moderate</h3>
            <p className="text-sm text-slate-400">
              Select which types of content should be analyzed and potentially flagged by the AI system.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(localSettings.categories).map(([category, enabled]) => (
                <motion.div
                  key={category}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-slate-700 bg-slate-800/50"
                >
                  <Switch
                    id={`category-${category}`}
                    checked={enabled}
                    onCheckedChange={() => handleCategoryToggle(category as keyof typeof settings.categories)}
                    className="data-[state=checked]:bg-purple-600"
                  />
                  <div>
                    <Label htmlFor={`category-${category}`} className="text-slate-300 capitalize">
                      {category}
                    </Label>
                    <p className="text-xs text-slate-400 mt-1">{getCategoryDescription(category)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sources" className="pt-4">
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-slate-200">Content Sources</h3>
            <p className="text-sm text-slate-400">
              Configure which sources of content should be moderated by the system.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(localSettings.sources).map(([source, enabled]) => (
                <motion.div
                  key={source}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-slate-700 bg-slate-800/50"
                >
                  <Switch
                    id={`source-${source}`}
                    checked={enabled}
                    onCheckedChange={() => handleSourceToggle(source as keyof typeof settings.sources)}
                    className="data-[state=checked]:bg-purple-600"
                  />
                  <div>
                    <Label htmlFor={`source-${source}`} className="text-slate-300 capitalize">
                      {formatSourceName(source)}
                    </Label>
                    <p className="text-xs text-slate-400 mt-1">{getSourceDescription(source)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between pt-6 border-t border-slate-700">
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={!hasChanges || isSaving}
          className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-200"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset Changes
        </Button>

        <Button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
        >
          {isSaving ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

function Badge({ level }: { level: string }) {
  const getColor = () => {
    switch (level) {
      case "low":
        return "bg-blue-500/20 text-blue-500 border-blue-500/30"
      case "medium":
        return "bg-amber-500/20 text-amber-500 border-amber-500/30"
      case "high":
        return "bg-red-500/20 text-red-500 border-red-500/30"
      default:
        return "bg-slate-500/20 text-slate-500 border-slate-500/30"
    }
  }

  return <span className={`text-xs px-2 py-1 rounded-full border ${getColor()} capitalize`}>{level}</span>
}

function getCategoryDescription(category: string): string {
  switch (category) {
    case "hate":
      return "Content expressing hatred toward individuals or groups"
    case "violence":
      return "Content depicting or promoting violence"
    case "harassment":
      return "Content intended to harass or bully others"
    case "spam":
      return "Unsolicited promotional or irrelevant content"
    case "misinformation":
      return "False or misleading information"
    case "adult":
      return "Adult or explicit content"
    case "profanity":
      return "Content containing profane language"
    default:
      return "Content in this category"
  }
}

function formatSourceName(source: string): string {
  switch (source) {
    case "socialMedia":
      return "Social Media"
    case "customerReview":
      return "Customer Reviews"
    default:
      return source.charAt(0).toUpperCase() + source.slice(1)
  }
}

function getSourceDescription(source: string): string {
  switch (source) {
    case "website":
      return "Content from your website pages and blog"
    case "socialMedia":
      return "Content from connected social media accounts"
    case "email":
      return "Content from email communications"
    case "customerReview":
      return "Customer reviews and feedback"
    case "forum":
      return "Content from forum discussions"
    default:
      return "Content from this source"
  }
}

