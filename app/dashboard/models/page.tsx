"use client";

import { useId } from "react";
import { useModels } from "@/app/context/models-context";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function ModelsPage() {
  const { models, activate } = useModels();
  const baseId = useId();

  return (
    <div className="space-y-6 w-full">
      <div className="space-y-0 w-full mb-6">
        <h1 className="text-lg font-semibold w-full">Models</h1>
        <p className="text-sm text-muted-foreground font-medium w-full">
          Select which model is active for inference.
        </p>
      </div>

      <div className="w-full space-y-2">
        <RadioGroup
          className="gap-2"
          value={models.find((m) => m.isActive)?.model}
          onValueChange={(value) => activate(value)}
        >
          {models.map((m, idx) => {
            const id = `${baseId}-${idx}`;
            return (
              <div
                key={m.model}
                className="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-3 rounded-md border p-4 shadow-xs outline-none"
              >
                <RadioGroupItem
                  value={m.model}
                  id={id}
                  aria-describedby={`${id}-description`}
                  className="order-1 after:absolute after:inset-0"
                />
                {m.logoUrl ? (
                  <img
                    src={m.logoUrl}
                    alt={m.name}
                    className="size-8"
                  />
                ) : null}
                <div className="grid grow gap-1">
                  <Label htmlFor={id} className="flex items-center gap-2">
                    <span className="font-medium">{m.name}</span>
                  </Label>
                  {(m.description) && (
                    <p id={`${id}-description`} className="text-muted-foreground text-xs">
                      {m.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </RadioGroup>
      </div>
    </div>
  );
}


