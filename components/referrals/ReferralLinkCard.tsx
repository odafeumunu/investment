"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, Share2 } from "lucide-react";
import { copyToClipboard } from "@/lib/utils/formatCurrency";

type Props = {
  referralCode: string;
  referralLink: string;
  shareMessage: string;
};

export function ReferralLinkCard({
  referralCode,
  referralLink,
  shareMessage,
}: Props) {
  async function onCopy() {
    const ok = await copyToClipboard(referralLink);

    if (ok) {
      toast.success("Referral Link Copied!");
    } else {
      toast.error("Failed to copy");
    }
  }

  async function onShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join me",
          text: shareMessage,
          url: referralLink,
        });
      } catch {}
    } else {
      onCopy();
    }
  }

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Referral Code</p>
          <p className="text-lg font-semibold">{referralCode}</p>
        </div>

        <div className="flex gap-2">
          {/* COPY BUTTON */}
          <Button
            variant="outline"
            onClick={onCopy}
            className="border-emerald-500 text-emerald-600 hover:bg-emerald-50">
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>

          {/* SHARE BUTTON */}
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={onShare}>
            <Share2 className="w-4 h-4 mr-2" />
          </Button>
        </div>
      </div>

      <div className="mt-4 text-sm break-all font-medium text-emerald-700 bg-emerald-50 p-2 rounded">
        {referralLink}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">{shareMessage}</p>
    </div>
  );
}
