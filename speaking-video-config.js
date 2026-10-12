// Public course media only; separate from ELP videos.
window.FCA_SPEAKING_VIDEO_URLS = {
  week1: 'https://qxqravtajqj1esoa.public.blob.vercel-storage.com/Presentaion-speaking%20-week-1.mp4',
  week2: 'https://qxqravtajqj1esoa.public.blob.vercel-storage.com/Presentation-speaking-week-2.mp4',
  week3: 'https://qxqravtajqj1esoa.public.blob.vercel-storage.com/Presentation-speaking-week-3.mp4',
  week4: 'https://qxqravtajqj1esoa.public.blob.vercel-storage.com/Presentation-speaking-week%20-4.mp4'
};
window.FCA_SPEAKING_VIDEO_CARD = function(n) {
  const url = window.FCA_SPEAKING_VIDEO_URLS['week' + n];
  if (!url) return '';
  return `<section class="card speaking-video-card"><span class="eyebrow dark">Week ${n} explainer</span><h2>Watch before your practice</h2><video controls playsinline preload="metadata" aria-label="Week ${n} presentation and speaking skills explainer"><source src="${url}" type="video/mp4">Your browser cannot play this video. Use the link below.</video><p class="muted">Watch the explainer, then work through the lessons and practice tasks. Pause or replay whenever helpful.</p><a href="${url}" target="_blank" rel="noopener">Open video in a new tab →</a></section>`;
};
