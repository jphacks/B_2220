<template>
  <v-card
    class="mx-auto"
    style="max-width: 500px;"
  >
  <!-- <v-main>
  <v-container> -->
    <v-system-bar
        color="deep-purple darken-4"
        dark
      >
        <v-spacer></v-spacer>
        <v-icon small>
          mdi-square
        </v-icon>
        <v-icon
          class="ml-1"
          small
        >
          mdi-circle
        </v-icon>
        <v-icon
          class="ml-1"
          small
        >
          mdi-triangle
        </v-icon>
    </v-system-bar>

    <v-toolbar 
      color="deep-purple accent-4"
      cards
      dark
      flat
    >
      <v-btn icon>
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-card-title class="text-h6 font-weight-regular">
        あんしん夜道
      </v-card-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-toolbar>

    <v-form
      ref="form"
      v-model="form"
      class="pa-4 pt-6"
    >

    <v-col>
      <div class="d-block pa-2">
        <br>
        <p style="text-align:left">1.緊急連絡先を入力してください</p>
        <br>
        <v-text-field
            v-model='phoneNumber'
            filled
            color="deep-purple"
            prepend-inner-icon="mdi-phone"
            label="電話番号"
            clearable
          ></v-text-field>
      </div>
    </v-col>
    <v-col>
      <div class="d-block pa-2">
        <p style="text-align:left">2.あなたの名前を入力してください</p>
        <br>
        <v-text-field
          v-model='name'
          filled
          required
          color="deep-purple"
          prepend-inner-icon="mdi-account"
          label="名前"
          clearable
        ></v-text-field>
      </div>
    </v-col>
    <v-col>
      <div class="d-block pa-2">
        <p style="text-align:left">3.位置情報の取得を許可してください</p>
        </br><br>
        <v-btn
          class="ma-2"
          color="deep-purple"
          @click="getLocation"
        >
          <v-icon>
            mdi-map-marker
          </v-icon>
          位置情報を取得する
        </v-btn>
      </div>
      </br><br>
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
      <br></br>
    </v-col>
    <v-col>
      <div class="d-block pa-2">
        <p style="text-align:left">4.フェイク通話を開始するボタンを押してください</p>
        </br><br>
        <div class="text-center">
                <v-btn
                  class="ma-2"
                  color="deep-purple"
                  @click="saveData"
                >
                  <v-icon>
                    mdi-phone-in-talk
                  </v-icon>
                  フェイク通話を開始する
                </v-btn>
          </div>
          <br></br>
      </div>
    </v-col>

    </v-form>
  <!-- </v-container>
  </v-main> -->
  </v-card>
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
