"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Policy } from "@/lib/defs";
import {
  assignPolicyToCategory,
  assignPolicyToMilestone,
  createPolicy,
  deletePolicy,
  getDefaultPolicy,
  getPolicies,
  setDefaultPolicy,
  updatePolicy,
} from "@/db/queries/policies-queries";
import { toast } from "sonner";

type PoliciesContextType = {
  policies: Policy[];
  setPolicies: (policies: Policy[]) => void;
  defaultPolicy: Policy | null;
  refresh: () => Promise<void>;
  addPolicy: (data: { minValidatorsPassed: number; minConfidence: number; isDefault?: boolean }) => Promise<void>;
  editPolicy: (id: number, data: Partial<{ minValidatorsPassed: number; minConfidence: number; isDefault: boolean }>) => Promise<void>;
  removePolicy: (id: number) => Promise<void>;
  makeDefault: (id: number) => Promise<void>;
  setPolicyForMilestone: (milestoneId: number, policyId: number | null) => Promise<void>;
  setPolicyForCategory: (category: string, policyId: number | null) => Promise<void>;
};

const PoliciesContext = createContext<PoliciesContextType | undefined>(undefined);

export function PoliciesProvider({ policiesData, children }: { policiesData: Policy[]; children: React.ReactNode }) {
  const [policies, setPolicies] = useState<Policy[]>(policiesData);
  const [defaultPolicy, setDefault] = useState<Policy | null>(null);

  useEffect(() => {
    setPolicies(policiesData);
  }, [policiesData]);

  useEffect(() => {
    (async () => {
      const def = await getDefaultPolicy();
      setDefault(def);
    })();
  }, []);

  const refresh = async () => {
    const rows = await getPolicies();
    setPolicies(rows as Policy[]);
    const def = await getDefaultPolicy();
    setDefault(def);
  };

  const addPolicy = async (data: { minValidatorsPassed: number; minConfidence: number; isDefault?: boolean }) => {
    await createPolicy(data);
    await refresh();
    toast.success("Policy created");
  };

  const editPolicy = async (id: number, data: Partial<{ minValidatorsPassed: number; minConfidence: number; isDefault: boolean }>) => {
    await updatePolicy(id, data);
    await refresh();
    toast.success("Policy updated");
  };

  const removePolicy = async (id: number) => {
    await deletePolicy(id);
    await refresh();
    toast.success("Policy deleted");
  };

  const makeDefault = async (id: number) => {
    await setDefaultPolicy(id);
    await refresh();
    toast.success("Default policy updated");
  };

  const setPolicyForMilestone = async (milestoneId: number, policyId: number | null) => {
    await assignPolicyToMilestone(milestoneId, policyId);
    toast.success("Policy assigned to milestone");
  };

  const setPolicyForCategory = async (category: string, policyId: number | null) => {
    await assignPolicyToCategory(category as any, policyId);
    toast.success("Policy assigned to category");
  };

  return (
    <PoliciesContext.Provider
      value={{
        policies,
        setPolicies,
        defaultPolicy,
        refresh,
        addPolicy,
        editPolicy,
        removePolicy,
        makeDefault,
        setPolicyForMilestone,
        setPolicyForCategory,
      }}
    >
      {children}
    </PoliciesContext.Provider>
  );
}

export function usePolicies() {
  const ctx = useContext(PoliciesContext);
  if (!ctx) throw new Error("usePolicies must be used within a PoliciesProvider");
  return ctx;
}


