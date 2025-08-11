
import type { Playlist, Track } from './types';

const getAuthToken = async (): Promise<string> => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Spotify API credentials are not configured. Please check your .env file.');
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
    },
    body: 'grant_type=client_credentials',
    cache: 'no-cache',
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Spotify Auth Error:', errorData);
    throw new Error(`Failed to authenticate with Spotify: ${errorData.error_description || response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
};

const getFirstPlaylistFromSearch = async (token: string, query: string): Promise<any> => {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=playlist&limit=1`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to search for playlists on Spotify');
    }

    const data = await response.json();
    return data.playlists.items[0];
}


const getPlaylistTracks = async (token: string, playlistId: string): Promise<Track[]> => {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=10`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch playlist tracks from Spotify');
    }

    const data = await response.json();
    return data.items.map((item: any) => ({
        name: item.track.name,
        artist: item.track.artists.map((artist: any) => artist.name).join(', '),
        albumArt: item.track.album.images[0]?.url || 'https://placehold.co/100x100.png',
        url: item.track.external_urls.spotify,
        'data-ai-hint': 'song album'
    }));
}

export async function getPlaylistByVibe(vibe: string, language: string): Promise<Playlist> {
  const token = await getAuthToken();
  const query = language === "Any" ? `${vibe} vibes` : `${language} ${vibe}`;
  const playlistData = await getFirstPlaylistFromSearch(token, query);

  if (!playlistData) {
    throw new Error(`Could not find a suitable playlist on Spotify for "${vibe}". Try a different mood!`);
  }

  const tracks = await getPlaylistTracks(token, playlistData.id);

  return {
    name: playlistData.name,
    description: playlistData.description || `A playlist for when you're feeling ${vibe.toLowerCase()}.`,
    url: playlistData.external_urls.spotify,
    tracks: tracks,
  };
}
