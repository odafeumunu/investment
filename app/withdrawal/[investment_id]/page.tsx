"use client";

import { useParams } from "next/navigation";
import { useActiveInvestments } from "@/lib/hooks/useInvestment";
import { useCreateWithdrawalRequest } from "@/lib/hooks/useWallet";
import { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { HeaderBar } from "@/components/HeaderBar";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import BottomNav from "@/components/ButtonNav";
import { Eye, EyeOff } from "lucide-react";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { Card, CardContent } from "@/components/ui/card";

export default function WithdrawalPage() {
  const params = useParams();
  const investmentId = params.investment_id as string;
  const { data: activeInvestments } = useActiveInvestments();
  const createWithdrawal = useCreateWithdrawalRequest();
  const [showBalance, setShowBalance] = useState(true);

  const investment = activeInvestments?.active_investments.find(
    (inv) => inv.investment_id === investmentId
  );

  const [amount, setAmount] = useState("");
  const [provider, setProvider] = useState("");
  const [number, setNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  if (!investment) {
    return;
  }

  const available = Number(investment.available_earnings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numericAmount = parseFloat(amount);

    if (numericAmount > available) {
      toast.error("Amount exceeds available earnings for this investment.");
      return;
    }

    if (!amount || numericAmount <= 0) {
      return toast.error("Please enter a valid amount.");
    }

    if (!provider) {
      return toast.error("Please select a momo provider.");
    }

    if (!number.trim()) {
      return toast.error("Please enter your momo number.");
    }

    if (!accountName.trim()) {
      return toast.error("Please enter the account name.");
    }

    const payload = {
      investment_id: investment.investment_id,
      amount,
      account_details: {
        provider,
        phone_number: number,
        account_name: accountName,
      },
    };

    createWithdrawal.mutate(payload, {
      onSuccess: () => {
        toast.success("Withdrawal request submitted successfully.");
      },
      onError: (error: Error) => {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.detail || "An error occurred.");
        } else {
          toast.error(error.message || "An error occurred.");
        }
      },
    });
  };

  return (
    <ProtectedRoute>
      <HeaderBar title={`Withdrawal for ${investment.plan_name}`} />
      <div className="container space-y-6 p-5">
        <Card className="w-full shadow-sm rounded-2xl border-0 mb-5 relative z-10">
          <CardContent className="flex justify-between items-end gap-2">
            <div>
              <p className="flex items-center text-sm">
                Available Earnings
                <button
                  onClick={() => setShowBalance((prev) => !prev)}
                  className="ml-2 text-muted-foreground hover:text-emerald-600 transition"
                  aria-label="Toggle balance visibility">
                  {showBalance ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
              </p>
              <p className="font-bold text-emerald-600 text-[1.2rem] mt-2">
                {formatCurrency(available ?? 0)}
              </p>
            </div>
          </CardContent>
        </Card>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 border p-5 rounded-xl bg-white">
          <div>
            <Label className="mb-2">Amount</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <Label className="mb-2">Momo Provider</Label>
            <Select onValueChange={setProvider}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MTN">MTN</SelectItem>
                <SelectItem value="AirtelTigo">AirtelTigo</SelectItem>
                <SelectItem value="Vodafone">Vodafone</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2">Momo Number</Label>
            <Input
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <Label className="mb-2">Account Name</Label>
            <Input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <button className="w-full bg-emerald-600 text-white py-2 rounded">
            {createWithdrawal.isPending ? "Withdrawing" : "Withdraw"}
          </button>
        </form>
      </div>
      <BottomNav />
    </ProtectedRoute>
  );
}
