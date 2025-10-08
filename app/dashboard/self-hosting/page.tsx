import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function SelfHostingPage() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Self-Hosting Guide</h1>
        <p className="text-muted-foreground">
          Complete guide to deploy and configure the Gaga X LinkCaring platform
        </p>
      </div>

      {/* Prerequisites */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Prerequisites</CardTitle>
          <CardDescription>
            You'll need the following before getting started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Badge variant="outline">1</Badge> Gemini API Key
            </h3>
            <p className="text-sm text-muted-foreground ml-8">
              For AI inference. Get one from{" "}
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Google AI Studio
              </a>
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Badge variant="outline">2</Badge> Google OAuth Credentials
            </h3>
            <p className="text-sm text-muted-foreground ml-8">
              For authentication. Create OAuth 2.0 credentials in{" "}
              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Google Cloud Console
              </a>
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Badge variant="outline">3</Badge> Cloudflare R2 Credentials
            </h3>
            <p className="text-sm text-muted-foreground ml-8">
              For video storage. Create a bucket and API token in{" "}
              <a
                href="https://dash.cloudflare.com/?to=/:account/r2"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Cloudflare Dashboard
              </a>
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Badge variant="outline">4</Badge> PostgreSQL Database
            </h3>
            <p className="text-sm text-muted-foreground ml-8">
              Recommended:{" "}
              <a
                href="https://neon.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Neon
              </a>{" "}
              (serverless Postgres with generous free tier)
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Badge variant="outline">5</Badge> Azure Account
            </h3>
            <p className="text-sm text-muted-foreground ml-8">
              For deploying the API as Azure Functions.{" "}
              <a
                href="https://azure.microsoft.com/free/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Sign up for free
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Deploy Admin Panel */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Deploy Admin Panel</CardTitle>
          <CardDescription>
            <a
              href="https://github.com/amitzarchi/gaga-linkcaring"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              github.com/amitzarchi/gaga-linkcaring
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription className="flex items-center">
              The easiest way to deploy is with{" "}
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline"
              >
                Vercel
              </a>
            </AlertDescription>
          </Alert>

          <div>
            <h3 className="font-semibold mb-3">Steps:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>
                Click{" "}
                <a
                  href="https://vercel.com/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  Deploy to Vercel
                </a>
              </li>
              <li>Import the repository (click 'Import a Third-Party Git Repository'): <code className="bg-muted px-1 py-0.5 rounded">https://github.com/amitzarchi/gaga-linkcaring</code></li>
              <li>Configure environment variables (see below)</li>
              <li>Click Deploy</li>
              <li>
                After deployment, run database migrations:
                <div className="bg-muted p-3 rounded mt-2 font-mono text-xs">
                  bun install<br />
                  bunx drizzle-kit push<br />
                  bun run seed
                </div>
              </li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Environment Variables:</h3>
            <div className="bg-muted p-4 rounded font-mono text-xs space-y-1">
              <div><span className="text-muted-foreground"># API Configuration</span></div>
              <div>GAGA_API_URL=<span className="text-orange-600">https://your-api.azurewebsites.net</span></div>
              <div>GAGA_API_KEY=<span className="text-orange-600">your-secret-api-key</span></div>
              <div className="mt-2"><span className="text-muted-foreground"># Database</span></div>
              <div>DATABASE_URL=<span className="text-orange-600">postgresql://user:pass@host:5432/db</span></div>
              <div className="mt-2"><span className="text-muted-foreground"># Better Auth</span></div>
              <div>BETTER_AUTH_URL=<span className="text-orange-600">https://your-app.vercel.app</span></div>
              <div>BETTER_AUTH_SECRET=<span className="text-orange-600">generate-with-openssl-rand-base64-32</span></div>
              <div className="mt-2"><span className="text-muted-foreground"># Google OAuth</span></div>
              <div>GOOGLE_CLIENT_ID=<span className="text-orange-600">your-client-id.apps.googleusercontent.com</span></div>
              <div>GOOGLE_CLIENT_SECRET=<span className="text-orange-600">your-client-secret</span></div>
              <div className="mt-2"><span className="text-muted-foreground"># Cloudflare R2</span></div>
              <div>R2_ENDPOINT=<span className="text-orange-600">https://accountid.r2.cloudflarestorage.com</span></div>
              <div>R2_ACCESS_KEY_ID=<span className="text-orange-600">your-access-key-id</span></div>
              <div>R2_SECRET_ACCESS_KEY=<span className="text-orange-600">your-secret-access-key</span></div>
              <div>R2_BUCKET_NAME=<span className="text-orange-600">your-bucket-name</span></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deploy API */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Deploy API (Azure Functions)</CardTitle>
          <CardDescription>
            <a
              href="https://github.com/amitzarchi/gaga-linkcaring-api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              github.com/amitzarchi/gaga-linkcaring-api
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-3">Steps:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Install Azure Functions Core Tools</li>
              <li>
                Clone the repository:
                <div className="bg-muted p-3 rounded mt-2 font-mono text-xs">
                  git clone https://github.com/amitzarchi/gaga-linkcaring-api.git<br />
                  cd gaga-linkcaring-api<br />
                  npm install
                </div>
              </li>
              <li>
                Login to Azure:
                <div className="bg-muted p-3 rounded mt-2 font-mono text-xs">
                  az login
                </div>
              </li>
              <li>
                Create a Function App in Azure Portal or CLI:
                <div className="bg-muted p-3 rounded mt-2 font-mono text-xs">
                  az functionapp create \<br />
                  {"  "}--resource-group YourResourceGroup \<br />
                  {"  "}--consumption-plan-location eastus \<br />
                  {"  "}--runtime node \<br />
                  {"  "}--runtime-version 20 \<br />
                  {"  "}--functions-version 4 \<br />
                  {"  "}--name your-api-name \<br />
                  {"  "}--storage-account yourstorageaccount
                </div>
              </li>
              <li>
                Configure environment variables in Azure Portal (see below)
              </li>
              <li>
                Deploy:
                <div className="bg-muted p-3 rounded mt-2 font-mono text-xs">
                  func azure functionapp publish your-api-name
                </div>
              </li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Azure Environment Variables:</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Configure these in Azure Portal → Function App → Configuration → Application settings
            </p>
            <div className="bg-muted p-4 rounded font-mono text-xs space-y-1">
              <div>DATABASE_URL=<span className="text-orange-600">postgresql://user:pass@host:5432/db</span></div>
              <div className="mt-2"><span className="text-muted-foreground"># Same database as admin panel</span></div>
              <div className="mt-2">GOOGLE_API_KEY=<span className="text-orange-600">your-gemini-api-key</span></div>
              <div className="mt-2"><span className="text-muted-foreground"># Gemini API for inference</span></div>
            </div>
          </div>

          <Alert>
            <AlertDescription>
              After deploying the API, update the <code className="bg-muted px-1 py-0.5 rounded">GAGA_API_URL</code> in your admin panel's environment variables to point to your Azure Function App URL.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}

