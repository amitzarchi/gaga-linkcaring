"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAccessRequests } from "@/app/context/access-requests-context";
import { getAllUsers } from "@/db/queries/access-requests-queries";
import { CheckCircle, XCircle, Clock, User, Mail, Calendar, Shield } from "lucide-react";
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Management</h1>
        <p className="text-muted-foreground">
          Manage users and access requests for the system
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              All Users ({users.length})
            </CardTitle>
            <CardDescription>
              Complete list of registered users in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No users found</p>
              ) : (
                <div className="space-y-3">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
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
                            {user.emailVerified && (
                              <Badge variant="secondary" className="text-xs">
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            Joined {format(new Date(user.createdAt), "MMM dd, yyyy")}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pending Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending Requests ({pendingRequests.length})
            </CardTitle>
            <CardDescription>
              Access requests awaiting approval or rejection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingRequests.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No pending requests</p>
              ) : (
                <div className="space-y-3">
                  {pendingRequests.map((request) => (
                    <div key={request.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span className="font-medium">{request.name}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {request.email}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            Requested {format(new Date(request.requestedAt), "MMM dd, yyyy HH:mm")}
                          </div>
                        </div>
                        {getStatusBadge(request.status)}
                      </div>
                      
                      {request.reason && (
                        <div className="text-sm">
                          <strong>Reason:</strong> {request.reason}
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => openActionDialog(request, "approve")}
                          disabled={isPending}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openActionDialog(request, "reject")}
                          disabled={isPending}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Requests History */}
      <Card>
        <CardHeader>
          <CardTitle>All Access Requests</CardTitle>
          <CardDescription>
            Complete history of all access requests and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Reviewed</TableHead>
                <TableHead>Reviewed By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accessRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.name}</TableCell>
                  <TableCell>{request.email}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {request.reason || "—"}
                  </TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    {format(new Date(request.requestedAt), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    {request.reviewedAt
                      ? format(new Date(request.reviewedAt), "MMM dd, yyyy")
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {request.reviewedBy ? (() => {
                      const reviewer = users.find((user) => user.id === request.reviewedBy);
                      if (!reviewer) return "—";
                      return (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
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
                          <span>{reviewer.name}</span>
                        </div>
                      );
                    })() : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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