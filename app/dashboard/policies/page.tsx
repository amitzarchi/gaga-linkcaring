"use client";

import { useEffect, useState } from "react";
import { usePolicies } from "@/app/context/policies-context";
import { useMilestones } from "@/app/context/milestones-context";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

export default function PoliciesPage() {
  const { policies, defaultPolicy, addPolicy, editPolicy, removePolicy, makeDefault, setPolicyForMilestone, refresh } = usePolicies();
  const { milestones, setMilestones } = useMilestones();
  const isMobile = useIsMobile();

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

  // Helper: format category like in milestoneSelector
  function formatCategoryName(category: string): string {
    return category
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Helper: badge styles like in milestoneSelector (keep page bg colors as-is)
  function getCategoryBadgeStyles(category: string): string {
    switch (category) {
      case 'GROSS_MOTOR':
        return 'bg-green-50 ring-[0.5px] ring-inset ring-green-500/30 border-[0.5px] text-green-950 shadow-sm';
      case 'FINE_MOTOR':
        return 'bg-blue-50 ring-[0.5px] ring-inset ring-blue-500/30 border-[0.5px] text-blue-950 shadow-sm';
      case 'SOCIAL':
        return 'bg-pink-50 ring-[0.5px] ring-inset ring-pink-500/30 border-[0.5px] text-pink-950 shadow-sm';
      case 'LANGUAGE':
        return 'bg-orange-50 ring-[0.5px] ring-inset ring-orange-500/30 border-[0.5px] text-orange-950 shadow-sm';
      default:
        return 'bg-gray-50 ring-[0.5px] ring-inset ring-gray-500/30 border-[0.5px] text-gray-950 shadow-sm';
    }
  }

  const assignToMilestone = async (id: number, policyIdStr: string) => {
    const policyId = policyIdStr === "none" ? null : Number(policyIdStr);
    await setPolicyForMilestone(id, policyId);
    setMilestones(milestones.map((m) => (m.id === id ? { ...m, policyId } : m)));
  };

  return (
    <div className="space-y-6 w-full pb-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Policies</h1>
          <p className="text-sm text-muted-foreground">Manage detection policies and assign them to milestones.</p>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={startCreate}
              className="size-9 rounded-full p-0 flex items-center justify-center cursor-pointer"
              size="icon"
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create Policy</p>
          </TooltipContent>
        </Tooltip>
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
        <ScrollArea type="auto" className="w-full grid grid-cols-1">
          <Table className="w-full">
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
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">Assign per Milestone</h2>
        <ScrollArea type="auto" className="w-full grid grid-cols-1">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Milestone</TableHead>
                <TableHead>Policy</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {milestones.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="truncate">{m.name}</span>
                      <Badge className={"w-fit h-fit text-xs " + getCategoryBadgeStyles(m.category)}>
                        {formatCategoryName(m.category)}
                      </Badge>
                    </div>
                  </TableCell>
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
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      {/* New/Edit Policy Modal - Drawer on mobile, Dialog on desktop */}
      {isMobile ? (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{editingId ? "Edit Policy" : "New Policy"}</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-4 pt-2">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label>Min Validators Passed (%)</Label>
                    <Input type="number" min={0} max={100} value={minValidatorsPassed} onChange={(e) => setMinValidatorsPassed(Number(e.target.value))} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Min Confidence (%)</Label>
                    <Input type="number" min={0} max={100} value={minConfidence} onChange={(e) => setMinConfidence(Number(e.target.value))} />
                  </div>
                  <div className="flex items-center gap-2">
                    <input id="isDefault" type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />
                    <Label htmlFor="isDefault">Set as default</Label>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                  <Button onClick={submit}>{editingId ? "Save" : "Create"}</Button>
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Policy" : "New Policy"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Min Validators Passed (%)</Label>
                  <Input type="number" min={0} max={100} value={minValidatorsPassed} onChange={(e) => setMinValidatorsPassed(Number(e.target.value))} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Min Confidence (%)</Label>
                  <Input type="number" min={0} max={100} value={minConfidence} onChange={(e) => setMinConfidence(Number(e.target.value))} />
                </div>
                <div className="flex items-center gap-2">
                  <input id="isDefault" type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />
                  <Label htmlFor="isDefault">Set as default</Label>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button onClick={submit}>{editingId ? "Save" : "Create"}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}


