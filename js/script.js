document.addEventListener('DOMContentLoaded', () => {
  // 1. Crear el mapa y añadir capa base OSM
  const map = L.map('map');
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // 2. Cargar el GeoJSON
  fetch('data/Estados_1.geojson')
    .then(res => res.json())
    .then(data => {
      // 3. Añadirlo al mapa con popups automáticos
      const layer = L.geoJSON(data, {
        style: { color: '#3388ff', weight: 2, fillOpacity: 0.2 },
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
      // 4. Centrar y hacer zoom al límite del GeoJSON
      map.fitBounds(layer.getBounds());
    })
    .catch(err => console.error('Error cargando GeoJSON:', err));
});
