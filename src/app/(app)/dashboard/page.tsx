"use client";

import type { Message } from "@/model/User";
import { acceptSchema } from "@/Schema/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { type AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { ApiResponse } from "../../../../types/ApiResponse";
import { toast } from "sonner";
import type { User } from "next-auth";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  ClipboardCopy,
  Loader2,
  MessageSquare,
  RefreshCcw,
} from "lucide-react";
import MessageCard from "@/components/MessageCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptSchema),
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessage ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ??
          "Error fetching accept message status"
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        console.log(response);
        setMessages(response.data.messages ?? []);
        if (refresh) {
          toast.success("Messages refreshed successfully");
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(
          axiosError.response?.data.message ?? "Error fetching messages"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchAcceptMessage();
    fetchMessages();
  }, [session, setValue, fetchMessages, fetchAcceptMessage]);

  // handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue(
        "acceptMessages",
        response.data.isAcceptingMessage ?? !acceptMessages
      );
      toast.success(
        response.data.message ??
          "Message acceptance status updated successfully"
      );
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ??
          "Error updating message acceptance status"
      );
    }
  };

  const username = (session?.user as User)?.username;

  let profileUrl = "";
  if (typeof window !== "undefined") {
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    profileUrl = `${baseUrl}/u/${username}`;
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("URL copied to clipboard");
  };

  if (!session || !session.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center p-8 rounded-lg shadow-sm border border-gray-100 bg-white">
          <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">
            Please login to see your messages
          </h1>
          <p className="text-gray-500 mt-2">
            You need to be logged in to access your dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              User Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your messages and profile settings
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`px-3 py-1 ${acceptMessages ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-50 text-gray-500 border-gray-200"}`}
            >
              {acceptMessages ? "Accepting Messages" : "Not Accepting Messages"}
            </Badge>
          </div>
        </div>

        {/* Settings Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Link Card */}
          <Card className="border-l-4 border-l-emerald-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">
                Your Unique Profile Link
              </CardTitle>
              <CardDescription>
                Share this link with others to receive messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={profileUrl}
                  readOnly
                  className="font-mono text-sm bg-gray-50"
                />
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="icon"
                  className="shrink-0 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors"
                >
                  <ClipboardCopy className="h-4 w-4" />
                  <span className="sr-only">Copy to clipboard</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Message Settings Card */}
          <Card className="border-l-4 border-l-emerald-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">
                Message Settings
              </CardTitle>
              <CardDescription>
                Control who can send you messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Accept Messages</div>
                  <div className="text-sm text-gray-500">
                    {acceptMessages
                      ? "Others can send you messages"
                      : "You are not accepting messages"}
                  </div>
                </div>
                <Switch
                  {...register("acceptMessages")}
                  checked={acceptMessages}
                  onCheckedChange={handleSwitchChange}
                  disabled={isSwitchLoading}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Messages Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Your Messages</h2>
              <p className="text-gray-500 text-sm">
                {messages.length > 0
                  ? `You have ${messages.length} message${messages.length === 1 ? "" : "s"}`
                  : "No messages yet"}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => fetchMessages(true)}
              disabled={isLoading}
              className="flex items-center gap-2 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
              <span>Refresh</span>
            </Button>
          </div>

          <Separator className="my-4" />

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
          ) : messages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in-50 duration-300">
              {messages.map((message) => (
                <MessageCard
                  key={message._id}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-200 animate-in fade-in-50 duration-300">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800">
                No messages yet
              </h3>
              <p className="text-gray-500 mt-1 max-w-md mx-auto">
                When someone sends you a message, it will appear here. Make sure
                you have message acceptance turned on.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
