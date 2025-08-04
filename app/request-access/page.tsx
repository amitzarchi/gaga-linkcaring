"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, Suspense } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useAccessRequests } from "@/app/context/access-requests-context";
import { AccessRequestsProvider } from "@/app/context/access-requests-context";
import { useRouter, useSearchParams } from "next/navigation";

function RequestAccessForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get user data from URL params (from auth error)
  const emailFromError = searchParams.get("email") || ""
  const nameFromError = searchParams.get("name")?.replaceAll("_", " ") || ""
  
  const [formData, setFormData] = useState({
    name: nameFromError,
    email: emailFromError,
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const { addAccessRequest } = useAccessRequests();

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateId = () => {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      await addAccessRequest({
        id: generateId(),
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        reason: formData.reason.trim() || undefined,
      });
      
      setSubmitted(true);
    } catch (error) {
      // Error is handled by the context with toast
      console.error("Error submitting access request:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (submitted) {
    return (
      <div className="flex justify-center items-center mt-[20vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <CardTitle className="text-lg md:text-xl text-green-700">
              Request Submitted!
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Your access request has been submitted successfully. We'll review it and get back to you soon.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                router.push('/')
              }}
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center mt-[15vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Request Access</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Request access to the platform. We'll review your request and get back to you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                aria-invalid={!!errors.name}
                disabled={loading}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                aria-invalid={!!errors.email}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">
                Reason for Access <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="reason"
                placeholder="Why do you need access to this platform?"
                value={formData.reason}
                onChange={(e) => handleInputChange("reason", e.target.value)}
                rows={3}
                disabled={loading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting Request...
                </>
              ) : (
                "Submit Access Request"
              )}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t text-center">
            <p className="text-xs text-muted-foreground">
              Already have access?{" "}
              <Link
                href="/" 
                className="text-primary hover:underline font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingForm() {
  return (
    <div className="flex justify-center items-center mt-[15vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Request Access</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Loading...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center p-8">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function RequestAccessPage() {
  return (
    <AccessRequestsProvider accessRequestsData={[]}>
      <Suspense fallback={<LoadingForm />}>
        <RequestAccessForm />
      </Suspense>
    </AccessRequestsProvider>
  );
} 