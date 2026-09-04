(() => {
  const titles = {
    week1: 'Think Like a Leader Before You Have the Title',
    week2: 'Your Presence Speaks Before You Do',
    week3: 'Speak Clearly When the Conversation Is Difficult'
  };

  function renderVideo(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    const slot = section.querySelector('.premium-video');
    if (!slot || slot.dataset.videoReady === 'true') return;

    const url = (window.ELRP_VIDEO_URLS || {})[sectionId];
    if (url) {
      slot.innerHTML = `
        <video class="course-video" controls playsinline preload="metadata" aria-label="${titles[sectionId]}">
          <source src="${url}" type="video/mp4">
          Your browser does not support embedded video.
        </video>
        <div class="video-caption">
          <strong>${titles[sectionId]}</strong>
          <span>Watch before your live coaching session.</span>
        </div>`;
      slot.dataset.videoReady = 'true';
    } else if (sectionId === 'week3') {
      slot.innerHTML = `
        <div class="video-pending">
          <div class="play">▶</div>
          <h3>${titles[sectionId]}</h3>
          <p>Your Week 3 explainer is being prepared. You can complete the reflection and conversation-planning activities now.</p>
          <div class="video-meta"><span>Coming shortly</span><span>Reflection available</span></div>
        </div>`;
      slot.dataset.videoReady = 'true';
    }
  }

  function renderAll() {
    ['week1','week2','week3'].forEach(renderVideo);
  }

  const observer = new MutationObserver(() => {
    ['week1','week2','week3'].forEach(id => {
      const slot = document.querySelector(`#${id} .premium-video`);
      if (slot && !slot.dataset.videoReady) renderVideo(id);
    });
  });

  document.addEventListener('DOMContentLoaded', () => {
    renderAll();
    observer.observe(document.body, { childList: true, subtree: true });
  });

  if (document.readyState !== 'loading') {
    renderAll();
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
