export type ActivityType = "TWEET" | "RETWEET" | "REPLY";

export interface Profile {
  handle: string;
  activityCount: number;
  lastActivity: string | null;
}

export interface CreateActivityDto {
  handle: string;
  type: ActivityType;
  timestamp?: string;
}

export interface Alert {
  handle: string;
  lastActivity: string | null;
}
