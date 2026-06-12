export interface EpisodeBrief {
  show_name: string;
  episode_type: string;
  host_name: string;
  guest_name?: string;
  guest_credentials?: string;
  health_niche: string;
  secondary_niches?: string[];
  core_topic: string;
  key_points: string[];
  target_listener: string;
  tone: string;
  quotable_moments?: string[];
  actionable_takeaways?: string[];
  sensitive_topics?: string[];
  trust_signals?: string[];
  episode_length_signal?: string;
}

export interface EpisodeRun {
  id: string;
  user_id: string;
  created_at: string;
  episode_title: string;
  health_niche: string;
  episode_type: string;
  assets: Record<string, string>;
  confidence_score: number;
  credibility_flags: string[];
  transformation_statement: string;
}

export type SubscriptionTier =
  | "free_trial"
  | "starter"
  | "pro"
  | "founding_member";
