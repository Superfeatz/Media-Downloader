document.getElementById('download-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const url = document.getElementById('url-input').value.trim();
  const resultDiv = document.getElementById('result');
  const errorDiv = document.getElementById('error');
  const loading = document.getElementById('loading');
  const formatsDiv = document.getElementById('formats');

  // Reset
  resultDiv.style.display = 'none';
  errorDiv.style.display = 'none';
  errorDiv.textContent = '';
  loading.style.display = 'block';
  formatsDiv.innerHTML = '';

  try {
    const response = await fetch('/fetch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Video tidak ditemukan');
    }

    const v = data.data;

    // Isi data
    document.getElementById('title').textContent = v.title || 'Tanpa Caption';
    document.getElementById('author-name').textContent = v.author?.name || 'Unknown';
    document.getElementById('username').textContent = v.author?.name?.toLowerCase().replace(/\s/g, '') || 'user';
    document.getElementById('avatar').src = v.author?.avatar || '';
    document.getElementById('thumbnail').src = v.thumbnail || '';

    document.getElementById('views').textContent = Number(v.stats?.views || 0).toLocaleString();
    document.getElementById('likes').textContent = Number(v.stats?.likes || 0).toLocaleString();
    document.getElementById('comments').textContent = Number(v.stats?.comments || 0).toLocaleString();

    // Tombol Download
    if (v.video?.hd) {
      addDownloadBtn('🎥 Download Video HD (Tanpa Watermark)', v.video.hd);
    } else if (v.video?.sd) {
      addDownloadBtn('🎥 Download Video SD', v.video.sd);
    }

    if (v.audio?.url) {
      addDownloadBtn('🎵 Download Audio (MP3)', v.audio.url);
    }

    resultDiv.style.display = 'block';
  } catch (err) {
    errorDiv.textContent = err.message;
    errorDiv.style.display = 'block';
  } finally {
    loading.style.display = 'none';
  }
});

function addDownloadBtn(text, url) {
  const btn = document.createElement('a');
  btn.href = url;
  btn.classList.add('format-btn');
  btn.textContent = text;
  btn.target = '_blank';
  btn.rel = 'noopener';
  document.getElementById('formats').appendChild(btn);
}