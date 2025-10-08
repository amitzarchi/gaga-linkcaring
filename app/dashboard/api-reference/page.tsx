import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";

export default async function ApiReferencePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/");
  }

  return (
    <div className="w-full flex flex-col gap-6 pb-8">
      <div className="space-y-0 w-full">
        <h1 className="text-lg font-semibold w-full">API Reference</h1>
        <p className="text-sm text-muted-foreground font-medium w-full">
          Documentation for the gaga API endpoints
        </p>
      </div>

      <Tabs defaultValue="analyze" className="w-full">
        <ScrollArea type="auto" className="w-full">
          <TabsList className="mb-4 text-foreground h-auto gap-2 rounded-none border-b bg-transparent px-0 py-1 w-max whitespace-nowrap justify-start">
            <TabsTrigger
              value="analyze"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              POST /api/analyze
            </TabsTrigger>
            <TabsTrigger
              value="milestone-ids"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              GET /api/milestone-ids
            </TabsTrigger>
            <TabsTrigger
              value="analyze-results"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              GET /api/analyze-results/:id
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <TabsContent value="analyze" className="space-y-6">
          <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Badge variant="default" className="bg-green-600 hover:bg-green-700">POST</Badge>
            <CardTitle className="text-xl font-mono">/api/analyze</CardTitle>
          </div>
          <CardDescription className="text-base">
            Analyze a video to determine if a developmental milestone has been achieved
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Authentication */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Authentication</h3>
            <p className="text-sm text-muted-foreground mb-3">
              This endpoint requires an API key as a Bearer token in the Authorization header. You can find your API keys <Link className="text-blue-500 font-medium hover:text-blue-600" href="/dashboard/api-keys">here</Link>.
            </p>
            <div className="bg-muted p-4 rounded-md font-mono text-sm">
              <div className="text-muted-foreground">Authorization: Bearer <span className="text-foreground">YOUR_API_KEY</span></div>
            </div>
          </div>

          <Separator />

          {/* Request */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Request Body</h3>
            <p className="text-sm text-muted-foreground mb-3">
              The endpoint accepts <code className="bg-muted px-1.5 py-0.5 rounded text-xs">multipart/form-data</code> with the following fields:
            </p>
            
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <code className="text-sm font-semibold">milestoneId</code>
                  <Badge variant="outline" className="text-xs">required</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  <span className="font-medium">Type:</span> <code className="bg-muted px-1.5 py-0.5 rounded text-xs">number</code>
                </p>
                <p className="text-sm text-muted-foreground">
                  The ID of the developmental milestone to analyze against.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <code className="text-sm font-semibold">video</code>
                  <Badge variant="outline" className="text-xs">required*</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  <span className="font-medium">Type:</span> <code className="bg-muted px-1.5 py-0.5 rounded text-xs">File</code>
                </p>
                <p className="text-sm text-muted-foreground">
                  Video file to analyze.
                </p>
              </div>

            </div>
          </div>

          <Separator />

          {/* Response */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Response</h3>
            <p className="text-sm text-muted-foreground mb-3">
              The endpoint returns JSON with the following structure:
            </p>

            <div className="space-y-4">
              {/* Success Response */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="default" className="bg-green-600 hover:bg-green-700">200 OK</Badge>
                  <span className="text-sm font-semibold">Success</span>
                </div>
                <div className="bg-muted p-4 rounded-md overflow-x-auto">
                  <pre className="text-xs font-mono">
{`{
  "id": string,
  "milestoneId": number,
  "result": boolean,
  "confidence": number,  // 0–1
  "validators": [
    {
      "description": string,
      "result": boolean
    }
  ],
  "policy": {
    "minValidatorsPassed": number,  // percent (0–100)
    "minConfidence": number         // percent (0–100)
  }
}`}
                  </pre>
                </div>
              </div>

              {/* Error Responses */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="destructive">400 Bad Request</Badge>
                </div>
                <div className="bg-muted p-4 rounded-md overflow-x-auto mb-2">
                  <pre className="text-xs font-mono">
{`{
  "error": "Invalid or missing video file"
}`}
                  </pre>
                </div>
                <div className="bg-muted p-4 rounded-md overflow-x-auto">
                  <pre className="text-xs font-mono">
{`{
  "error": "Invalid or missing milestone ID"
}`}
                  </pre>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="destructive">401 Unauthorized</Badge>
                </div>
                <div className="bg-muted p-4 rounded-md overflow-x-auto">
                  <pre className="text-xs font-mono">
{`{
  "error": "Unauthorized"
}`}
                  </pre>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="destructive">500 Internal Server Error</Badge>
                </div>
                <div className="bg-muted p-4 rounded-md overflow-x-auto">
                  <pre className="text-xs font-mono">
{`{
  "error": "Internal server error"
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Examples */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Examples</h3>
            
            <div className="space-y-4">
              {/* Example with video file */}
              <div>
                <h4 className="text-sm font-medium mb-2">Using a video file</h4>
                <div className="bg-muted p-4 rounded-md overflow-x-auto">
                  <pre className="text-xs font-mono">
{`curl -X POST ${process.env.GAGA_API_URL || '${baseUrl}'}/api/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "milestoneId=1" \\
  -F "video=@/path/to/video.mp4"`}
                  </pre>
                </div>
              </div>

              {/* Example JavaScript */}
              <div>
                <h4 className="text-sm font-medium mb-2">JavaScript/TypeScript example</h4>
                <div className="bg-muted p-4 rounded-md overflow-x-auto">
                  <pre className="text-xs font-mono">
{`const formData = new FormData();
formData.append('milestoneId', '1');
formData.append('video', videoFile);

const response = await fetch('${process.env.GAGA_API_URL || '${baseUrl}'}/api/analyze', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: formData
});

const result = await response.json();
console.log(result);`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="milestone-ids" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">GET</Badge>
                <CardTitle className="text-xl font-mono">/api/milestone-ids</CardTitle>
              </div>
              <CardDescription className="text-base">
                Retrieve a list of all available milestones with their IDs and names
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Authentication */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Authentication</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  This endpoint requires an API key as a Bearer token in the Authorization header. You can find your API keys <Link className="text-blue-500 font-medium hover:text-blue-600" href="/dashboard/api-keys">here</Link>.
                </p>
                <div className="bg-muted p-4 rounded-md font-mono text-sm">
                  <div className="text-muted-foreground">Authorization: Bearer <span className="text-foreground">YOUR_API_KEY</span></div>
                </div>
              </div>

              <Separator />

              {/* Response */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Response</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  The endpoint returns JSON with the following structure:
                </p>

                <div className="space-y-4">
                  {/* Success Response */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="default" className="bg-green-600 hover:bg-green-700">200 OK</Badge>
                      <span className="text-sm font-semibold">Success</span>
                    </div>
                    <div className="bg-muted p-4 rounded-md overflow-x-auto">
                      <pre className="text-xs font-mono">
{`[
  {
    "id": number,
    "name": string
  }
]`}
                      </pre>
                    </div>
                  </div>

                  {/* Error Responses */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="destructive">401 Unauthorized</Badge>
                    </div>
                    <div className="bg-muted p-4 rounded-md overflow-x-auto">
                      <pre className="text-xs font-mono">
{`{
  "error": "Unauthorized"
}`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="destructive">500 Internal Server Error</Badge>
                    </div>
                    <div className="bg-muted p-4 rounded-md overflow-x-auto">
                      <pre className="text-xs font-mono">
{`{
  "error": "Internal server error"
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Examples */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Examples</h3>
                
                <div className="space-y-4">
                  {/* Example cURL */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">cURL example</h4>
                    <div className="bg-muted p-4 rounded-md overflow-x-auto">
                      <pre className="text-xs font-mono">
{`curl -X GET ${process.env.GAGA_API_URL || '${baseUrl}'}/milestone-ids \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                      </pre>
                    </div>
                  </div>

                  {/* Example JavaScript */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">JavaScript/TypeScript example</h4>
                    <div className="bg-muted p-4 rounded-md overflow-x-auto">
                      <pre className="text-xs font-mono">
{`const response = await fetch('${process.env.GAGA_API_URL || '${baseUrl}'}/milestone-ids', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});

const milestones = await response.json();
console.log(milestones);
// [
//   { id: 1, name: "Visually follows a moving object horizontally" },
//   { id: 2, name: "Vocalizes in response to human voice" },
//   ...
// ]`}
                      </pre>
                    </div>
                  </div>

                  {/* Example Response */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Example response</h4>
                    <div className="bg-muted p-4 rounded-md overflow-x-auto">
                      <pre className="text-xs font-mono">
{`[
  { "id": 1, "name": "Visually follows a moving object horizontally" },
  { "id": 2, "name": "Vocalizes in response to human voice" },
  { "id": 3, "name": "Smiles responsively" },
  { "id": 4, "name": "Raises head" }
]`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analyze-results" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">GET</Badge>
                <CardTitle className="text-xl font-mono">/api/analyze-results/:id</CardTitle>
              </div>
              <CardDescription className="text-base">
                Retrieve detailed information about a specific analysis result
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Authentication */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Authentication</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  This endpoint requires an API key as a Bearer token in the Authorization header. You can find your API keys <Link className="text-blue-500 font-medium hover:text-blue-600" href="/dashboard/api-keys">here</Link>.
                </p>
                <div className="bg-muted p-4 rounded-md font-mono text-sm">
                  <div className="text-muted-foreground">Authorization: Bearer <span className="text-foreground">YOUR_API_KEY</span></div>
                </div>
              </div>

              <Separator />

              {/* Path Parameters */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Path Parameters</h3>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <code className="text-sm font-semibold">id</code>
                    <Badge variant="outline" className="text-xs">required</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    <span className="font-medium">Type:</span> <code className="bg-muted px-1.5 py-0.5 rounded text-xs">string</code>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    The unique identifier of the analysis result to retrieve.
                  </p>
                </div>
              </div>

              <Separator />

              {/* Response */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Response</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  The endpoint returns JSON with the following structure:
                </p>

                <div className="space-y-4">
                  {/* Success Response */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="default" className="bg-green-600 hover:bg-green-700">200 OK</Badge>
                      <span className="text-sm font-semibold">Success</span>
                    </div>
                    <div className="bg-muted p-4 rounded-md overflow-x-auto">
                      <pre className="text-xs font-mono">
{`{
  "id": string,
  "createdAt": string,           // ISO 8601 timestamp
  "milestoneId": number,
  "result": boolean,
  "confidence": number,          // 0-100
  "validatorsTotal": number,
  "validatorsPassed": number,
  "apiKeyId": number,
  "model": string,
  "totalTokenCount": number,
  "processingMs": number,        // milliseconds
  "requestId": string            // UUID
}`}
                      </pre>
                    </div>
                  </div>

                  {/* Error Responses */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="destructive">401 Unauthorized</Badge>
                    </div>
                    <div className="bg-muted p-4 rounded-md overflow-x-auto">
                      <pre className="text-xs font-mono">
{`{
  "error": "Unauthorized"
}`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="destructive">404 Not Found</Badge>
                    </div>
                    <div className="bg-muted p-4 rounded-md overflow-x-auto">
                      <pre className="text-xs font-mono">
{`{
  "error": "Analysis result not found"
}`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="destructive">500 Internal Server Error</Badge>
                    </div>
                    <div className="bg-muted p-4 rounded-md overflow-x-auto">
                      <pre className="text-xs font-mono">
{`{
  "error": "Internal server error"
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Examples */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Examples</h3>
                
                <div className="space-y-4">
                  {/* Example cURL */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">cURL example</h4>
                    <div className="bg-muted p-4 rounded-md overflow-x-auto">
                      <pre className="text-xs font-mono">
{`curl -X GET ${process.env.GAGA_API_URL || '${baseUrl}'}/api/analyze-results/5 \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                      </pre>
                    </div>
                  </div>

                  {/* Example JavaScript */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">JavaScript/TypeScript example</h4>
                    <div className="bg-muted p-4 rounded-md overflow-x-auto">
                      <pre className="text-xs font-mono">
{`const resultId = 5;
const response = await fetch(\`${process.env.GAGA_API_URL || '${baseUrl}'}/api/analyze-results/\${resultId}\`, {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});

const result = await response.json();
console.log(result);`}
                      </pre>
                    </div>
                  </div>

                  {/* Example Response */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Example response</h4>
                    <div className="bg-muted p-4 rounded-md overflow-x-auto">
                      <pre className="text-xs font-mono">
{`{
  "id": bc315a35-d190-4091-a88a-695f41815808,
  "createdAt": "2025-08-12T21:32:45.556Z",
  "milestoneId": 10,
  "result": true,
  "confidence": 100,
  "validatorsTotal": 1,
  "validatorsPassed": 1,
  "apiKeyId": 12,
  "model": "gemini-2.5-flash",
  "totalTokenCount": 2767,
  "processingMs": 3798,
  "requestId": "bc315a35-d190-4091-a88a-695f41715808"
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

