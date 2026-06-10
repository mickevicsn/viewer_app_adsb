import { AnimationController } from "./animation_controller.js";
import { CameraController } from "./camera_controller.js";
import { CesiumFlightScene } from "./cesium_scene.js";
import { ControlPanel } from "./controls.js";
import { DashboardUI } from "./dashboard_ui.js";
import { ViewerState } from "./state.js";

async function loadFlights() {
  const response = await fetch("/api/flights");

  if (!response.ok) {
    throw new Error(`Failed to load flight list: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.flights || [];
}

async function loadPayload(flightId, methodId) {
  const url = new URL("/api/payload", window.location.origin);
  if (flightId) {
    url.searchParams.set("flight", flightId);
  }
  if (methodId) {
    url.searchParams.set("method", methodId);
  }

  const response = await fetch(url);

  if (!response.ok) {
    let detail = `${response.status} ${response.statusText}`;
    try {
      const errorPayload = await response.json();
      if (errorPayload?.error) {
        detail = errorPayload.error;
      }
    } catch (_) {
      // Keep the HTTP status if the server did not send JSON.
    }
    throw new Error(`Failed to load payload: ${detail}`);
  }

  return response.json();
}

function installResponsiveOverlayLayout() {
  const root = document.getElementById("viewerRoot");
  const topbar = document.querySelector(".topbar");
  const titleCard = document.querySelector(".title-card");

  if (!root || !topbar || !titleCard) {
    return;
  }

  const updateLayoutVars = () => {
    const rootRect = root.getBoundingClientRect();
    const topbarRect = topbar.getBoundingClientRect();
    const titleRect = titleCard.getBoundingClientRect();

    root.style.setProperty("--topbar-bottom", `${Math.round(topbarRect.bottom - rootRect.top)}px`);
    root.style.setProperty("--titlebar-bottom", `${Math.round(titleRect.bottom - rootRect.top)}px`);
  };

  const ro = new ResizeObserver(updateLayoutVars);
  ro.observe(topbar);
  ro.observe(titleCard);
  window.addEventListener("resize", updateLayoutVars);
  requestAnimationFrame(updateLayoutVars);
}

function getFlightId(flight) {
  return flight?.id || flight?.flightId || "";
}

function getMethodId(method) {
  return method?.methodId || method?.id || "";
}

function getMethods(flight) {
  return Array.isArray(flight?.methods) ? flight.methods : [];
}

function flightDisplayName(flight) {
  return flight?.label || flight?.icao || flight?.name || getFlightId(flight) || "Flight";
}

function methodDisplayName(method) {
  return method?.label || method?.name || getMethodId(method) || "Method";
}

function availableMethods(flight) {
  return getMethods(flight).filter(method => method.available !== false && !method.placeholder);
}


const APP_MODE_NORMAL = "normal";
const APP_MODE_PRESENTATION = "presentation";
const PRESENTATION_FLIGHT_ID = "4BAAD9";
const PRESENTATION_METHOD_ID = "bea_v_spline_accurate";
const INTERNAL_LOAD_TOKEN_PARAM = "viewerLoadToken";
const INTERNAL_LOAD_CONTEXT_STORAGE_KEY = "adsbViewerInternalLoadContextV4";
const INTERNAL_LOAD_CONTEXT_MAX_AGE_MS = 5 * 60 * 1000;

const VIEW_PRESETS = [
  {
    id: "preset-1",
    label: "Preset 1",
    description: "Start 546 s · heading 0° · pitch -12° · range 80 m",
    startRelT: 546,
    cameraInitialHeadingDeg: 0,
    cameraInitialPitchDeg: -12,
    cameraRangeM: 80,
  },
  {
    id: "preset-2",
    label: "Preset 2",
    description: "Start 1813 s · speed 3.75x · heading 320° · pitch -9° · range 278.28 m",
    startRelT: 1813,
    speed: 3.75,
    cameraInitialHeadingDeg: 320,
    cameraInitialPitchDeg: -9,
    cameraRangeM: 278.28,
  },
];

function urlParams() {
  return new URLSearchParams(window.location.search);
}

function consumeTrustedInternalLoadContext() {
  const params = urlParams();
  const tokenFromUrl = params.get(INTERNAL_LOAD_TOKEN_PARAM);
  if (!tokenFromUrl) {
    return null;
  }

  let raw = null;
  try {
    raw = window.sessionStorage.getItem(INTERNAL_LOAD_CONTEXT_STORAGE_KEY);
    window.sessionStorage.removeItem(INTERNAL_LOAD_CONTEXT_STORAGE_KEY);
  } catch (_) {
    raw = null;
  }

  if (!raw) {
    return null;
  }

  let context = null;
  try {
    context = JSON.parse(raw);
  } catch (_) {
    return null;
  }

  const createdAt = Number(context?.createdAt || 0);
  if (!Number.isFinite(createdAt) || Date.now() - createdAt > INTERNAL_LOAD_CONTEXT_MAX_AGE_MS) {
    return null;
  }

  const mode = String(context?.mode || "");
  if (![APP_MODE_NORMAL, APP_MODE_PRESENTATION].includes(mode)) {
    return null;
  }

  const matchesParam = (key, value) => String(params.get(key) || "") === String(value || "");
  if (String(context?.token || "") !== tokenFromUrl) return null;
  if (!matchesParam("mode", mode)) return null;
  if (!matchesParam("flight", context?.flightId)) return null;
  if (!matchesParam("method", context?.methodId)) return null;
  if (!matchesParam("preset", context?.presetId)) return null;

  return {
    mode,
    trustUrlSelection: true,
    trustUrlPreset: true,
  };
}

function createInternalLoadContext(flightId, methodId, options = {}) {
  const token = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  try {
    window.sessionStorage.setItem(INTERNAL_LOAD_CONTEXT_STORAGE_KEY, JSON.stringify({
      createdAt: Date.now(),
      token,
      mode: options.mode || "",
      flightId: flightId || "",
      methodId: methodId || "",
      presetId: options.presetId || "",
    }));
    return token;
  } catch (_) {
    return null;
  }
}

function modeFromUrl() {
  const requested = urlParams().get("mode");
  return [APP_MODE_NORMAL, APP_MODE_PRESENTATION].includes(requested) ? requested : null;
}

function presetFromUrl() {
  const requested = urlParams().get("preset");
  return VIEW_PRESETS.find(preset => preset.id === requested) || null;
}

function findPresentationFlight(flights) {
  return flights.find(flight => {
    const candidates = [getFlightId(flight), flight?.flightId, flight?.id, flight?.icao, flight?.callsign, flight?.label, flight?.name]
      .filter(Boolean)
      .map(value => String(value).toUpperCase());
    return candidates.includes(PRESENTATION_FLIGHT_ID);
  }) || null;
}

function presentationMethodMatches(method) {
  const values = [
    getMethodId(method),
    method?.id,
    method?.methodId,
    method?.file,
    method?.jsonFile,
    method?.path,
    method?.label,
    method?.name,
  ];

  return values
    .filter(Boolean)
    .map(value => String(value).trim())
    .some(value => {
      const lower = value.toLowerCase();
      const target = PRESENTATION_METHOD_ID.toLowerCase();
      return (
        lower === target ||
        lower === `${target}.json` ||
        lower.endsWith(`/${target}.json`) ||
        lower.endsWith(`\\${target}.json`)
      );
    });
}

function forcePresentationSelection(flights) {
  const flight = findPresentationFlight(flights);
  if (!flight) {
    throw new Error(`Presentation flight ${PRESENTATION_FLIGHT_ID} was not found in the available flights.`);
  }

  const methods = getMethods(flight);
  const method = methods.find(presentationMethodMatches) || null;

  if (!method) {
    throw new Error(`Presentation method ${PRESENTATION_METHOD_ID}.json was not listed for flight ${PRESENTATION_FLIGHT_ID}.`);
  }

  if (method.available === false || method.placeholder) {
    throw new Error(`Presentation method ${PRESENTATION_METHOD_ID}.json is listed for ${PRESENTATION_FLIGHT_ID}, but it is not available yet.`);
  }

  return {
    flightId: getFlightId(flight),
    methodId: getMethodId(method),
    flight,
    method,
  };
}

function presentationSelection(flights, { trustUrlSelection = false } = {}) {
  const defaultSelection = forcePresentationSelection(flights);

  if (!trustUrlSelection) {
    return defaultSelection;
  }

  const requestedMethodId = urlParams().get("method");
  if (!requestedMethodId) {
    return defaultSelection;
  }

  const requestedFlightId = urlParams().get("flight");
  if (requestedFlightId && requestedFlightId !== defaultSelection.flightId) {
    return defaultSelection;
  }

  const method = getMethods(defaultSelection.flight).find(candidate => getMethodId(candidate) === requestedMethodId) || null;
  if (!method || method.available === false || method.placeholder) {
    return defaultSelection;
  }

  return {
    flightId: defaultSelection.flightId,
    methodId: getMethodId(method),
    flight: defaultSelection.flight,
    method,
  };
}

function applyPresetToState(state, preset) {
  if (!preset) {
    return;
  }

  if (Number.isFinite(Number(preset.cameraInitialHeadingDeg))) {
    state.orbitHeadingDeg = state.normalizeDeg(Number(preset.cameraInitialHeadingDeg));
  }
  if (Number.isFinite(Number(preset.cameraInitialPitchDeg))) {
    state.orbitPitchDeg = state.clamp(
      Number(preset.cameraInitialPitchDeg),
      state.config.cameraMinPitchDeg ?? -89,
      state.config.cameraMaxPitchDeg ?? 0,
    );
  }
  if (Number.isFinite(Number(preset.cameraRangeM))) {
    state.userCameraRangeM = state.clamp(
      Number(preset.cameraRangeM),
      state.config.cameraMinRangeM || 80,
      state.config.cameraMaxRangeM || 50000,
    );
  }
  if (Number.isFinite(Number(preset.speed))) {
    state.setSpeed(Number(preset.speed));
  }
  if (Number.isFinite(Number(preset.startRelT))) {
    state.currentRelT = state.clamp(Number(preset.startRelT), 0, state.maxRelativeTime());
    state.currentIndex = state.indexForTime(state.currentRelT);
  }
}

function defaultMethodForFlight(flight) {
  const methods = getMethods(flight);
  const defaultMethodId = flight?.defaultMethod || "raw_adsb";
  return (
    methods.find(method => getMethodId(method) === defaultMethodId && method.available !== false && !method.placeholder) ||
    availableMethods(flight)[0] ||
    methods[0] ||
    null
  );
}

function selectionFromUrl(flights) {
  const params = new URLSearchParams(window.location.search);
  const requestedFlightId = params.get("flight");
  const requestedMethodId = params.get("method");

  if (!requestedFlightId) {
    return null;
  }

  const flight = flights.find(candidate => getFlightId(candidate) === requestedFlightId || candidate.flightId === requestedFlightId);
  if (!flight) {
    return null;
  }

  const methods = getMethods(flight);
  let method = null;

  if (requestedMethodId) {
    method = methods.find(candidate => getMethodId(candidate) === requestedMethodId) || null;
    if (method && (method.available === false || method.placeholder)) {
      return null;
    }
  }

  if (!method) {
    method = defaultMethodForFlight(flight);
  }

  if (!method || method.available === false || method.placeholder) {
    return null;
  }

  return {
    flightId: getFlightId(flight),
    methodId: getMethodId(method),
    flight,
    method,
  };
}

function formatFlightMeta(flight) {
  const pieces = [];
  if (flight?.icao) pieces.push(`ICAO ${flight.icao}`);
  if (flight?.callsign) pieces.push(`Callsign ${flight.callsign}`);
  if (flight?.startTimeUtc) pieces.push(flight.startTimeUtc);
  if (flight?.origin || flight?.destination) pieces.push(`${flight.origin || "?"} → ${flight.destination || "?"}`);
  return pieces.join(" · ") || "Metadata may be completed in flight.json";
}

function formatMethodMeta(method) {
  if (method.available === false || method.placeholder) {
    return method.description || `Add ${method.file || "methods/<method>.json"} to enable this method.`;
  }
  return method.description || method.file || "Available method JSON";
}

function hideSelectionOverlay() {
  const overlay = document.getElementById("flightOverlay");
  const list = document.getElementById("flightList");
  if (overlay) {
    overlay.classList.add("hidden");
  }
  if (list) {
    list.classList.remove("choice-list");
  }
}

function showFlightChooser(flights, options = {}) {
  const overlay = document.getElementById("flightOverlay");
  const title = document.getElementById("flightOverlayTitle");
  const message = document.getElementById("flightOverlayMessage");
  const list = document.getElementById("flightList");

  if (!overlay || !title || !message || !list) {
    return Promise.reject(new Error("Flight chooser overlay was not found in viewer.html."));
  }

  title.textContent = options.title || "Select flight dataset and reconstruction method";
  message.textContent = options.message || "Choose a flight dataset and then select one reconstruction method.";
  list.innerHTML = "";
  list.classList.remove("choice-list");

  return new Promise(resolve => {
    if (!flights.length) {
      const empty = document.createElement("div");
      empty.className = "flight-empty";
      empty.textContent = "No flights were found. Expected track_output/flights.json and at least one methods/raw_adsb.json file inside a flight folder.";
      list.appendChild(empty);
      overlay.classList.remove("hidden");
      return;
    }

    for (const flight of flights) {
      const card = document.createElement("section");
      card.className = "flight-card";
      if (getFlightId(flight) === options.currentFlightId) {
        card.classList.add("flight-card-active");
      }

      const header = document.createElement("div");
      header.className = "flight-card-header";

      const name = document.createElement("span");
      name.className = "flight-card-name";
      name.textContent = flightDisplayName(flight);

      header.appendChild(name);

      const meta = document.createElement("span");
      meta.className = "flight-card-meta";
      meta.textContent = formatFlightMeta(flight);

      const methodsWrap = document.createElement("div");
      methodsWrap.className = "method-list";

      const methods = getMethods(flight);
      if (!methods.length) {
        const emptyMethod = document.createElement("div");
        emptyMethod.className = "method-empty";
        emptyMethod.textContent = "No methods are listed for this flight.";
        methodsWrap.appendChild(emptyMethod);
      }

      for (const method of methods) {
        const methodButton = document.createElement("button");
        methodButton.type = "button";
        methodButton.className = "method-card";
        const methodId = getMethodId(method);
        const methodAvailable = method.available !== false && !method.placeholder;
        methodButton.disabled = !methodAvailable;

        if (getFlightId(flight) === options.currentFlightId && methodId === options.currentMethodId) {
          methodButton.classList.add("method-card-active");
        }

        const methodName = document.createElement("span");
        methodName.className = "method-card-name";
        methodName.textContent = methodDisplayName(method);

        const methodMeta = document.createElement("span");
        methodMeta.className = "method-card-meta";
        methodMeta.textContent = formatMethodMeta(method);

        methodButton.appendChild(methodName);
        methodButton.appendChild(methodMeta);

        if (methodAvailable) {
          methodButton.addEventListener("click", () => {
            overlay.classList.add("hidden");
            resolve({
              flightId: getFlightId(flight),
              methodId,
            });
          });
        }

        methodsWrap.appendChild(methodButton);
      }

      card.appendChild(header);
      card.appendChild(meta);
      card.appendChild(methodsWrap);
      list.appendChild(card);
    }

    overlay.classList.remove("hidden");
  });
}


function hideFlightOverlay() {
  const overlay = document.getElementById("flightOverlay");
  const list = document.getElementById("flightList");
  if (overlay) {
    overlay.classList.add("hidden");
  }
  if (list) {
    list.classList.remove("choice-list");
  }
}

function createChoiceButton({ name, meta, badge = "", onClick }) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "choice-card";

  const header = document.createElement("div");
  header.className = "flight-card-header";

  const nameEl = document.createElement("span");
  nameEl.className = "flight-card-name";
  nameEl.textContent = name;
  header.appendChild(nameEl);

  if (badge) {
    const badgeEl = document.createElement("span");
    badgeEl.className = "flight-card-badge";
    badgeEl.textContent = badge;
    header.appendChild(badgeEl);
  }

  const metaEl = document.createElement("span");
  metaEl.className = "flight-card-meta";
  metaEl.textContent = meta;

  button.appendChild(header);
  button.appendChild(metaEl);
  button.addEventListener("click", onClick);

  return button;
}

function showModeChooser() {
  const overlay = document.getElementById("flightOverlay");
  const title = document.getElementById("flightOverlayTitle");
  const message = document.getElementById("flightOverlayMessage");
  const list = document.getElementById("flightList");

  if (!overlay || !title || !message || !list) {
    return Promise.reject(new Error("Startup mode chooser overlay was not found in viewer.html."));
  }

  title.textContent = "Choose app mode";
  message.textContent = "Presentation locks the viewer to flight 4BAAD9 and starts with the BEA-V-Spline (accurate) method. Normal App keeps the full flight/method selector.";
  list.innerHTML = "";
  list.classList.add("choice-list");

  return new Promise(resolve => {
    list.appendChild(createChoiceButton({
      name: "Presentation",
      badge: "4BAAD9",
      meta: "Load bea_v_spline_accurate.json first. Reset will only offer methods for this flight.",
      onClick: () => {
        overlay.classList.add("hidden");
        list.classList.remove("choice-list");
        resolve(APP_MODE_PRESENTATION);
      },
    }));

    list.appendChild(createChoiceButton({
      name: "Normal App",
      badge: "all flights",
      meta: "Use the standard flight and reconstruction-method chooser.",
      onClick: () => {
        overlay.classList.add("hidden");
        list.classList.remove("choice-list");
        resolve(APP_MODE_NORMAL);
      },
    }));

    overlay.classList.remove("hidden");
  });
}

function showPresetChooser(options = {}) {
  const overlay = document.getElementById("flightOverlay");
  const title = document.getElementById("flightOverlayTitle");
  const message = document.getElementById("flightOverlayMessage");
  const list = document.getElementById("flightList");

  if (!overlay || !title || !message || !list) {
    return Promise.reject(new Error("Preset chooser overlay was not found in viewer.html."));
  }

  title.textContent = options.title || "Choose view preset";
  message.textContent = options.message || "Select the start time and camera setup before the flight loads.";
  list.innerHTML = "";
  list.classList.add("choice-list");

  return new Promise(resolve => {
    for (const preset of VIEW_PRESETS) {
      list.appendChild(createChoiceButton({
        name: preset.label,
        badge: `${Math.round(preset.startRelT)} s`,
        meta: preset.description,
        onClick: () => {
          overlay.classList.add("hidden");
          list.classList.remove("choice-list");
          resolve(preset);
        },
      }));
    }

    overlay.classList.remove("hidden");
  });
}

function openFlightInViewer(flightId, methodId, options = {}) {
  const url = new URL("/viewer", window.location.origin);
  url.searchParams.set("flight", flightId);
  if (methodId) {
    url.searchParams.set("method", methodId);
  }
  if (options.mode) {
    url.searchParams.set("mode", options.mode);
  }
  if (options.presetId) {
    url.searchParams.set("preset", options.presetId);
  }

  // Only redirects created inside this viewer get a one-use, parameter-matched
  // context. Fresh boots and restored/copied /viewer?... URLs must still ask for
  // Presentation vs Normal App first.
  const internalLoadToken = createInternalLoadContext(flightId, methodId, options);
  if (internalLoadToken) {
    url.searchParams.set(INTERNAL_LOAD_TOKEN_PARAM, internalLoadToken);
  }

  window.location.replace(url.toString());
}

function showError(error) {
  console.error(error);

  const box = document.createElement("div");
  box.className = "error-box";
  box.textContent = error?.stack || error?.message || String(error);
  document.body.appendChild(box);
}

async function main() {
  installResponsiveOverlayLayout();

  const trustedInternalLoad = consumeTrustedInternalLoadContext();
  let appMode = trustedInternalLoad?.mode || null;

  // Fresh boot rule: always ask for Presentation vs Normal App first. URL mode,
  // flight, method, and preset parameters are ignored unless they were created by
  // openFlightInViewer() during this browser session and still exactly match the
  // one-use trusted context.
  if (!appMode) {
    appMode = await showModeChooser();
  } else {
    hideFlightOverlay();
  }

  const flights = await loadFlights();
  if (!flights.length) {
    await showFlightChooser(flights, {
      title: "No flights found",
      message: "Create track_output/flights.json and at least one methods/raw_adsb.json file, then reload the viewer.",
    });
    return;
  }

  const canUseUrlSelection = Boolean(trustedInternalLoad?.trustUrlSelection);

  let selection = null;
  if (appMode === APP_MODE_PRESENTATION) {
    selection = presentationSelection(flights, { trustUrlSelection: canUseUrlSelection });
  } else {
    selection = canUseUrlSelection ? selectionFromUrl(flights) : null;
    if (!selection) {
      selection = await showFlightChooser(flights, {
        title: "Select flight dataset and reconstruction method",
        message: "Choose the flight dataset and the reconstruction method to view.",
      });
    }
  }

  let selectedPreset = canUseUrlSelection ? presetFromUrl() : null;
  if (!selectedPreset) {
    selectedPreset = await showPresetChooser({
      title: "Choose startup view preset",
      message: "This preset will be applied before the selected flight starts playing.",
    });
  }

  hideSelectionOverlay();

  const payload = await loadPayload(selection.flightId, selection.methodId);

  document.title = payload.title || "ADS-B 3D Flight Viewer";
  document.getElementById("title").textContent = payload.title || "ADS-B 3D Flight Viewer";

  const state = new ViewerState(payload);
  state.appMode = appMode;
  state.selectedStartupPreset = selectedPreset;
  applyPresetToState(state, selectedPreset);

  const scene = new CesiumFlightScene("cesiumContainer", state);
  scene.initialize();

  const camera = new CameraController(scene.viewer, state);
  camera.installKeyboardHandlers();
  camera.installWheelHandler(document.getElementById("cesiumContainer"));

  const controls = new ControlPanel(state, scene);
  controls.mount();

  const hud = new DashboardUI(state, {
    onReset: async () => {
      state.playing = false;
      const allFlights = state.payload.availableFlights || flights;
      const chooserFlights = state.appMode === APP_MODE_PRESENTATION
        ? [findPresentationFlight(allFlights)].filter(Boolean)
        : allFlights;
      const selected = await showFlightChooser(chooserFlights, {
        title: state.appMode === APP_MODE_PRESENTATION
          ? "Select method for flight 4BAAD9"
          : "Select flight dataset and reconstruction method",
        message: state.appMode === APP_MODE_PRESENTATION
          ? "Presentation mode is locked to flight 4BAAD9. Choose another available reconstruction method for this same flight."
          : "Choose a flight dataset and method to reset and reload the viewer.",
        currentFlightId: state.payload.selectedFlightId,
        currentMethodId: state.payload.selectedMethodId,
      });
      const preset = await showPresetChooser({
        title: "Choose view preset",
        message: "Select the start time, speed, and camera setup for the reloaded flight.",
      });
      openFlightInViewer(selected.flightId, selected.methodId, {
        mode: state.appMode,
        presetId: preset.id,
      });
    },
  });
  hud.mount();

  const animation = new AnimationController(state, scene, camera, hud);
  animation.start();

  setInterval(() => {
    hud.syncButtons();
  }, 250);
}

main().catch(showError);
