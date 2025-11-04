// Simple Node script to health-check media CDN URIs. This is intentionally
// lightweight and does not require project imports; it mirrors the URIs from
// constants/media.js so it can be run standalone (e.g. CI job) to exercise the
// fallback path.

const http = require('http');
const https = require('https');
const urls = [
  'https://cdn.pixabay.com/video/2023/08/17/176651-856034078_large.mp4',
  'https://cdn.pixabay.com/video/2022/02/10/107707-676325945_large.mp4',
  'https://cdn.pixabay.com/video/2023/06/16/166881-836982086_large.mp4',
  'https://cdn.pixabay.com/video/2021/07/03/80273-571123890_large.mp4',
  'https://cdn.pixabay.com/video/2022/12/29/145312-783826829_large.mp4',
  'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
  'https://cdn.pixabay.com/download/audio/2022/03/10/audio_4e5240f2eb.mp3',
  'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d1718ab41b.mp3',
];

function head(url, timeout = 3000) {
  return new Promise((resolve) => {
    try {
      const lib = url.startsWith('https') ? https : http;
      const req = lib.request(url, { method: 'HEAD', timeout }, (res) => {
        resolve({ ok: res.statusCode >= 200 && res.statusCode < 400, status: res.statusCode });
      });
      req.on('error', () => resolve({ ok: false }));
      req.on('timeout', () => {
        req.destroy();
        resolve({ ok: false, timeout: true });
      });
      req.end();
    } catch (e) {
      resolve({ ok: false });
    }
  });
}

(async () => {
  console.log('Checking media CDN urls...');
  for (const u of urls) {
    const res = await head(u, 4000);
    console.log(u, '->', res.ok ? `OK (${res.status || '200'})` : 'UNREACHABLE');
  }
})();
