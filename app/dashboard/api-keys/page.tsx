"use client";

import { useState } from "react";
import { useApiKeys } from "../../context/api-keys-context";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  CopyIcon,
  CheckIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

interface CreateApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function CreateApiKeyModal({ isOpen, onClose }: CreateApiKeyModalProps) {
  const { addApiKey } = useApiKeys();
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [isKeyCopied, setIsKeyCopied] = useState(false);
  const isMobile = useIsMobile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.id) {
      toast.error("You must be logged in to create API keys");
      return;
    }

    setIsLoading(true);

    try {
      const generatedKey = await addApiKey({
        name: name.trim(),
        userId: session.user.id,
      });

      if (generatedKey) {
        setNewKey(generatedKey);
        setName("");
        setIsKeyCopied(false);
      }
    } catch (error) {
      console.error("Error creating API key:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setNewKey(null);
    setName("");
    setIsKeyCopied(false);
    onClose();
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("API key copied to clipboard!");
      
      // Set as recently copied
      setIsKeyCopied(true);
      
      // Reset after 2 seconds
      setTimeout(() => {
        setIsKeyCopied(false);
      }, 2000);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const content = (
    <div className="space-y-4">
      {newKey ? (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">
              API Key Created Successfully!
            </h4>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-2 bg-white border rounded text-sm font-mono">
                {newKey}
              </code>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(newKey)}
              >
                {isKeyCopied ? (
                  <CheckIcon className="h-4 w-4 text-green-600" />
                ) : (
                  <CopyIcon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <Button onClick={handleClose} className="w-full">
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Production App, Mobile Client"
            />
          </div>
          <div className="space-y-2">
            <Label>Owner</Label>
            <div className="p-2 bg-muted rounded text-sm">
              {session?.user?.name || session?.user?.email || "Current User"}
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Creating..." : "Create API Key"}
            </Button>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={handleClose}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Create New API Key</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4">{content}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New API Key</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}

interface EditApiKeyModalProps {
  apiKey: {
    id: number;
    name: string | null;
    isActive: boolean;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

function EditApiKeyModal({ apiKey, isOpen, onClose }: EditApiKeyModalProps) {
  const { editApiKey } = useApiKeys();
  const [name, setName] = useState(apiKey?.name || "");
  const [isActive, setIsActive] = useState(apiKey?.isActive ?? true);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) return;

    setIsLoading(true);
    try {
      await editApiKey({
        id: apiKey.id,
        name: name.trim() || undefined,
        isActive,
      });
      onClose();
    } catch (error) {
      console.error("Error updating API key:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const content = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="edit-name">Name</Label>
        <Input
          id="edit-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Production App, Mobile Client"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="edit-active"
          checked={isActive}
          onCheckedChange={setIsActive}
        />
        <Label htmlFor="edit-active">Active</Label>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Updating..." : "Update API Key"}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Edit API Key</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4">{content}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit API Key</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}

export default function ApiKeysPage() {
  const { apiKeys, removeApiKey } = useApiKeys();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<{
    id: number;
    name: string | null;
    isActive: boolean;
  } | null>(null);
  const [recentlyCopied, setRecentlyCopied] = useState<Record<number, boolean>>(
    {}
  );

  const copyToClipboard = async (text: string, keyId: number) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("API key copied to clipboard!");

      // Set as recently copied
      setRecentlyCopied((prev) => ({
        ...prev,
        [keyId]: true,
      }));

      // Reset after 2 seconds
      setTimeout(() => {
        setRecentlyCopied((prev) => ({
          ...prev,
          [keyId]: false,
        }));
      }, 2000);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await removeApiKey(id);
    } catch (error) {
      console.error("Error deleting API key:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
        <Button onClick={() => setCreateModalOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Create API Key
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Key Management</CardTitle>
        </CardHeader>
        <CardContent>
          {apiKeys.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No API keys found</p>
              <Button onClick={() => setCreateModalOpen(true)}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Your First API Key
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>API Key</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((apiKey) => (
                  <TableRow key={apiKey.id}>
                    <TableCell className="font-mono text-sm">
                      <div className="flex items-center gap-2">
                        <span>{apiKey.key}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                          className="h-6 w-6 p-0"
                        >
                          {recentlyCopied[apiKey.id] ? (
                            <CheckIcon className="h-3 w-3 text-green-600" />
                          ) : (
                            <CopyIcon className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      {apiKey.name || (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {apiKey.owner ? (
                        <div className="flex items-center gap-2">
                          {apiKey.owner.avatar && (
                            <img
                              src={apiKey.owner.avatar}
                              alt={apiKey.owner.name}
                              className="w-6 h-6 rounded-full"
                            />
                          )}
                          <div className="text-sm">
                            <div className="font-medium">
                              {apiKey.owner.name}
                            </div>
                            <div className="text-muted-foreground">
                              {apiKey.owner.email}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(apiKey.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {apiKey.lastUsedAt ? (
                        new Date(apiKey.lastUsedAt).toLocaleDateString()
                      ) : (
                        <span className="text-muted-foreground">Never</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={apiKey.isActive ? "default" : "secondary"}
                      >
                        {apiKey.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setEditingKey({
                              id: apiKey.id,
                              name: apiKey.name,
                              isActive: apiKey.isActive,
                            })
                          }
                        >
                          <EditIcon className="h-3 w-3" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <TrashIcon className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete API Key
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this API key?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(apiKey.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <CreateApiKeyModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />

      <EditApiKeyModal
        apiKey={editingKey}
        isOpen={!!editingKey}
        onClose={() => setEditingKey(null)}
      />
    </div>
  );
}
