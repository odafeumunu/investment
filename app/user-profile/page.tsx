"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Copy,
  ArrowDownCircle,
  ArrowUpCircle,
  LogOut,
} from "lucide-react";

import { useAuthStore } from "@/lib/store/authStore";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import BottomNav from "@/components/ButtonNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; // ShadCN Select

import {
  getUserDetails,
  updateUserProfile,
  DashboardData,
} from "@/lib/api/dashboard";
import { formatCurrency, copyToClipboard } from "@/lib/utils/formatCurrency";

export default function UserProfile() {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  // Dialog state
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    mobile_money_number: "",
    mobile_money_provider: "",
  });

  // Fetch user dashboard
  const { data: userPro } = useQuery<DashboardData, Error>({
    queryKey: ["dashboard"],
    queryFn: getUserDetails,
  });

  const mutation = useMutation({
    mutationFn: (data: {
      full_name: string;
      mobile_money_number: string;
      mobile_money_provider: "MTN" | "Vodafone" | "AirtelTigo";
    }) => updateUserProfile(data),
    onSuccess: () => {
      toast.success("Profile updated!");
      queryClient.invalidateQueries({ queryKey: ["dashboard"], exact: true });
      setShowEditDialog(false);
    },
    onError: () => toast.error("Update failed"),
  });

  if (!userPro) return null;

  const { profile } = userPro;

  // Prefill form on open
  const handleOpenDialog = () => {
    setFormData({
      full_name: profile.full_name || "",
      mobile_money_number: profile.mobile_money_number || "",
      mobile_money_provider: profile.mobile_money_provider || "",
    });
    setShowEditDialog(true);
  };


  const moneyProviders = ["MTN", "Vodafone", "AirtelTigo"];

  return (
    <ProtectedRoute>
      {/* Header */}
      <div className="relative h-64 bg-[url('/bg.gif')] bg-cover bg-center text-white">
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2 px-4 text-center">
          <Avatar className="h-20 w-20">
            {profile.profile_picture ? (
              <AvatarImage src={profile.profile_picture} alt="User Avatar" />
            ) : (
              <AvatarFallback>
                <Image
                  src="/user.png"
                  alt="Default Avatar"
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                />
              </AvatarFallback>
            )}
          </Avatar>

          <h2 className="text-lg font-semibold">
            {userPro.username || userPro.phone_number}
          </h2>
          <p className="text-sm">{userPro.phone_number}</p>

          <p
            className="flex items-center text-sm cursor-pointer"
            onClick={async () => {
              const copied = await copyToClipboard(userPro.referral_code);
              if (copied) toast.success("Referral code copied!");
              else toast.error("Failed to copy");
            }}>
            <Copy className="h-4 w-4 mr-1" />
            Referral Code: {userPro.referral_code}
          </p>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/deposit">
              <Button className="flex items-center gap-2">
                <ArrowDownCircle className="w-4 h-4" />
                Deposit
              </Button>
            </Link>

            <Link href="/investments#activePlan">
              <Button className="flex items-center gap-2">
                <ArrowUpCircle className="w-4 h-4" />
                Withdrawal
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-6 space-y-6">
        {/* Wallets */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Wallet Balance", value: userPro.available_balance },
            { label: "Invested Balance", value: userPro.invested_balance },
          ].map((item) => (
            <div key={item.label} className="bg-white shadow rounded-lg p-4">
              <p className="text-sm text-gray-500">{item.label}</p>
              <h3 className="text-md font-bold text-emerald-600">
                {formatCurrency(item.value)}
              </h3>
            </div>
          ))}
        </div>

        {/* Total Balances */}
        <div className="bg-white shadow rounded-lg px-4 py-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Total Balance", value: userPro.total_balance },
              { label: "Total Earned", value: userPro.total_earned },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-md p-3">
                <p className="text-gray-500">{item.label}</p>
                <p className="font-semibold text-md text-emerald-600">
                  {formatCurrency(item.value)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Profile Info */}
        <div className="bg-white shadow rounded-lg p-4 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Full Name:</p>
              <p className="font-semibold">{profile.full_name}</p>
            </div>
          </div>

          <div className="flex justify-between items-center mt-2">
            <div>
              <p className="text-sm text-gray-500">Mobile Money Number</p>
              <p className="font-semibold">{profile.mobile_money_number}</p>
            </div>
          </div>

          <div className="flex justify-between items-center mt-2">
            <div>
              <p className="text-sm text-gray-500">Mobile Money Provider</p>
              <p className="font-semibold">{profile.mobile_money_provider}</p>
            </div>

            <Button size="sm" variant="outline" onClick={handleOpenDialog}>
              {profile.full_name ? "Edit" : "+ Add"}
            </Button>
          </div>
        </div>

        {/* Quick Links & Logout */}
        <div className="bg-white shadow rounded-lg divide-y">
          <div className="px-4 py-3 flex justify-between">
            <Button
              className="bg-red-500 hover:bg-red-700"
              size="sm"
              onClick={logout}>
              <LogOut />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-2">
            {/* Avatar and File input */}
            <Input
              placeholder="Full Name"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
            />
            <Input
              placeholder="Mobile Money Number"
              value={formData.mobile_money_number}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  mobile_money_number: e.target.value,
                })
              }
            />

            {/* Mobile Money Provider Select using ShadCN Select */}
            <div>
              <label htmlFor="mobile_money_provider">
                Mobile Money Provider
              </label>
              <Select
                value={formData.mobile_money_provider}
                onValueChange={(value) =>
                  setFormData({ ...formData, mobile_money_provider: value })
                }>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Provider" />
                </SelectTrigger>
                <SelectContent>
                  {moneyProviders.map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                mutation.mutate({
                  ...formData,
                  mobile_money_provider: formData.mobile_money_provider as
                    | "MTN"
                    | "Vodafone"
                    | "AirtelTigo",
                });
              }}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <BottomNav />
    </ProtectedRoute>
  );
}
