// audio.js — Web Audio API sound engine
const Audio = (() => {
  let ctx = null;

  function init() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  }

  function tone(freq, type, duration, vol = 0.3, delay = 0) {
    if (!ctx) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = type; o.frequency.value = freq;
    const t = ctx.currentTime + delay;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t + duration);
    o.start(t); o.stop(t + duration);
  }

  function noise(duration, vol = 0.1) {
    if (!ctx) return;
    const buf = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass'; f.frequency.value = 800;
    src.buffer = buf;
    src.connect(f); f.connect(g); g.connect(ctx.destination);
    g.gain.setValueAtTime(vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    src.start(); src.stop(ctx.currentTime + duration);
  }

  return {
    init,
    click()   { init(); tone(880, 'square', 0.05, 0.15); tone(1200, 'square', 0.04, 0.1, 0.04); },
    success() { init(); [0,0.1,0.2].forEach((d,i) => tone([523,659,784][i], 'sine', 0.3, 0.25, d)); },
    fail()    { init(); tone(200, 'sawtooth', 0.4, 0.3); tone(150, 'sawtooth', 0.3, 0.2, 0.15); },
    alert()   { init(); [0,0.15].forEach(d => tone(1400, 'square', 0.1, 0.2, d)); },
    type()    { init(); tone(600 + Math.random()*400, 'square', 0.03, 0.08); },
    ambient() {
      init();
      const hum = ctx.createOscillator();
      const g = ctx.createGain();
      hum.connect(g); g.connect(ctx.destination);
      hum.type = 'sine'; hum.frequency.value = 60;
      g.gain.value = 0.04;
      hum.start();
      // subtle random blips
      setInterval(() => { if (Math.random() > 0.7) tone(400 + Math.random()*200, 'sine', 0.05, 0.03); }, 2000);
    },
    levelUp() {
      init();
      const seq = [523,659,784,1047];
      seq.forEach((f,i) => tone(f, 'sine', 0.25, 0.3, i*0.12));
    }
  };
})();
