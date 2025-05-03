"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "./ui/button";
import { Clock, Trash2 } from "lucide-react";
import type { Message } from "@/model/User";
import axios from "axios";
import type { ApiResponse } from "../../types/ApiResponse";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast.success(response.data.message);
      onMessageDelete(message._id);
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };

  const formattedDate = formatDistanceToNow(
    new Date(message.createdAt || Date.now()),
    {
      addSuffix: true,
    }
  );

  return (
    <Card className="relative overflow-hidden border-l-4 border-l-emerald-500 shadow-md hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="flex flex-row items-start justify-between pb-2 pt-2 space-y-0">
        <div>
          <CardTitle className="text-lg font-semibold">New Message</CardTitle>
          <CardDescription className="flex items-center mt-1 text-xs">
            <Clock className="h-3 w-3 mr-1 text-emerald-500" />
            {formattedDate}
          </CardDescription>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-full text-red-500 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete message</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="border-l-4 border-l-red-500">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-red-500">
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                message from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border border-gray-200">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
          <p className="text-gray-700 leading-relaxed">{message.content}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessageCard;
