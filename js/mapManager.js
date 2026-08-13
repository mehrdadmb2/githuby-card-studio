// ============================================================
//  MAP MANAGER – Leaflet map with marker
// ============================================================
const MapManager = (function() {
  let map = null;
  let marker = null;
  let onPositionChange = null;

  function init(containerId, lat = 35.6892, lng = 51.3890, onChange) {
    if (map) {
      map.invalidateSize();
      return;
    }
    onPositionChange = onChange;
    map = L.map(containerId).setView([lat, lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);

    marker = L.marker([lat, lng], { draggable: true }).addTo(map);

    marker.on('dragend', function(e) {
      const pos = marker.getLatLng();
      if (onPositionChange) onPositionChange(pos.lat, pos.lng);
    });

    map.on('click', function(e) {
      const pos = e.latlng;
      marker.setLatLng(pos);
      if (onPositionChange) onPositionChange(pos.lat, pos.lng);
    });
  }

  function setPosition(lat, lng) {
    if (map && marker) {
      map.setView([lat, lng], 13);
      marker.setLatLng([lat, lng]);
    }
  }

  function invalidateSize() {
    if (map) map.invalidateSize();
  }

  return {
    init,
    setPosition,
    invalidateSize
  };
})();

window.MapManager = MapManager;
