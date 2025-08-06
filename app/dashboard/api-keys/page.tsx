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
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  CopyIcon,
  CheckIcon,
  KeyIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { IconWithBadge } from "@/components/icon-with-badge";

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

const truncateApiKey = (
  key: string,
  prefixLength: number = 8,
  suffixLength: number = 4
) => {
  if (key.length <= prefixLength + suffixLength + 3) {
    return key;
  }
  return `${key.slice(0, prefixLength)}...${key.slice(-suffixLength)}`;
};

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
    <div className="space-y-4 w-full">
      {/* Header */}
      <div className="space-y-0 w-full mb-10">
        <h1 className="text-lg font-semibold w-full">API Keys</h1>
        <p className="text-sm text-muted-foreground font-medium w-full">
          Manage API keys for external integrations.
        </p>
      </div>

      {/* Header with actions */}
      <div className="flex items-center justify-between w-full">
        <div>
          <h2 className="text-lg font-medium">
            {" "}
            {apiKeys.length} {apiKeys.length === 1 ? "Key" : "Keys"}
          </h2>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setCreateModalOpen(true)}
              className="size-9 rounded-full p-0 flex items-center justify-center cursor-pointer"
              size="icon"
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create API Key</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <Separator className="w-full bg-gray-700/40 mb-8" />

      {apiKeys.length === 0 ? (
        <div className="flex flex-col gap-6 items-center justify-center py-12">
          <IconWithBadge
            icon={KeyIcon}
            badgeText="0"
            badgeColor="green"
            size="lg"
          />
          <div className="flex flex-col gap-0 text-md items-center justify-center">
            <h2 className=" font-medium">No API Keys</h2>
            <p className="text-muted-foreground font-medium text-center">
              No API keys found. Create your first API key to get started.
            </p>
          </div>
        </div>
      ) : (
          <ScrollArea type="auto" className="w-full grid grid-cols-1">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">API Key</TableHead>
                  <TableHead className="w-[150px]">Name</TableHead>
                  <TableHead className="w-[180px]">Owner</TableHead>
                  <TableHead className="w-[120px]">Created</TableHead>
                  <TableHead className="w-[120px]">Last Used</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((apiKey) => (
                  <TableRow key={apiKey.id}>
                    <TableCell className="font-mono text-sm w-[200px]">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-gray-800 text-gray-100 rounded text-xs">
                          {truncateApiKey(apiKey.key)}
                        </span>
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
                    <TableCell className="w-[150px]">
                      <div className="truncate">
                        {apiKey.name || (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="w-[180px]">
                      {apiKey.owner ? (
                        <div className="flex items-center gap-2 min-w-0">
                          {apiKey.owner.avatar && (
                            <img
                              src={apiKey.owner.avatar}
                              alt={apiKey.owner.name}
                              className="w-6 h-6 rounded-full flex-shrink-0"
                            />
                          )}
                          <div className="text-sm min-w-0 flex-1">
                            <div className="font-medium truncate">
                              {apiKey.owner.name}
                            </div>
                            <div className="text-muted-foreground text-xs truncate">
                              {apiKey.owner.email}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="w-[120px]">
                      {new Date(apiKey.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="w-[120px]">
                      {apiKey.lastUsedAt ? (
                        new Date(apiKey.lastUsedAt).toLocaleDateString()
                      ) : (
                        <span className="text-muted-foreground">Never</span>
                      )}
                    </TableCell>
                    <TableCell className="w-[100px]">
                      <Badge
                        variant={apiKey.isActive ? "default" : "secondary"}
                      >
                        {apiKey.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="w-[120px]">
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
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
      )}

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
