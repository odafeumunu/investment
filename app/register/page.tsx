"use client";

export const dynamic = "force-dynamic";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { registerUser, RegisterPayload } from "@/lib/api/register";
import RegisterForm from "@/components/auth_form/RegisterForm";
import { AxiosError } from "axios";
import { useRef } from "react";
import { UseFormReturn } from "react-hook-form";

export default function RegisterPage() {
  const router = useRouter();
  const formRef = useRef<UseFormReturn<RegisterPayload> | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success("Registration successful!");
      router.push("/signin");
    },
    onError: (error: AxiosError<Record<string, string[]>>) => {
      const backendErrors = error.response?.data;
      if (backendErrors && formRef.current) {
        Object.entries(backendErrors).forEach(([field, messages]) => {
          formRef.current?.setError(field as keyof RegisterPayload, {
            type: "server",
            message: messages[0],
          });
        });
      } else {
        toast.error("Registration failed");
      }
    },
  });

  const handleSubmit = (
    values: RegisterPayload,
    form: UseFormReturn<RegisterPayload>
  ) => {
    formRef.current = form;
    mutate(values);
  };

  return <RegisterForm onSubmit={handleSubmit} isLoading={isPending} />;
}
