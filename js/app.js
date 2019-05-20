/**
 * Make clustering of markers with a custom theme
 *
 * Note that the maps clustering module http://js.api.here.com/v3/3.0/mapsjs-clustering.js
 * must be loaded to use the Clustering
 *
 * @param {H.Map} map A HERE Map instance within the application
 * @param {H.ui.UI} ui Default ui component
 * @param {Function} getBubbleContent Function returning detailed information about photo
 * @param {Array.<Object>} data Raw data containing information about each photo
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
   * CLICK/TAP event handler for our markers. That marker can represent either a single photo or
   * a cluster (group of photos)
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
  
  //Step 2: initialize a map  - not specificing a location will give a whole world view.
  var map = new H.Map(document.getElementById('map'),
    defaultLayers.normal.map);
  
  //Step 3: make the map interactive
  // MapEvents enables the event system
  // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
  var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
  
  // Create the default UI components
  var ui = H.ui.UI.createDefault(map, defaultLayers);
  
  // Now use the map as required...
  moveMapToBerlin(map);
  
  function moveMapToBerlin(map,op,position){
    if(op===1){
      console.log(position);
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
    // Ensure that the marker can receive drag events
    marker.draggable = true;
    map.addObject(marker);
    markerAnt=marker;
    moveMapToBerlin(map,1,position);
   }else{
     map.removeObject(markerAnt);
     marker = new H.map.Marker({lat: position.coords.latitude , lng:position.coords.longitude}, { icon: icon },{optimized:false});
     // Ensure that the marker can receive drag events
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
          // Author info may be missing
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
  
  // Step 5: Request data that will be visualized on a map.
  //
  //  For convenience we have included the jQuery library to make an AJAX call to do this.
  //  For more information see: http://api.jquery.com/jQuery.getJSON/
  //
  //  The jQuery library is available under an MIT license  https://jquery.org/license/
  //
  function loadPoint(){
    jQuery.getJSON("data/pointJson.json", function (data) {
      startClustering(map, ui, getBubbleContent, data);
    });
  }
