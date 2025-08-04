"use client";

import { useState } from "react";
import { useMilestones } from "../context/milestones-context";
import { useValidators } from "../context/validators-context";
import { useIsMobile } from "@/hooks/use-mobile";
import { Milestone } from "@/lib/defs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDownIcon, PlusIcon, EditIcon, TrashIcon, CheckIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MilestoneSelectorProps {
  selectedMilestone: Milestone | null;
  onSelect: (milestone: Milestone) => void;
}

function MilestoneSelector({ selectedMilestone, onSelect }: MilestoneSelectorProps) {
  const { milestones } = useMilestones();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const triggerContent = (
    <div className={cn(
      "flex w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-6 py-4 text-left shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[60px]",
      "cursor-pointer"
    )}>
      <div className="flex flex-col gap-1">
        {selectedMilestone ? (
          <>
            <span className="font-medium text-lg">{selectedMilestone.name}</span>
            <Badge variant="secondary" className="w-fit">
              {selectedMilestone.category}
            </Badge>
          </>
        ) : (
          <span className="text-muted-foreground text-lg">Select a milestone...</span>
        )}
      </div>
      <ChevronDownIcon className="h-5 w-5 opacity-50" />
    </div>
  );

  const milestoneList = (
    <ScrollArea className="h-[400px] p-4">
      <div className="space-y-2">
        {milestones.map((milestone) => (
          <div
            key={milestone.id}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
            onClick={() => {
              onSelect(milestone);
              setOpen(false);
            }}
          >
            <div className="flex flex-col gap-1">
              <span className="font-medium">{milestone.name}</span>
              <Badge variant="outline" className="w-fit text-xs">
                {milestone.category}
              </Badge>
            </div>
            {selectedMilestone?.id === milestone.id && (
              <CheckIcon className="h-4 w-4 text-primary" />
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <div>{triggerContent}</div>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Select Milestone</DrawerTitle>
          </DrawerHeader>
          {milestoneList}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>{triggerContent}</div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Select Milestone</DialogTitle>
        </DialogHeader>
        {milestoneList}
      </DialogContent>
    </Dialog>
  );
}

interface ValidatorItemProps {
  validator: {
    id: number;
    milestoneId: number;
    description: string;
  };
  onEdit: (params: { id: number; description: string }) => void;
  onDelete: (id: number) => void;
}

function ValidatorItem({ validator, onEdit, onDelete }: ValidatorItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(validator.description);

  const handleSave = () => {
    if (editValue.trim()) {
      onEdit({ id: validator.id, description: editValue.trim() });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(validator.description);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2 items-center">
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") handleCancel();
              }}
              autoFocus
            />
            <Button size="sm" onClick={handleSave} disabled={!editValue.trim()}>
              <CheckIcon className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start gap-4">
          <p className="flex-1 text-sm leading-relaxed">{validator.description}</p>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
            >
              <EditIcon className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(validator.id)}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { milestones, selectedMilestone, setSelectedMilestone } = useMilestones();
  const { validators, addValidator, editValidator, removeValidator } = useValidators();
  const [newValidatorDescription, setNewValidatorDescription] = useState("");
  const [isAddingValidator, setIsAddingValidator] = useState(false);

  // Filter validators for the selected milestone
  const filteredValidators = selectedMilestone
    ? validators.filter((v) => v.milestoneId === selectedMilestone.id)
    : [];

  const handleAddValidator = async () => {
    if (newValidatorDescription.trim() && selectedMilestone) {
      await addValidator({
        milestoneId: selectedMilestone.id,
        description: newValidatorDescription.trim(),
      });
      setNewValidatorDescription("");
      setIsAddingValidator(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Milestone Selector */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Select a milestone to view and manage its validators
        </p>
        <MilestoneSelector
          selectedMilestone={selectedMilestone}
          onSelect={setSelectedMilestone}
        />
      </div>

      {/* Validators Section */}
      {selectedMilestone && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Validators</h2>
              <p className="text-muted-foreground">
                Validators for {selectedMilestone.name} ({filteredValidators.length} total)
              </p>
            </div>
            <Button
              onClick={() => setIsAddingValidator(true)}
              className="flex items-center gap-2"
            >
              <PlusIcon className="h-4 w-4" />
              Add Validator
            </Button>
          </div>

          {/* Add New Validator */}
          {isAddingValidator && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add New Validator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Enter validator description..."
                  value={newValidatorDescription}
                  onChange={(e) => setNewValidatorDescription(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddValidator();
                    if (e.key === "Escape") {
                      setIsAddingValidator(false);
                      setNewValidatorDescription("");
                    }
                  }}
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddValidator}
                    disabled={!newValidatorDescription.trim()}
                  >
                    Add Validator
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddingValidator(false);
                      setNewValidatorDescription("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
  
          {/* Validators List */}
          <div className="space-y-4">
            {filteredValidators.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">
                    No validators found for this milestone.
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => setIsAddingValidator(true)}
                  >
                    Add First Validator
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredValidators.map((validator) => (
                <ValidatorItem
                  key={validator.id}
                  validator={validator}
                  onEdit={editValidator}
                  onDelete={removeValidator}
                />
              ))
            )}
          </div>
        </div>
      )}

      {!selectedMilestone && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              Please select a milestone to view its validators.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
