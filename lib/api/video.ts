export interface AvailableVideo {
  id: number;
  title: string;
  description: string;
  thumbnail: string | null;
  video_file: string;
  category_name: string;
  duration_seconds: number;
  earnings_amount: string;
  has_watched: string; 
}

export interface VideoCategory {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

export interface VideoHistoryItem {
  id: number;
  video: number;
  video_title: string;
  video_thumbnail: string;
  earned_amount: string;
  watched_at: string;
  is_credited: boolean;
}

export interface DailyStats {
  has_active_investment: boolean;
  plan_level: number;
  daily_limit: number;
  videos_watched_today: number;
  earnings_today: string;
  available_videos: number;
  remaining_views: number;
}
