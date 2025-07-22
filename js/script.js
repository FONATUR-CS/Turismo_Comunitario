document.addEventListener('DOMContentLoaded', () => {
  // 1. Crear el mapa centrado (aprox.) y capa base
  const map = L.map('map').setView([23.0, -102.0], 5);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // 2. Cargar tu nuevo GeoJSON
  fetch('data/Estados_1.geojson')
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      // 3. Añadir GeoJSON al mapa con estilo y popups dinámicos
      const layer = L.geoJSON(data, {
        style: {
          color: '#006400',
          weight: 2,
          fillOpacity: 0.3
        },
        onEachFeature: (feature, lyr) => {
          const p = feature.properties;
          let html = '<table>';
          for (let key in p) {
            html += `<tr><th>${key}</th><td>${p[key]}</td></tr>`;
          }
          html += '</table>';
          lyr.bindPopup(html);
        }
      }).addTo(map);

      // 4. Ajustar vista al bounding box
      if (layer.getBounds().isValid()) {
        map.fitBounds(layer.getBounds());
      } else {
        console.warn('Bounds inválidos; mantiene vista inicial.');
      }
    })
    .catch(err => {
      console.error('Error cargando/parsing GeoJSON:', err);
      alert('No se pudo cargar el GeoJSON. Revisa la consola.');
    });
});
