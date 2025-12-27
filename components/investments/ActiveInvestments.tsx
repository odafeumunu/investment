"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useActiveInvestments,
  InvestmentDetails,
} from "@/lib/hooks/useInvestment";
import { formatCurrency } from "@/lib/utils/formatCurrency";


export function ActiveInvestmentsCards() {
  const { data: activeInvestments } = useActiveInvestments();

  if (!activeInvestments?.active_investments.length) {
    return (
      <div className="rounded-xl border bg-card p-6 text-center text-muted-foreground mb-5">
        No active investments found
      </div>
    );
  }

  return (
    <div className="mb-8 rounded-xl border bg-card p-5">
      <h2 className="text-lg mb-4">Active Investments</h2>

      <div className="">
        {activeInvestments.active_investments.map((inv: InvestmentDetails) => (
          <Card key={inv.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm capitalize">
                  {inv.plan_name} — {inv.plan_level}
                </CardTitle>
                <Badge variant="secondary" className="capitalize">
                  {inv.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Invested</span>
                <span>{formatCurrency(inv.amount_invested, "GHC")}</span>
              </div>

              <div className="flex justify-between font-medium">
                <span className="text-muted-foreground">Available</span>
                <span className="text-emerald-600">
                  {formatCurrency(inv.available_earnings, "GHC")}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Earnings</span>
                <span>{formatCurrency(inv.total_earnings, "GHC")}</span>
              </div>
            </CardContent>

            <CardFooter className="mt-auto">
              <Button asChild className="w-full bg-emerald-600">
                <Link href={`/withdrawal/${inv.investment_id}`}>Withdraw</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
