"use client"

import { useState, useTransition } from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Edit2Icon } from "lucide-react"
import { renameWorkspace } from "../actions"
import { toast } from "@workspace/ui/components/sonner"
import { Spinner } from "@workspace/ui/components/spinner"

interface RenameWorkspaceFormProps {
  workspaceId: string,
  userId: string,
  currentName: string
}

export function RenameWorkspaceForm({ workspaceId, userId, currentName }: RenameWorkspaceFormProps) {
  const [name, setName] = useState(currentName)
  const [isEditing, setIsEditing] = useState(false)
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      await renameWorkspace(workspaceId, userId, name).then((result) => result.success ? toast.success('Workspace renamed successfully.') : toast.error(result.error));
      setIsEditing(false)
    })
  }

  function handleCancel() {
    setName(currentName)
    setIsEditing(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <Label htmlFor="workspace-name">Workspace Name</Label>
        <div className="flex items-center gap-2">
          <Input
            className="w-max"
            id="workspace-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isEditing}
            placeholder="Enter workspace name"
          />
          {!isEditing && <Button
            type="button"
            variant="outline"
            size='icon'
            onClick={() => setIsEditing(true)}
          >
            <Edit2Icon />
          </Button>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isEditing &&
          (
            <>
              <Button type="submit" disabled={!name.trim() || name === currentName}>
                {isPending && <Spinner data-icon='inline-start' />}Save
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          )}
      </div>
    </form>
  )
}
