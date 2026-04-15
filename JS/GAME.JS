// game.js
const Game = (() => {
  let state = {
    agent:'', level:0, score:0, correct:0, wrong:0,
    timerVal:60, timerInterval:null, missionOpen:false,
    wrongStreak:0, levelStartTime:0, levelResults:[]
  };
  let currentMission = null, typeInt = null;

  const BOOT_LINES = [
    '> NEURAL PROTOCOL v4.2 — INITIALIZING...',
    '> Loading threat intelligence database...',
    '> Connecting to secure encrypted network...',
    '> Calibrating biometric scanner...',
    '> AI threat analysis engine: ONLINE',
    '> SYSTEM READY — AWAITING AGENT IDENTIFICATION'
  ];

  // ── SCREENS ──────────────────────────────────────────
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }

  // ── BOOT ─────────────────────────────────────────────
  function runBoot() {
    const el = document.getElementById('boot-lines');
    el.innerHTML = '';
    let i = 0;
    const iv = setInterval(() => {
      if (i >= BOOT_LINES.length) {
        clearInterval(iv);
        document.getElementById('boot-form').style.display = 'flex';
        document.getElementById('codename-input').focus();
        return;
      }
      const d = document.createElement('div');
      d.textContent = BOOT_LINES[i++];
      el.appendChild(d);
      el.scrollTop = el.scrollHeight;
    }, 300);
  }

  // ── START ─────────────────────────────────────────────
  function start() {
    const inp = document.getElementById('codename-input');
    const name = inp.value.trim().toUpperCase();
    if (!name) {
      inp.style.borderColor = '#ff003c';
      inp.style.boxShadow = '0 0 16px #ff003c66';
      setTimeout(() => { inp.style.borderColor = ''; inp.style.boxShadow = ''; }, 700);
      return;
    }
    state.agent = name;
    try { Audio.init(); Audio.ambient(); } catch(e){}
    showScreen('screen-dashboard');
    buildDashboard();
  }

  // ── DASHBOARD ─────────────────────────────────────────
  function buildDashboard() {
    document.getElementById('dash-agent-name').textContent = state.agent;
    updateDashStats();
    const grid = document.getElementById('dash-levels-grid');
    grid.innerHTML = '';
    MISSIONS.forEach((m, i) => {
      const res = state.levelResults[i];
      const done = !!res;
      const isNext = i === state.level;
      const locked = i > state.level;
      const card = document.createElement('div');
      card.className = 'level-card' + (locked ? ' locked' : '') + (done ? ' completed' : '') + (isNext ? ' active-level' : '');
      card.innerHTML = `
        <div class="lc-num">${String(i+1).padStart(2,'0')}</div>
        <div class="lc-title">${m.title}</div>
        <div class="lc-desc">${m.dialogue.substring(0,60)}...</div>
        <div class="lc-meta">
          <span class="lc-score">${done ? '✔ '+res.score+'pts' : isNext ? '▶ READY' : '🔒 LOCKED'}</span>
          <span class="lc-time">${done ? res.timeTaken+'s' : m.time+'s limit'}</span>
        </div>
        <div class="lc-badge">${done ? (res.correct ? '✅' : '❌') : isNext ? '🎯' : '🔒'}</div>`;
      if (!locked) card.onclick = () => playLevel(i);
      grid.appendChild(card);
    });
    const btn = document.getElementById('dash-play-btn');
    if (state.level >= MISSIONS.length) {
      btn.textContent = '🏆 VIEW FINAL RESULTS';
      btn.onclick = showFinal;
    } else {
      btn.textContent = `▶ PLAY LEVEL ${state.level + 1}`;
      btn.onclick = playNext;
    }
  }

  function updateDashStats() {
    const done = state.levelResults.length;
    const correct = state.levelResults.filter(r => r.correct).length;
    const acc = done > 0 ? Math.round((correct/done)*100) : 0;
    let rank = 'TRAINEE';
    if (state.score >= 70) rank = 'ELITE HACKER';
    else if (state.score >= 40) rank = 'CYBER ANALYST';
    document.getElementById('dash-total-score').textContent = state.score;
    document.getElementById('dash-levels-done').textContent = done + ' / ' + MISSIONS.length;
    document.getElementById('dash-accuracy').textContent = acc + '%';
    document.getElementById('dash-rank').textContent = rank;
  }

  // ── PLAY ──────────────────────────────────────────────
  function playNext() {
    if (state.level >= MISSIONS.length) { showFinal(); return; }
    playLevel(state.level);
  }

  function playLevel(idx) {
    currentMission = MISSIONS[idx];
    state.missionOpen = true;
    state.levelStartTime = Date.now();
    showScreen('screen-level');
    document.getElementById('hud-agent').textContent = state.agent;
    document.getElementById('hud-mission').textContent = currentMission.title;
    document.getElementById('hud-score').textContent = state.score;
    // Init 3D world
    try { World.init(document.getElementById('game-canvas')); } catch(e){}
    // Show computer screen
    document.getElementById('computer-screen').style.display = 'block';
    renderMission();
    startTimer(currentMission.time);
  }

  // ── RENDER MISSION ON COMPUTER SCREEN ─────────────────
  function renderMission() {
    document.getElementById('cs-title').textContent = `MISSION ${currentMission.id} — ${currentMission.title}`;
    // Typewriter dialogue
    typeText('cs-dialogue', currentMission.dialogue, () => {
      renderContent();
      renderQuestion();
      renderChoices();
    });
  }

  function renderContent() {
    const el = document.getElementById('cs-content');
    el.innerHTML = '';
    currentMission.content.split('\n').forEach((line, i) => {
      setTimeout(() => {
        const d = document.createElement('div');
        d.textContent = line;
        if (/\[CRIT\]|CRITICAL|BYPASSED|ACTIVE/.test(line)) d.className = 'line-crit';
        else if (/\[WARN\]|WARNING|ALERT/.test(line)) d.className = 'line-warn';
        else if (/━|─|=/.test(line)) d.className = 'line-sep';
        else if (/\[SYS\]|ROOT|RESULT/.test(line)) d.className = 'line-hi';
        el.appendChild(d);
        el.scrollTop = el.scrollHeight;
      }, i * 35);
    });
  }

  function renderQuestion() {
    document.getElementById('cs-question').textContent = '❓ ' + currentMission.question;
  }

  function renderChoices() {
    const el = document.getElementById('cs-choices');
    el.innerHTML = '';
    const keys = ['A','B','C','D'];
    const shuffled = [...currentMission.choices].sort(() => Math.random() - 0.5);
    shuffled.forEach((c, i) => {
      setTimeout(() => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.innerHTML = `<span class="cb-key">${keys[i]}</span>${c.text}`;
        btn.onclick = () => handleChoice(c, btn, el);
        el.appendChild(btn);
        try { Audio.type(); } catch(e){}
      }, i * 100);
    });
  }

  // ── CHOICE HANDLER ────────────────────────────────────
  function handleChoice(choice, btn, container) {
    if (!state.missionOpen) return;
    stopTimer();
    try { Audio.click(); } catch(e){}
    container.querySelectorAll('.choice-btn').forEach(b => {
      b.style.pointerEvents = 'none';
      if (b !== btn) b.style.opacity = '0.35';
    });
    const timeTaken = Math.round((Date.now() - state.levelStartTime) / 1000);
    if (choice.correct) {
      btn.classList.add('correct');
      state.score += 10;
      state.correct++;
      state.wrongStreak = 0;
      document.getElementById('hud-score').textContent = state.score;
      showFeedback('ACCESS GRANTED ✓', true);
      try { Audio.success(); World.pulseTerminal(true); } catch(e){}
      state.levelResults[state.level] = { correct:true, score:10, timeTaken };
      setTimeout(() => finishLevel(true, timeTaken), 1800);
    } else {
      btn.classList.add('wrong');
      state.wrong++;
      state.wrongStreak++;
      showFeedback('ACCESS DENIED ✗', false);
      try { Audio.fail(); World.pulseTerminal(false); } catch(e){}
      // Show correct
      container.querySelectorAll('.choice-btn').forEach(b => {
        if (b.textContent.trim() === choice.text) return;
        const match = currentMission.choices.find(c => c.correct && b.textContent.includes(c.text));
        if (match) { b.classList.add('correct'); b.style.opacity = '1'; }
      });
      if (state.wrongStreak >= 2) showHint(currentMission.hint);
      state.levelResults[state.level] = { correct:false, score:0, timeTaken };
      setTimeout(() => finishLevel(false, timeTaken), 2200);
    }
  }

  // ── FINISH LEVEL → RESULT SCREEN ──────────────────────
  function finishLevel(correct, timeTaken) {
    state.missionOpen = false;
    stopTimer();
    try { World.destroy(); } catch(e){}
    showScreen('screen-result');
    document.getElementById('result-badge').textContent = correct ? '✅' : '❌';
    document.getElementById('result-title').textContent = correct ? 'MISSION COMPLETE' : 'MISSION FAILED';
    document.getElementById('res-level').textContent = `${state.level + 1} — ${currentMission.title}`;
    document.getElementById('res-score').textContent = correct ? '+10 pts' : '+0 pts';
    document.getElementById('res-time').textContent = timeTaken + 's';
    document.getElementById('res-result').textContent = correct ? 'CORRECT' : 'INCORRECT';
    document.getElementById('res-result').style.color = correct ? '#00ff9f' : '#ff003c';
    state.level++;
    try { Audio.levelUp(); } catch(e){}
    // Hide next button if all done
    const nextBtn = document.querySelector('#screen-result .btn-secondary');
    if (nextBtn) nextBtn.style.display = state.level >= MISSIONS.length ? 'none' : '';
  }

  function goToDashboard() {
    showScreen('screen-dashboard');
    buildDashboard();
  }

  // ── TIMER ─────────────────────────────────────────────
  function startTimer(s) {
    state.timerVal = s;
    document.getElementById('hud-timer').textContent = s;
    state.timerInterval = setInterval(() => {
      state.timerVal--;
      document.getElementById('hud-timer').textContent = state.timerVal;
      if (state.timerVal <= 10) document.getElementById('hud-timer').classList.add('urgent');
      if (state.timerVal <= 0) {
        stopTimer();
        if (state.missionOpen) {
          showFeedback('TIME OUT', false);
          try { Audio.fail(); } catch(e){}
          const t = currentMission.time;
          state.levelResults[state.level] = { correct:false, score:0, timeTaken:t };
          setTimeout(() => finishLevel(false, t), 1800);
        }
      }
    }, 1000);
  }

  function stopTimer() {
    clearInterval(state.timerInterval);
    document.getElementById('hud-timer').classList.remove('urgent');
  }

  // ── FINAL SCREEN ──────────────────────────────────────
  function showFinal() {
    showScreen('screen-final');
    let rank, color;
    if (state.score >= 70) { rank = '💀 ELITE HACKER'; color = '#00ff9f'; }
    else if (state.score >= 40) { rank = '🧠 CYBER ANALYST'; color = '#00cfff'; }
    else { rank = '⚠️ TRAINEE'; color = '#ffaa00'; }
    const el = document.getElementById('final-rank');
    el.textContent = rank; el.style.color = color; el.style.textShadow = `0 0 30px ${color}`;
    document.getElementById('final-score').textContent = `FINAL SCORE: ${state.score}`;
    const done = state.levelResults.length;
    const correct = state.levelResults.filter(r=>r.correct).length;
    document.getElementById('final-stats').innerHTML =
      `AGENT: ${state.agent}<br>MISSIONS: ${done} / ${MISSIONS.length}<br>` +
      `CORRECT: ${correct}<br>ACCURACY: ${done>0?Math.round(correct/done*100):0}%`;
    try { Audio.levelUp(); } catch(e){}
    try { localStorage.setItem('cd_save', JSON.stringify(state)); } catch(e){}
  }

  // ── HELPERS ───────────────────────────────────────────
  function showFeedback(text, ok) {
    const el = document.getElementById('feedback');
    el.textContent = text;
    el.className = ok ? 'fb-ok' : 'fb-fail';
    el.style.display = 'flex';
    setTimeout(() => { el.style.display = 'none'; }, 1500);
  }

  function showHint(text) {
    const box = document.getElementById('hint-box');
    document.getElementById('hint-text').textContent = text;
    box.style.display = 'flex';
    setTimeout(() => { box.style.display = 'none'; }, 5000);
  }

  function typeText(id, text, cb) {
    const el = document.getElementById(id);
    el.textContent = '';
    let i = 0;
    clearInterval(typeInt);
    typeInt = setInterval(() => {
      el.textContent += text[i++];
      if (i >= text.length) { clearInterval(typeInt); if (cb) cb(); }
    }, 22);
  }

  function restart() {
    state = { agent:'', level:0, score:0, correct:0, wrong:0,
      timerVal:60, timerInterval:null, missionOpen:false,
      wrongStreak:0, levelStartTime:0, levelResults:[] };
    document.getElementById('codename-input').value = '';
    document.getElementById('boot-form').style.display = 'none';
    showScreen('screen-boot');
    runBoot();
  }

  window.addEventListener('load', runBoot);
  return { start, playNext, playLevel, goToDashboard, showFinal, restart };
})();
