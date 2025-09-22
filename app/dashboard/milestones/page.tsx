"use client";

import { useState } from "react";
import { useMilestones } from "@/app/context/milestones-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { MilestoneCategory } from "@/lib/defs";
import { PlusIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

function formatCategoryName(category: string): string {
  return category
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getCategoryBadgeStyles(category: string): string {
  switch (category) {
    case "GROSS_MOTOR":
      return "bg-green-50 ring-[0.5px] ring-inset ring-green-500/30 border-[0.5px] text-green-950 shadow-sm";
    case "FINE_MOTOR":
      return "bg-blue-50 ring-[0.5px] ring-inset ring-blue-500/30 border-[0.5px] text-blue-950 shadow-sm";
    case "SOCIAL":
      return "bg-pink-50 ring-[0.5px] ring-inset ring-pink-500/30 border-[0.5px] text-pink-950 shadow-sm";
    case "LANGUAGE":
      return "bg-orange-50 ring-[0.5px] ring-inset ring-orange-500/30 border-[0.5px] text-orange-950 shadow-sm";
    default:
      return "bg-gray-50 ring-[0.5px] ring-inset ring-gray-500/30 border-[0.5px] text-gray-950 shadow-sm";
  }
}

const CATEGORY_OPTIONS: MilestoneCategory[] = [
  "GROSS_MOTOR",
  "FINE_MOTOR",
  "SOCIAL",
  "LANGUAGE",
];

export default function MilestonesPage() {
  const { milestones, editMilestone, removeMilestone, addMilestone } = useMilestones();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editCategory, setEditCategory] = useState<MilestoneCategory>(
    "GROSS_MOTOR"
  );
  const [saving, setSaving] = useState(false);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState<string>("");
  const [createCategory, setCreateCategory] = useState<MilestoneCategory>("GROSS_MOTOR");
  const [creating, setCreating] = useState(false);

  const startEdit = (id: number) => {
    const m = milestones.find((x) => x.id === id);
    if (!m) return;
    setEditingId(id);
    setEditName(m.name);
    setEditCategory(m.category);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditCategory("GROSS_MOTOR");
  };

  const saveEdit = async () => {
    if (editingId == null) return;
    setSaving(true);
    try {
      await editMilestone(editingId, { name: editName, category: editCategory });
      setEditingId(null);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (deleteId == null) return;
    const id = deleteId;
    setDeleteId(null);
    await removeMilestone(id);
  };

  const submitCreate = async () => {
    if (!createName.trim()) return;
    setCreating(true);
    try {
      await addMilestone({ name: createName.trim(), category: createCategory });
      setCreateOpen(false);
      setCreateName("");
      setCreateCategory("GROSS_MOTOR");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6 w-full pb-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Milestones</h1>
          <p className="text-sm text-muted-foreground">
            View and manage milestones. Edit inline or delete.
          </p>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setCreateOpen(true)}
              className="size-9 rounded-full p-0 flex items-center justify-center cursor-pointer"
              size="icon"
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create Milestone</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <section className="space-y-2">
        <ScrollArea type="auto" className="w-full grid grid-cols-1">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Milestone</TableHead>
                <TableHead>Id</TableHead>
                <TableHead className="w-[220px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {milestones.map((m) => {
                const isEditing = editingId === m.id;
                return (
                  <TableRow key={m.id}>
                    <TableCell>
                      {isEditing ? (
                        <div className="flex items-center gap-3 min-w-0">
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="max-w-[340px]"
                          />
                          <Select
                            value={editCategory}
                            onValueChange={(v) => setEditCategory(v as MilestoneCategory)}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {CATEGORY_OPTIONS.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {formatCategoryName(cat)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="truncate">{m.name}</span>
                          <Badge className={getCategoryBadgeStyles(m.category)}>
                            {formatCategoryName(m.category)}
                          </Badge>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{m.id}</TableCell>
                    <TableCell className="space-x-2">
                      {isEditing ? (
                        <>
                          <Button size="sm" onClick={saveEdit} disabled={saving}>
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEdit} disabled={saving}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="outline" onClick={() => startEdit(m.id)}>
                            Edit
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => setDeleteId(m.id)}>
                            Delete
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      <AlertDialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete milestone?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Milestone</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  placeholder="Milestone name"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={createCategory}
                  onValueChange={(v) => setCreateCategory(v as MilestoneCategory)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {formatCategoryName(cat)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={submitCreate} disabled={creating || !createName.trim()}>
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


