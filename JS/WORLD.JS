// world.js — Three.js 3D cyberpunk environment
const World = (() => {
  let scene, camera, renderer, clock;
  let objects = []; // raycasting targets
  let particles = [];
  let neonLights = [];
  let animMixers = [];
  let raycaster, mouse;
  let yaw = 0, pitch = 0;
  let keys = {};
  let isPointerLocked = false;
  let onObjectHover = null, onObjectClick = null;
  let hoveredObj = null;
  let screenMeshes = {};
  let time = 0;

  // ── INIT ──────────────────────────────────────────────
  function init(canvas, hoverCb, clickCb) {
    onObjectHover = hoverCb;
    onObjectClick = clickCb;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000a12, 0.06);

    camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.05, 80);
    camera.position.set(0, 1.7, 3.5);

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.8;

    clock = new THREE.Clock();
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2(0, 0);

    buildRoom();
    buildDesk();
    buildMonitors();
    buildServerRacks();
    buildParticles();
    buildLights();

    setupControls(canvas);
    window.addEventListener('resize', onResize);
    animate();
  }

  // ── MATERIALS ─────────────────────────────────────────
  function neonMat(color, emissiveIntensity = 1.5) {
    return new THREE.MeshStandardMaterial({
      color, emissive: color, emissiveIntensity,
      roughness: 0.3, metalness: 0.8
    });
  }

  function darkMat(color = 0x0a1520, rough = 0.9) {
    return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0.2 });
  }

  // ── ROOM ──────────────────────────────────────────────
  function buildRoom() {
    const roomW = 14, roomH = 5, roomD = 12;

    // Floor
    const floorGeo = new THREE.PlaneGeometry(roomW, roomD, 20, 20);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x020c14, roughness: 0.8, metalness: 0.3
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Floor grid lines
    const gridHelper = new THREE.GridHelper(14, 28, 0x00ff9f11, 0x00ff9f08);
    gridHelper.position.y = 0.001;
    scene.add(gridHelper);

    // Ceiling
    const ceil = new THREE.Mesh(
      new THREE.PlaneGeometry(roomW, roomD),
      darkMat(0x010810)
    );
    ceil.rotation.x = Math.PI / 2;
    ceil.position.y = roomH;
    scene.add(ceil);

    // Walls
    const wallMat = darkMat(0x030f1a);
    const walls = [
      { pos: [0, roomH/2, -roomD/2], rot: [0,0,0], size: [roomW, roomH] },
      { pos: [0, roomH/2,  roomD/2], rot: [0, Math.PI, 0], size: [roomW, roomH] },
      { pos: [-roomW/2, roomH/2, 0], rot: [0, Math.PI/2, 0], size: [roomD, roomH] },
      { pos: [ roomW/2, roomH/2, 0], rot: [0,-Math.PI/2, 0], size: [roomD, roomH] }
    ];
    walls.forEach(w => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(...w.size), wallMat.clone());
      m.position.set(...w.pos);
      m.rotation.set(...w.rot);
      m.receiveShadow = true;
      scene.add(m);
    });

    // Neon wall strips
    addNeonStrip([-7, 0.5, 0], [0, 0, 0], 5, 0x00ff9f);
    addNeonStrip([ 7, 0.5, 0], [0, 0, 0], 5, 0x00cfff);
    addNeonStrip([0, 0.5, -6], [0, Math.PI/2, 0], 5, 0x00ff9f);
    addNeonStrip([0, 4.8, 0], [0, 0, Math.PI/2], 14, 0x00cfff, 0.5);

    // Circuit board wall decals (back wall)
    addCircuitDecals();
  }

  function addNeonStrip(pos, rot, length, color, intensity = 2) {
    const geo = new THREE.BoxGeometry(0.04, length, 0.04);
    const mat = neonMat(color, intensity);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...pos);
    mesh.rotation.set(...rot);
    scene.add(mesh);
    neonLights.push({ mesh, color, baseIntensity: intensity });

    const light = new THREE.PointLight(color, 0.6, 4);
    light.position.set(...pos);
    scene.add(light);
    neonLights.push({ light, baseIntensity: 0.6 });
  }

  function addCircuitDecals() {
    const mat = new THREE.MeshStandardMaterial({
      color: 0x00ff9f, emissive: 0x00ff9f, emissiveIntensity: 0.3,
      roughness: 1, transparent: true, opacity: 0.15
    });
    for (let i = 0; i < 12; i++) {
      const w = 0.02, h = 0.3 + Math.random() * 0.8;
      const seg = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.01), mat);
      seg.position.set(-5 + Math.random() * 10, 0.5 + Math.random() * 3.5, -5.98);
      scene.add(seg);
    }
  }

  // ── DESK ──────────────────────────────────────────────
  function buildDesk() {
    const deskMat = darkMat(0x0d1f2d, 0.6);

    // Desk surface
    const desk = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.08, 1.2), deskMat);
    desk.position.set(0, 0.82, -1.2);
    desk.castShadow = true; desk.receiveShadow = true;
    scene.add(desk);

    // Desk legs
    [[1.9, -1.5], [-1.9, -1.5], [1.9, -0.5], [-1.9, -0.5]].forEach(([x, z]) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.82, 0.08), deskMat);
      leg.position.set(x, 0.41, z);
      scene.add(leg);
    });

    // Keyboard
    const kb = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.02, 0.3), darkMat(0x111e2a));
    kb.position.set(0, 0.87, -0.9);
    scene.add(kb);

    // Keyboard neon edge
    const kbEdge = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.025, 0.32),
      neonMat(0x00ff9f, 0.4));
    kbEdge.position.set(0, 0.87, -0.9);
    scene.add(kbEdge);

    // Mouse
    const mouse3d = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), darkMat(0x0d1f2d));
    mouse3d.scale.set(1, 0.5, 1.4);
    mouse3d.position.set(0.6, 0.87, -0.9);
    scene.add(mouse3d);

    // Chair
    buildChair();
  }

  function buildChair() {
    const mat = darkMat(0x080f18, 0.9);
    // Seat
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.08, 0.9), mat);
    seat.position.set(0, 0.55, 0.5);
    scene.add(seat);
    // Back
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.0, 0.06), mat);
    back.position.set(0, 1.1, 0.05);
    scene.add(back);
    // Neon back strip
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.02, 0.07), neonMat(0x00cfff, 1));
    strip.position.set(0, 1.55, 0.05);
    scene.add(strip);
  }

  // ── MONITORS ──────────────────────────────────────────
  function buildMonitors() {
    // Main terminal monitor (center)
    buildMonitor(0, 1.4, -1.9, 0, 'terminal', 0x00ff9f, true);
    // Left monitor
    buildMonitor(-1.5, 1.35, -1.85, 0.25, 'logs', 0x00cfff, false);
    // Right monitor
    buildMonitor(1.5, 1.35, -1.85, -0.25, 'data', 0xff003c, false);
  }

  function buildMonitor(x, y, z, rotY, id, color, isMain) {
    const w = isMain ? 1.2 : 0.9, h = isMain ? 0.72 : 0.54;

    // Stand
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.08, 0.3, 8), darkMat(0x0d1f2d));
    stand.position.set(x, y - h/2 - 0.15, z);
    stand.rotation.y = rotY;
    scene.add(stand);

    // Base
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.03, 12), darkMat(0x0d1f2d));
    base.position.set(x, y - h/2 - 0.3, z);
    scene.add(base);

    // Frame
    const frame = new THREE.Mesh(new THREE.BoxGeometry(w + 0.06, h + 0.06, 0.06), darkMat(0x0a1825));
    frame.position.set(x, y, z);
    frame.rotation.y = rotY;
    scene.add(frame);

    // Screen (emissive)
    const screenGeo = new THREE.PlaneGeometry(w, h);
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: color,
      emissiveIntensity: 0.15,
      roughness: 1
    });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(x, y, z + 0.035);
    screen.rotation.y = rotY;
    scene.add(screen);
    screenMeshes[id] = { mesh: screen, mat: screenMat, color, baseIntensity: 0.15 };

    // Screen glow light
    const glow = new THREE.PointLight(color, 0.4, 2.5);
    glow.position.set(x, y, z + 0.1);
    scene.add(glow);
    neonLights.push({ light: glow, baseIntensity: 0.4 });

    // Neon border
    const border = new THREE.Mesh(
      new THREE.BoxGeometry(w + 0.07, h + 0.07, 0.01),
      neonMat(color, 0.6)
    );
    border.position.set(x, y, z + 0.03);
    border.rotation.y = rotY;
    scene.add(border);

    // Clickable object
    if (isMain) {
      screen.userData = { id: 'terminal', label: 'ACCESS TERMINAL', clickable: true };
      objects.push(screen);
    }
  }

  // ── SERVER RACKS ──────────────────────────────────────
  function buildServerRacks() {
    [-5.5, -4.2].forEach((x, i) => buildRack(x, -2));
    [5.5, 4.2].forEach((x, i) => buildRack(x, -2));
  }

  function buildRack(x, z) {
    const mat = darkMat(0x080f18, 0.7);
    const rack = new THREE.Mesh(new THREE.BoxGeometry(0.8, 3.5, 0.6), mat);
    rack.position.set(x, 1.75, z);
    rack.castShadow = true;
    scene.add(rack);

    // Server units
    for (let i = 0; i < 8; i++) {
      const unit = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.3, 0.55), darkMat(0x0d1f2d));
      unit.position.set(x, 0.3 + i * 0.38, z);
      scene.add(unit);

      // LED indicators
      const ledColor = [0x00ff9f, 0x00cfff, 0xff003c][Math.floor(Math.random() * 3)];
      const led = new THREE.Mesh(new THREE.SphereGeometry(0.025, 6, 6), neonMat(ledColor, 2));
      led.position.set(x + 0.28, 0.3 + i * 0.38, z + 0.28);
      scene.add(led);
      neonLights.push({ mesh: led, color: ledColor, baseIntensity: 2, blink: Math.random() > 0.5 });
    }

    // Rack neon strip
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.04, 3.5, 0.04), neonMat(0x00ff9f, 1));
    strip.position.set(x + 0.38, 1.75, z);
    scene.add(strip);
  }

  // ── PARTICLES ─────────────────────────────────────────
  function buildParticles() {
    const count = 300;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const vel = [];

    for (let i = 0; i < count; i++) {
      pos[i*3]   = (Math.random() - 0.5) * 12;
      pos[i*3+1] = Math.random() * 4.5;
      pos[i*3+2] = (Math.random() - 0.5) * 10;
      vel.push({ x: (Math.random()-0.5)*0.002, y: 0.003+Math.random()*0.004, z: (Math.random()-0.5)*0.002 });
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color: 0x00ff9f, size: 0.025, transparent: true, opacity: 0.6 });
    const pts = new THREE.Points(geo, mat);
    scene.add(pts);
    particles.push({ pts, vel, count });
  }

  // ── LIGHTS ────────────────────────────────────────────
  function buildLights() {
    scene.add(new THREE.AmbientLight(0x020c14, 3));

    // Main overhead
    const main = new THREE.DirectionalLight(0x00cfff, 0.3);
    main.position.set(0, 5, 0);
    main.castShadow = true;
    scene.add(main);

    // Accent lights
    const accent1 = new THREE.PointLight(0x00ff9f, 1.2, 8);
    accent1.position.set(-3, 3, -3);
    scene.add(accent1);

    const accent2 = new THREE.PointLight(0x00cfff, 1.0, 8);
    accent2.position.set(3, 3, -3);
    scene.add(accent2);

    // Floor bounce
    const bounce = new THREE.PointLight(0x00ff9f, 0.3, 6);
    bounce.position.set(0, 0.1, 0);
    scene.add(bounce);
  }

  // ── CONTROLS ──────────────────────────────────────────
  function setupControls(canvas) {
    document.addEventListener('keydown', e => { keys[e.code] = true; });
    document.addEventListener('keyup',   e => { keys[e.code] = false; });

    canvas.addEventListener('click', () => {
      if (!isPointerLocked) {
        canvas.requestPointerLock();
      } else {
        handleClick();
      }
    });

    document.addEventListener('pointerlockchange', () => {
      isPointerLocked = document.pointerLockElement === canvas;
    });

    document.addEventListener('mousemove', e => {
      if (isPointerLocked) {
        yaw   -= e.movementX * 0.002;
        pitch -= e.movementY * 0.002;
        pitch  = Math.max(-0.8, Math.min(0.8, pitch));
      }
    });

    // Touch support
    let touchStart = null;
    canvas.addEventListener('touchstart', e => {
      touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    });
    canvas.addEventListener('touchmove', e => {
      if (!touchStart) return;
      const dx = e.touches[0].clientX - touchStart.x;
      const dy = e.touches[0].clientY - touchStart.y;
      yaw   -= dx * 0.004;
      pitch -= dy * 0.004;
      pitch  = Math.max(-0.8, Math.min(0.8, pitch));
      touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    });
  }

  function handleClick() {
    raycaster.setFromCamera({ x: 0, y: 0 }, camera);
    const hits = raycaster.intersectObjects(objects);
    if (hits.length > 0 && hits[0].object.userData.clickable) {
      Audio.click();
      if (onObjectClick) onObjectClick(hits[0].object.userData.id);
    }
  }

  // ── ANIMATE ───────────────────────────────────────────
  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    time += delta;

    updateMovement(delta);
    updateParticles();
    updateNeonFlicker(time);
    updateScreens(time);
    checkHover();

    renderer.render(scene, camera);
  }

  function updateMovement(delta) {
    const speed = 3.5;
    const dir = new THREE.Vector3();
    if (keys['KeyW'] || keys['ArrowUp'])    dir.z -= 1;
    if (keys['KeyS'] || keys['ArrowDown'])  dir.z += 1;
    if (keys['KeyA'] || keys['ArrowLeft'])  dir.x -= 1;
    if (keys['KeyD'] || keys['ArrowRight']) dir.x += 1;

    if (dir.length() > 0) {
      dir.normalize();
      dir.applyEuler(new THREE.Euler(0, yaw, 0));
      camera.position.addScaledVector(dir, speed * delta);
      // Clamp to room
      camera.position.x = Math.max(-6, Math.min(6, camera.position.x));
      camera.position.z = Math.max(-5, Math.min(5, camera.position.z));
    }

    camera.rotation.order = 'YXZ';
    camera.rotation.y = yaw;
    camera.rotation.x = pitch;

    // Update compass
    const needle = document.getElementById('compass-needle');
    if (needle) needle.style.transform = `rotate(${-yaw}rad)`;
  }

  function updateParticles() {
    particles.forEach(({ pts, vel, count }) => {
      const pos = pts.geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        pos[i*3]   += vel[i].x;
        pos[i*3+1] += vel[i].y;
        pos[i*3+2] += vel[i].z;
        if (pos[i*3+1] > 4.8) pos[i*3+1] = 0;
      }
      pts.geometry.attributes.position.needsUpdate = true;
    });
  }

  function updateNeonFlicker(t) {
    neonLights.forEach(n => {
      const flicker = 1 + Math.sin(t * 8 + Math.random() * 0.1) * 0.05;
      if (n.mesh) n.mesh.material.emissiveIntensity = n.baseIntensity * flicker;
      if (n.light) n.light.intensity = n.baseIntensity * flicker;
      if (n.blink && Math.random() > 0.995) {
        n.mesh.visible = !n.mesh.visible;
      }
    });
  }

  function updateScreens(t) {
    Object.values(screenMeshes).forEach(s => {
      const pulse = s.baseIntensity + Math.sin(t * 2) * 0.05;
      s.mat.emissiveIntensity = pulse;
    });
  }

  function checkHover() {
    raycaster.setFromCamera({ x: 0, y: 0 }, camera);
    const hits = raycaster.intersectObjects(objects);
    const hit = hits.length > 0 && hits[0].object.userData.clickable ? hits[0].object : null;

    if (hit !== hoveredObj) {
      hoveredObj = hit;
      if (onObjectHover) onObjectHover(hit ? hit.userData : null);
      document.getElementById('crosshair').classList.toggle('active', !!hit);
    }
  }

  function onResize() {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  }

  // ── EFFECTS ───────────────────────────────────────────
  function flashScreen(color = 0xff003c) {
    const flash = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.3, depthTest: false })
    );
    flash.position.set(0, 1.7, -0.5);
    flash.renderOrder = 999;
    scene.add(flash);
    let op = 0.3;
    const fade = setInterval(() => {
      op -= 0.02;
      flash.material.opacity = op;
      if (op <= 0) { scene.remove(flash); clearInterval(fade); }
    }, 30);
  }

  function pulseTerminal(success) {
    const s = screenMeshes['terminal'];
    if (!s) return;
    const origColor = s.color;
    const flashColor = success ? 0x00ff9f : 0xff003c;
    s.mat.emissive.setHex(flashColor);
    s.mat.emissiveIntensity = 1.5;
    setTimeout(() => {
      s.mat.emissive.setHex(origColor);
      s.mat.emissiveIntensity = s.baseIntensity;
    }, 600);
  }

  return { init, flashScreen, pulseTerminal };
})();

window.World = World;
