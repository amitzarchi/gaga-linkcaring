"use client";

import { useEffect, useMemo, useState } from "react";
import { usePolicies } from "@/app/context/policies-context";
import { useMilestones } from "@/app/context/milestones-context";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function PoliciesPage() {
  const { policies, defaultPolicy, addPolicy, editPolicy, removePolicy, makeDefault, setPolicyForMilestone, setPolicyForCategory, refresh } = usePolicies();
  const { milestones, setMilestones } = useMilestones();

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [minValidatorsPassed, setMinValidatorsPassed] = useState<number>(80);
  const [minConfidence, setMinConfidence] = useState<number>(80);
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => { refresh(); }, []);

  const startCreate = () => {
    setEditingId(null);
    setMinValidatorsPassed(80);
    setMinConfidence(80);
    setIsDefault(false);
    setIsOpen(true);
  };

  const startEdit = (id: number) => {
    const p = policies.find((x) => x.id === id);
    if (!p) return;
    setEditingId(id);
    setMinValidatorsPassed(p.minValidatorsPassed);
    setMinConfidence(p.minConfidence);
    setIsDefault(p.id === defaultPolicy?.id);
    setIsOpen(true);
  };

  const submit = async () => {
    if (minValidatorsPassed < 0 || minValidatorsPassed > 100 || minConfidence < 0 || minConfidence > 100) {
      toast.error("Values must be 0-100");
      return;
    }

    if (editingId) {
      await editPolicy(editingId, { minValidatorsPassed, minConfidence });
      if (isDefault) await makeDefault(editingId);
    } else {
      const createdDefault = isDefault;
      await addPolicy({ minValidatorsPassed, minConfidence, isDefault: createdDefault });
    }

    setIsOpen(false);
  };

  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>("none");

  const categories = useMemo(() => {
    return Array.from(new Set(milestones.map((m) => m.category)));
  }, [milestones]);

  const assignByCategory = async () => {
    const policyId = selectedPolicyId === "none" ? null : Number(selectedPolicyId);
    if (selectedCategory === "ALL") {
      await Promise.all(milestones.map((m) => setPolicyForMilestone(m.id, policyId)));
      setMilestones(milestones.map((m) => ({ ...m, policyId })));
    } else {
      await setPolicyForCategory(selectedCategory, policyId);
      setMilestones(milestones.map((m) => (m.category === selectedCategory ? { ...m, policyId } : m)));
    }
    toast.success("Policy assigned");
  };

  const assignToMilestone = async (id: number, policyIdStr: string) => {
    const policyId = policyIdStr === "none" ? null : Number(policyIdStr);
    await setPolicyForMilestone(id, policyId);
    setMilestones(milestones.map((m) => (m.id === id ? { ...m, policyId } : m)));
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Policies</h1>
          <p className="text-sm text-muted-foreground">Manage detection policies and assign them to milestones.</p>
        </div>
        <Button onClick={startCreate}>New Policy</Button>
      </div>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">Default Policy</h2>
        <p className="text-sm text-muted-foreground">The policy used when a milestone has no explicit policy.</p>
        <div className="flex items-center gap-4">
          {defaultPolicy ? (
            <>
              <span className="text-sm text-muted-foreground">
                Min validators: {defaultPolicy.minValidatorsPassed}% · Min confidence: {defaultPolicy.minConfidence}%
              </span>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">No default policy set</span>
          )}
        </div>
      </section>


      <section className="space-y-2">
        <h2 className="text-base font-semibold">Existing Policies</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Min Validators</TableHead>
              <TableHead>Min Confidence</TableHead>
              <TableHead>Default</TableHead>
              <TableHead className="w-[220px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {policies.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.minValidatorsPassed}%</TableCell>
                <TableCell>{p.minConfidence}%</TableCell>
                <TableCell>{p.id === defaultPolicy?.id ? <Badge>Default</Badge> : null}</TableCell>
                <TableCell className="space-x-2">
                  <Button size="sm" variant="outline" onClick={() => startEdit(p.id)}>Edit</Button>
                  <Button size="sm" variant="outline" onClick={() => makeDefault(p.id)}>Make Default</Button>
                  <Button size="sm" variant="destructive" onClick={() => removePolicy(p.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
      <section className="space-y-2">
        <h2 className="text-base font-semibold">Assign by Category</h2>
        <p className="text-sm text-muted-foreground">Bulk-assign a policy to milestones by category or to all.</p>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="w-48">
            <Label>Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-56">
            <Label>Policy</Label>
            <Select value={selectedPolicyId} onValueChange={setSelectedPolicyId}>
              <SelectTrigger>
                <SelectValue placeholder="Policy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Use default</SelectItem>
                {policies.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.minValidatorsPassed}% validators · {p.minConfidence}% confidence
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={assignByCategory}>Assign</Button>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">Assign per Milestone</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Milestone</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Policy</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {milestones.map((m) => (
              <TableRow key={m.id}>
                <TableCell>{m.name}</TableCell>
                <TableCell>{m.category}</TableCell>
                <TableCell>
                  <Select value={m.policyId ? String(m.policyId) : "none"} onValueChange={(v) => assignToMilestone(m.id, v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Use default</SelectItem>
                      {policies.map((p) => (
                        <SelectItem key={p.id} value={String(p.id)}>
                          {p.minValidatorsPassed}% validators · {p.minConfidence}% confidence
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Policy" : "New Policy"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label>Min Validators Passed (%)</Label>
              <Input type="number" min={0} max={100} value={minValidatorsPassed} onChange={(e) => setMinValidatorsPassed(Number(e.target.value))} />
            </div>
            <div>
              <Label>Min Confidence (%)</Label>
              <Input type="number" min={0} max={100} value={minConfidence} onChange={(e) => setMinConfidence(Number(e.target.value))} />
            </div>
            <div className="flex items-center gap-2">
              <input id="isDefault" type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />
              <Label htmlFor="isDefault">Set as default</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={submit}>{editingId ? "Save" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


