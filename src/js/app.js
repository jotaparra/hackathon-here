

//HACIA ABAJO CODIGO DE MARCELA
/**
* Hacer agrupación de marcadores con un tema personalizado.
*
* Tenga en cuenta que el módulo de agrupación de mapas http://js.api.here.com/v3/3.0/mapsjs-clustering.js
* Debe cargarse para usar el Clustering
 *
 * @param {H.Map} map Una instancia de mapa HERE dentro de la aplicación
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
function init(){
  document.getElementById("splash").style.display="Block";
  setTimeout(() => {
    document.getElementById("splash").style.display="none";
    
  }, 3000);
  setTimeout(() => {
  
    document.getElementById("loggin").style.display="block";
  }, 3000);
  showMarker();

}
document.getElementById("loginU").addEventListener("click",hideLogin);
function hideLogin(){
  document.getElementById("sesion").style.display="none";
}
  document.getElementById("singIn").addEventListener("click",showPage);
  function showPage(){
    document.getElementById("loggin").style.display="none";
    document.getElementById("sesion").style.display="block";
    showMarker();
  }
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
  let resp=1;
  function getBubbleContent(data) {
    
    //preguntar si la ubicacion es cercana o lejana y dibujar un tipo u otro de card
    if(resp===1){
      return [
        '<div id="card" class="row minh-100 justify-content-center">',
        '<div class="col-10 mt-3 col-md-4 postal text-center">',
            '<p class="titulo-postal pt-3"><span class="morado">Barrio Recoleta</span><br>',
                'Cementerio general',
            '</p>',
           '<img class="img-postal" src="./img/imagen-ejemplo.png" alt="imagen ejemplo">',
            '<div class="row pt-2">',
                '<div class="col-5 offset-1">',
                    '<p class="subtitulo-postal">',
                        'Horario',
                    '</p>',
                    '<p class="texto-postal">',
                        'Lunes a domingo',
                        '9:00 a 17:30 hrs.',
                    '</p>',
                '</div>',
                '<div class="col-6">',
                    '<p class="subtitulo-postal">',
                        'Dirección',
                    '</p>',
                    '<p class="texto-postal">',
                        'Prof. Zañartu 951,',
                        'Recoleta, Santiago',
                    '</p>',
                '</div>',
            '</div>',
            '<div class="box-iconos pt-3">',
                '<img src="./img/accesibilidad.png" alt="">',
                '<img src="./img/gratis.png" alt="">',
                '<img src="./img/banos.png" alt="">',
            '</div>',
            '<div>',
                '<button type="button" class="text-center col-10 mt-3 btn-registrar" id="comoLlegar" onclick="routButoon()">¿Cómo llegar?</button>',
            '</div>',
        '</div>',
    '</div>',
      ].join('');
    }
    else{
      return [
        '<div id="ganaste" class="row minh-100 justify-content-center">',
        '<div class="col-10 mt-3 col-md-4 postal text-center">',
            '<p class="mensajes pt-3 pb-0 mb-0">Llegaste al punto:',
                '<h3> Cementerio general </h3>',
            '</p>',
            '<img src="./img/trofeo.png" alt="imagen ejemplo">',
           '<p class="mensajes pt-3 pb-0 mb-0">¡Ganaste tu primera medalla!</p>',
            '<p class="miniatura pt-2">El cementerio general fuen fundado 9 de diciembre de 1821, <span class="bold">¡ya',
                    'tiene 197 años!</span></p>',
            '<div class="box-iconos pt-1">',
                '<img src="./img/accesibilidad.png" alt="">',
                '<img src="./img/gratis.png" alt="">',
                '<img src="./img/banos.png" alt="">',
            '</div>',
            '<div>',
                '<button type="button" class="text-center col-10 mt-3 btn-registrar" id="explorar">Explorar</button>',
            '</div>',
        '</div>',
    '</div>',
      ].join('');
    }
  }


  //INICIO ENCONTRAR RUTA
 function routButoon(){
  resp=2;
   //-33.362357, -70.726141   cementerio -33.414625,-70.649315
  var routingParameters = {   
// El modo de enrutamiento:
    'mode': 'fastest;car',
    // punto de inicio
    'waypoint0': 'geo!-33.595715,-70.585197',
    // punto de llegada
    'waypoint1': 'geo!-33.362357,-70.726141',
  
// Para recuperar la forma de la ruta elegimos la ruta
    // modo de representación 'display'
    'representation': 'display',
    'trafficMode':'enabled'
  };
  
// Definir una función de devolución de llamada para procesar la respuesta de enrutamiento:
  var onResult = function(result) {
    console.log(result);
    var route,
      routeShape,
      startPoint,
      endPoint,
      linestring;
    if(result.response.route) {
    
// Escoge la primera ruta de la respuesta
    route = result.response.route[0];
  // Escoge la forma de la ruta:
    routeShape = route.shape;
  
    
// Crear una serie lineal para usar como fuente puntual para la línea de ruta
    linestring = new H.geo.LineString(); 
    
// Empuje todos los puntos en la forma en la cadena lineal:
    routeShape.forEach(function(point) {
      var parts = point.split(',');
      linestring.pushLatLngAlt(parts[0], parts[1]);
    });
  
// Recuperar las posiciones mapeadas de los puntos de ruta solicitados:
    startPoint = route.waypoint[0].mappedPosition;
    endPoint = route.waypoint[1].mappedPosition;
  
    
// Crear una polilínea para mostrar la ruta:
    var routeLine = new H.map.Polyline(linestring, {
      style: {lineWidth: 8 },
      arrows: { fillColor: 'white', frequency: 4, width: 0.8, length: 0.7 }
    });
   
// Crear un marcador para el punto de inicio:
    var startMarker = new H.map.Marker({
      lat: startPoint.latitude,
      lng: startPoint.longitude
    });
  
// Crear un marcador para el punto final:
    var endMarker = new H.map.Marker({
      lat: endPoint.latitude,
      lng: endPoint.longitude
    });
  
// Añadir la polilínea de la ruta y los dos marcadores al mapa:
    map.addObjects([routeLine, startMarker, endMarker]); 
  
// Establezca la ventana gráfica del mapa para que toda la ruta sea visible:
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
 //FIN ENCONTRAR RUTA

// Paso 5: Solicitar datos que se visualizarán en un mapa.
  // Para mayor comodidad, hemos incluido la biblioteca jQuery para hacer una llamada AJAX para hacer esto.
  // Para obtener más información, consulte: http://api.jquery.com/jQuery.getJSON/
  // La biblioteca jQuery está disponible bajo una licencia MIT https://jquery.org/license/

  function loadPoint(){
    console.log("leyebdo puntos");
    $.getJSON("data/pointJson.json", function (data) {
      startClustering(map, ui, getBubbleContent, data);
    });
  }
  