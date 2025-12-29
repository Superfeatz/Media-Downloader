const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/fetch', async (req, res) => {
  const { url } = req.body;

  if (!url || !url.includes('tiktok.com')) {
    return res.status(400).json({ error: 'Masukkan URL TikTok yang valid!' });
  }

  try {
    // Endpoint resmi GiMiTA untuk TikTok
    const apiUrl = `https://api.gimita.id/api/downloader/tiktok?url=${encodeURIComponent(url)}`;

    const apiResponse = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TikTokDownloader/1.0)'
      }
    });

    if (!apiResponse.ok) {
      throw new Error(`API Error: ${apiResponse.status}`);
    }

    const data = await apiResponse.json();

    if (!data.success) {
      throw new Error(data.message || 'Video tidak ditemukan atau private');
    }

    res.json(data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message || 'Gagal mengambil data video TikTok' });
  }
});

app.listen(port, () => {
  console.log(`TikTok Downloader berjalan di http://localhost:${port}`);
  console.log(`Buka browser dan coba: http://localhost:${port}`);
});