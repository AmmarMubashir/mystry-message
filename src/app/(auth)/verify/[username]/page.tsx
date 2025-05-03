"use client";

import { verifySchema } from "@/Schema/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { type AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type * as z from "zod";
import type { ApiResponse } from "../../../../../types/ApiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";

const VerifyAccount = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // zod implementation
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      toast.success(response.data.message);
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error in verifying code", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message ?? "Error verifying code";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="w-full max-w-md p-4">
        <Card className="border-t-4 border-t-emerald-500 shadow-lg overflow-hidden">
          <CardHeader className="space-y-1 text-center pb-6">
            <div className="mx-auto bg-emerald-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
              <ShieldCheck className="h-8 w-8 text-emerald-600" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Verify Your Account
            </CardTitle>
            <CardDescription className="text-gray-500">
              We&apos;ve sent a verification code to your email for{" "}
              {params.username}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  name="code"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        Verification Code
                      </FormLabel>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <FormControl>
                          <Input
                            placeholder="Enter your verification code"
                            className="pl-10 text-center tracking-widest font-mono text-lg bg-gray-50 border-gray-200 focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 transition-all"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white transition-all duration-300"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span>Verify Account</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  )}
                </Button>

                <div className="text-center mt-4 space-y-2">
                  <p className="text-sm text-gray-500">
                    Didn&apos;t receive a code? Check your spam folder or
                    request a new code.
                  </p>
                  {/* <Button
                    variant="link"
                    className="text-emerald-600 hover:text-emerald-700 p-0 h-auto"
                  >
                    Resend verification code
                  </Button> */}
                </div>
              </form>
            </Form>
          </CardContent>

          <div className="border-t border-gray-100 p-4 text-center">
            <div className="text-sm text-gray-500">
              <span>Return to </span>
              <Link
                href="/sign-in"
                className="font-medium text-emerald-600 hover:text-emerald-700"
              >
                Sign In
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VerifyAccount;
