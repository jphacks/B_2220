<template>
  <v-app>
    <div id='map' style='width: 400px; height: 300px;' v-if="isMapboxWork"></div>
    <div class="p-map" v-if="!isMapboxWork">
      <iframe
          :src="mapRequestUrl"
          width="30px"
          height="30px"
          frameborder="0"
          style="border:0"
          allowfullscreen
      >
      </iframe>
    </div>
    <p v-if="!isExistLatlng">
      Not Found
    </p>
  </v-app>
</template>

<script>
import mapboxgl from 'mapbox-gl';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import firebase from "firebase/app";
import "firebase/firestore";

export default {
  name: "Map",
  data: () => ({
    isMapboxWork: true,
    isExistLatlng: true,
    userLocationArray: null,
    userStartPosition: null,
    mapRequestUrl: null,
  }),
  mounted() {
    const url = new URL(window.location.href);
    mapboxgl.accessToken = process.env.VUE_APP_MAPBOX_ACCESS_TOKEN;
    const db = firebase.firestore();
    var docRef = db.collection("users").doc(url.searchParams.get('uid')).collection("latlng").doc(url.searchParams.get('date'));
    docRef.get().then((doc)=>{
      if (doc.exists) {
        this.userStartPosition = doc.data().locationArray[0];
        this.userLocationArray = doc.data().locationArray.join(';').slice( 0, -1 );
        this.getMatch();
      }
      else{
        this.isExistLatlng = false;
      }
    })
  },
  methods: {
    addRoute(coords) {
      const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: [this.userStartPosition.split(',')[0], this.userStartPosition.split(',')[1]], // starting position [lng, lat]
        zoom: 15, // starting zoom
        projection: 'globe' // display the map as a 3D globe
      });
      map.on('style.load', () => {
        map.setFog({}); // Set the default atmosphere style
        if (map.getSource('route')) {
          map.removeLayer('route');
          map.removeSource('route');
        } else {
          // Add a new layer to the map
          map.addLayer({
            id: 'route',
            type: 'line',
            source: {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: coords
              }
            },
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#03AA46',
              'line-width': 8,
              'line-opacity': 0.8
            }
          });
        }
      });
    },
    async getMatch() {
      const query = await fetch(
          `https://api.mapbox.com/matching/v5/mapbox/walking/${this.userLocationArray}?geometries=geojson&steps=true&access_token=${mapboxgl.accessToken}`,
          {method: 'GET'}
      );
      const response = await query.json();
      // Handle errors
      if (response.code !== 'Ok') {
        this.isMapboxWork = false;
        this.mapRequestUrl = "https://maps.google.co.jp/maps?output=embed&q=" + this.userStartPosition.split(',')[1] + "," + this.userStartPosition.split(',')[0] + "&t=m&z=20"
        return;
      }
      // Get the coordinates from the response
      const coords = response.matchings[0].geometry;
      console.log(coords)
      // Draw the route on the map
      this.addRoute(coords);
    },
  }
}
</script>

<style scoped>

</style>