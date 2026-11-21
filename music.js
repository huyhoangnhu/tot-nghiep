/**
 * BỘ PHÁT NHẠC NỀN DỊU NHẸ
 * - Nếu config.music.customAudioUrl có đường dẫn MP3: phát file MP3 đó với fade-in mượt mà.
 * - Nếu để trống: tự động trình diễn bản ballad piano ấm áp bằng Web Audio API (hoạt động mượt ngay cả khi offline).
 */
(function () {
  const MusicPlayer = (() => {
    let isPlaying = false;
    let listeners = [];
    let htmlAudio = null;

    // Web Audio synth state
    let ctx = null;
    let masterGain = null;
    let delayNode = null;
    let feedbackGain = null;
    let schedulerId = null;
    let nextNoteTime = 0;
    let stepIndex = 0;

    // Giai điệu piano thanh xuân ấm áp (Canon-inspired C major / Am / F / G, 76 BPM, 16 bước/4 ô nhịp x 2 = 32 bước)
    const BPM = 76;
    const EIGHTH = 60 / BPM / 2;

    // Tần số nốt nhạc (Hz)
    const NOTE = {
      C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94,
      C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
      C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0,
    };

    // 8 ô nhịp (mỗi ô nhịp 8 nốt móc đơn = 64 bước)
    // bass: nốt trầm, arp: hợp âm rải tay trái, melody: giai điệu tay phải
    const SCORE = [
      // Bar 1: C major (C3 - G3 - C4 - E4)
      { bass: "C3", arp: "C4", mel: "E5", dur: 1.8 },
      { arp: "G3" },
      { arp: "E4", mel: "D5", dur: 0.9 },
      { arp: "G3", mel: "C5", dur: 0.9 },
      { arp: "C4", mel: "G4", dur: 1.6 },
      { arp: "G3" },
      { arp: "E4", mel: "A4", dur: 0.9 },
      { arp: "C4", mel: "C5", dur: 1.1 },

      // Bar 2: G/B
      { bass: "B3", arp: "D4", mel: "D5", dur: 1.8 },
      { arp: "G3" },
      { arp: "B3", mel: "C5", dur: 0.9 },
      { arp: "D4", mel: "B4", dur: 0.9 },
      { arp: "G4", mel: "G4", dur: 1.8 },
      { arp: "D4" },
      { arp: "B3", mel: "A4", dur: 0.9 },
      { arp: "D4", mel: "B4", dur: 1.0 },

      // Bar 3: Am7
      { bass: "A3", arp: "E4", mel: "C5", dur: 1.8 },
      { arp: "E3" },
      { arp: "C4", mel: "B4", dur: 0.9 },
      { arp: "E4", mel: "A4", dur: 0.9 },
      { arp: "G4", mel: "E4", dur: 1.8 },
      { arp: "E4" },
      { arp: "C4", mel: "G4", dur: 0.9 },
      { arp: "E4", mel: "A4", dur: 1.0 },

      // Bar 4: Em7
      { bass: "E3", arp: "B3", mel: "B4", dur: 1.8 },
      { arp: "B3" },
      { arp: "E4", mel: "A4", dur: 0.9 },
      { arp: "G4", mel: "G4", dur: 1.5 },
      { arp: "E4" },
      { arp: "B3", mel: "E4", dur: 1.1 },
      { arp: "G4", mel: "G4", dur: 1.0 },
      { arp: "E4", mel: "A4", dur: 1.0 },

      // Bar 5: Fmaj7
      { bass: "F3", arp: "C4", mel: "A4", dur: 1.7 },
      { arp: "C4" },
      { arp: "E4", mel: "C5", dur: 0.9 },
      { arp: "A4", mel: "D5", dur: 1.0 },
      { arp: "F4", mel: "C5", dur: 1.6 },
      { arp: "C4" },
      { arp: "E4", mel: "A4", dur: 1.0 },
      { arp: "C4", mel: "G4", dur: 1.0 },

      // Bar 6: C/E
      { bass: "E3", arp: "C4", mel: "G4", dur: 1.8 },
      { arp: "G3" },
      { arp: "C4", mel: "E4", dur: 0.9 },
      { arp: "E4", mel: "G4", dur: 1.0 },
      { arp: "G4", mel: "C5", dur: 1.8 },
      { arp: "E4" },
      { arp: "C4", mel: "E5", dur: 1.0 },
      { arp: "G3", mel: "D5", dur: 1.0 },

      // Bar 7: Dm7
      { bass: "D3", arp: "A3", mel: "C5", dur: 1.5 },
      { arp: "A3" },
      { arp: "D4", mel: "A4", dur: 1.0 },
      { arp: "F4", mel: "C5", dur: 1.0 },
      { arp: "A4", mel: "D5", dur: 1.8 },
      { arp: "F4" },
      { arp: "D4", mel: "C5", dur: 1.0 },
      { arp: "A3", mel: "A4", dur: 1.0 },

      // Bar 8: Gsus4 -> G7
      { bass: "G3", arp: "D4", mel: "B4", dur: 1.8 },
      { arp: "D4" },
      { arp: "G4", mel: "A4", dur: 0.9 },
      { arp: "B4", mel: "G4", dur: 1.0 },
      { arp: "F4", mel: "D5", dur: 1.8 },
      { arp: "D4" },
      { arp: "B3", mel: "B4", dur: 1.0 },
      { arp: "D4", mel: "G4", dur: 1.1 },
    ];

    function notify() {
      listeners.forEach((fn) => fn(isPlaying));
    }

    function ensureAudioContext() {
      if (ctx) return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      ctx = new AudioCtx();

      masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);

      // Bộ lọc làm ấm âm sắc như piano có nỉ (felt piano)
      const warmthFilter = ctx.createBiquadFilter();
      warmthFilter.type = "lowpass";
      warmthFilter.frequency.setValueAtTime(1900, ctx.currentTime);
      warmthFilter.Q.setValueAtTime(0.6, ctx.currentTime);

      // Tạo âm vang phòng dịu nhẹ
      delayNode = ctx.createDelay(1.0);
      delayNode.delayTime.setValueAtTime(0.32, ctx.currentTime);

      feedbackGain = ctx.createGain();
      feedbackGain.gain.setValueAtTime(0.28, ctx.currentTime);

      const delayFilter = ctx.createBiquadFilter();
      delayFilter.type = "lowpass";
      delayFilter.frequency.setValueAtTime(1200, ctx.currentTime);

      const wetGain = ctx.createGain();
      wetGain.gain.setValueAtTime(0.24, ctx.currentTime);

      warmthFilter.connect(masterGain);
      warmthFilter.connect(delayNode);
      delayNode.connect(delayFilter);
      delayFilter.connect(feedbackGain);
      feedbackGain.connect(delayNode);
      delayFilter.connect(wetGain);
      wetGain.connect(masterGain);

      masterGain.connect(ctx.destination);
      masterGain._input = warmthFilter;
    }

    function playPianoTone(freq, time, duration, velocity) {
      if (!ctx || !masterGain) return;
      const dest = masterGain._input;

      // Oscillator 1: fundamental warm triangle
      const osc1 = ctx.createOscillator();
      osc1.type = "triangle";
      osc1.frequency.setValueAtTime(freq, time);

      // Oscillator 2: gentle sine harmonic an octave up (subtle shimmer)
      const osc2 = ctx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(freq * 2, time);

      const env1 = ctx.createGain();
      const env2 = ctx.createGain();

      // Soft felt-piano envelope
      env1.gain.setValueAtTime(0.0001, time);
      env1.gain.linearRampToValueAtTime(velocity, time + 0.028);
      env1.gain.exponentialRampToValueAtTime(velocity * 0.45, time + duration * 0.42);
      env1.gain.exponentialRampToValueAtTime(0.0001, time + duration + 0.45);

      env2.gain.setValueAtTime(0.0001, time);
      env2.gain.linearRampToValueAtTime(velocity * 0.16, time + 0.02);
      env2.gain.exponentialRampToValueAtTime(0.0001, time + duration * 0.55);

      osc1.connect(env1);
      osc2.connect(env2);
      env1.connect(dest);
      env2.connect(dest);

      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + duration + 0.5);
      osc2.stop(time + duration + 0.5);
    }

    function scheduleLoop() {
      if (!isPlaying || !ctx) return;
      const lookahead = 0.25;
      while (nextNoteTime < ctx.currentTime + lookahead) {
        const step = SCORE[stepIndex % SCORE.length];
        if (step.bass && NOTE[step.bass]) {
          playPianoTone(NOTE[step.bass], nextNoteTime, EIGHTH * 5.8, 0.14);
        }
        if (step.arp && NOTE[step.arp]) {
          playPianoTone(NOTE[step.arp], nextNoteTime + 0.01, EIGHTH * 2.6, 0.075);
        }
        if (step.mel && NOTE[step.mel]) {
          const melDur = (step.dur || 1.1) * EIGHTH * 1.4;
          playPianoTone(NOTE[step.mel], nextNoteTime, melDur, 0.15);
        }
        nextNoteTime += EIGHTH;
        stepIndex = (stepIndex + 1) % SCORE.length;
      }
    }

    async function startSynth() {
      ensureAudioContext();
      if (ctx.state === "suspended") {
        await ctx.resume();
      }
      const now = ctx.currentTime;
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.setValueAtTime(Math.max(masterGain.gain.value, 0.0001), now);
      masterGain.gain.linearRampToValueAtTime(0.65, now + 0.9);

      nextNoteTime = ctx.currentTime + 0.08;
      if (schedulerId) clearInterval(schedulerId);
      schedulerId = setInterval(scheduleLoop, 80);
    }

    function stopSynth() {
      if (schedulerId) {
        clearInterval(schedulerId);
        schedulerId = null;
      }
      if (ctx && masterGain) {
        const now = ctx.currentTime;
        masterGain.gain.cancelScheduledValues(now);
        masterGain.gain.setValueAtTime(masterGain.gain.value, now);
        masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.4);
      }
    }

    async function play() {
      if (isPlaying) return;
      const customUrl = (window.INVITATION_CONFIG?.music?.customAudioUrl || "").trim();

      if (customUrl) {
        try {
          if (!htmlAudio) {
            htmlAudio = new Audio(customUrl);
            htmlAudio.loop = true;
            htmlAudio.volume = 0.55;
          }
          await htmlAudio.play();
          isPlaying = true;
          notify();
          return;
        } catch (err) {
          console.warn("Không thể phát file MP3 tuỳ chỉnh, chuyển sang piano tích hợp:", err);
        }
      }

      try {
        await startSynth();
        isPlaying = true;
        notify();
      } catch (err) {
        console.warn("Trình duyệt đang tạm chặn phát âm thanh:", err);
      }
    }

    function pause() {
      if (!isPlaying) return;
      isPlaying = false;
      if (htmlAudio) {
        htmlAudio.pause();
      }
      stopSynth();
      notify();
    }

    function toggle() {
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    }

    return {
      play,
      pause,
      toggle,
      isPlaying: () => isPlaying,
      onStateChange: (fn) => {
        listeners.push(fn);
        fn(isPlaying);
      },
    };
  })();

  window.MusicPlayer = MusicPlayer;
})();
