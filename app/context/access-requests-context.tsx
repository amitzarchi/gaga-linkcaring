"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import {
  createAccessRequest,
  updateAccessRequest,
  approveAccessRequest,
  rejectAccessRequest,
  deleteAccessRequest,
} from "@/db/queries/access-requests-queries";
import { toast } from "sonner";
import { AccessRequest } from "@/lib/defs";

type AccessRequestsContextType = {
  accessRequests: AccessRequest[];
  setAccessRequests: (accessRequests: AccessRequest[]) => void;
  addAccessRequest: (data: {
    id: string;
    email: string;
    name: string;
    reason?: string;
  }) => Promise<void>;
  updateAccessRequestStatus: (
    id: string,
    data: {
      status: "PENDING" | "APPROVED" | "REJECTED";
      reviewedBy: string;
      notes?: string;
    }
  ) => Promise<void>;
  approveRequest: (id: string, reviewedBy: string, notes?: string) => Promise<void>;
  rejectRequest: (id: string, reviewedBy: string, notes?: string) => Promise<void>;
  removeAccessRequest: (id: string) => Promise<void>;
};

const AccessRequestsContext = createContext<AccessRequestsContextType | undefined>(
  undefined
);

export function AccessRequestsProvider({
  accessRequestsData,
  children,
}: {
  accessRequestsData: AccessRequest[];
  children: ReactNode;
}) {
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);

  useEffect(() => {
    setAccessRequests(accessRequestsData);
  }, [accessRequestsData]);

  const addAccessRequest = async (data: {
    id: string;
    email: string;
    name: string;
    reason?: string;
  }): Promise<void> => {
    try {
      const createdRequest = await createAccessRequest(data);
      setAccessRequests((prev) => [createdRequest, ...prev]);
      toast.success("Access request submitted successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error creating access request";
      toast.error(errorMessage);
      throw error;
    }
  };

  const updateAccessRequestStatus = async (
    id: string,
    data: {
      status: "PENDING" | "APPROVED" | "REJECTED";
      reviewedBy: string;
      notes?: string;
    }
  ): Promise<void> => {
    const oldRequest = accessRequests.find((r) => r.id === id);

    if (!oldRequest) {
      throw new Error("Access request not found");
    }

    const updatedData = {
      ...data,
      reviewedAt: new Date(),
    };

    // Optimistic update
    setAccessRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, ...updatedData } : r
      )
    );

    try {
      await updateAccessRequest(id, updatedData);
      toast.success(`Access request ${data.status.toLowerCase()} successfully`);
    } catch (error) {
      // Revert changes on error
      setAccessRequests((prev) =>
        prev.map((r) =>
          r.id === id ? oldRequest : r
        )
      );
      toast.error("Error updating access request");
      throw error;
    }
  };

  const approveRequest = async (
    id: string,
    reviewedBy: string,
    notes?: string
  ): Promise<void> => {
    const oldRequest = accessRequests.find((r) => r.id === id);

    if (!oldRequest) {
      throw new Error("Access request not found");
    }

    // Optimistic update
    setAccessRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "APPROVED" as const,
              reviewedAt: new Date(),
              reviewedBy,
              notes: notes || null,
            }
          : r
      )
    );

    try {
      await approveAccessRequest(id, reviewedBy, notes);
      toast.success("Access request approved successfully");
    } catch (error) {
      // Revert changes on error
      setAccessRequests((prev) =>
        prev.map((r) =>
          r.id === id ? oldRequest : r
        )
      );
      toast.error("Error approving access request");
      throw error;
    }
  };

  const rejectRequest = async (
    id: string,
    reviewedBy: string,
    notes?: string
  ): Promise<void> => {
    const oldRequest = accessRequests.find((r) => r.id === id);

    if (!oldRequest) {
      throw new Error("Access request not found");
    }

    // Optimistic update
    setAccessRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "REJECTED" as const,
              reviewedAt: new Date(),
              reviewedBy,
              notes: notes || null,
            }
          : r
      )
    );

    try {
      await rejectAccessRequest(id, reviewedBy, notes);
      toast.success("Access request rejected successfully");
    } catch (error) {
      // Revert changes on error
      setAccessRequests((prev) =>
        prev.map((r) =>
          r.id === id ? oldRequest : r
        )
      );
      toast.error("Error rejecting access request");
      throw error;
    }
  };

  const removeAccessRequest = async (id: string): Promise<void> => {
    const oldRequest = accessRequests.find((r) => r.id === id);
    
    // Optimistic update
    setAccessRequests((prev) => prev.filter((r) => r.id !== id));

    try {
      await deleteAccessRequest(id);
      toast.success("Access request deleted successfully");
    } catch (error) {
      // Restore on error
      if (oldRequest) {
        setAccessRequests((prev) => [oldRequest, ...prev]);
      }
      toast.error("Error deleting access request");
      throw error;
    }
  };

  return (
    <AccessRequestsContext.Provider
      value={{
        accessRequests,
        setAccessRequests,
        addAccessRequest,
        updateAccessRequestStatus,
        approveRequest,
        rejectRequest,
        removeAccessRequest,
      }}
    >
      {children}
    </AccessRequestsContext.Provider>
  );
}

export function useAccessRequests() {
  const context = useContext(AccessRequestsContext);
  if (context === undefined) {
    throw new Error("useAccessRequests must be used within an AccessRequestsProvider");
  }
  return context;
} 