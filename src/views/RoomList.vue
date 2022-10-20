<template>
  <v-app id="inspire">
    <v-app-bar
        app
    >
      安心夜道
    </v-app-bar>
  <v-main>
    <v-container>
      <v-row class="display:flex">
        <div>
        <v-col>
          <div class="d-block pa-2">
            <p><b>1.緊急連絡先を入力してください</b></p>
              <v-text-field
                v-model='phoneNumber'
                label='電話番号を入力してください'
                required
                prepend-icon="mdi-phone"
                clearable
              ></v-text-field>
          </div>
        </v-col>
        <v-col>
          <div class="d-block pa-2">
            <p><b>2.あなたの名前を入力してください</b></p>
              <v-text-field
                v-model='name'
                label='名前を入力してください'
                required
                prepend-icon="mdi-account"
                clearable
              ></v-text-field>
          </div>
        </v-col>
        <v-col>
          <div class="d-block pa-2">
          <p><b>3.位置情報の取得を許可してください</b></p>
              <v-btn
                class="ma-2"
                color="secondary"
                @click="getLocation"
              >
                <v-icon>
                  mdi-map-marker
                </v-icon>
                位置情報を取得する
              </v-btn>
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
        </v-col>
        <v-col>
          <div class="d-block pa-2">
            <p><b>4.フェイク通話を開始するボタンを押してください</b></p>
              <div class="text-center">
                <v-btn
                  class="ma-2"
                  color="secondary"
                  @click="saveData"
                >
                  <v-icon>
                    mdi-phone-in-talk
                  </v-icon>
                  フェイク通話を開始する
                </v-btn>
              </div>
          </div>
        </v-col>
          </div>
      </v-row>
    </v-container>
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
    saveData: function() { // sessionStorageへ保存する
      sessionStorage.setItem('name', this.name); 
      sessionStorage.setItem('phoneNumber', this.phoneNumber); 
      sessionStorage.setItem('googleMapUrl', 'https://maps.google.co.jp/maps?ll=' + this.latitude + ',' + this.longitude);
      this.$router.push('/Call');
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
