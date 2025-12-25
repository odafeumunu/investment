"use client";

import { AvailableVideo } from "@/lib/api/video";
import { useWatchVideo } from "@/lib/hooks/useVideo";
import { useState, useEffect, useRef } from "react";
import { DailyStats } from "@/lib/api/video";
import { useQueryClient } from "@tanstack/react-query";

// Global variable to track currently playing video
let currentlyPlaying: HTMLVideoElement | null = null;

export function VideoPlayer({ video }: { video: AvailableVideo }) {
  const watchMutation = useWatchVideo();
  const queryClient = useQueryClient();
  const [sent, setSent] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle video ending
  const handleEnded = () => {
    if (!sent) {
      setSent(true);
      watchMutation.mutate(video.id, {
        onSuccess: () => {
          queryClient.setQueryData<DailyStats>(
            ["videos", "stats"],
            (oldData) => {
              if (!oldData) return oldData;
              return {
                ...oldData,
                videos_watched_today: oldData.videos_watched_today + 1,
                remaining_views: oldData.remaining_views - 1,
                earnings_today: (
                  parseFloat(oldData.earnings_today) +
                  parseFloat(video.earnings_amount)
                ).toString(),
              };
            }
          );
        },
      });
    }
  };

  // Pause other videos when this one starts
  const handlePlay = () => {
    if (currentlyPlaying && currentlyPlaying !== videoRef.current) {
      currentlyPlaying.pause();
    }
    currentlyPlaying = videoRef.current!;
  };

  // Clean up reference on unmount
  useEffect(() => {
    const vid = videoRef.current;
    return () => {
      if (currentlyPlaying === vid) currentlyPlaying = null;
    };
  }, []);

  return (
    <div className="mb-3">
      <h3 className="font-semibold text-sm mb-1">{video.title}</h3>
      <p className="text-sm">{video.description}</p>

      <div className="relative overflow-hidden rounded-sm">
        <video
          ref={videoRef}
          controls
          onEnded={handleEnded}
          onPlay={handlePlay}
          className="w-full h-28 object-cover rounded-sm"
          poster={video.thumbnail || ""}>
          <source src={video.video_file} type="video/mp4" />
        </video>

        {sent && (
          <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.6)]">
            <p className="text-white text-center text-sm font-semibold">
              Earnings credited!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
