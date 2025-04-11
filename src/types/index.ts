export interface Event {
  id: number;
  name: string;
  venue_name: string;
  address: string;
  start_date: string;
  start_time: string;
  end_time: string;
  time_zone: string;
  ticket_status: "Available" | "Sold Out" | "Sold At The Door";
  ticket_link: string;
  lineup: string[];
  genres: string[];
  description: string;
  poster_url: string;
  price: number;
  currency: string;
}

export interface EventCreate extends Omit<Event, 'id'> {}

export interface EventUpdate extends Partial<EventCreate> {}


export interface DjSocials {
  id: number;
  instagram: string;
  spotify: string;
  soundcloud: string;
  apple_music: string;
  youtube: string;
  tiktok: string;
}
export interface DjSocialsCreate extends Omit<DjSocials, 'id'> {}

export interface Dj {
  id: number;
  alias: string;
  profile_url: string;
  social_id: string;
  DjSocials?: DjSocials;
}

// DjCreate — DjSocials is optional and can be omitted entirely
export interface DjCreate extends Omit<Dj, 'id' | 'social_id' | 'DjSocials'> {
  DjSocials?: DjSocialsCreate;
}

// DjUpdate — make all fields optional for PATCH-style updates
export interface DjUpdate extends Partial<Omit<Dj, 'id' | 'social_id' | 'DjSocials'>> {
  DjSocials?: Partial<DjSocialsCreate>;
}


export interface Content {
  id: number;
  key: string;
  string_collection: string[];
  big_string: string;
}

export interface ContentCreate extends Omit<Content, 'id'> {}

export interface ContentUpdate extends Partial<Omit<Content, 'id' | 'key'>> {}

export interface CloudinarySignature {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
}

export interface MailingListEntry {
  id: number;
  name: string;
  email: string;
  subscribed: boolean;
  created_at: string;
}

export interface MailingListResponse {
  items: MailingListEntry[];
  total: number;
} 