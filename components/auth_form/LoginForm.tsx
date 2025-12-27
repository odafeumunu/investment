"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { EyeOff, Eye, Smartphone, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";

// Define Zod schema including all required fields
const formSchema = z
  .object({
    phone_number: z
      .string()
      .min(1, "Phone number is required")
      .max(15, "Phone number too long"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  })

type FormSchemaType = z.infer<typeof formSchema>;

export default function LoginForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (data: FormSchemaType, form: UseFormReturn<FormSchemaType>) => void;
  isLoading?: boolean;
}) {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone_number: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="container">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => onSubmit(data, form))}
          className="mt-10">
          <div className="flex flex-col items-center gap-3 justify-center mb-5">
            <Image
              src="/logo.png"
              alt="My App Logo"
              width={85}
              height={85}
              className="shadow-sm"
              priority
            />
            <h2 className="text-center text-2xl font-semibold">Sign In</h2>
          </div>

          {/* PHONE NUMBER */}
          <div className="mb-5">
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center h-7 w-7 rounded-full border border-gray-300/50 text-gray-500">
                        <Smartphone className="h-4 w-4" />
                      </div>
                      <Input
                        placeholder="Enter Phone Number"
                        {...field}
                        className="pl-12"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-5">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center h-7 w-7 rounded-full border border-gray-300/50 text-gray-500">
                        <Lock className="h-4 w-4" />
                      </div>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter Password"
                        {...field}
                        className="pl-12 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        tabIndex={-1}>
                        {showPassword ? (
                          <Eye className="h-5 w-5" />
                        ) : (
                          <EyeOff className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* SUBMIT BUTTON */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>

          <p className="text-center mt-3 text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
}
