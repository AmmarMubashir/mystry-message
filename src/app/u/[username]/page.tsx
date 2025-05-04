"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios, { type AxiosError } from "axios";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Loader2,
  MessageSquare,
  ArrowRight,
  Info,
  Lightbulb,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { ApiResponse } from "../../../../types/ApiResponse";

// Define the message schema with Zod
const messageSchema = z.object({
  content: z
    .string()
    .min(2, { message: "Message must be at least 2 characters long" })
    .max(1000, { message: "Message cannot exceed 1000 characters" }),
});

type MessageFormValues = z.infer<typeof messageSchema>;

const Page = () => {
  const router = useRouter();
  const { username } = useParams<{ username: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Initialize the form with Zod validation
  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: MessageFormValues) => {
    setIsSubmitting(true);
    setMessageSuccess(false);

    try {
      // Send the message data to the API
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username,
        content: data.content,
      });

      // Show success message
      toast.success(response.data.message || "Message sent successfully!");
      setMessageSuccess(true);
      form.reset();

      // Optional: Redirect after a delay
      // setTimeout(() => router.push("/message-sent"), 2000);
    } catch (error) {
      console.error("Error sending message:", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message || "Failed to send message";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch message suggestions from API
  const fetchSuggestions = async () => {
    setIsLoadingSuggestions(true);
    try {
      const response = await axios.post<{ suggestions: string[] }>(
        "/api/suggest-messages"
      );
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      toast.error("Failed to load message suggestions");
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Apply a suggestion to the form
  const applySuggestion = (suggestion: string) => {
    form.setValue("content", suggestion);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="w-full max-w-2xl p-4">
        <Card className="border-t-4 border-t-emerald-500 shadow-lg overflow-hidden">
          <CardHeader className="space-y-1 text-center pb-6">
            <div className="mx-auto bg-emerald-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
              <MessageSquare className="h-8 w-8 text-emerald-600" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Send to {username}
            </CardTitle>
            <CardDescription className="text-gray-500">
              Your identity will remain anonymous. Share your thoughts freely.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {messageSuccess && (
              <Alert className="mb-6 bg-emerald-50 border-emerald-200 text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <AlertTitle className="text-emerald-700">
                  Message Sent!
                </AlertTitle>
                <AlertDescription className="text-emerald-600">
                  Your anonymous message has been delivered to {username}.
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  name="content"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        Your Message
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Textarea
                            placeholder="Write your anonymous message here..."
                            className="min-h-[200px] resize-none bg-gray-50 border-gray-200 focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 transition-all"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <div className="flex justify-between items-center mt-1.5">
                        <FormMessage />
                        <div className="text-xs text-gray-500">
                          {field.value.length}/300 characters
                        </div>
                      </div>

                      {/* Add the suggestion button here */}
                      <div className="mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 flex items-center gap-1.5"
                          onClick={fetchSuggestions}
                          disabled={isLoadingSuggestions}
                        >
                          {isLoadingSuggestions ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Lightbulb className="h-3.5 w-3.5" />
                          )}
                          <span>Get message ideas</span>
                        </Button>

                        {suggestions.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <p className="text-xs font-medium text-gray-500">
                              Suggested messages:
                            </p>
                            <div className="grid gap-2">
                              {suggestions.map((suggestion, index) => (
                                <div
                                  key={index}
                                  className="p-2 bg-gray-50 border border-gray-100 rounded-md text-sm cursor-pointer hover:bg-emerald-50 hover:border-emerald-100 transition-colors"
                                  onClick={() => applySuggestion(suggestion)}
                                >
                                  {suggestion}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </FormItem>
                  )}
                />

                <div className="bg-emerald-50 border border-emerald-100 rounded-md p-3 flex items-start">
                  <Info className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-emerald-700">
                    Your message will be sent anonymously. The recipient will
                    not know who sent this message.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white transition-all duration-300 py-6"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Sending message...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span>Send Anonymous Message</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex justify-center border-t border-gray-100 pt-4 pb-6">
            <div className="text-center flex items-center gap-1 text-sm">
              <span className="text-gray-600">
                Want your own anonymous inbox?
              </span>
              <Link
                href="/sign-up"
                className="font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Page;
