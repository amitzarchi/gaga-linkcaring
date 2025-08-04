"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { createApiKey, deleteApiKey, updateApiKey } from "@/db/queries/api-keys-queries";
import { toast } from "sonner";
import { randomBytes } from "crypto";
import { ApiKey } from "@/lib/defs";

type ApiKeysContextType = {
  apiKeys: ApiKey[];
  setApiKeys: (apiKeys: ApiKey[]) => void;
  addApiKey: ({name, userId}: {name: string, userId: string}) => Promise<string | null>; // Returns the plain text key
  editApiKey: ({id, name, isActive}: {id: number, name?: string, isActive?: boolean}) => Promise<void>;
  removeApiKey: (id: number) => Promise<void>;
  generateApiKey: () => string;
};

const ApiKeysContext = createContext<ApiKeysContextType | undefined>(
  undefined
);

export function ApiKeysProvider({
  apiKeysData,
  children,
}: {
  apiKeysData: ApiKey[];
  children: ReactNode;
}) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  
  useEffect(() => {
    setApiKeys(apiKeysData);
  }, [apiKeysData]);

  const generateApiKey = (): string => {
    // Generate a cryptographically secure random API key
    // Convert base64 to base64url by replacing +/= with -_
    const base64 = randomBytes(32).toString('base64');
    const base64url = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    return 'gaga_' + base64url;
  };
  
  const addApiKey = async ({name, userId}: {name: string, userId: string}): Promise<string | null> => {
    const plainTextKey = generateApiKey();
        
    try {
      const createdKey = await createApiKey({
        key: plainTextKey,
        userId: userId,
        name: name,
      });
      setApiKeys((prev) => [createdKey, ...prev]);
      toast.success("API key created successfully");
      return plainTextKey;
    } catch (error) {
      toast.error("Error creating API key");
      return null;
    }
  };

  const editApiKey = async ({id, name, isActive}: {id: number, name?: string, isActive?: boolean}) => {
    const oldApiKey: ApiKey | undefined = apiKeys.find((k) => k.id === id);

    if (!oldApiKey) {
      throw new Error("API key not found");
    }

    const updateData = {
      name: name || oldApiKey.name,
      isActive: isActive || oldApiKey.isActive,
    };


    setApiKeys((prev) => prev?.map((k) => 
      k.id === id ? { ...k, ...updateData } : k
    ));
    
    try {
      await updateApiKey(id, updateData);
      toast.success("API key updated successfully");
    } catch (error) {
      // Revert changes on error
      setApiKeys((prev) => prev?.map((k) => 
        k.id === id ? { ...k, 
          name: oldApiKey?.name || "", 
          isActive: oldApiKey?.isActive || true 
        } : k
      ));
      toast.error("Error updating API key");
    }
  };

  const removeApiKey = async (id: number) => {
    const oldApiKey = apiKeys.find((k) => k.id === id);
    setApiKeys((prev) => prev?.filter((k) => k.id !== id));
    
    try {
      await deleteApiKey(id);
      toast.success("API key deleted successfully");
    } catch (error) {
      // Restore on error
      if (oldApiKey) {
        setApiKeys((prev) => [oldApiKey, ...prev]);
      }
      toast.error("Error deleting API key");
    }
  };

  return (
    <ApiKeysContext.Provider
      value={{
        apiKeys,
        setApiKeys,
        addApiKey,
        editApiKey,
        removeApiKey,
        generateApiKey,
      }}
    >
      {children}
    </ApiKeysContext.Provider>
  );
}

export function useApiKeys() {
  const context = useContext(ApiKeysContext);
  if (context === undefined) {
    throw new Error("useApiKeys must be used within an ApiKeysProvider");
  }
  return context;
} 