(() => {
  const STORAGE_KEY = 'mens-fellowship-music-v1';
  const host = document.querySelector('[data-music-control]');
  if (!host || host.dataset.ready === 'true') return;
  host.dataset.ready = 'true';
  host.innerHTML = `<span class="music-title"><span>Music for the Study</span><strong>Open My Eyes</strong></span><span class="music-actions"><button class="music-toggle" type="button" aria-label="Play Music for the Study"><span class="music-icon" aria-hidden="true">▶</span><span class="music-state">Play</span></button><label class="music-volume-label"><span class="sr-only">Music volume</span><input class="music-volume" type="range" min="0" max="1" step="0.01" value="0.1" aria-label="Music volume"></label></span>`;

  const readState = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (!saved || typeof saved !== 'object') return { playing: false, volume: 0.1, time: 0 };
      return {
        playing: saved.playing === true,
        volume: Math.min(1, Math.max(0, Number(saved.volume) || 0.1)),
        time: Math.max(0, Number(saved.time) || 0),
      };
    } catch {
      return { playing: false, volume: 0.1, time: 0 };
    }
  };

  const saved = readState();
  const audio = new Audio(host.dataset.src || 'music/open-my-eyes.mp3');
  const toggle = host.querySelector('.music-toggle');
  const icon = host.querySelector('.music-icon');
  const stateText = host.querySelector('.music-state');
  const volume = host.querySelector('.music-volume');
  let wantsPlaying = saved.playing;
  let blocked = false;
  let lastSavedSecond = -1;

  audio.preload = 'metadata';
  audio.volume = saved.volume;
  volume.value = String(saved.volume);

  const save = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        playing: wantsPlaying,
        volume: audio.volume,
        time: Number.isFinite(audio.currentTime) ? audio.currentTime : saved.time,
      }));
    } catch {}
  };

  const render = () => {
    const playing = !audio.paused;
    host.classList.toggle('is-playing', playing);
    icon.textContent = playing ? 'Ⅱ' : '▶';
    stateText.textContent = playing ? 'Pause' : (blocked && wantsPlaying ? 'Resume' : 'Play');
    toggle.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} Music for the Study`);
  };

  const start = async () => {
    blocked = false;
    try {
      await audio.play();
      wantsPlaying = true;
    } catch {
      blocked = true;
    }
    save();
    render();
  };

  audio.addEventListener('loadedmetadata', () => {
    if (saved.time > 0 && Number.isFinite(audio.duration)) audio.currentTime = Math.min(saved.time, Math.max(0, audio.duration - 0.25));
    if (wantsPlaying) start();
  }, { once: true });

  toggle.addEventListener('click', () => {
    if (audio.paused) start();
    else {
      wantsPlaying = false;
      blocked = false;
      audio.pause();
      save();
      render();
    }
  });

  volume.addEventListener('input', () => {
    audio.volume = Number(volume.value);
    save();
  });

  audio.addEventListener('play', render);
  audio.addEventListener('pause', render);
  audio.addEventListener('ended', () => {
    wantsPlaying = false;
    audio.currentTime = 0;
    save();
    render();
  });
  audio.addEventListener('timeupdate', () => {
    const second = Math.floor(audio.currentTime);
    if (second !== lastSavedSecond) {
      lastSavedSecond = second;
      save();
    }
  });

  const resumeAfterNavigation = () => {
    if (blocked && wantsPlaying) start();
    document.removeEventListener('pointerdown', resumeAfterNavigation);
  };
  document.addEventListener('pointerdown', resumeAfterNavigation);
  addEventListener('pagehide', save);
  render();
})();
