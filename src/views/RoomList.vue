<template>
  <v-app id="inspire">
    <sidebar/>
    <!-- <v-app-bar
        app
        shrink-on-scroll
    >
      <CreateRoom />
    </v-app-bar> -->
  <v-main>
  <v-form v-model="valid">
    <v-container>
      <v-row class="display:flex">
        <div>
        <div class="d-block pa-2">
          <p>{{ phoneNumber }}</p>
          <p>1.発信する電話番号を入力してください</p>
            <v-text-field
              v-model='phoneNumber'
              label='電話番号を入力してください'
              required
            ></v-text-field>
        </div>
 
        <div class="d-block pa-2">
          <p>{{ name }}</p>
          <p>2.あなたの名前を入力してください</p>
            <v-text-field
              v-model='name'
              label='名前を入力してください'
              required
            ></v-text-field>
        </div>
        
        <div class="d-block pa-2">
          <p>3.位置情報の取得を許可してください</p>
          <template>
            <div>
              <v-btn
                class="ma-2"
                :loading="loading"
                :disabled="loading"
                color="secondary"
                @click="getLocation"
              >
                位置情報を取得する
              </v-btn>
              <p>{{ latitude }}</p>
              <p>{{ longitude }}</p>

            </div>
          </template>
        </div>
          <div class="p-map">
            <iframe
              :src="this.mapRequestUrl"
              width="100%"
              height="auto"
              frameborder="0"
              style="border:0"
              allowfullscreen
            >
            </iframe>
          </div>
          </div>
        <div class="d-block pa-2">
          <p>4.フェイク通話を開始するボタンを押してください</p>
            <div class="text-center">
              <v-btn
                class="ma-2"
                :loading="loading"
                :disabled="loading"
                color="secondary"
                @click="saveData"
              >
                発信する
              </v-btn>
            </div>
        </div>
      </v-row>
    </v-container>
  </v-form>
</v-main>
  </v-app>
</template>

<script>
// import Sidebar from '@/components/layouts/Sidebar'
// import CreateRoom from '@/components/modal/CreateRoom'
import firebase from "@/firebase/firebase"

export default {
  /* components: {
    Sidebar,
    CreateRoom
  },*/
  data: () => ({
    rooms: [],
    name: '',
    phoneNumber: '',
    latitude: 0,
    longitude: 0,
    mapRequestUrl: "https://maps.google.co.jp/maps?output=embed&q=" + 0 + "," + 0 + "&t=m&z=20",
    ringtone: new Audio(require('@/assets/ringtone/ringtone2.mp3'))
  }),
  mounted() {

    this.getRooms()

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position){
          let coords = position.coords;
          // 緯度経度だけ取得
          this.latitude = coords.latitude;
          this.longitude = coords.longitude;
        }.bind(this),
        function(error) {
          console.error(error);
        }
      );
    } else {
        console.error("Geolocation APIに対応していません");
    }

  },
  watch: {
    latitude: {
      handler: function (val) {
        this.mapRequestUrl = 'https://maps.google.co.jp/maps?output=embed&q=' + val + ',' + this.longitude + '&t=m&z=20'
      }
    },
    longitude: {
      handler: function (val) {
        this.mapRequestUrl = 'https://maps.google.co.jp/maps?output=embed&q=' + this.latitude + ',' + val + '&t=m&z=20'
      }
    }
  },
  methods: {

    async getRooms() {
      this.rooms = []
      const roomRef = firebase.firestore().collection("rooms")
      const snapshot = await roomRef.get()
      console.log("snapshot", snapshot)
      // snapshot.forEach(doc => {
      //   console.log(doc.data())
      // })

      snapshot.docs.map(doc => {
        // const data = {
        //   name: doc.data().name,
        //   thumbnailUrl: doc.data().thumbnailUrl,
        //   createdAt: doc.data().createdAt
        // }

        const data = {...doc.data()}
        data.id = doc.id
        console.log(data)
        this.rooms.push(data)
      })
      console.log(this.rooms)
    },

    getLocation: function() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function(position){
            let coords = position.coords;
            // 緯度経度だけ取得
            this.latitude = coords.latitude;
            this.longitude = coords.longitude;
          }.bind(this),
          function(error) {
            console.error(error);
          }
        );
      } else {
          console.error("Geolocation APIに対応していません");
      }
    },
    saveData: function() {
      sessionStorage.setItem('name', this.name); // 👈 sessionStorageへ保存
      sessionStorage.setItem('phoneNumber', this.phoneNumber); // 👈 sessionStorageへ保存
    }
  }
}
</script>

<style>
.p-map {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
}
.p-map iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
