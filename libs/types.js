export type User = {
  id: string;
  clerkId: string;
  createdAt: string;
};

export type Profile = {
  userId: string;
  username: string;
  displayName: string;
  bio?: string;
  discipline?: string;
  skillLevel?: string;
  homeBase?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  socialLinks?: Record<string, string>;
};

export type Clip = {
  id: number;
  userId: string;
  blobUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  tags: string[];
  visibility: "public" | "followers" | "private";
  createdAt: string;
};

export type Announcement = {
  id: number;
  userId: string;
  text: string;
  visibility: "public" | "followers";
  createdAt: string;
};

export type Follow = {
  followerId: string;
  followedId: string;
  createdAt: string;
};

export type Reaction = {
  id: number;
  userId: string;
  targetType: "clip" | "announcement" | "message" | "event" | "lesson";
  targetId: number;
  emoji: string;
  createdAt: string;
};

export type SpotType =
  | "skate_park"
  | "street_spot"
  | "parking_garage"
  | "parking_lot"
  | "park"
  | "food"
  | "water";

export type Spot = {
  id: number;
  name: string;
  type: SpotType;
  lat: number;
  lng: number;
  address?: string;
  verified: boolean;
  addedBy?: string;
};

export type EventType = "jam" | "lesson" | "comp" | "meetup";

export type Event = {
  id: number;
  title: string;
  description?: string;
  hostUserId: string;
  spotId?: number;
  startAt: string;
  endAt: string;
  type: EventType;
  maxAttendees?: number;
  visibility: "public" | "private";
};

export type CalendarItemType = "lesson" | "event" | "personal";

export type CalendarItem = {
  id: number;
  userId: string;
  type: CalendarItemType;
  refId?: number;
  title: string;
  startAt: string;
  endAt: string;
  notes?: string;
};
