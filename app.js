if (!window.TECTONIC_PLATES_GEOJSON || !window.DRAINAGE_DIVIDES_LEGACY_GEOJSON || !window.DRAINAGE_DIVIDES_GEOJSON) {
  throw new Error("Layer data is missing. Check ./data/*.js");
}

const map = L.map("map", {
  worldCopyJump: true,
  preferCanvas: true,
  zoomSnap: 0.25,
  minZoom: 2,
  maxZoom: 13
}).setView([20, 0], 2.25);

L.control.zoom({ position: "bottomright" }).addTo(map);
L.control.scale({ imperial: false }).addTo(map);

const oceanDepth = L.tileLayer(
  "https://services.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}",
  {
    maxZoom: 10,
    opacity: 0.62,
    attribution: "Tiles: Esri Ocean"
  }
);

const worldPhysical = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}",
  {
    maxZoom: 8,
    opacity: 0.38,
    attribution: "Tiles: Esri World Physical"
  }
);

const hillshade = L.tileLayer(
  "https://services.arcgisonline.com/ArcGIS/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}",
  {
    maxZoom: 13,
    opacity: 0.3,
    attribution: "Tiles: Esri World Hillshade"
  }
);

L.layerGroup([oceanDepth, worldPhysical, hillshade]).addTo(map);

const lineRenderer = L.canvas({ padding: 0.5 });

const tectonicLayer = L.geoJSON(window.TECTONIC_PLATES_GEOJSON, {
  renderer: lineRenderer,
  interactive: false,
  style: {
    color: "#a61c10",
    weight: 2.4,
    opacity: 0.98
  }
}).addTo(map);

const drainageLegacyLayer = L.geoJSON(window.DRAINAGE_DIVIDES_LEGACY_GEOJSON, {
  renderer: lineRenderer,
  interactive: false,
  style: {
    color: "#0b2f89",
    weight: 1.8,
    opacity: 0.94
  }
}).addTo(map);

const drainageDetailLayer = L.geoJSON(window.DRAINAGE_DIVIDES_GEOJSON, {
  renderer: lineRenderer,
  interactive: false,
  style: {
    color: "#0b2f89",
    weight: 1.1,
    opacity: 0.15
  }
}).addTo(map);

const tectonicToggle = document.getElementById("tectonic-toggle");
const drainageLegacyToggle = document.getElementById("drainage-legacy-toggle");
const drainageDetailToggle = document.getElementById("drainage-detail-toggle");

tectonicToggle.addEventListener("change", () => {
  if (tectonicToggle.checked) {
    tectonicLayer.addTo(map);
    return;
  }
  tectonicLayer.removeFrom(map);
});

drainageLegacyToggle.addEventListener("change", () => {
  if (drainageLegacyToggle.checked) {
    drainageLegacyLayer.addTo(map);
    return;
  }
  drainageLegacyLayer.removeFrom(map);
});

drainageDetailToggle.addEventListener("change", () => {
  if (drainageDetailToggle.checked) {
    drainageDetailLayer.addTo(map);
    return;
  }
  drainageDetailLayer.removeFrom(map);
});
