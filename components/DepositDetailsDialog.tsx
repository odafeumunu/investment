// src/components/wallet/DepositDetailsDialog.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Countdown from "@/components/Countdown";
import { useSubmitPayment } from "@/lib/hooks/useWallet";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  details: {
    account_name: string;
    account_number: string;
    network: string;
    reference: string;
    amount: string;
  };
  expiresAt: number; // timestamp in ms
  onExpired: () => void;
};

export default function DepositDetailsDialog({
  open,
  onOpenChange,
  details,
  expiresAt,
  onExpired,
}: Props) {
  const [txnRef, setTxnRef] = useState("");
  const submitPaymentMutation = useSubmitPayment();
  const router = useRouter()

  const handleSubmitPayment = () => {
    submitPaymentMutation.mutate(
      {
        deposit_reference: details.reference,
        transaction_reference: txnRef,
      },
      {
        onSuccess: (data) => {
          toast.success(data.message || "Payment submitted successfully.");
          onOpenChange(false);
          router.push("/deposit/history")
        },
        onError: (err: unknown) => {
          let msg = "Failed to submit payment.";

          if (err && typeof err === "object" && "isAxiosError" in err) {
            const axiosError = err as AxiosError<{
              message?: string;
              detail?: string;
            }>;
            msg =
              axiosError.response?.data?.message ||
              axiosError.response?.data?.detail ||
              msg;
          }

          toast.error(msg);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
            <DialogHeader>
            <DialogTitle className="text-lg">Deposit instructions</DialogTitle>
            </DialogHeader>

            <div className="space-y-3 text-sm">
            <div className="bg-gray-50 p-3 rounded-md">
                <p className="font-medium">Send money to:</p>
                <p>{details.account_name}</p>
                <p className="font-mono text-lg">{details.account_number}</p>
                <p className="uppercase text-xs text-gray-500">
                Network: {details.network}
                </p>
            </div>

            <div className="flex items-center justify-between">
                <p>
                Reference: <span className="font-mono">{details.reference}</span>
                </p>
                <p>
                Expires in:{" "}
                <Countdown expiresAt={expiresAt} onExpire={onExpired} />
                </p>
            </div>

            <p className="text-gray-600">
                Transfer the exact amount now. After completing the payment, enter
                your transaction reference and submit.
            </p>

            <Input
                placeholder="Transaction reference (e.g. TXN123456789)"
                value={txnRef}
                onChange={(e) => setTxnRef(e.target.value)}
            />

            <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleSubmitPayment}
                disabled={submitPaymentMutation.isPending || !txnRef.trim()}>
                {submitPaymentMutation.isPending
                ? "Submitting..."
                : "I have completed this payment"}
            </Button>
            </div>
        </DialogContent>
    </Dialog>
  );
}
