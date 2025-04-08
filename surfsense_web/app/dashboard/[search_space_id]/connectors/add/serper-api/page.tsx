"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { ArrowLeft, Check, Info, Loader2 } from "lucide-react";

import { useSearchSourceConnectors } from "@/hooks/useSearchSourceConnectors";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

// Define the form schema with Zod
const serperApiFormSchema = z.object({
  name: z.string().min(3, {
    message: "Connector name must be at least 3 characters.",
  }),
  api_key: z.string().min(10, {
    message: "API key is required and must be valid.",
  }),
});

// Define the type for the form values
type SerperApiFormValues = z.infer<typeof serperApiFormSchema>;

export default function SerperApiPage() {
  const router = useRouter();
  const params = useParams();
  const searchSpaceId = params.search_space_id as string;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createConnector } = useSearchSourceConnectors();

  // Initialize the form
  const form = useForm<SerperApiFormValues>({
    resolver: zodResolver(serperApiFormSchema),
    defaultValues: {
      name: "Serper API Connector",
      api_key: "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: SerperApiFormValues) => {
    setIsSubmitting(true);
    try {
      await createConnector({
        name: values.name,
        connector_type: "SERPER_API",
        config: {
          SERPER_API_KEY: values.api_key,
        },
        is_indexable: false,
        last_indexed_at: null,
      });

      toast.success("Serper API connector created successfully!");
      
      // Navigate back to connectors page
      router.push(`/dashboard/${searchSpaceId}/connectors`);
    } catch (error) {
      console.error("Error creating connector:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create connector");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.push(`/dashboard/${searchSpaceId}/connectors/add`)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Connectors
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-2 border-border">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Connect Serper API</CardTitle>
            <CardDescription>
              Integrate with Serper API to enhance your search capabilities with Google search results.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6 bg-muted">
              <Info className="h-4 w-4" />
              <AlertTitle>API Key Required</AlertTitle>
              <AlertDescription>
                You'll need a Serper API key to use this connector. You can get one by signing up at{" "}
                <a 
                  href="https://serper.dev" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium underline underline-offset-4"
                >
                  serper.dev
                </a>
              </AlertDescription>
            </Alert>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Connector Name</FormLabel>
                      <FormControl>
                        <Input placeholder="My Serper API Connector" {...field} />
                      </FormControl>
                      <FormDescription>
                        A friendly name to identify this connector.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="api_key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Serper API Key</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Enter your Serper API key" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Your API key will be encrypted and stored securely.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Connect Serper API
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col items-start border-t bg-muted/50 px-6 py-4">
            <h4 className="text-sm font-medium">What you get with Serper API:</h4>
            <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
              <li>Access to Google search results directly in your research</li>
              <li>Real-time information from the web</li>
              <li>Enhanced search capabilities for your projects</li>
            </ul>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}