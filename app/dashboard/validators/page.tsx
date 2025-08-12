"use client";

import { useState } from "react";
import { useMilestones } from "../../context/milestones-context";
import { useValidators } from "../../context/validators-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { PlusIcon, PencilIcon, TrashIcon, CheckIcon, XIcon, FileTextIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { MilestoneSelector } from "@/components/milestone-selector";
import { IconWithBadge } from "@/components/icon-with-badge";

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
      <div className="border rounded-lg p-3 bg-white">
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
          <Button 
            size="sm" 
            onClick={handleSave} 
            disabled={!editValue.trim()}
            className="h-8 w-8 p-0 rounded-full bg-black hover:bg-gray-800 text-white"
          >
            <CheckIcon className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleCancel}
            className="h-8 w-8 p-0 rounded-full border-gray-300 text-black hover:bg-gray-50"
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-3 bg-white hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-center gap-3">
        <p className="flex-1 text-sm leading-relaxed">{validator.description}</p>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsEditing(true)}
            className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(validator.id)}
            className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
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
    <div className="space-y-8 w-full">
      {/* Milestone Selector */}
      <div className="space-y-0 w-full">
        <h1 className="text-lg font-semibold w-full">Milestones & Validators</h1>
        <p className="text-sm text-muted-foreground font-medium w-full">Manage your milestones and validators.</p>
      </div>
      <div className="flex justify-center">
        <MilestoneSelector
          selectedMilestone={selectedMilestone}
          onSelect={setSelectedMilestone}
        />
      </div>

      {/* Validators Section */}
      {selectedMilestone && (
        <div className="space-y-4 w-full">
          <div className="flex items-center justify-between w-full">
            <div>
              <h2 className="text-lg font-medium ">Validators</h2>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setIsAddingValidator(true)}
                  className="size-9 rounded-full p-0 flex items-center justify-center cursor-pointer"
                  size="icon"
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add Validator</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Separator className="w-full" />

          {/* Add New Validator */}
          {isAddingValidator && (
            <div className="border-2 rounded-lg p-3 bg-white w-full border-blue-500/30  text-blue-950 shadow-sm">
              <div className="flex items-center gap-3">
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
                  className="flex-1"
                />
                <Button
                  onClick={handleAddValidator}
                  disabled={!newValidatorDescription.trim()}
                  size="icon"
                  className="h-8 w-8 p-0 rounded-full bg-black hover:bg-gray-800 text-white"
                >
                  <CheckIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingValidator(false);
                    setNewValidatorDescription("");
                  }}
                  size="icon"
                  className="h-8 w-8 p-0 rounded-full border-gray-300 text-black hover:bg-gray-50"
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          {/* Validators List */}
          <div className="space-y-3 w-full">
            {filteredValidators.length === 0 ? (
              <div className="flex flex-col gap-6 items-center justify-center py-12">
                <IconWithBadge
                  icon={FileTextIcon}
                  badgeText="0"
                  badgeColor="blue"
                  size="lg"
                />
                <div className="flex flex-col gap-0 text-md items-center justify-center">
                  <h2 className=" font-medium">No Validators</h2>
                  <p className="text-muted-foreground font-medium text-center">
                    No validators found for this milestone.
                  </p>
                </div>
              </div>
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
        <div className="flex justify-center">
          <Card className="w-full">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                Please select a milestone to view its validators.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
