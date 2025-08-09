"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSystemPrompt } from "@/app/context/system-prompt-context";
import { useSession } from "@/lib/auth-client";
import { getAllUsers } from "@/db/queries/access-requests-queries";
import { format } from "date-fns";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

export default function SystemPromptPage() {
  const { current, history, save, restore } = useSystemPrompt();
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");
  const [changeNote, setChangeNote] = useState("");
  const [isPending, startTransition] = useTransition();
  const [users, setUsers] = useState<Record<string, { id: string; name: string | null }>>({});
  const [selectedHistoryId, setSelectedHistoryId] = useState<string>("");
  const hasContentChanged = useMemo(() => {
    const original = current?.content ?? "";
    return isEditing && content !== original;
  }, [content, current, isEditing]);

  useEffect(() => {
    if (current?.content && !isEditing) {
      setContent(current.content);
    }
  }, [current, isEditing]);

  useEffect(() => {
    (async () => {
      try {
        const all = await getAllUsers();
        const map: Record<string, { id: string; name: string | null }> = {};
        for (const u of all) map[u.id] = { id: u.id, name: u.name ?? null };
        setUsers(map);
      } catch (e) {
        // Non-critical; we can still show IDs
      }
    })();
  }, []);

  const selectedHistory = useMemo(() => {
    const idNum = Number(selectedHistoryId);
    if (!idNum) return null;
    return history.find((h) => h.id === idNum) ?? null;
  }, [selectedHistoryId, history]);

  const onEdit = () => {
    if (!current) {
      toast.error("No current system prompt set yet");
      return;
    }
    setContent(current.content);
    setChangeNote("");
    setIsEditing(true);
  };

  const onCancel = () => {
    setIsEditing(false);
    setChangeNote("");
    setContent(current?.content ?? "");
  };

  const onSave = () => {
    if (!session?.user?.id) {
      toast.error("You must be signed in");
      return;
    }
    if (!content.trim()) {
      toast.error("Prompt content cannot be empty");
      return;
    }
    if (!hasContentChanged) {
      toast.message?.("No changes to save");
      return;
    }
    startTransition(async () => {
      await save({ content, changeNote: changeNote || null, userId: session.user.id });
      setIsEditing(false);
      setChangeNote("");
    });
  };

  const onRestore = () => {
    if (!selectedHistory) return;
    if (!session?.user?.id) {
      toast.error("You must be signed in");
      return;
    }
    startTransition(async () => {
      await restore(selectedHistory.id, session.user.id, "Restored from history");
      setSelectedHistoryId("");
    });
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">System Prompt</h1>
          <p className="text-sm text-muted-foreground">Manage the AI analysis system prompt and its history.</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Label className="whitespace-nowrap">History</Label>
          <Select value={selectedHistoryId} onValueChange={setSelectedHistoryId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a previous version" />
            </SelectTrigger>
            <SelectContent>
              {history.map((h) => (
                <SelectItem key={h.id} value={String(h.id)}>
                  {format(new Date(h.createdAt), "MMM dd, yyyy HH:mm")} - {h.changeNote || "No note"}
                  {" "}· {users[h.createdBy ?? ""]?.name || h.createdBy || "Unknown"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedHistory && (
            <Button variant="outline" onClick={onRestore} disabled={isPending}>
              Restore
            </Button>
          )}
        </div>
      </div>

      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Current Prompt</CardTitle>
          {!isEditing && (
            <Button size="icon" variant="outline" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {!isEditing ? (
            <pre className="whitespace-pre-wrap break-words text-sm p-3 bg-muted rounded-md max-h-[60vh] overflow-auto">
              {current?.content || "No prompt set yet"}
            </pre>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="promptContent" className="flex items-center gap-2">
                  <span>Prompt</span>
                  {hasContentChanged && (
                    <span
                      className="inline-block h-2 w-2 rounded-full bg-primary"
                      aria-label="unsaved changes"
                    />
                  )}
                </Label>
                <Textarea
                  id="promptContent"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[320px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="changeNote">Change note</Label>
                <Input
                  id="changeNote"
                  value={changeNote}
                  onChange={(e) => setChangeNote(e.target.value)}
                  placeholder="Describe your change (optional)"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={onSave} disabled={isPending || !hasContentChanged}>Save</Button>
                <Button variant="outline" onClick={onCancel} disabled={isPending}>Cancel</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}




