"use client";

import { useInvestmentPlans } from "@/lib/hooks/useInvestment";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import BottomNav from "@/components/ButtonNav";
import InvestmentCard from "@/components/investments/InvestmentCard";
import { HeaderBar } from "@/components/HeaderBar";
import { ActiveInvestmentsCards } from "@/components/investments/ActiveInvestments";
import { InvestmentHistoryTable } from "@/components/investments/HistoryInvestment";
import { InvestmentStatsTable } from "@/components/investments/InvestmentStats";
import ScrollToHash from "@/components/ScrollToHash";

export default function InvestmentPage() {
  const { data: investmentPlans } = useInvestmentPlans();

  return (
    <ProtectedRoute>
      <ScrollToHash />
      <HeaderBar title="Investments" />

      <div className="bg-gray-100 min-h-screen py-6 px-4">
        {/* Investment Plans Section */}
        <div className="mb-8 rounded-xl border bg-card p-5">
          <h2 className="text-lg font-semibold mb-4">Investment Plans</h2>
          <div className="grid gap-4">
            {investmentPlans?.map((plan) => (
              <InvestmentCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>

        {/* Active Investments Section */}
        <div id="activePlan">
          <ActiveInvestmentsCards />
        </div>

        {/* Investment Stats Section */}
        <InvestmentStatsTable />

        {/* History Investments Section */}
        <InvestmentHistoryTable />
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </ProtectedRoute>
  );
}
