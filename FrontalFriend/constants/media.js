export const THEME_COLORS = {
  primary: '#4A90E2',
  secondary: '#7B68EE',
  background: '#F5F7FA',
  text: {
    primary: '#2C3E50',
    secondary: '#95A5A6',
    light: '#ECF0F1',
  },
  button: {
    active: '#4A90E2',
    inactive: '#BDC3C7',
  },
};

export const MEDIA_CATEGORIES = [
  {
    id: 'nature',
    label: 'Landscapes',
    videos: [
      {
        id: 'ocean-waves',
        title: 'Ocean Waves',
        uri: 'https://cdn.pixabay.com/video/2023/08/17/176651-856034078_large.mp4',
      },
      {
        id: 'forest-stream',
        title: 'Forest Stream',
        uri: 'https://cdn.pixabay.com/video/2022/02/10/107707-676325945_large.mp4',
      },
      {
        id: 'mountain-sunset',
        title: 'Mountain Sunset',
        uri: 'https://cdn.pixabay.com/video/2023/06/16/166881-836982086_large.mp4',
      },
    ],
  },
  {
    id: 'animals',
    label: 'Animals',
    videos: [
      {
        id: 'cat-relaxing',
        title: 'Relaxing Cat',
        uri: 'https://cdn.pixabay.com/video/2021/07/03/80273-571123890_large.mp4',
      },
      {
        id: 'dog-playing',
        title: 'Peaceful Dog',
        uri: 'https://cdn.pixabay.com/video/2022/12/29/145312-783826829_large.mp4',
      },
    ],
  },
];

export const AUDIO_TRACKS = [
  {
    id: 'calm-meditation',
    title: 'Calm Meditation',
    uri: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
  },
  {
    id: 'peaceful-garden',
    title: 'Peaceful Garden',
    uri: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_4e5240f2eb.mp3',
  },
  {
    id: 'relaxing-ambient',
    title: 'Relaxing Ambient',
    uri: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d1718ab41b.mp3',
  },
];

// NOTE:
// The URIs above are hosted on external CDNs (Pixabay). These are runtime
// dependencies outside the app's control and may become unavailable. Callers
// should validate remote URIs and provide a local/static fallback (image or
// message) when the CDN is unreachable. See `constants/mediaUtils.js` for a
// small helper used by the Relax screen to sanity-check links and select a
// fallback path when an asset cannot be reached.
