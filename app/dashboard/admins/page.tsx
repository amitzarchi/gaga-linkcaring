"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { useAccessRequests } from "@/app/context/access-requests-context";
import { getAllUsers } from "@/db/queries/access-requests-queries";
import { CheckCircle, XCircle, Clock, User, Mail, Calendar, Shield, RefreshCcw, History, FileClock, UserPlus, Copy, Check } from "lucide-react";
import { format } from "date-fns";
import { useEffect } from "react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { User as UserType } from "@/lib/defs";

export default function AdminsPage() {
  const { accessRequests, approveRequest, rejectRequest } = useAccessRequests();
  const { data: session } = useSession();
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");
  const [isPending, startTransition] = useTransition();
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast.error("Failed to load users");
      }
    };
    fetchUsers();
  }, []);

  const pendingRequests = accessRequests.filter((req) => req.status === "PENDING");

  const handleRequestAction = async (requestId: string, action: "approve" | "reject", notes?: string) => {
    if (!session?.user?.id) {
      toast.error("User session not found");
      return;
    }

    startTransition(async () => {
      try {
        if (action === "approve") {
          await approveRequest(requestId, session.user.id, notes);
        } else {
          await rejectRequest(requestId, session.user.id, notes);
        }
        setIsDialogOpen(false);
        setNotes("");
        setSelectedRequest(null);
      } catch (error) {
        console.error("Failed to update request:", error);
        // Toast is already handled by the context
      }
    });
  };

  const openActionDialog = (request: any, action: "approve" | "reject") => {
    setSelectedRequest(request);
    setActionType(action);
    setIsDialogOpen(true);
  };

  const copyInviteLink = async () => {
    const inviteLink = `${window.location.origin}/request-access`;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setLinkCopied(true);
      toast.success("Invite link copied to clipboard!");
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge variant="outline" className="text-green-600 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="outline" className="text-red-600 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="space-y-0 w-full">
        <h1 className="text-lg font-semibold w-full">Admin Management</h1>
        <p className="text-sm text-muted-foreground font-medium w-full">
          Manage users and access requests for the system.
        </p>
      </div>

      <Tabs defaultValue="members" className="w-full">
        <ScrollArea type="auto" className="w-full">
          <TabsList className="mb-4 text-foreground h-auto gap-2 rounded-none border-b bg-transparent px-0 py-1 w-max whitespace-nowrap justify-start">
            <TabsTrigger
              value="members"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Members ({users.length})
            </TabsTrigger>
            <TabsTrigger
              value="requests"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Requests ({pendingRequests.length} pending)
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <TabsContent value="members" className="space-y-6">
          {/* Users Table */}
              {users.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No users found</p>
              ) : (
                <ScrollArea type="auto" className="w-full grid grid-cols-1">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Joined At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={user.image || ""} />
                                <AvatarFallback>
                                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{user.name}</span>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Mail className="h-3 w-3" />
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(user.createdAt), "MMM dd, yyyy")}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              )}
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          {/* Pending Requests */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending Requests ({pendingRequests.length})
            </h3>
            {pendingRequests.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No pending requests</p>
            ) : (
              <div className="space-y-3">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{request.name}</span>
                        <span className="text-sm text-muted-foreground">({request.email})</span>
                      </div>
                      {request.reason && (
                        <p className="text-sm text-muted-foreground mt-1">{request.reason}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Requested {format(new Date(request.requestedAt), "MMM dd, yyyy HH:mm")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 h-8 w-8 p-0"
                        onClick={() => openActionDialog(request, "approve")}
                        disabled={isPending}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8 w-8 p-0"
                        onClick={() => openActionDialog(request, "reject")}
                        disabled={isPending}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Requests History */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileClock className="h-5 w-5" />
              <h3 className="text-lg font-medium">Requests History</h3>
            </div>
            {accessRequests.filter(request => request.status !== "PENDING").length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No Past Requests</p>
            ) : (
              <ScrollArea type="auto" className="w-full grid grid-cols-1">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">Name</TableHead>
                      <TableHead className="w-[200px]">Email</TableHead>
                      <TableHead className="w-[250px]">Reason</TableHead>
                      <TableHead className="w-[100px]">Status</TableHead>
                      <TableHead className="w-[120px]">Requested</TableHead>
                      <TableHead className="w-[120px]">Reviewed</TableHead>
                      <TableHead className="w-[180px]">Reviewed By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accessRequests.filter(request => request.status !== "PENDING").map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium w-[150px]">{request.name}</TableCell>
                        <TableCell className="w-[200px]">{request.email}</TableCell>
                        <TableCell className="w-[250px]">
                          <div className="truncate">
                            {request.reason || "—"}
                          </div>
                        </TableCell>
                        <TableCell className="w-[100px]">{getStatusBadge(request.status)}</TableCell>
                        <TableCell className="w-[120px]">
                          {format(new Date(request.requestedAt), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell className="w-[120px]">
                          {request.reviewedAt
                            ? format(new Date(request.reviewedAt), "MMM dd, yyyy")
                            : "—"}
                        </TableCell>
                        <TableCell className="w-[180px]">
                          {request.reviewedBy ? (() => {
                            const reviewer = users.find((user) => user.id === request.reviewedBy);
                            if (!reviewer) return "—";
                            return (
                              <div className="flex items-center gap-2 min-w-0">
                                <Avatar className="h-6 w-6 flex-shrink-0">
                                  <AvatarImage src={reviewer.image || undefined} alt={reviewer.name || "User"} />
                                  <AvatarFallback>
                                    {reviewer.name
                                      ? reviewer.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")
                                          .toUpperCase()
                                      : "?"}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="truncate">{reviewer.name}</span>
                              </div>
                            );
                          })() : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Invite Members Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Invite Members
          </CardTitle>
          <CardDescription>
            Share this link with people who need access to the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="w-full sm:flex-1 p-3 bg-muted rounded-lg font-mono text-sm break-all">
              {typeof window !== 'undefined' ? `${window.location.origin}/request-access` : '/request-access'}
            </div>
            <Button
              onClick={copyInviteLink}
              variant="outline"
              className="w-full sm:w-auto flex items-center justify-center gap-2"
            >
              {linkCopied ? (
                <>
                  <Check className="h-4 w-4 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Link
                </>
              )}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            People can use this link to request access to the system. You'll be able to review and approve their requests in the Requests tab above.
          </p>
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Approve" : "Reject"} Access Request
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? "Are you sure you want to approve this access request?"
                : "Are you sure you want to reject this access request?"}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="py-4">
              <div className="space-y-2">
                <p><strong>Name:</strong> {selectedRequest.name}</p>
                <p><strong>Email:</strong> {selectedRequest.email}</p>
                {selectedRequest.reason && (
                  <p><strong>Reason:</strong> {selectedRequest.reason}</p>
                )}
              </div>
              
              <div className="mt-4">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about this decision..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                selectedRequest &&
                handleRequestAction(selectedRequest.id, actionType, notes || undefined)
              }
              disabled={isPending}
              className={
                actionType === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {isPending ? "Processing..." : actionType === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 