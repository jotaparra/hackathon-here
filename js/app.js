const showRrss = document.getElementById("showRrss");

showRrss.addEventListener("click", () => {
  document.getElementsByClassName("mostrar-logos")[0].classList.remove("mostrar-logos");
})

//HACIA ABAJO CODIGO DE MARCELA
/**
* Hacer agrupación de marcadores con un tema personalizado.
*
* Tenga en cuenta que el módulo de agrupación de mapas http://js.api.here.com/v3/3.0/mapsjs-clustering.js
* Debe cargarse para usar el Clustering
 *
 * @param {H.Map} map Una instancia de mapa AQUÍ dentro de la aplicación
 * @param {H.ui.UI} ui Componente ui predeterminado
 * @param {Function} getBubbleContent Función que devuelve información detallada sobre la foto.
 * @param {Array.<Object>} data Datos crudos que contienen información sobre cada foto.
 */
let firstPosition=0;
function startClustering(map, ui, getBubbleContent, data) {
    var dataPoints = data.map(function (item) {
      return new H.clustering.DataPoint(item.latitude, item.longitude, null, item);
    });
    var clusteredDataProvider = new H.clustering.Provider(dataPoints, {
      clusteringOptions: {
        eps: 64,
        minWeight: 3
      },
      theme: CUSTOM_THEME
    });
    var layer = new H.map.layer.ObjectLayer(clusteredDataProvider);
    map.addLayer(layer);
  }
  var CUSTOM_THEME = {
    getClusterPresentation: function (cluster) {
      var randomDataPoint = getRandomDataPoint(cluster),
        data = randomDataPoint.getData();
        
      var clusterMarker = new H.map.Marker(cluster.getPosition(), {
        icon: new H.map.Icon(data.thumbnail, {
          size: {w: 50, h: 50},
          anchor: {x: 25, y: 25}
        }),
  
        min: cluster.getMinZoom(),
        max: cluster.getMaxZoom()
      });
  
      clusterMarker.setData(data)
        .addEventListener('tap', onMarkerClick);
  
      return clusterMarker;
    },
    getNoisePresentation: function (noisePoint) {
      var data = noisePoint.getData(),
        noiseMarker = new H.map.Marker(noisePoint.getPosition(), {
          min: noisePoint.getMinZoom(),
          icon: new H.map.Icon(data.thumbnail, {
            size: {w: 20, h: 20},
            anchor: {x: 10, y: 10}
          })
        });
      noiseMarker.setData(data);
      noiseMarker.addEventListener('tap', onMarkerClick);
  
      return noiseMarker;
    }
  };

  function getRandomDataPoint(cluster) {
    var dataPoints = [];
    cluster.forEachDataPoint(dataPoints.push.bind(dataPoints));
    return dataPoints[Math.random() * dataPoints.length | 0];
  }
  
  /** 
* Controlador de eventos CLICK / TAP para nuestros marcadores. Ese marcador puede representar una sola foto o
   * un grupo (grupo de fotos)
   * @this {H.map.Marker}
   */
  function onMarkerClick() {
    var position = this.getPosition(),
      data = this.getData(),
      bubbleContent = getBubbleContent(data),
      bubble = onMarkerClick.bubble;
    if (!bubble) {
      bubble = new H.ui.InfoBubble(position, {
        content: bubbleContent
      });
      ui.addBubble(bubble);
      onMarkerClick.bubble = bubble;
    } else {
      bubble.setPosition(position);
      bubble.setContent(bubbleContent);
      bubble.open();
    }
  
    map.setCenter(position, true);
  }
  
  var platform = new H.service.Platform({
    app_id: 'F8lTznIEpvu1Y1DxFWOo',
    app_code: 'gEEMm8jLc9T1F8TOVfUmJg',
    useCIT: true,
    useHTTPS: true
  });
  var defaultLayers = platform.createDefaultLayers();
   
// Paso 2: inicialice un mapa, no especificar una ubicación le dará una visión global.
  var map = new H.Map(document.getElementById('map'),
    defaultLayers.normal.map);
  
// Paso 3: hacer el mapa interactivo
  // MapEvents habilita el sistema de eventos
  // Comportamiento implementa interacciones predeterminadas para panorámica / zoom (también en entornos táctiles móviles)
  var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
  
// Crear los componentes de la interfaz de usuario predeterminados
  var ui = H.ui.UI.createDefault(map, defaultLayers);
  
// Ahora usa el mapa como se requiere ...
  moveMapToBerlin(map);
  
  function moveMapToBerlin(map,op,position){
    if(op===1){
      map.setCenter({lat: position.coords.latitude , lng:position.coords.longitude});
      map.setZoom(16);
    }
  }

  function circlePoint(time) {
    var radius = 0.01;
    var x = Math.cos(time) * radius;
    var y = Math.sin(time) * radius;
    return {lat:window.lat + y, lng:window.lng + x};
  };

  function showMarker(){
    navigator.geolocation.getCurrentPosition(showPosition);
    loadPoint();
 setInterval(function(){navigator.geolocation.getCurrentPosition(showPosition);},3000);

  }
  var marker=0;
  var markerAnt=0;
  function showPosition(position){
   
   var icon= new H.map.Icon("./img/icon.gif", {
      size: {w: 20, h: 20},
      anchor: {x: 10, y: 10}
    });
   if(marker === 0){
    marker = new H.map.Marker({lat: position.coords.latitude , lng:position.coords.longitude}, { icon: icon},{optimized:false});
// Asegúrate de que el marcador pueda recibir eventos de arrastre
    marker.draggable = true;
    map.addObject(marker);
    markerAnt=marker;
    moveMapToBerlin(map,1,position);
   }else{
     map.removeObject(markerAnt);
     marker = new H.map.Marker({lat: position.coords.latitude , lng:position.coords.longitude}, { icon: icon },{optimized:false});
     
// Asegúrate de que el marcador pueda recibir eventos de arrastre
     marker.draggable = true;
     map.addObject(marker);
     markerAnt=marker;
   }
  }
    
  function getBubbleContent(data) {
    return [
      '<div class="bubble">',
        '<a class="bubble-image" ',
          'style="background-image: url(', data.fullurl, ')" ',
          'href="', data.url, '" target="_blank">',
        '</a>',
        '<span>',
         
// Puede que falte la información del autor
          data.author ? ['Photo by: ', '<a href="//commons.wikimedia.org/wiki/User:',
            encodeURIComponent(data.author), '" target="_blank">',
            data.author, '</a>'].join(''):'',
          '<hr/>',
          '<a class="bubble-footer" href="//commons.wikimedia.org/" target="_blank">',
            '<img class="bubble-logo" src="img/wikimedia-logo.png" />',
            '<span class="bubble-desc">',
            'Photos provided by Wikimedia Commons are <br/>under the copyright of their owners.',
            '</span>',
          '</a>',
        '</span>',
      '</div>'
    ].join('');
  }

 function routButoon(){
  var routingParameters = {
    // The routing mode:
    'mode': 'fastest;car',
    // punto de inicio
    'waypoint0': 'geo!-33.595715,-70.585197',
    // punto de llegada
    'waypoint1': 'geo!-33.414625,-70.649315',
    // To retrieve the shape of the route we choose the route
    // representation mode 'display'
    'representation': 'display',
    'trafficMode':'enabled'
  };
  
  // Define a callback function to process the routing response:
  var onResult = function(result) {
    console.log(result);
    var route,
      routeShape,
      startPoint,
      endPoint,
      linestring;
    if(result.response.route) {
    // Pick the first route from the response:
    route = result.response.route[0];
    // Pick the route's shape:
    routeShape = route.shape;
  
    // Create a linestring to use as a point source for the route line
    linestring = new H.geo.LineString();
  
    // Push all the points in the shape into the linestring:
    routeShape.forEach(function(point) {
      var parts = point.split(',');
      linestring.pushLatLngAlt(parts[0], parts[1]);
    });
  
    // Retrieve the mapped positions of the requested waypoints:
    startPoint = route.waypoint[0].mappedPosition;
    endPoint = route.waypoint[1].mappedPosition;
  
    // Create a polyline to display the route:
    var routeLine = new H.map.Polyline(linestring, {
      style: {lineWidth: 8 },
      arrows: { fillColor: 'white', frequency: 4, width: 0.8, length: 0.7 }
    });
  
    // Create a marker for the start point:
    var startMarker = new H.map.Marker({
      lat: startPoint.latitude,
      lng: startPoint.longitude
    });
  
    // Create a marker for the end point:
    var endMarker = new H.map.Marker({
      lat: endPoint.latitude,
      lng: endPoint.longitude
    });
  
    // Add the route polyline and the two markers to the map:
    map.addObjects([routeLine, startMarker, endMarker]);
  
    // Set the map's viewport to make the whole route visible:
    map.setViewBounds(routeLine.getBounds());
    }
  };
  
  
// Obtener una instancia del servicio de enrutamiento:
  var router = platform.getRoutingService();
  
// Llame a calculaRoute () con los parámetros de enrutamiento,
  // la devolución de llamada y una función de devolución de llamada de error (llamada si
  // se produce un error de comunicación):
  router.calculateRoute(routingParameters, onResult,
    function(error) {
      alert(error.message);
    });
 }
 
// Paso 5: Solicitar datos que se visualizarán en un mapa.
  //
  // Para mayor comodidad, hemos incluido la biblioteca jQuery para hacer una llamada AJAX para hacer esto.
  // Para obtener más información, consulte: http://api.jquery.com/jQuery.getJSON/
  //
  // La biblioteca jQuery está disponible bajo una licencia MIT https://jquery.org/license/
  //
  function loadPoint(){
    jQuery.getJSON("data/pointJson.json", function (data) {
      startClustering(map, ui, getBubbleContent, data);
    });
  }
