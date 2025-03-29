export interface Event {
  id: number;
  name: string;
  venue_name: string;
  address: string;
  start_time: string;
  end_time: string;
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