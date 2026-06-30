const state = {
  balance: 1000,
  bet: 10,
  totalBet: 0,
  depth: 0,
  maxDepth: 10000,
  maxZones: 100,
  zoneHeight: 156,
  zones: [],
  hooked: [],
  eventCount: 0,
  busy: false,
  roundOver: false,
  vortexTimer: null,
  activeEventRange: null,
  jellyCharge: null,
  openingPreviewDone: false,
  theme: null,
  themeRevealed: false,
};

const RTP_TARGET = 0.95;
const BASE_EXPECTED_RETURN_PER_DIVE = 5.294001221747099;
const UI_LAYOUT_KEY = "goDeepUiLayout.v3";
const RTP_PAYOUT_SCALE = RTP_TARGET / BASE_EXPECTED_RETURN_PER_DIVE;

const fishTypes = [
  { type: "low", label: "0.2x", mult: 0.2, weight: 18, src: "assets/fish/generated-low-01.png", facing: 1 },
  { type: "low", label: "0.2x", mult: 0.2, weight: 18, src: "assets/fish/generated-low-02.png", facing: 1 },
  { type: "low", label: "0.2x", mult: 0.2, weight: 16, src: "assets/fish/generated-low-03.png", facing: 1 },
  { type: "low", label: "0.5x", mult: 0.5, weight: 15, src: "assets/fish/generated-low-04.png", facing: -1 },
  { type: "low", label: "0.5x", mult: 0.5, weight: 14, src: "assets/fish/generated-low-05.png", facing: -1 },
  { type: "low", label: "0.5x", mult: 0.5, weight: 14, src: "assets/fish/generated-low-06.png", facing: -1 },
  { type: "low", label: "0.8x", mult: 0.8, weight: 12, src: "assets/fish/generated-low-07.png", wide: true, facing: -1 },
  { type: "low", label: "0.8x", mult: 0.8, weight: 12, src: "assets/fish/generated-low-08.png", wide: true, facing: -1 },
  { type: "mid", label: "1x", mult: 1, weight: 11, src: "assets/fish/generated-low-09.png", facing: -1 },
  { type: "mid", label: "2x", mult: 2, weight: 8, src: "assets/fish/generated-low-10.png", facing: -1 },
  { type: "mid", label: "3x", mult: 3, weight: 6, src: "assets/fish/generated-low-11.png", facing: -1 },
  { type: "mid", label: "4x", mult: 4, weight: 5, src: "assets/fish/generated-low-12.png", wide: true, facing: -1 },
  { type: "high", label: "5x", mult: 5, weight: 4, src: "assets/fish/generated-high-01.png", facing: 1 },
  { type: "high", label: "15x", mult: 15, weight: 3, src: "assets/fish/generated-high-02.png", facing: 1 },
  { type: "high", label: "30x", mult: 30, weight: 2, src: "assets/fish/generated-high-03.png", facing: 1 },
  { type: "high", label: "50x", mult: 50, weight: 2, src: "assets/fish/generated-high-04.png", facing: 1 },
  { type: "high", label: "80x", mult: 80, weight: 1.4, src: "assets/fish/generated-high-05.png", facing: 1 },
  { type: "high", label: "120x", mult: 120, weight: 1, src: "assets/fish/generated-high-06.png", facing: 1 },
  { type: "high", label: "180x", mult: 180, weight: 0.8, src: "assets/fish/generated-high-07.png", facing: 1 },
  { type: "high", label: "300x", mult: 300, weight: 0.5, src: "assets/fish/generated-high-08.png", facing: 1 },
];

const oceanThemes = [
  {
    id: "volcano",
    name: "Volcanic Ridge",
    kicker: "PUFFER SURGE / HOT HIGH VALUE",
    densityBonus: -1,
    highBias: 1.55,
    midBias: 0.9,
    lowBias: 0.78,
    eventChance: 0.045,
    eventWeights: { puffer: 6, pearl: 1.4, jelly: 1.2, mirror: 1 },
    featuredDepths: [1800, 4200, 7600],
    featuredFish: { type: "high", label: "220x", mult: 220, weight: 1, src: "assets/fish/generated-high-08.png", facing: 1, themeFish: "LAVA ANCIENT" },
  },
  {
    id: "trench",
    name: "Abyss Trench",
    kicker: "JELLY CHARGE / RARE GIANTS",
    densityBonus: -1,
    highBias: 1.35,
    midBias: 1.05,
    lowBias: 0.68,
    eventChance: 0.038,
    eventWeights: { jelly: 6, mirror: 1.8, puffer: 1.1, pearl: 1 },
    featuredDepths: [2400, 5600, 9000],
    featuredFish: { type: "high", label: "300x", mult: 300, weight: 1, src: "assets/fish/generated-high-06.png", facing: 1, themeFish: "ABYSS LEVIATHAN" },
  },
  {
    id: "coral",
    name: "Golden Coral",
    kicker: "PEARL STACK / DENSE SCHOOLS",
    densityBonus: 2,
    highBias: 0.82,
    midBias: 1.25,
    lowBias: 1.28,
    eventChance: 0.05,
    eventWeights: { pearl: 6, mirror: 2.4, jelly: 1.2, puffer: 1 },
    featuredDepths: [1200, 3600, 6800],
    featuredFish: { type: "high", label: "120x", mult: 120, weight: 1, src: "assets/fish/generated-high-01.png", facing: 1, themeFish: "GILDED TURTLE" },
  },
  {
    id: "wreck",
    name: "Sunken Wreck",
    kicker: "MIRROR CACHE / TOOL FISH",
    densityBonus: 0,
    highBias: 1.12,
    midBias: 1.12,
    lowBias: 0.9,
    eventChance: 0.055,
    eventWeights: { mirror: 5.5, pearl: 2, jelly: 1.3, puffer: 1.3 },
    featuredDepths: [1600, 4800, 8200],
    featuredFish: { type: "high", label: "180x", mult: 180, weight: 1, src: "assets/fish/generated-high-07.png", facing: 1, themeFish: "RELIC GUARDIAN" },
  },
];

const eventTypes = [
  {
    id: "mirror",
    short: "MIRROR",
    name: "Mirror Link",
    src: "assets/events/event-generated-01.png",
    kicker: "LOCK TARGET / ENERGY SPREAD",
    text: "Duplicates nearby normal fish in the active depth band.",
    range: ["Target depth", "Nearby fish", "Clone reward fish"],
    apply(zone) {
      const targets = zone.fish.filter((fish) => !fish.event);
      const clones = [];
      targets.slice(0, 3).forEach((base, index) => {
        if (Math.random() < 0.72 || index === 0) {
          const clone = {
            ...base,
            id: uid(),
            x: clamp(base.x + 8 + index * 4, 8, 82),
            y: clamp(base.y + 15 - index * 7, 8, 74),
            doubled: true,
            caught: false,
          };
          zone.fish.push(clone);
          clones.push(clone);
        }
      });
      return `${clones.length} fish cloned at ${zone.depth}m.`;
    },
  },
  {
    id: "pearl",
    short: "PEARL",
    name: "Pearl X2",
    src: "assets/events/event-generated-02.png",
    kicker: "COIN SHOWER / MULTIPLIER STACK",
    text: "Applies a x2 multiplier buff to normal fish in the target depth.",
    range: ["Target depth", "All normal fish", "Multiplier x2"],
    apply(zone) {
      const targets = zone.fish.filter((fish) => !fish.event);
      targets.forEach((fish) => {
        fish.mult *= 2;
        fish.label = `${trimNumber(fish.mult)}x`;
        fish.golded = true;
        fish.buffSource = "pearl";
      });
      return `${targets.length} fish gained x2 at ${zone.depth}m.`;
    },
  },
  {
    id: "puffer",
    short: "PUFFER",
    name: "Puffer Blast",
    src: "assets/events/event-generated-03.png",
    kicker: "PRESSURE BUILD / INSTANT RELEASE",
    text: "Stuns normal fish in the target depth and makes them guaranteed catches.",
    range: ["Target depth", "All normal fish", "Guaranteed catch"],
    apply(zone) {
      const targets = zone.fish.filter((fish) => !fish.event);
      targets.forEach((fish) => {
        fish.stunned = true;
        fish.stunSource = "puffer";
      });
      return `${targets.length} fish stunned at ${zone.depth}m.`;
    },
  },
  {
    id: "jelly",
    short: "JELLY",
    name: "Jelly Charge",
    src: "assets/events/event-generated-04.png",
    kicker: "HOOK CHARGE / STORED ELECTRICITY",
    text: "Charges the hook for several dives. Each charged dive shocks a fixed downward range.",
    range: ["Charge hook", "2-4 dives", "3-4 zones fixed range"],
    apply(zone) {
      const turns = randomInt(2, 4);
      const rangeZones = randomInt(3, 4);
      state.jellyCharge = {
        turns,
        rangeZones,
        sourceDepth: zone.depth,
      };
      return `Hook charged for ${turns} dives. Electric range locked to ${rangeZones} zones.`;
    },
  },
];

const frameSets = {
  vortex: { folder: "vortex", prefix: "vortex", count: 16, fps: 42 },
  mirror: { folder: "mirror", prefix: "mirror", count: 31, fps: 82 },
  pearl: { folder: "pearl", prefix: "pearl", count: 31, fps: 82 },
  puffer: { folder: "puffer", prefix: "puffer", count: 31, fps: 86 },
  jelly: { folder: "jelly", prefix: "jelly", count: 31, fps: 86 },
  "affected-pearl": { folder: "affected-pearl", prefix: "affected-pearl", count: 31, fps: 58 },
  "affected-puffer": { folder: "affected-puffer", prefix: "affected-puffer", count: 31, fps: 60 },
  "affected-jelly": { folder: "affected-jelly", prefix: "affected-jelly", count: 31, fps: 60 },
  "hook-shock": { folder: "hook-shock", prefix: "hook-shock", count: 31, fps: 34 },
  "jelly-impact": { folder: "jelly-impact", prefix: "jelly-impact", count: 31, fps: 38 },
  "reel-success": { folder: "reel-success", prefix: "reel-success", count: 31, fps: 32 },
  "reel-fail": { folder: "reel-fail", prefix: "reel-fail", count: 31, fps: 32 },
  "eventfish-mirror": { folder: "eventfish-mirror", prefix: "eventfish-mirror", count: 6, fps: 86 },
  "eventfish-pearl": { folder: "eventfish-pearl", prefix: "eventfish-pearl", count: 6, fps: 86 },
  "eventfish-puffer": { folder: "eventfish-puffer", prefix: "eventfish-puffer", count: 6, fps: 86 },
  "eventfish-jelly": { folder: "eventfish-jelly", prefix: "eventfish-jelly", count: 6, fps: 86 },
};

const statusIcons = {
  gold: "assets/status/status-pearl.png",
  stun: "assets/status/status-puffer.png",
  jelly: "assets/status/status-jelly.png",
  mirror: "assets/status/status-pearl.png",
};

const eventPresentation = {
  mirror: { title: "MIRROR LINK", kicker: "CLONE FIELD" },
  pearl: { title: "PEARL X2", kicker: "MULTIPLIER BUFF" },
  puffer: { title: "PUFFER BLAST", kicker: "STUN FIELD" },
  jelly: { title: "JELLY CHARGE", kicker: "HOOK ELECTRIFIED" },
};

const els = {
  game: document.querySelector(".game"),
  ocean: document.getElementById("ocean"),
  waterColumn: document.getElementById("waterColumn"),
  fxLayer: document.getElementById("fxLayer"),
  vortex: document.getElementById("vortex"),
  vortexFrame: document.getElementById("vortexFrame"),
  chain: document.getElementById("chain"),
  hook: document.getElementById("hook"),
  depthLabel: document.getElementById("depthLabel"),
  balanceLabel: document.getElementById("balanceLabel"),
  totalBetLabel: document.getElementById("totalBetLabel"),
  betInput: document.getElementById("betInput"),
  betPanel: document.getElementById("betPanel"),
  betDownButton: document.getElementById("betDownButton"),
  betUpButton: document.getElementById("betUpButton"),
  deepButton: document.getElementById("deepButton"),
  pullButton: document.getElementById("pullButton"),
  resetButton: document.getElementById("resetButton"),
  hookedLabel: document.getElementById("hookedLabel"),
  eventLabel: document.getElementById("eventLabel"),
  eventStage: document.getElementById("eventStage"),
  eventSymbol: document.getElementById("eventSymbol"),
  eventKicker: document.getElementById("eventKicker"),
  eventTitle: document.getElementById("eventTitle"),
  eventText: document.getElementById("eventText"),
  eventRange: document.getElementById("eventRange"),
  eventResult: document.getElementById("eventResult"),
  pullBanner: document.getElementById("pullBanner"),
  eventFlashCard: document.getElementById("eventFlashCard"),
  eventFlashKicker: document.getElementById("eventFlashKicker"),
  eventFlashTitle: document.getElementById("eventFlashTitle"),
  themeBadge: document.getElementById("themeBadge"),
  themeName: document.getElementById("themeName"),
  themeKicker: document.getElementById("themeKicker"),
  themeReveal: document.getElementById("themeReveal"),
  themeTravelFrame: document.getElementById("themeTravelFrame"),
  themeRevealName: document.getElementById("themeRevealName"),
  themeRevealKicker: document.getElementById("themeRevealKicker"),
  themeRevealTrait: document.getElementById("themeRevealTrait"),
  chargeBadge: document.getElementById("chargeBadge"),
  chargeTurns: document.getElementById("chargeTurns"),
  chargeRange: document.getElementById("chargeRange"),
  settlementScreen: document.getElementById("settlementScreen"),
  settlementKicker: document.getElementById("settlementKicker"),
  settlementTitle: document.getElementById("settlementTitle"),
  settlementAmount: document.getElementById("settlementAmount"),
  settlementRatio: document.getElementById("settlementRatio"),
  settlementExitButton: document.getElementById("settlementExitButton"),
  log: document.getElementById("log"),
};

function init() {
  createBubbles();
  resetRound(true);
  setupUiEditor();
  els.deepButton.addEventListener("click", goDeep);
  els.pullButton.addEventListener("click", pullUp);
  els.resetButton.addEventListener("click", () => resetRound(false));
  els.settlementExitButton.addEventListener("click", () => resetRound(false));
  els.betDownButton.addEventListener("click", () => adjustBet(-10));
  els.betUpButton.addEventListener("click", () => adjustBet(10));
  els.betInput.addEventListener("input", () => {
    if (els.game.classList.contains("ui-editing") || state.depth > 0 || state.busy || state.roundOver) {
      els.betInput.value = state.bet;
      return;
    }
    state.bet = clamp(Number(els.betInput.value) || 1, 1, 100);
  });
}

function setupUiEditor() {
  const game = els.game;
  const controls = document.querySelector(".main-controls");
  const bottom = document.querySelector(".bottom-console");
  const bottomBank = document.querySelector(".bottom-bank");
  if (!game || !controls || !bottom || !bottomBank) return;

  const targets = [
    { id: "betPanel", el: els.betPanel },
    { id: "pullButton", el: els.pullButton },
    { id: "deepButton", el: els.deepButton },
  ].filter((item) => item.el);

  let editing = false;
  let drag = null;

  const toggle = document.createElement("button");
  toggle.className = "ui-edit-toggle";
  toggle.type = "button";
  toggle.textContent = "EDIT UI";
  document.body.appendChild(toggle);

  const panel = document.createElement("div");
  panel.className = "ui-editor-panel";
  panel.hidden = true;
  panel.innerHTML = `
    <strong>UI EDIT</strong>
    <span>Game controls locked. Drag buttons. Pull corners to resize buttons or info bar.</span>
    <div>
      <button type="button" data-action="save">SAVE</button>
      <button type="button" data-action="reset">RESET</button>
      <button type="button" data-action="done">DONE</button>
    </div>
  `;
  document.body.appendChild(panel);

  targets.forEach(({ el }) => {
    el.classList.add("ui-edit-target");
    const handle = document.createElement("span");
    handle.className = "ui-resize-handle";
    el.appendChild(handle);
  });
  bottomBank.classList.add("ui-edit-target", "ui-info-edit-target");
  const infoHandle = document.createElement("span");
  infoHandle.className = "ui-resize-handle ui-info-resize-handle";
  bottomBank.appendChild(infoHandle);

  applySavedUiLayout();

  toggle.addEventListener("click", () => setEditing(!editing));
  panel.addEventListener("click", (event) => {
    const action = event.target?.dataset?.action;
    if (!action) return;
    if (action === "save") {
      saveCurrentUiLayout();
      flashEditorMessage("SAVED");
    }
    if (action === "reset") {
      localStorage.removeItem(UI_LAYOUT_KEY);
      resetEditableLayout();
      flashEditorMessage("RESET");
    }
    if (action === "done") setEditing(false);
  });

  controls.addEventListener("pointerdown", (event) => {
    if (!editing) return;
    const targetEl = event.target.closest(".ui-edit-target");
    if (!targetEl || !controls.contains(targetEl)) return;
    event.preventDefault();
    event.stopPropagation();
    const rect = targetEl.getBoundingClientRect();
    const parentRect = controls.getBoundingClientRect();
    drag = {
      el: targetEl,
      mode: event.target.classList.contains("ui-resize-handle") ? "resize" : "move",
      startX: event.clientX,
      startY: event.clientY,
      x: rect.left - parentRect.left,
      y: rect.top - parentRect.top,
      w: rect.width,
      h: rect.height,
    };
    targetEl.setPointerCapture?.(event.pointerId);
    targetEl.classList.add("editing-active");
  }, true);

  bottomBank.addEventListener("pointerdown", (event) => {
    if (!editing) return;
    event.preventDefault();
    event.stopPropagation();
    const rect = bottomBank.getBoundingClientRect();
    drag = {
      el: bottomBank,
      mode: "info-resize",
      startX: event.clientX,
      startY: event.clientY,
      h: rect.height,
    };
    bottomBank.setPointerCapture?.(event.pointerId);
    bottomBank.classList.add("editing-active");
  }, true);

  controls.addEventListener("click", (event) => {
    if (!editing) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);

  window.addEventListener("pointermove", (event) => {
    if (!drag) return;
    event.preventDefault();
    const parentRect = controls.getBoundingClientRect();
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (drag.mode === "info-resize") {
      const height = clamp(drag.h + dy, 22, 76);
      drag.el.style.height = `${height}px`;
    } else if (drag.mode === "resize") {
      const width = clamp(drag.w + dx, 72, parentRect.width - drag.x);
      const height = clamp(drag.h + dy, 74, 168);
      drag.el.style.width = `${width}px`;
      drag.el.style.height = `${height}px`;
    } else {
      const x = clamp(drag.x + dx, -18, parentRect.width - drag.w + 18);
      const y = clamp(drag.y + dy, -18, 44);
      drag.el.style.left = `${x}px`;
      drag.el.style.top = `${y}px`;
    }
  });

  window.addEventListener("pointerup", () => {
    if (!drag) return;
    drag.el.classList.remove("editing-active");
    drag = null;
  });

  function setEditing(active) {
    if (active) seedEditableLayout();
    editing = active;
    game.classList.toggle("ui-editing", editing);
    panel.hidden = !editing;
    toggle.textContent = editing ? "CLOSE UI" : "EDIT UI";
    if (!editing) {
      saveCurrentUiLayout();
    }
  }

  function seedEditableLayout() {
    const parentRect = controls.getBoundingClientRect();
    targets.forEach(({ el }) => {
      const rect = el.getBoundingClientRect();
      el.style.left = `${rect.left - parentRect.left}px`;
      el.style.top = `${rect.top - parentRect.top}px`;
      el.style.width = `${rect.width}px`;
      el.style.height = `${rect.height}px`;
    });
    controls.classList.add("has-custom-ui-layout");
    controls.style.height = `${Math.max(132, ...targets.map(({ el }) => Number.parseFloat(el.style.top || 0) + Number.parseFloat(el.style.height || 0)))}px`;
  }

  function saveCurrentUiLayout() {
    const parentRect = controls.getBoundingClientRect();
    const layout = {};
    targets.forEach(({ id, el }) => {
      const rect = el.getBoundingClientRect();
      layout[id] = {
        x: (rect.left - parentRect.left) / parentRect.width,
        y: (rect.top - parentRect.top),
        w: rect.width / parentRect.width,
        h: rect.height,
      };
    });
    layout.bottomBank = {
      h: bottomBank.getBoundingClientRect().height,
    };
    controls.classList.add("has-custom-ui-layout");
    localStorage.setItem(UI_LAYOUT_KEY, JSON.stringify(layout));
  }

  function applySavedUiLayout() {
    let layout = null;
    try {
      layout = JSON.parse(localStorage.getItem(UI_LAYOUT_KEY) || "null");
    } catch {
      layout = null;
    }
    if (!layout) return;
    const parentWidth = controls.getBoundingClientRect().width || 420;
    controls.classList.add("has-custom-ui-layout");
    targets.forEach(({ id, el }) => {
      const item = layout[id];
      if (!item) return;
      el.style.left = `${item.x * parentWidth}px`;
      el.style.top = `${item.y}px`;
      el.style.width = `${item.w * parentWidth}px`;
      el.style.height = `${item.h}px`;
    });
    if (layout.bottomBank?.h) {
      bottomBank.style.height = `${layout.bottomBank.h}px`;
    }
    controls.style.height = `${Math.max(132, ...targets.map(({ el }) => Number.parseFloat(el.style.top || 0) + Number.parseFloat(el.style.height || 0)))}px`;
  }

  function clearUiLayout() {
    controls.classList.remove("has-custom-ui-layout");
    controls.style.height = "";
    targets.forEach(({ el }) => {
      el.style.left = "";
      el.style.top = "";
      el.style.width = "";
      el.style.height = "";
    });
    bottomBank.style.height = "";
  }

  function resetEditableLayout() {
    game.classList.remove("ui-editing");
    clearUiLayout();
    seedEditableLayout();
    if (editing) game.classList.add("ui-editing");
  }

  function flashEditorMessage(text) {
    panel.dataset.status = text;
    window.setTimeout(() => {
      if (panel.dataset.status === text) panel.dataset.status = "";
    }, 900);
  }
}

function adjustBet(delta) {
  if (els.game.classList.contains("ui-editing") || state.busy || state.roundOver || state.depth > 0) return;
  state.bet = clamp((Number(els.betInput.value) || state.bet || 10) + delta, 1, 100);
  els.betInput.value = state.bet;
  addLog(`Bet set to ${money(state.bet)}.`);
}

function resetRound(first) {
  state.totalBet = 0;
  state.depth = 0;
  state.hooked = [];
  state.eventCount = 0;
  state.busy = false;
  state.roundOver = false;
  state.jellyCharge = null;
  state.activeEventRange = null;
  state.openingPreviewDone = false;
  state.themeRevealed = false;
  state.theme = pickWeighted(oceanThemes.map((theme) => ({ ...theme, weight: 1 })));
  state.bet = clamp(Number(els.betInput.value) || 10, 1, 100);
  state.zones = makeZones();
  els.fxLayer.innerHTML = "";
  document.querySelector(".surface").style.transform = "translateX(-50%)";
  els.vortex.style.left = "";
  els.vortex.style.rotate = "";
  els.vortex.classList.remove("pull-active", "pull-travel");
  els.vortex.hidden = true;
  els.game.classList.remove("pulling", "theme-revealed", ...oceanThemes.map((theme) => `theme-${theme.id}`));
  stopVortexFrames();
  hideSettlement();
  hideEventFlash();
  hideStage();
  hideBanner(els.pullBanner);
  renderZones();
  render();
  setBetLocked(false);
  els.deepButton.disabled = false;
  els.pullButton.disabled = true;
  addLog(first ? "Press GO DEEP to discover this run's ocean." : "New round ready. Ocean unknown.");
}

function setBetLocked(locked) {
  els.betInput.disabled = locked;
  els.betDownButton.disabled = locked;
  els.betUpButton.disabled = locked;
  els.betPanel?.classList.toggle("locked", locked);
}

function makeZones() {
  const zones = [];
  const theme = state.theme || oceanThemes[0];
  const fishPool = getThemeFishPool(theme);
  for (let i = 1; i <= state.maxZones; i += 1) {
    const depth = i * 100;
    const count = clamp(3 + Math.floor(Math.random() * 4) + theme.densityBonus, 2, 7);
    const fish = [];
    for (let j = 0; j < count; j += 1) {
      const base = pickWeighted(fishPool);
      const positioned = positionFishInZone(base, fish);
      fish.push({
        ...base,
        id: uid(),
        x: positioned.x,
        y: positioned.y,
        caught: false,
      });
    }
    const scheduledEvent = i % 8 === 0 ? pickThemeEvent(theme) : null;
    const eventChance = theme.eventChance;
    if (scheduledEvent || Math.random() < eventChance) {
      const event = scheduledEvent || pickThemeEvent(theme);
      fish.push({
        id: uid(),
        type: "event",
        event: true,
        eventId: event.id,
        demoForced: Boolean(scheduledEvent),
        label: event.short,
        src: event.src,
        mult: 0,
        x: 10 + Math.random() * 74,
        y: 10 + Math.random() * 62,
        caught: false,
      });
    }
    if (theme.featuredDepths.includes(depth)) {
      const base = theme.featuredFish;
      const positioned = positionFishInZone(base, fish);
      fish.push({
        ...base,
        id: uid(),
        x: positioned.x,
        y: positioned.y,
        caught: false,
        featured: true,
      });
    }
    if (i >= state.maxZones - 2) {
      const prizePool = fishTypes.filter((item) => item.type === "high" && item.mult >= 80);
      const base = prizePool[(i - (state.maxZones - 2)) % prizePool.length];
      const positioned = positionFishInZone(base, fish);
      fish.push({
        ...base,
        id: uid(),
        x: positioned.x,
        y: positioned.y,
        caught: false,
        prizePreview: true,
      });
    }
    zones.push({ depth, fish });
  }
  return zones;
}

function positionFishInZone(base, existing) {
  const bounds = getFishSpawnBounds(base);
  let best = {
    x: bounds.minX + Math.random() * (bounds.maxX - bounds.minX),
    y: bounds.minY + Math.random() * (bounds.maxY - bounds.minY),
  };
  let bestScore = -Infinity;
  for (let attempt = 0; attempt < 24; attempt += 1) {
    const candidate = {
      x: bounds.minX + Math.random() * (bounds.maxX - bounds.minX),
      y: bounds.minY + Math.random() * (bounds.maxY - bounds.minY),
    };
    const score = existing.reduce((sum, other) => {
      const dx = Math.abs(candidate.x - other.x);
      const dy = Math.abs(candidate.y - other.y);
      const widePenalty = base.wide || other.wide ? 18 : 0;
      const minDx = (base.wide || other.wide ? 30 : 18) + widePenalty;
      const minDy = base.wide || other.wide ? 24 : 16;
      const overlap = Math.max(0, minDx - dx) * 2 + Math.max(0, minDy - dy) * 2.4;
      return sum - overlap + dx * 0.08 + dy * 0.05;
    }, 0);
    if (score > bestScore) {
      bestScore = score;
      best = candidate;
    }
  }
  return best;
}

function getFishSpawnBounds(base) {
  if (base.type === "high") return { minX: 12, maxX: 54, minY: 11, maxY: 55 };
  if (base.wide) return { minX: 12, maxX: 52, minY: 14, maxY: 58 };
  return { minX: 8, maxX: 72, minY: 10, maxY: 68 };
}

function getThemeFishPool(theme) {
  return fishTypes.map((fish) => {
    const bias = fish.type === "high" ? theme.highBias : fish.type === "mid" ? theme.midBias : theme.lowBias;
    return { ...fish, weight: fish.weight * bias };
  });
}

function pickThemeEvent(theme) {
  const weighted = eventTypes.map((event) => ({
    ...event,
    weight: theme.eventWeights[event.id] || 1,
  }));
  return pickWeighted(weighted);
}

function renderZones() {
  els.waterColumn.innerHTML = "";
  state.zones.forEach((zone, index) => {
    const zoneEl = document.createElement("div");
    zoneEl.className = getZoneClass(zone);
    zoneEl.dataset.depth = `${zone.depth}m`;
    zoneEl.dataset.zoneDepth = String(zone.depth);
    if (state.activeEventRange && isZoneInActiveRange(zone.depth)) {
      zoneEl.dataset.rangeLabel = state.activeEventRange.label;
    }
    zoneEl.style.top = `${index * state.zoneHeight}px`;
    zone.fish.forEach((fish) => {
      const fishEl = document.createElement("div");
      fishEl.className = getFishClass(fish);
      if (fish.themeFish) fishEl.dataset.themeFish = fish.themeFish;
      fishEl.dataset.id = fish.id;
      const maxX = fish.type === "high" ? 56 : fish.event ? 69 : fish.wide ? 58 : 73;
      const minX = fish.wide || fish.type === "high" ? 12 : 5;
      fishEl.style.left = `${clamp(fish.x, minX, maxX)}%`;
      fishEl.style.top = `${fish.y}%`;
      const seed = hashId(fish.id);
      const driftX = fish.type === "high" ? 34 + (seed % 18) : 28 + (seed % 22);
      const driftY = fish.type === "high" ? 4 + ((seed >> 4) % 5) : 3 + ((seed >> 4) % 5);
      fishEl.style.setProperty("--swim-x", `${driftX}px`);
      fishEl.style.setProperty("--swim-y", `${seed % 3 ? driftY : -driftY}px`);
      fishEl.style.setProperty("--swim-duration", `${4.4 + (seed % 20) / 10}s`);
      fishEl.style.setProperty("--swim-delay", `${-((seed % 30) / 10)}s`);
      const baseFacing = fish.facing || 1;
      fishEl.style.setProperty("--face-right", baseFacing);
      fishEl.style.setProperty("--face-left", -baseFacing);
      const img = document.createElement("img");
      img.src = fish.src;
      img.alt = "";
      fishEl.appendChild(img);
      if (!fish.event) {
        const mult = document.createElement("span");
        mult.className = `mult ${getMultiplierClass(fish.mult)}`;
        mult.textContent = fish.label;
        fishEl.appendChild(mult);
        const badges = createStatusBadges(fish);
        if (badges) fishEl.appendChild(badges);
      }
      zoneEl.appendChild(fishEl);
    });
    els.waterColumn.appendChild(zoneEl);
  });
}

function createStatusBadges(fish) {
  const badges = [];
  if (fish.golded) badges.push({ type: "gold" });
  if (fish.doubled) badges.push({ type: "mirror" });
  if (fish.stunned) badges.push({ type: fish.stunSource === "jelly" ? "jelly" : "stun" });
  if (!badges.length) return null;
  const wrap = document.createElement("span");
  wrap.className = "status-stack";
  badges.slice(0, 2).forEach((badge) => {
    const item = document.createElement("span");
    item.className = `status-badge badge-${badge.type}`;
    const img = document.createElement("img");
    img.src = statusIcons[badge.type];
    img.alt = "";
    item.appendChild(img);
    wrap.appendChild(item);
  });
  return wrap;
}

function getZoneClass(zone) {
  const classes = ["zone"];
  if (state.activeEventRange && isZoneInActiveRange(zone.depth)) {
    classes.push("event-range-zone", `range-${state.activeEventRange.eventId}`);
    if (zone.depth === state.activeEventRange.start) classes.push("range-start");
    if (zone.depth === state.activeEventRange.end) classes.push("range-end");
  }
  return classes.join(" ");
}

function isZoneInActiveRange(depth) {
  const range = state.activeEventRange;
  return range && depth >= range.start && depth <= range.end;
}

function render() {
  updateHudOnly();
  const hookTop = state.depth > 0 ? -154 : -176;
  els.hook.style.top = `${hookTop}px`;
  if (els.chain) els.chain.style.height = "0px";
  const viewIndex = Math.max(0, state.depth / 100 - 1);
  els.waterColumn.style.transform = `translateY(${-viewIndex * state.zoneHeight}px)`;
  els.pullButton.disabled = state.depth <= 0 || state.busy || state.roundOver;
  els.deepButton.disabled = state.busy || state.roundOver || state.depth >= state.maxDepth || state.balance < state.bet;
  document.querySelector(".boat").style.opacity = state.depth >= 200 ? "0" : "1";
}

async function playOpeningPrizePreview() {
  state.openingPreviewDone = true;
  const bottomIndex = state.maxZones - 1;
  const bottomOffset = -bottomIndex * state.zoneHeight;
  const water = els.waterColumn;
  els.game.classList.add("prize-preview");
  water.style.transition = "none";
  water.style.transform = `translateY(${bottomOffset}px)`;
  water.offsetHeight;
  await wait(360);
  water.style.transition = "transform 4.2s cubic-bezier(.82,0,.94,.2)";
  water.style.transform = "translateY(0px)";
  await wait(4260);
  water.style.transition = "";
  els.game.classList.remove("prize-preview");
  addLog("Prize preview complete. Diving starts now.");
}

async function revealTheme() {
  if (state.themeRevealed || !state.theme) return;
  state.themeRevealed = true;
  els.game.classList.add("theme-revealed", `theme-${state.theme.id}`);
  updateHudOnly();
  await playThemeRevealTransition();
  addLog(`Ocean discovered: ${state.theme.name}. ${state.theme.kicker}`);
}

async function playThemeRevealTransition() {
  if (!els.themeReveal || !state.theme) return;
  els.themeReveal.className = `theme-reveal reveal-${state.theme.id} traveling`;
  els.themeRevealName.textContent = state.theme.name;
  els.themeRevealKicker.textContent = "OCEAN DISCOVERED";
  els.themeRevealTrait.textContent = state.theme.kicker;
  if (els.themeTravelFrame) {
    els.themeTravelFrame.src = "assets/anim/ocean-travel/ocean-travel_00.png";
  }
  els.themeReveal.hidden = false;
  await playThemeTravelFrames();
  els.themeReveal.className = `theme-reveal reveal-${state.theme.id} reveal-card-phase`;
  await wait(1120);
  els.themeReveal.hidden = true;
}

async function playThemeTravelFrames() {
  if (!els.themeTravelFrame) return wait(1500);
  const total = 60;
  for (let i = 0; i < total; i += 1) {
    els.themeTravelFrame.src = `assets/anim/ocean-travel/ocean-travel_${String(i).padStart(2, "0")}.png`;
    await wait(36);
  }
}

async function goDeep() {
  if (els.game.classList.contains("ui-editing") || state.busy || state.roundOver) return;
  state.bet = clamp(Number(els.betInput.value) || 1, 1, 100);
  if (state.balance < state.bet) {
    addLog("Not enough balance. Lower BET or start a new round.");
    return;
  }
  state.busy = true;
  render();
  if (!state.openingPreviewDone && state.depth === 0) {
    await revealTheme();
    await playOpeningPrizePreview();
  }
  els.game.classList.add("diving");
  state.balance -= state.bet;
  state.totalBet += state.bet;
  state.depth += 100;
  setBetLocked(true);
  addLog(`Dive paid ${money(state.bet)}. Hook reached ${state.depth}m.`);
  render();
  await wait(170);
  els.game.classList.remove("diving");
  const zone = state.zones.find((item) => item.depth === state.depth);
  await resolveJellyChargeForDive(zone);
  const events = zone?.fish.filter((fish) => fish.event) || [];
  for (const fish of events) {
    const event = eventTypes.find((item) => item.id === fish.eventId);
    if (!event) continue;
    const targetZone = chooseEventTarget(zone, event);
    const triggered = fish.demoForced || Math.random() < 0.9;
    setEventRangeHighlight(event, targetZone, true);
    try {
      if (triggered) {
        state.eventCount += 1;
        await playEventFx(event, fish, targetZone);
        const result = event.apply(targetZone);
        renderZones();
        playAffectedFishFx(event, targetZone);
        addLog(`${event.name} triggered. ${result}`);
      } else {
        presentEventResult(event, `${event.name} missed. No fish changed.`);
        addLog(`${event.name} appeared but did not trigger.`);
      }
    } catch (error) {
      console.error(error);
      addLog(`${event.name} effect skipped. Round continues.`);
    } finally {
      setEventRangeHighlight(event, targetZone, false);
      hideStage();
    }
  }
  state.busy = false;
  render();
}

async function pullUp() {
  if (els.game.classList.contains("ui-editing") || state.busy || state.roundOver || state.depth <= 0) return;
  state.busy = true;
  hideStage();
  hideBanner(els.pullBanner);
  els.deepButton.disabled = true;
  els.pullButton.disabled = true;
  els.vortex.hidden = false;
  els.game.classList.add("pulling");
  stopVortexFrames();
  setVortexProgress(0);
  els.hook.style.transform = "translateX(-50%) scale(1.08)";
  const pullStartDepth = state.depth;
  await playPullIntroV3();

  let win = 0;
  const passed = state.zones.filter((zone) => zone.depth <= state.depth).reverse();
  for (const zone of passed) {
    focusPullZone(zone.depth, pullStartDepth);
    updatePullPath(zone.depth, pullStartDepth);
    if (zone.depth % 300 === 0 || passed.length <= 18) pulseZone(zone.depth);
    addLog(`Pull path reached ${zone.depth}m. Vortex is collecting fish.`);
    await wait(passed.length > 20 ? 3 : 12);
    zone.fish.filter((fish) => fish.event && !fish.pulledFx).forEach((fish) => {
      fish.pulledFx = true;
      playToolFishSurfaceReach(fish);
    });
    const normalFish = zone.fish.filter((fish) => !fish.event && !fish.caught);
    const quickFish = normalFish.filter((fish) => fish.type !== "high");
    const highFish = normalFish.filter((fish) => fish.type === "high");
    quickFish.forEach((fish, index) => {
      const catchRate = fish.stunned ? 1 : catchChance(fish);
      const caught = Math.random() < catchRate;
      window.setTimeout(() => playLowFishVortexHold(fish), index * 18);
      if (caught) {
        fish.caught = true;
        state.hooked.push(fish);
        const amount = payoutForFish(fish);
        win += amount;
        playCatchLift(fish, fish.type);
        addLog(`${zone.depth}m catch: ${fish.label}. Win ${money(amount)}.`);
      }
    });
    if (quickFish.length) await wait(Math.min(180, 80 + quickFish.length * 18));
    for (const fish of highFish) {
      const catchRate = fish.stunned ? 1 : catchChance(fish);
      const caught = Math.random() < catchRate;
      await playHighFishStruggle(fish);
      await showReelCheck(fish, caught);
      if (caught) {
        fish.caught = true;
        state.hooked.push(fish);
        const amount = payoutForFish(fish);
        win += amount;
        playHighCatchBurst(fish);
        playReelSuccessImpact(fish);
        showCatchResultText(fish, `${fish.label} GET!`);
        playCatchLift(fish, fish.type);
        addLog(`${zone.depth}m catch: ${fish.label}. Win ${money(amount)}.`);
      } else {
        addLog(`${zone.depth}m high-value fish escaped.`);
      }
    }
    renderZones();
    updateHudOnly();
    await wait(passed.length > 20 ? 2 : 8);
  }

  state.balance += win;
  state.roundOver = true;
  focusPullZone(0, pullStartDepth);
  updatePullPath(0, pullStartDepth);
  window.setTimeout(() => {
    stopVortexFrames();
    els.vortex.hidden = true;
    els.vortex.classList.remove("pull-active", "pull-travel");
    els.vortex.style.left = "";
    els.vortex.style.rotate = "";
    els.game.classList.remove("pulling");
  }, 1800);
  els.hook.style.transform = "translateX(-50%)";
  document.querySelector(".surface").style.transform = "translateX(-50%)";
  const ratio = state.totalBet > 0 ? win / state.totalBet : 0;
  const title = ratio >= 5 ? "ULTIMATE WIN" : ratio >= 3 ? "SUPER WIN" : ratio >= 1.5 ? "BIG WIN" : win > 0 ? "WIN" : "MISS";
  hideBanner(els.pullBanner);
  showSettlement(title, win, ratio);
  addLog(`Round settled: ${title}. Total win ${money(win)}.`);
  state.busy = false;
  updateHudOnly();
  els.deepButton.disabled = true;
  els.pullButton.disabled = true;
}

function updateHudOnly() {
  els.depthLabel.textContent = `${state.depth}m`;
  els.balanceLabel.textContent = money(state.balance);
  els.totalBetLabel.textContent = money(state.totalBet);
  els.hookedLabel.textContent = state.hooked.length;
  els.eventLabel.textContent = state.eventCount;
  const charge = state.jellyCharge;
  if (els.chargeBadge) {
    els.chargeBadge.hidden = !charge;
    els.game.classList.toggle("hook-charged", Boolean(charge));
    if (charge) {
      els.chargeTurns.textContent = `${charge.turns}`;
      els.chargeRange.textContent = `${charge.rangeZones} ZONES`;
    }
  }
  if (els.themeBadge) {
    els.themeBadge.hidden = !state.themeRevealed || !state.theme;
  }
  if (els.themeBadge && state.theme && state.themeRevealed) {
    els.themeName.textContent = state.theme.name;
    els.themeKicker.textContent = state.theme.kicker;
  }
}

async function resolveJellyChargeForDive(currentZone) {
  if (!state.jellyCharge || !currentZone) return;
  const charge = state.jellyCharge;
  const start = currentZone.depth;
  const end = Math.min(state.maxDepth, start + (charge.rangeZones - 1) * 100);
  const zones = state.zones.filter((zone) => zone.depth >= start && zone.depth <= end);
  const shocked = [];
  const stunned = [];
  zones.forEach((zone) => {
    zone.fish.filter((fish) => !fish.event && !fish.caught).forEach((fish) => {
      fish.electricTouched = true;
      shocked.push(fish);
      if (!fish.stunned && Math.random() < 0.55) {
        fish.stunned = true;
        fish.stunSource = "jelly";
        stunned.push(fish);
      }
    });
  });
  charge.turns -= 1;
  const remaining = charge.turns;
  if (remaining <= 0) state.jellyCharge = null;
  setElectricRangeHighlight(start, end, true);
  renderZones();
  updateHudOnly();
  shocked.slice(0, 14).forEach((fish, index) => playHookShockFx(fish, index));
  stunned.forEach((fish, index) => playJellyAffectedFx(fish, index));
  addLog(`Charged hook shocked ${zones.length} zones. ${stunned.length} fish stunned. ${Math.max(remaining, 0)} charged dives left.`);
  window.setTimeout(() => setElectricRangeHighlight(start, end, false), 720);
  await wait(120);
}

async function playPullIntroV3() {
  const deepest = state.depth;
  focusPullZone(deepest, deepest);
  hideBanner(els.pullBanner);
  addLog(`PULL UP started at ${deepest}m. Vortex is forming.`);
  for (let i = 0; i <= 4; i += 1) {
    setVortexProgress(i / 15);
    await wait(32);
  }
  await wait(30);
  els.vortex.classList.add("pull-active");
  addLog("Vortex expands and bends into the pull path.");
  for (let i = 5; i <= 10; i += 1) {
    setVortexProgress(i / 15);
    await wait(36);
  }
  els.vortex.classList.add("pull-travel");
  addLog("Hook rises. Camera follows the chain upward.");
  for (let i = 10; i <= 12; i += 1) {
    setVortexProgress(i / 15);
    await wait(32);
  }
}

function focusPullZone(depth, startDepth = state.depth) {
  const index = Math.max(0, depth / 100 - 1);
  els.waterColumn.style.transform = `translateY(${-index * state.zoneHeight}px)`;
  const progress = startDepth > 0 ? clamp(1 - depth / startDepth, 0, 1) : 0;
  const hookTop = -150 - progress * 64;
  els.hook.style.top = `${hookTop}px`;
  if (els.chain) els.chain.style.height = "0px";
}

function updatePullPath(depth, startDepth) {
  const progress = startDepth > 0 ? clamp(1 - depth / startDepth, 0, 1) : 0;
  const sway = Math.sin(progress * Math.PI * 2.6) * 8;
  const tilt = Math.sin(progress * Math.PI * 3.2) * 8;
  document.querySelector(".surface").style.transform = `translateX(calc(-50% + ${sway}px))`;
  els.vortex.style.left = `${50 + sway * 0.45}%`;
  els.vortex.style.rotate = `${tilt}deg`;
  setVortexProgress(progress);
}

function pulseZone(depth) {
  const zoneEl = document.querySelector(`[data-zone-depth="${depth}"]`);
  if (!zoneEl) return;
  zoneEl.classList.add("pull-zone");
  window.setTimeout(() => zoneEl.classList.remove("pull-zone"), 220);
}

async function presentEventStart(event) {
  els.eventStage.className = `event-stage ${event.id}`;
  els.eventSymbol.src = event.src;
  els.eventSymbol.alt = event.name;
  els.eventKicker.textContent = event.kicker;
  els.eventTitle.textContent = event.name;
  els.eventText.textContent = event.text;
  els.eventRange.innerHTML = event.range.map((item) => `<span>${item}</span>`).join("");
  els.eventResult.textContent = "Wheel resolving...";
  els.eventStage.hidden = false;
  await wait(900);
}

function presentEventResult(event, message) {
  els.eventStage.className = `event-stage ${event.id}`;
  els.eventResult.textContent = message;
}

function hideStage() {
  els.eventStage.hidden = true;
}

async function playEventFx(event, fish, targetZone) {
  const fishEl = document.querySelector(`[data-id="${fish.id}"]`);
  if (!fishEl) return;
  fishEl.classList.add("event-triggering");
  if (targetZone) pulseZone(targetZone.depth);
  showEventFlash(event);
  const focusEls = showEventFishFocus(fishEl, fish, event);
  try {
    const eventBody = `eventfish-${event.id}`;
    await Promise.all([
      playFrameSequence(event.id, fishEl, {
        className: `event-sequence seq-${event.id}`,
        frames: frameSets[event.id]?.count || 24,
        frameMs: frameSets[event.id]?.fps || 34,
      }),
      playFrameSequenceOnFish(eventBody, fishEl, {
        className: `event-fish-sequence event-fish-${event.id}`,
        frames: 18,
        frameMs: frameSets[eventBody]?.fps || 86,
      }),
    ]);
  } finally {
    focusEls.forEach((el) => el.remove());
    hideEventFlash();
    fishEl.classList.remove("event-triggering");
  }
}

function showEventFlash(event) {
  const copy = eventPresentation[event.id] || { title: event.id.toUpperCase(), kicker: "EVENT" };
  els.eventFlashCard.className = `event-flash-card flash-${event.id}`;
  els.eventFlashKicker.textContent = copy.kicker;
  els.eventFlashTitle.textContent = copy.title;
  els.eventFlashCard.hidden = false;
}

function hideEventFlash() {
  els.eventFlashCard.hidden = true;
}

function playAffectedFishFx(event, targetZone) {
  if (!targetZone) return;
  let targets = [];
  if (event.id === "pearl") {
    targets = targetZone.fish.filter((fish) => !fish.event && fish.golded);
    targets.forEach((fish, index) => playPearlAffectedFx(fish, index));
  } else if (event.id === "puffer") {
    targets = targetZone.fish.filter((fish) => !fish.event && fish.stunned);
    targets.forEach((fish, index) => playStunAffectedFx(fish, "puffer", index));
  }
}

function playPearlAffectedFx(fish, index = 0) {
  playAffectedFrameSequence("affected-pearl", fish, index * 44);
}

function playStunAffectedFx(fish, source, index = 0) {
  const name = source === "jelly" ? "affected-jelly" : "affected-puffer";
  playAffectedFrameSequence(name, fish, index * 58);
}

function playJellyAffectedFx(fish, index) {
  playAffectedFrameSequence("jelly-impact", fish, index * 56);
}

function playAffectedFrameSequence(name, fish, delay = 0) {
  const fishEl = document.querySelector(`[data-id="${fish.id}"]`);
  if (!fishEl) return;
  const set = frameSets[name];
  if (!set) return;
  const className = `affected-sequence ${name}`;
  const run = () => {
    const currentFishEl = document.querySelector(`[data-id="${fish.id}"]`);
    if (!currentFishEl) return;
    playFrameSequenceOnFish(name, currentFishEl, { className, frames: set.count, frameMs: set.fps });
  };
  if (delay > 0) {
    window.setTimeout(run, delay);
  } else {
    run();
  }
}

function playHookShockFx(fish, index = 0) {
  const fishEl = document.querySelector(`[data-id="${fish.id}"]`);
  if (!fishEl) return;
  const set = frameSets["hook-shock"];
  if (!set) return;
  const source = hookDischargePoint();
  const target = fishCenter(fishEl);
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const distance = Math.max(118, Math.hypot(dx, dy));
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  const img = document.createElement("img");
  img.className = "hook-shock-sequence";
  img.alt = "";
  img.src = framePath("hook-shock", 0);
  img.style.left = `${source.x + dx / 2}px`;
  img.style.top = `${source.y + dy / 2}px`;
  img.style.width = `${distance}px`;
  img.style.height = `${clamp(distance * 0.28, 72, 168)}px`;
  img.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
  const run = () => {
    els.fxLayer.appendChild(img);
    let frame = 0;
    const timer = window.setInterval(() => {
      frame += 1;
      if (frame >= set.count) {
        window.clearInterval(timer);
        img.remove();
        return;
      }
      img.src = framePath("hook-shock", frame);
    }, set.fps);
  };
  window.setTimeout(run, index * 34);
}

function hookDischargePoint() {
  const hookRect = els.hook.getBoundingClientRect();
  const oceanRect = els.ocean.getBoundingClientRect();
  return {
    x: hookRect.left - oceanRect.left + hookRect.width / 2,
    y: hookRect.top - oceanRect.top + hookRect.height - 52,
  };
}

function fishCenter(fishEl) {
  const rect = fishEl.getBoundingClientRect();
  const oceanRect = els.ocean.getBoundingClientRect();
  return {
    x: rect.left - oceanRect.left + rect.width / 2,
    y: rect.top - oceanRect.top + rect.height / 2,
  };
}

function showEventFishFocus(anchorEl, fish, event) {
  const rect = anchorEl.getBoundingClientRect();
  const oceanRect = els.ocean.getBoundingClientRect();
  const x = rect.left - oceanRect.left + rect.width / 2;
  const y = rect.top - oceanRect.top + rect.height / 2;
  const halo = document.createElement("div");
  halo.className = `event-fish-halo halo-${event.id}`;
  halo.style.left = `${x}px`;
  halo.style.top = `${y}px`;
  const img = document.createElement("img");
  img.className = `event-fish-focus focus-${event.id}`;
  img.alt = "";
  img.src = fish.src;
  img.style.left = `${x}px`;
  img.style.top = `${y}px`;
  els.fxLayer.appendChild(halo);
  els.fxLayer.appendChild(img);
  return [halo, img];
}

function playFrameSequence(name, anchorEl, options = {}) {
  const set = frameSets[name];
  if (!set) return wait(650);
  const rect = anchorEl.getBoundingClientRect();
  const oceanRect = els.ocean.getBoundingClientRect();
  const x = rect.left - oceanRect.left + rect.width / 2;
  const y = rect.top - oceanRect.top + rect.height / 2;
  const img = document.createElement("img");
  img.className = `sequence-fx ${options.className || ""}`.trim();
  img.alt = "";
  img.src = framePath(name, 0);
  img.style.left = `${x}px`;
  img.style.top = `${y}px`;
  els.fxLayer.appendChild(img);

  const frames = options.frames || set.count;
  const frameMs = options.frameMs || set.fps;
  let index = 0;
  return new Promise((resolve) => {
    const timer = window.setInterval(() => {
      index += 1;
      if (index >= frames) {
        window.clearInterval(timer);
        img.remove();
        resolve();
        return;
      }
      img.src = framePath(name, index);
    }, frameMs);
  });
}

function playFrameSequenceOnFish(name, fishEl, options = {}) {
  const set = frameSets[name];
  if (!set) return wait(650);
  const img = document.createElement("img");
  img.className = `fish-locked-sequence ${options.className || ""}`.trim();
  img.alt = "";
  img.src = framePath(name, 0);
  fishEl.appendChild(img);
  const frames = options.frames || set.count;
  const frameMs = options.frameMs || set.fps;
  let index = 0;
  return new Promise((resolve) => {
    const timer = window.setInterval(() => {
      index += 1;
      if (index >= frames) {
        window.clearInterval(timer);
        img.remove();
        resolve();
        return;
      }
      img.src = framePath(name, index);
    }, frameMs);
  });
}

function playFrameRange(name, anchorEl, options = {}) {
  const set = frameSets[name];
  if (!set) return wait(300);
  const rect = anchorEl.getBoundingClientRect();
  const oceanRect = els.ocean.getBoundingClientRect();
  const point = clampOceanPoint(
    rect.left - oceanRect.left + rect.width / 2 + (options.offsetX || 0),
    rect.top - oceanRect.top + rect.height / 2 + (options.offsetY || 0),
    options.marginX || 92,
    options.marginY || 92
  );
  const img = options.el || document.createElement("img");
  if (options.el && options.className) {
    img.className = `sequence-fx ${options.className}`.trim();
  }
  if (!options.el) {
    img.className = `sequence-fx ${options.className || ""}`.trim();
    img.alt = "";
    img.style.left = `${point.x}px`;
    img.style.top = `${point.y}px`;
    els.fxLayer.appendChild(img);
  }
  const start = options.start || 0;
  const end = options.end ?? set.count - 1;
  const frameMs = options.frameMs || set.fps;
  let index = start;
  img.src = framePath(name, index);
  return new Promise((resolve) => {
    const timer = window.setInterval(() => {
      index += 1;
      if (index > end) {
        window.clearInterval(timer);
        if (!options.keep) img.remove();
        resolve(img);
        return;
      }
      img.src = framePath(name, index);
    }, frameMs);
  });
}

function playCatchLift(fish, type = "low") {
  const fishEl = document.querySelector(`[data-id="${fish.id}"]`);
  if (!fishEl) return;
  const rect = fishEl.getBoundingClientRect();
  const oceanRect = els.ocean.getBoundingClientRect();
  const img = document.createElement("img");
  img.className = `catch-lift-fish lift-${type}`;
  img.alt = "";
  img.src = fish.src;
  const startX = rect.left - oceanRect.left + rect.width / 2;
  const startY = rect.top - oceanRect.top + rect.height / 2;
  const hookX = oceanRect.width / 2;
  const hookY = 110;
  img.style.left = `${startX}px`;
  img.style.top = `${startY}px`;
  img.style.setProperty("--hook-x", `${hookX - startX}px`);
  img.style.setProperty("--hook-y", `${hookY - startY}px`);
  img.style.setProperty("--lift-x", `${hookX - startX + (8 - Math.random() * 16)}px`);
  img.style.setProperty("--lift-y", `${hookY - startY - 190 - Math.random() * 80}px`);
  els.fxLayer.appendChild(img);
  removeLater(img, type === "high" ? 1180 : 820);
}

function playToolFishSurfaceReach(fish) {
  const fishEl = document.querySelector(`[data-id="${fish.id}"]`);
  if (!fishEl) return;
  const rect = fishEl.getBoundingClientRect();
  const oceanRect = els.ocean.getBoundingClientRect();
  const x = rect.left - oceanRect.left + rect.width / 2;
  const y = rect.top - oceanRect.top + rect.height / 2;
  const img = document.createElement("img");
  img.className = "tool-fish-exit";
  img.src = fish.src;
  img.alt = "";
  img.style.left = `${x}px`;
  img.style.top = `${y}px`;
  img.style.setProperty("--exit-x", `${x < oceanRect.width / 2 ? -170 : 170}px`);
  img.style.setProperty("--exit-y", `${-40 - Math.random() * 90}px`);
  els.fxLayer.appendChild(img);
  removeLater(img, 950);
}

function showSettlement(title, win, ratio) {
  els.settlementTitle.textContent = title;
  els.settlementAmount.textContent = money(win);
  els.settlementRatio.textContent = `${trimNumber(ratio)}x`;
  els.settlementKicker.textContent = state.hooked.length > 0 ? `${state.hooked.length} FISH HOOKED` : "NO CATCH";
  els.settlementScreen.hidden = false;
}

function hideSettlement() {
  els.settlementScreen.hidden = true;
}

function framePath(name, index) {
  const set = frameSets[name];
  const frame = String(index % set.count).padStart(2, "0");
  return `assets/anim/${set.folder}/${set.prefix}_${frame}.png`;
}

function setVortexProgress(progress) {
  if (!els.vortexFrame) return;
  const clamped = clamp(progress, 0, 1);
  const frameIndex = Math.min(frameSets.vortex.count - 1, Math.floor(clamped * frameSets.vortex.count));
  els.vortexFrame.src = framePath("vortex", frameIndex);
  els.vortex.style.setProperty("--vortex-scale", (0.62 + clamped * 0.62).toFixed(3));
  els.vortex.style.setProperty("--vortex-opacity", (0.25 + clamped * 0.75).toFixed(3));
}

function startVortexFrames() {
  stopVortexFrames();
  if (!els.vortexFrame) return;
  let index = 0;
  els.vortexFrame.src = framePath("vortex", 0);
  state.vortexTimer = window.setInterval(() => {
    index = (index + 1) % frameSets.vortex.count;
    els.vortexFrame.src = framePath("vortex", index);
  }, frameSets.vortex.fps);
}

function stopVortexFrames() {
  if (state.vortexTimer) {
    window.clearInterval(state.vortexTimer);
    state.vortexTimer = null;
  }
}

async function showReelFight(fish) {
  const fishEl = document.querySelector(`[data-id="${fish.id}"]`);
  if (!fishEl) return;
  fishEl.classList.add("fighting");
  const rect = fishEl.getBoundingClientRect();
  const oceanRect = els.ocean.getBoundingClientRect();
  const reel = document.createElement("div");
  reel.className = "reel";
  reel.style.left = `${rect.left - oceanRect.left + 76}px`;
  reel.style.top = `${rect.top - oceanRect.top - 20}px`;
  els.fxLayer.appendChild(reel);
  await wait(520);
  fishEl.classList.remove("fighting");
  reel.remove();
}

async function showReelCheck(fish, caught) {
  const fishEl = document.querySelector(`[data-id="${fish.id}"]`);
  if (!fishEl) return;
  fishEl.classList.add("reel-checking");
  const outcomeName = caught ? "reel-success" : "reel-fail";
  const focus = createReelFocusFish(fishEl, fish);
  try {
    const reelEl = await playFrameRange("reel-success", fishEl, {
      className: "reel-sequence reel-shared-fx",
      start: 0,
      end: 25,
      keep: true,
      frameMs: frameSets["reel-success"].fps,
      offsetX: 118,
      offsetY: -28,
    });
    await playFrameRange(outcomeName, fishEl, {
      el: reelEl,
      className: `reel-sequence ${caught ? "reel-success-fx" : "reel-fail-fx"}`,
      start: 26,
      end: frameSets[outcomeName].count - 1,
      frameMs: frameSets[outcomeName].fps,
    });
  } finally {
    fishEl.classList.remove("reel-checking");
    focus.remove();
  }
}

function createReelFocusFish(fishEl, fish) {
  const rect = fishEl.getBoundingClientRect();
  const oceanRect = els.ocean.getBoundingClientRect();
  const point = clampOceanPoint(
    rect.left - oceanRect.left + rect.width / 2,
    rect.top - oceanRect.top + rect.height / 2,
    126,
    126
  );
  const img = document.createElement("img");
  img.className = "reel-focus-fish";
  img.src = fish.src;
  img.alt = "";
  img.style.left = `${point.x}px`;
  img.style.top = `${point.y}px`;
  els.fxLayer.appendChild(img);
  return img;
}

function playLowFishVortexHold(fish) {
  const fishEl = document.querySelector(`[data-id="${fish.id}"]`);
  if (!fishEl) return;
  const rect = fishEl.getBoundingClientRect();
  const oceanRect = els.ocean.getBoundingClientRect();
  const img = document.createElement("img");
  img.className = "low-vortex-hold";
  img.src = fish.src;
  img.alt = "";
  img.style.left = `${rect.left - oceanRect.left + rect.width / 2}px`;
  img.style.top = `${rect.top - oceanRect.top + rect.height / 2}px`;
  img.style.setProperty("--hold-x", `${oceanRect.width / 2 - (rect.left - oceanRect.left + rect.width / 2)}px`);
  img.style.setProperty("--hold-y", `${-22 + Math.random() * 32}px`);
  els.fxLayer.appendChild(img);
  removeLater(img, 520);
}

async function playHighFishStruggle(fish) {
  const fishEl = document.querySelector(`[data-id="${fish.id}"]`);
  if (!fishEl) return;
  fishEl.classList.add("vortex-dragging");
  const rect = fishEl.getBoundingClientRect();
  const oceanRect = els.ocean.getBoundingClientRect();
  const img = document.createElement("img");
  img.className = "high-struggle-fish high-struggle-pre";
  img.src = fish.src;
  img.alt = "";
  const startX = rect.left - oceanRect.left + rect.width / 2;
  const startY = rect.top - oceanRect.top + rect.height / 2;
  const point = clampOceanPoint(startX, startY, 118, 118);
  img.style.left = `${point.x}px`;
  img.style.top = `${point.y}px`;
  img.style.setProperty("--drag-x", `${oceanRect.width / 2 - startX}px`);
  img.style.setProperty("--drag-y", `${-18 + Math.random() * 34}px`);
  els.fxLayer.appendChild(img);
  await wait(360);
  fishEl.classList.remove("vortex-dragging");
  img.remove();
}

function showCatchResultText(fish, text) {
  const fishEl = document.querySelector(`[data-id="${fish.id}"]`);
  if (!fishEl) return;
  const pos = fishCenter(fishEl);
  const card = document.createElement("div");
  card.className = "catch-result-text";
  card.textContent = `${text} ${fish.label}`;
  card.style.left = `${pos.x}px`;
  card.style.top = `${pos.y - 74}px`;
  els.fxLayer.appendChild(card);
  removeLater(card, 1180);
}

function playHighCatchBurst(fish) {
  const fishEl = document.querySelector(`[data-id="${fish.id}"]`);
  if (!fishEl) return;
  const pos = fishCenter(fishEl);
  const burst = document.createElement("img");
  burst.className = "high-catch-burst";
  burst.alt = "";
  burst.src = "assets/anim/reel-success/reel-success_30.png";
  burst.style.left = `${pos.x}px`;
  burst.style.top = `${pos.y}px`;
  els.fxLayer.appendChild(burst);
  removeLater(burst, 860);
}

function playReelSuccessImpact(fish) {
  const fishEl = document.querySelector(`[data-id="${fish.id}"]`);
  if (!fishEl) return;
  const pos = fishCenter(fishEl);
  const fx = document.createElement("div");
  fx.className = "reel-success-impact";
  const point = clampOceanPoint(pos.x, pos.y, 150, 150);
  fx.style.left = `${point.x}px`;
  fx.style.top = `${point.y}px`;
  els.fxLayer.appendChild(fx);
  removeLater(fx, 980);
}

function clampOceanPoint(x, y, marginX = 80, marginY = 80) {
  const rect = els.ocean.getBoundingClientRect();
  return {
    x: clamp(x, marginX, rect.width - marginX),
    y: clamp(y, marginY, rect.height - marginY),
  };
}

function chooseEventTarget(currentZone, event) {
  if (event.id === "jelly") return currentZone;
  const visible = state.zones.filter((zone) => Math.abs(zone.depth - currentZone.depth) <= 100);
  return visible[Math.floor(Math.random() * visible.length)] || currentZone;
}

function setTargetZone(depth, active) {
  const zoneEl = document.querySelector(`[data-zone-depth="${depth}"]`);
  if (!zoneEl) return;
  zoneEl.classList.toggle("target-zone", active);
}

function setEventRangeHighlight(event, targetZone, active) {
  if (!targetZone || !active) {
    state.activeEventRange = null;
    applyEventRangeDom();
    return;
  }
  state.activeEventRange = getEventRange(event, targetZone);
  applyEventRangeDom();
}

function setElectricRangeHighlight(start, end, active) {
  if (!active) {
    if (state.activeEventRange?.eventId === "jelly-electric") {
      state.activeEventRange = null;
      applyEventRangeDom();
    }
    return;
  }
  state.activeEventRange = {
    eventId: "jelly-electric",
    start,
    end,
    label: "CHARGED HOOK RANGE",
  };
  applyEventRangeDom();
}

function getEventRange(event, targetZone) {
  const start = targetZone.depth;
  const end = start;
  const labels = {
    mirror: "MIRROR LINK RANGE",
    pearl: "PEARL X2 RANGE",
    puffer: "PUFFER STUN RANGE",
    jelly: "HOOK CHARGE",
  };
  return {
    eventId: event.id,
    start,
    end,
    label: labels[event.id] || "EVENT RANGE",
  };
}

function applyEventRangeDom() {
  document.querySelectorAll(".zone").forEach((zoneEl) => {
    zoneEl.classList.remove(
      "event-range-zone",
      "range-start",
      "range-end",
      "range-mirror",
      "range-pearl",
      "range-puffer",
      "range-jelly",
      "range-jelly-electric"
    );
    delete zoneEl.dataset.rangeLabel;
    const depth = Number(zoneEl.dataset.zoneDepth);
    if (!state.activeEventRange || !isZoneInActiveRange(depth)) return;
    zoneEl.classList.add("event-range-zone", `range-${state.activeEventRange.eventId}`);
    if (depth === state.activeEventRange.start) zoneEl.classList.add("range-start");
    if (depth === state.activeEventRange.end) zoneEl.classList.add("range-end");
    zoneEl.dataset.rangeLabel = state.activeEventRange.label;
  });
}

function catchChance(fish) {
  if (fish.type === "high") return 0.18;
  if (fish.type === "mid") return 0.38;
  return 0.64;
}

function payoutForFish(fish) {
  return fish.mult * state.bet * RTP_PAYOUT_SCALE;
}

function getFishClass(fish) {
  return [
    "fish",
    fish.type,
    fish.event ? `event-${fish.eventId}` : "",
    fish.event ? "event" : "",
    fish.wide ? "wide" : "",
    fish.featured ? "featured-fish" : "",
    fish.themeFish ? "theme-special" : "",
    fish.stunned ? "stunned" : "",
    fish.doubled ? "doubled" : "",
    fish.golded ? "golded" : "",
    fish.caught ? "caught" : "",
  ].filter(Boolean).join(" ");
}

function hashId(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function getMultiplierClass(mult) {
  if (mult >= 100) return "mult-legendary";
  if (mult >= 50) return "mult-epic";
  if (mult >= 10) return "mult-rare";
  if (mult >= 2) return "mult-mid";
  return "mult-low";
}

function pickWeighted(items) {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  for (const item of items) {
    roll -= item.weight;
    if (roll <= 0) return item;
  }
  return items[0];
}

function createBubbles() {
  for (let i = 0; i < 46; i += 1) {
    const bubble = document.createElement("div");
    const size = 4 + Math.random() * 14;
    bubble.className = "bubble";
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.animationDuration = `${8 + Math.random() * 13}s`;
    bubble.style.animationDelay = `${-Math.random() * 16}s`;
    els.ocean.appendChild(bubble);
  }
}

function addLog(text) {
  els.log.textContent = text;
}

function showBanner(el, html) {
  el.innerHTML = html;
  el.hidden = false;
}

function hideBanner(el) {
  el.hidden = true;
}

function removeLater(el, ms) {
  window.setTimeout(() => el.remove(), ms);
}

function money(value) {
  return Number(value).toFixed(2);
}

function trimNumber(value) {
  return Number(value.toFixed(2)).toString();
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function randomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function uid() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

init();
