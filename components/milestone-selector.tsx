"use client";

import { useState } from "react";
import { useMilestones } from "@/app/context/milestones-context";
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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDownIcon, CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Helper function to format category names
function formatCategoryName(category: string): string {
  return category
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Helper function to get category-based background colors
function getCategoryBackgroundColor(category: string): string {
  switch(category) {
    case 'GROSS_MOTOR':
      return 'bg-green-300/30 hover:bg-green-400/30 ring-[1.3px] ring-inset ring-green-300/30 text-green-950 shadow-sm';
    case 'FINE_MOTOR':
      return 'bg-blue-300/30 hover:bg-blue-400/30 ring-[1.3px] ring-inset ring-blue-300/30 text-blue-950 shadow-sm';
    case 'SOCIAL':
      return 'bg-pink-300/30 hover:bg-pink-400/30 ring-[1.3px] ring-inset ring-pink-300/30 text-pink-950 shadow-sm';
    case 'LANGUAGE':
      return 'bg-orange-300/30 hover:bg-orange-400/30 ring-[1.3px] ring-inset ring-orange-300/30 text-orange-950 shadow-sm';
    default:
      return 'bg-gray-100 hover:bg-gray-200 ring-1 ring-inset ring-black/10 shadow-sm';
  }
}

// Helper function to get category-based badge styling
function getCategoryBadgeStyles(category: string, whitenessLevel: 'normal' | 'extra-white' = 'normal'): string {
  const topColor = 'from-white';
  const accentOpacity = whitenessLevel === 'extra-white' ? '/3' : '/10';
  
  switch(category) {
    case 'GROSS_MOTOR':
      return `bg-green-50 ring-[0.5px] ring-inset ring-green-500/30 border-[0.5px] text-green-950 shadow-sm`;
    case 'FINE_MOTOR':
      return `bg-blue-50 ring-[0.5px] ring-inset ring-blue-500/30 border-[0.5px] text-blue-950 shadow-sm`;
    case 'SOCIAL':
      return `bg-pink-50 ring-[0.5px] ring-inset ring-pink-500/30 border-[0.5px] text-pink-950 shadow-sm`;
    case 'LANGUAGE':
      return `bg-orange-50 ring-[0.5px] ring-inset ring-orange-500/30 border-[0.5px] text-orange-950 shadow-sm`;
    default:
      return `bg-gray-50 ring-[0.5px] ring-inset ring-gray-500/30 border-[0.5px] text-gray-950 shadow-sm`;
  }
}

interface MilestoneSelectorProps {
  selectedMilestone: Milestone | null;
  onSelect: (milestone: Milestone) => void;
}

export function MilestoneSelector({ selectedMilestone, onSelect }: MilestoneSelectorProps) {
  const { milestones } = useMilestones();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const triggerContent = (
    <Button 
      variant="outline" 
      className={cn(
        "h-14 gap-4 border-0 cursor-pointer",
        selectedMilestone ? getCategoryBackgroundColor(selectedMilestone.category) : "bg-gray-50 hover:bg-gray-100 ring-1 ring-inset ring-black/10 shadow-sm"
      )}
    >
      {selectedMilestone ? (
        <>
          <span className="font-medium text-lg">{selectedMilestone.name}</span>
          <Badge className={cn("w-fit", getCategoryBadgeStyles(selectedMilestone.category, 'extra-white'))}>
            {formatCategoryName(selectedMilestone.category)}
          </Badge>
        </>
      ) : (
        <span className="text-muted-foreground text-lg">Select a milestone...</span>
      )}
      <ChevronDownIcon className="h-5 w-5 opacity-50" />
    </Button>
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
            <div className="flex gap-2 justify-between w-full">
              <span className="font-medium">{milestone.name}</span>
              <Badge className={cn("w-fit h-fit text-xs", getCategoryBadgeStyles(milestone.category))}>
                {formatCategoryName(milestone.category)}
              </Badge>
            </div>
            {selectedMilestone?.id === milestone.id && (
              <CheckIcon className="h-4 w-4 text-primary " />
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