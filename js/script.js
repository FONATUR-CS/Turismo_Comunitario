document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM cargado, arrancando Leaflet…');

  // 1. Inicializa el mapa con vista genérica
  const map = L.map('map').setView([23.0, -102.0], 5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // 2. Intenta cargar el GeoJSON
  const url = 'data/Estados_1.geojson';
  console.log('Fetch GeoJSON desde:', url);

  fetch(url)
    .then(res => {
      console.log('Fetch status:', res.status, res.statusText);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log('GeoJSON recibido:', data);
      if (!data.features || !data.features.length) {
        console.error('¡GeoJSON sin features o mal formado!');
        return;
      }
      console.log('Número de features:', data.features.length);

      // 3. Añade al mapa
      const layer = L.geoJSON(data, {
        style: { color: '#006400', weight: 2, fillOpacity: 0.3 },
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

      // 4. Ajusta la vista
      const bounds = layer.getBounds();
      console.log('Bounds:', bounds);
      if (bounds.isValid()) {
        map.fitBounds(bounds);
      } else {
        console.warn('Bounds inválidos, mantengo zoom inicial.');
      }
    })
    .catch(err => {
      console.error('Error al cargar/parsing GeoJSON:', err);
      alert('Revisa la consola: no se pudo cargar el GeoJSON.');
    });
});
