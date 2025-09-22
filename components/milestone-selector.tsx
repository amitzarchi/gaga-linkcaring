"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const selectedItemRef = useRef<HTMLDivElement | null>(null);

  const categories = useMemo(() => {
    const unique = new Set<string>();
    milestones.forEach((m) => unique.add(m.category));
    return Array.from(unique);
  }, [milestones]);

  const filteredMilestones = useMemo(() => {
    const byCategory = categoryFilter === "ALL"
      ? milestones
      : milestones.filter((m) => m.category === categoryFilter);
    const query = searchQuery.trim().toLowerCase();
    if (!query) return byCategory;
    return byCategory.filter((m) => m.name.toLowerCase().includes(query));
  }, [milestones, categoryFilter, searchQuery]);

  // Keyboard shortcut: if one item after filtering, Enter selects it
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      const isSelectOpen = !!document.querySelector(
        '[data-slot="select-content"][data-state="open"]'
      );
      if (isSelectOpen) return;
      if (e.key === "Enter" && filteredMilestones.length === 1) {
        e.preventDefault();
        const only = filteredMilestones[0];
        if (only) {
          onSelect(only);
          setOpen(false);
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, filteredMilestones, onSelect]);

  // When opening the modal/drawer, center the selected item in the scroll area
  useEffect(() => {
    if (!open) return;
    const id = window.requestAnimationFrame(() => {
      if (selectedItemRef.current) {
        selectedItemRef.current.scrollIntoView({ block: "center", behavior: "auto" });
      }
    });
    return () => window.cancelAnimationFrame(id);
  }, [open, filteredMilestones, selectedMilestone?.id]);

  const triggerContent = (
    <Button 
      variant="outline" 
      className={cn(
        "h-fit min-h-14 gap-4 text-wrap border-0 cursor-pointer",
        selectedMilestone ? getCategoryBackgroundColor(selectedMilestone.category) : "bg-gray-50 hover:bg-gray-100 ring-1 ring-inset ring-black/10 shadow-sm"
      )}
    >
      {selectedMilestone ? (
        <>
          <span className="font-medium text-lg text-left text-wrap ">{selectedMilestone.name}</span>
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

  const filters = (
    <div className="flex flex-col gap-2 p-4 pt-0">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Input
            placeholder="Search milestones by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {formatCategoryName(cat)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const milestoneList = (
    <>
      {filters}
      <ScrollArea className="h-[400px] px-4 pb-4">
        <div className="space-y-2">
          {filteredMilestones.map((milestone) => {
            const isSelected = selectedMilestone?.id === milestone.id;
            return (
              <div
                key={milestone.id}
                ref={isSelected ? selectedItemRef : undefined}
                className={cn(
                  "relative flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors border border-transparent",
                  getCategoryBackgroundColor(milestone.category),
                  isSelected && "border-primary/60 shadow-[0_0_0_2px_rgba(0,0,0,0.02)]"
                )}
                onClick={() => {
                  onSelect(milestone);
                  setOpen(false);
                }}
              >
                <div className="flex gap-2 justify-between w-full pr-6">
                  <span className="font-medium">{milestone.name}</span>
                  <Badge className={cn("w-fit h-fit text-xs", getCategoryBadgeStyles(milestone.category))}>
                    {formatCategoryName(milestone.category)}
                  </Badge>
                </div>
                {isSelected && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 inline-block size-2 rounded-full bg-primary" />
                )}
              </div>
            );
          })}
          {filteredMilestones.length === 0 && (
            <div className="text-sm text-muted-foreground px-1 py-4">No milestones found</div>
          )}
        </div>
      </ScrollArea>
    </>
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