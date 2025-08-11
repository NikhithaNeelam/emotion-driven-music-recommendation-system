export interface Track {
  name: string;
  artist: string;
  albumArt: string;
  url: string;
  'data-ai-hint'?: string;
}

export interface Playlist {
  name: string;
  description: string;
  url: string;
  tracks: Track[];
}
