"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, Clock, Search, Filter, Download, Eye, ThumbsUp, ThumbsDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"
import type { ContentItem } from "@/components/content-moderation-dashboard"

interface ModeratedContentListProps {
  items: ContentItem[]
  onUpdateStatus: (id: string, status: "approved" | "flagged") => void
}

export function ModeratedContentList({ items, onUpdateStatus }: ModeratedContentListProps) {
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />
      case "flagged":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "pending":
        return <Clock className="h-5 w-5 text-amber-500" />
      default:
        return null
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.8) return "text-emerald-500"
    if (confidence > 0.6) return "text-amber-500"
    return "text-red-500"
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30">Approved</Badge>
      case "flagged":
        return <Badge className="bg-red-500/20 text-red-500 border-red-500/30">Flagged</Badge>
      case "pending":
        return <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30">Pending</Badge>
      default:
        return null
    }
  }

  const filteredItems = items.filter((item) => {
    // Apply status filter
    if (filter !== "all" && item.status !== filter) return false

    // Apply search filter
    if (searchTerm && !item.content.toLowerCase().includes(searchTerm.toLowerCase())) return false

    return true
  })

  const handleViewDetails = (item: ContentItem) => {
    setSelectedItem(item)
    setIsDialogOpen(true)
  }

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredItems, null, 2))
    const downloadAnchorNode = document.createElement("a")
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", "moderated-content.json")
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-1/3">
          <label className="text-sm font-medium text-slate-300 mb-2 block">Filter by Status</label>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-200">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              <SelectItem value="all" className="text-slate-200 focus:bg-slate-600 focus:text-white">
                All Content
              </SelectItem>
              <SelectItem value="approved" className="text-slate-200 focus:bg-slate-600 focus:text-white">
                Approved
              </SelectItem>
              <SelectItem value="flagged" className="text-slate-200 focus:bg-slate-600 focus:text-white">
                Flagged
              </SelectItem>
              <SelectItem value="pending" className="text-slate-200 focus:bg-slate-600 focus:text-white">
                Pending
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-2/3">
          <label className="text-sm font-medium text-slate-300 mb-2 block">Search Content</label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-slate-700 border-slate-600 text-slate-200 placeholder:text-slate-400 focus:ring-purple-500"
            />
          </div>
        </div>

        <Button
          variant="outline"
          className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-200"
          onClick={handleExport}
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12 text-slate-400 bg-slate-700/30 rounded-lg border border-slate-600">
          <Filter className="h-12 w-12 mx-auto text-slate-500 mb-3" />
          <p className="text-lg font-medium">No matching content found</p>
          <p className="text-sm mt-1">Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border border-slate-700 bg-slate-800/50 rounded-lg p-4 space-y-3 hover:bg-slate-800 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(item.status)}
                    {getStatusBadge(item.status)}
                    <span className="text-sm text-slate-400">{formatTime(item.timestamp)}</span>
                  </div>
                  <div className={`font-medium ${getConfidenceColor(item.confidence)}`}>
                    {Math.round(item.confidence * 100)}% confidence
                  </div>
                </div>

                <p className="text-slate-300">{item.content}</p>

                <div className="flex flex-wrap gap-2 mt-2">
                  {item.categories?.map((category) => (
                    <Badge key={category} variant="outline" className="text-slate-400 border-slate-600">
                      {category}
                    </Badge>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                  <div className="flex items-center space-x-2 text-sm text-slate-400">
                    <span>Source: {item.source}</span>
                    {item.moderatedBy && <span>• Moderated by: {item.moderatedBy}</span>}
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-slate-400 hover:text-slate-200"
                      onClick={() => handleViewDetails(item)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>

                    {item.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10"
                          onClick={() => onUpdateStatus(item.id, "approved")}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-500 border-red-500/30 hover:bg-red-500/10"
                          onClick={() => onUpdateStatus(item.id, "flagged")}
                        >
                          <ThumbsDown className="h-4 w-4 mr-1" />
                          Flag
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-slate-200">
          <DialogHeader>
            <DialogTitle>Content Details</DialogTitle>
            <DialogDescription className="text-slate-400">
              Detailed information about the selected content
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                {getStatusIcon(selectedItem.status)}
                <span className="font-medium capitalize">{selectedItem.status}</span>
              </div>

              <div className="border border-slate-700 rounded-lg p-3 bg-slate-900">
                <p className="text-slate-300">{selectedItem.content}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-1">Source</h4>
                  <p className="text-slate-300">{selectedItem.source}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-1">Timestamp</h4>
                  <p className="text-slate-300">{formatTime(selectedItem.timestamp)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-1">Confidence</h4>
                  <p className={getConfidenceColor(selectedItem.confidence)}>
                    {Math.round(selectedItem.confidence * 100)}%
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-1">Moderated By</h4>
                  <p className="text-slate-300">{selectedItem.moderatedBy || "Not moderated yet"}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-2">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.categories?.map((category) => (
                    <Badge key={category} className="bg-slate-700 text-slate-300">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              {selectedItem.status === "pending" && (
                <div className="flex space-x-2 pt-4 border-t border-slate-700">
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => {
                      onUpdateStatus(selectedItem.id, "approved")
                      setIsDialogOpen(false)
                    }}
                  >
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Approve Content
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      onUpdateStatus(selectedItem.id, "flagged")
                      setIsDialogOpen(false)
                    }}
                  >
                    <ThumbsDown className="h-4 w-4 mr-2" />
                    Flag Content
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

