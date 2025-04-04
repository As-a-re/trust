"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { UserPlus, MoreVertical, Edit, Trash2, Shield, User, Eye, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { User as UserType } from "@/components/content-moderation-dashboard"

interface UserManagementProps {
  users: UserType[]
  onAddUser: (user: Omit<UserType, "id">) => void
  onUpdateUser: (id: string, updates: Partial<UserType>) => void
  onDeleteUser: (id: string) => void
}

export function UserManagement({ users, onAddUser, onUpdateUser, onDeleteUser }: UserManagementProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [newUser, setNewUser] = useState({
    name: "",
    role: "moderator",
    avatar: "/placeholder.svg?height=40&width=40",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddUser = () => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      onAddUser(newUser)
      setNewUser({
        name: "",
        role: "moderator",
        avatar: "/placeholder.svg?height=40&width=40",
      })
      setIsAddDialogOpen(false)
      setIsSubmitting(false)
    }, 800)
  }

  const handleUpdateUser = () => {
    if (!selectedUser) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      onUpdateUser(selectedUser.id, selectedUser)
      setIsEditDialogOpen(false)
      setIsSubmitting(false)
    }, 800)
  }

  const handleDeleteUser = () => {
    if (!selectedUser) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      onDeleteUser(selectedUser.id)
      setIsDeleteDialogOpen(false)
      setIsSubmitting(false)
    }, 800)
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-500/20 text-purple-500 border-purple-500/30">Admin</Badge>
      case "moderator":
        return <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30">Moderator</Badge>
      case "viewer":
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">Viewer</Badge>
      default:
        return null
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4 text-purple-500" />
      case "moderator":
        return <User className="h-4 w-4 text-blue-500" />
      case "viewer":
        return <Eye className="h-4 w-4 text-slate-400" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-slate-200">System Users</h3>
          <p className="text-sm text-slate-400">Manage users and their permissions</p>
        </div>

        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {users.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                        className="w-10 h-10 rounded-full bg-slate-700"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-slate-800 rounded-full p-0.5">
                        {getRoleIcon(user.role)}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-slate-200">{user.name}</h4>
                      <div className="flex items-center mt-1">{getRoleBadge(user.role)}</div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-300">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-slate-800 border-slate-700">
                      <DropdownMenuLabel className="text-slate-300">Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-slate-700" />
                      <DropdownMenuItem
                        className="text-slate-300 focus:bg-slate-700 focus:text-slate-200 cursor-pointer"
                        onClick={() => {
                          setSelectedUser(user)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2 text-blue-500" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer"
                        onClick={() => {
                          setSelectedUser(user)
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-slate-200">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription className="text-slate-400">
              Create a new user account with specific permissions
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-300">
                Name
              </Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="Enter user name"
                className="bg-slate-700 border-slate-600 text-slate-200 placeholder:text-slate-400 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-slate-300">
                Role
              </Label>
              <Select
                value={newUser.role}
                onValueChange={(value) => setNewUser({ ...newUser, role: value as "admin" | "moderator" | "viewer" })}
              >
                <SelectTrigger id="role" className="bg-slate-700 border-slate-600 text-slate-200">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="admin" className="text-slate-200 focus:bg-slate-600 focus:text-white">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 text-purple-500 mr-2" />
                      Admin
                    </div>
                  </SelectItem>
                  <SelectItem value="moderator" className="text-slate-200 focus:bg-slate-600 focus:text-white">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-blue-500 mr-2" />
                      Moderator
                    </div>
                  </SelectItem>
                  <SelectItem value="viewer" className="text-slate-200 focus:bg-slate-600 focus:text-white">
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 text-slate-400 mr-2" />
                      Viewer
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddUser}
              disabled={!newUser.name || isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-slate-200">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription className="text-slate-400">Update user details and permissions</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-slate-300">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-slate-200 placeholder:text-slate-400 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-role" className="text-slate-300">
                  Role
                </Label>
                <Select
                  value={selectedUser.role}
                  onValueChange={(value) =>
                    setSelectedUser({ ...selectedUser, role: value as "admin" | "moderator" | "viewer" })
                  }
                >
                  <SelectTrigger id="edit-role" className="bg-slate-700 border-slate-600 text-slate-200">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="admin" className="text-slate-200 focus:bg-slate-600 focus:text-white">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 text-purple-500 mr-2" />
                        Admin
                      </div>
                    </SelectItem>
                    <SelectItem value="moderator" className="text-slate-200 focus:bg-slate-600 focus:text-white">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-blue-500 mr-2" />
                        Moderator
                      </div>
                    </SelectItem>
                    <SelectItem value="viewer" className="text-slate-200 focus:bg-slate-600 focus:text-white">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 text-slate-400 mr-2" />
                        Viewer
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateUser}
              disabled={!selectedUser?.name || isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Update User
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-slate-200">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription className="text-slate-400">
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="py-4">
              <Card className="bg-slate-700 border-slate-600">
                <CardContent className="p-4 flex items-center space-x-4">
                  <img
                    src={selectedUser.avatar || "/placeholder.svg"}
                    alt={selectedUser.name}
                    className="w-10 h-10 rounded-full bg-slate-600"
                  />
                  <div>
                    <h4 className="font-medium text-slate-200">{selectedUser.name}</h4>
                    <div className="flex items-center mt-1">{getRoleBadge(selectedUser.role)}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-200"
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete User
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

