import { getApiKeys } from "@/db/queries/api-keys-queries";
import { ApiKeysProvider } from "../../context/api-keys-context";

export default async function ApiKeysLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const apiKeys = await getApiKeys();

  return (
    <ApiKeysProvider apiKeysData={apiKeys}>
      {children}
    </ApiKeysProvider>
  );
} 