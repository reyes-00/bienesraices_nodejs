(function() {
  const lat = document.querySelector("#lat").value || 19.4296737;
  const lng = document.querySelector("#lng").value || -99.1368588;
  const mapa = L.map('mapa').setView([lat, lng ], 16);
  let marker;

  //utilizar Provider y Geocoder
  const geocodeService = L.esri.Geocoding.geocodeService();

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mapa);

  marker = new L.marker([lat, lng],{
    draggable: true,
    autoPan: true
  })
  .addTo(mapa)

  //detectar el movimiento del pin
  marker.on("moveend", function(e) {
    marker = e.target
    const posicion = marker.getLatLng();
    mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));

    //Obtener la informacion de las calles 
    geocodeService.reverse().latlng(posicion,13).run(function(err, result){
      marker.bindPopup(result.address.LongLabel)
      
      //Llenar los campos 
      document.querySelector(".calle").textContent = result?.address?.Address ?? "";
      document.querySelector("#calle").value = result?.address?.Address ?? "";
      document.querySelector("#lat").value = result?.latlng?.lat ?? "";
      document.querySelector("#lng").value = result?.latlng?.lng ?? "";

    })
  })


})()