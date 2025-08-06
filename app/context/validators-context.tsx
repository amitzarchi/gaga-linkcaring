"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { createValidator, deleteValidator, updateValidator } from "@/db/queries/validators-queries";
import { toast } from "sonner";
import { Validator, ValidatorInsert } from "@/lib/defs";

type ValidatorsContextType = {
  validators: Validator[];
  setValidators: (validators: Validator[]) => void;
  addValidator: ({milestoneId, description}: {milestoneId: number, description: string}) => Promise<void>;
  editValidator: ({id, description}: {id: number, description: string}) => Promise<void>;
  removeValidator: (id: number) => Promise<void>;
};

const ValidatorsContext = createContext<ValidatorsContextType | undefined>(
  undefined
);

export function ValidatorsProvider({
  validatorsData,
  children,
}: {
  validatorsData: Validator[];
  children: ReactNode;
}) {
  const [validators, setValidators] = useState<Validator[]>([]);
  useEffect(() => {
    setValidators(validatorsData);
  }, [validatorsData]);

  const addValidator = async ({milestoneId, description}: {milestoneId: number, description: string}) => {
    // Create temporary validator for optimistic update
    const tempValidator: Validator = {
      id: 0,
      milestoneId,
      description
    };
    
    // Optimistic update
    setValidators([...validators, tempValidator]);
    
    try {
      const validatorInsert: ValidatorInsert = {
        milestoneId,
        description
      };
      
      const newValidatorId = await createValidator(validatorInsert);
      
      // Update with real ID
      setValidators((prev) => prev?.map((v) => v.id === 0 ? { ...v, id: newValidatorId } : v));
      toast.success("Validator added successfully");
    } catch (error) {
      // Remove temp validator on error
      setValidators((prev) => prev?.filter((v) => v.id !== 0));
      toast.error("Error adding validator");
    }
  };

  const editValidator = async ({id, description}: {id: number, description: string}) => {
    const oldValidator = validators.find((v) => v.id === id);
    setValidators((prev) => prev?.map((v) => v.id === id ? { ...v, description } : v));
    try {
      await updateValidator(id, {description});
      toast.success("Validator updated successfully");
    } catch (error) {
      setValidators((prev) => prev?.map((v) => v.id === id ? { ...v, description: oldValidator?.description || "" } : v));
      toast.error("Error updating validator");
    }
  };

  const removeValidator = async (id: number) => {
    const oldValidator = validators.find((v) => v.id === id);
    setValidators((prev) => prev?.filter((v) => v.id !== id));
    try {
      await deleteValidator(id);
      toast.success("Validator deleted successfully");
    } catch (error) {
      setValidators((prev) => prev?.map((v) => v.id === id ? { ...v, description: oldValidator?.description || "" } : v));
      toast.error("Error deleting validator");
    }
  };

  return (
    <ValidatorsContext.Provider
      value={{
        validators,
        setValidators,
        addValidator,
        editValidator,
        removeValidator,
      }}
    >
      {children}
    </ValidatorsContext.Provider>
  );
}

export function useValidators() {
  const context = useContext(ValidatorsContext);
  if (context === undefined) {
    throw new Error("useValidators must be used within a ValidatorsProvider");
  }
  return context;
} 