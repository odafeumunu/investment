"use client";

import { useAvailableVideos, useVideoStats } from "@/lib/hooks/useVideo";
import { VideoPlayer } from "@/components/videos/VideoPlayer";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import BottomNav from "@/components/ButtonNav";
import { HeaderBar } from "@/components/HeaderBar";

export default function VideoEarningsPage() {
  const { data: videos } = useAvailableVideos();
  const { data: stats } = useVideoStats();

  return (
    <ProtectedRoute>
      <HeaderBar title="Daily Tasks" />
      <div className="container space-y-10">
        {/* ----------- AVAILABLE VIDEOS ----------- */}
        <section className="mt-5 rounded-xl border bg-card p-5">
          <div className="mb-6">
            <h2 className="text-lg mb-1 text-emerald-600">
              Watch & Earn Videos
            </h2>
            <p className="text-sm mb-4">
              Earnings are automatically earned when you finish a video
            </p>
          </div>

          {videos?.length === 0 && (
            <p className="text-muted-foreground text-sm">
              No videos available now
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {videos && stats
              ? videos
                  .slice(0, stats.daily_limit)
                  .map((v) => <VideoPlayer key={v.id} video={v} />)
              : null}
          </div>
        </section>

        {/* ---------- DAILY STATS ---------- */}
        <section className="rounded-xl border bg-card p-5">
          <h2 className="text-lg mb-4">Daily Video Stats</h2>

          {!stats && (
            <p className="text-sm text-muted-foreground">Loading...</p>
          )}

          {stats && (
            <div className="grid grid-cols-2 gap-4">
              <Stat label="Daily Limit" value={stats.daily_limit} />
              <Stat label="Watched Today" value={stats.videos_watched_today} />
              <Stat label="Remaining Views" value={stats.remaining_views} />
              <Stat
                label="Earnings Today"
                value={formatCurrency(stats.earnings_today || "0", "GHC")}
              />
            </div>
          )}
        </section>
      </div>

      <BottomNav />
    </ProtectedRoute>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-3 border rounded-lg bg-muted/20">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold text-sm">{value}</p>
    </div>
  );
}
