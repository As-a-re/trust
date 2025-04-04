"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Loader2, AlertTriangle, Info } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ContentAnalyzerProps {
  onSubmit: (content: string, source: string) => void
  isLoading: boolean
}

export function ContentAnalyzer({ onSubmit, isLoading }: ContentAnalyzerProps) {
  const [content, setContent] = useState("")
  const [source, setSource] = useState("Website")
  const [showTip, setShowTip] = useState(true)

  const handleSubmit = async () => {
    if (!content.trim()) return
    onSubmit(content, source)
    setContent("")
  }

  const sources = ["Website", "Social Media", "Email", "Customer Review", "Forum", "Chat", "Other"]

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert className="bg-slate-700 border-slate-600">
              <Info className="h-4 w-4 text-blue-400" />
              <AlertTitle className="text-slate-200">Analysis Tip</AlertTitle>
              <AlertDescription className="text-slate-400">
                Try entering content with potentially problematic phrases to see how the AI moderator responds. Words
                like "hate", "terrible", or aggressive language will likely be flagged.
              </AlertDescription>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 text-slate-400 hover:text-slate-300"
                onClick={() => setShowTip(false)}
              >
                Dismiss
              </Button>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/4">
            <label className="text-sm font-medium text-slate-300 mb-2 block">Content Source</label>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-200">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {sources.map((src) => (
                  <SelectItem key={src} value={src} className="text-slate-200 focus:bg-slate-600 focus:text-white">
                    {src}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-3/4">
            <label className="text-sm font-medium text-slate-300 mb-2 block">Content to Analyze</label>
            <Textarea
              placeholder="Enter content to analyze..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[150px] bg-slate-700 border-slate-600 text-slate-200 placeholder:text-slate-400 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={!content.trim() || isLoading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Analyze Content
                <Send className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
          <h3 className="text-sm font-medium text-slate-300 mb-2 flex items-center">
            <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
            Example Flagged Content
          </h3>
          <p className="text-slate-400 text-sm">
            "This product is a complete scam! I hate the company and their terrible customer service. Don't waste your
            money on this garbage."
          </p>
        </div>

        <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
          <h3 className="text-sm font-medium text-slate-300 mb-2 flex items-center">
            <Info className="h-4 w-4 text-blue-500 mr-2" />
            Example Approved Content
          </h3>
          <p className="text-slate-400 text-sm">
            "I really enjoyed using this product. The features are well-designed and the customer service team was very
            helpful when I had questions."
          </p>
        </div>
      </div>
    </div>
  )
}

