<template>
  <v-app>
  <v-card
    style="max-width: auto; max-height: auto; "
    mt-0
    pa-0
  >

    
    <v-toolbar
      class="bar-gra"
      cards
      dark
      flat
    >
      <v-card-title class="text-h6 font-weight-bold">
        あんしん夜道
      </v-card-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-main>
    <v-sheet
      class="pa-4 pt-6"
    >
    <v-col>
      <div class="d-block pa-2">
        <p style="text-align:left; margin: 15px 0px;">1.緊急連絡先を入力してください</p>
        <p style="text-align:left; font-size: 70%;"> ※ハイフンなし・半角数字で入力してください。</p>
        <v-text-field
            v-model='phoneNumber'
            filled
            prepend-inner-icon="mdi-phone"
            label="電話番号"
            clearable
          ></v-text-field>
      </div>
    </v-col>
    <v-col>
      <div class="d-block pa-2">
        <p style="text-align:left; margin: 15px 0px;">2.あなたの名前を入力してください</p>
        <v-text-field
          v-model='name'
          filled
          required
          prepend-inner-icon="mdi-account"
          label="名前"
          clearable
        ></v-text-field>
      </div>
    </v-col>
    <v-col>
      <div class="d-block pa-2">
        <p style="text-align:left; margin: 20px 0px;">3.位置情報の取得を許可してください</p>
        <div>
        <div style="margin: 20px 0px;">
        <v-btn
          class="ma-2"
          color="#ECEFF1"
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
              width="30px"
              height="30px"
              frameborder="0"
              style="border:0"
              allowfullscreen
            >
            </iframe>
        </div>
        </div>
    </div>
    </v-col>
    <v-col>
      <div class="d-block pa-2">
        <p style="text-align:left; margin: 20px 0px;;">4.フェイク通話を開始するボタンを押してください</p>
        <div class="text-center">
          <div style="margin: 20px 0px;">
                <v-btn
                  class="ma-2"
                  color="#ECEFF1"
                  @click="saveData"
                >
                  <v-icon>
                    mdi-phone-in-talk
                  </v-icon>
                  フェイク通話を開始する
                </v-btn>
            </div>
          </div>
      </div>
    </v-col>
    </v-sheet>
    </v-main>
  </v-card>
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
    user: null,
    rooms: [],
    name: '',
    phoneNumber: '',
    latitude: 0,
    longitude: 0,
    mapRequestUrl: "https://maps.google.co.jp/maps?output=embed&q=" + 0 + "," + 0 + "&t=m&z=20",
    ringtone: new Audio(require('@/assets/ringtone/ringtone2.mp3'))
  }),
  mounted() {
    // キャッシュからユーザー情報を取得
    this.user = JSON.parse(sessionStorage.getItem('user'))
    this.name = this.user.displayName
    this.phoneNumber = this.user.phoneNumber
    console.log("user ", this.user.name, this.user.phoneNumber);

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
    name(newValue) {
      console.log("name changed", newValue);
      // this.name = this.user.name
    },
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
    // sessionStorageへ保存する
    saveData: function() {
      // オブジェクトに保存しているので、'name' 'phoneNumber' は使わない。
      // sessionStorage.setItem('name', this.name);
      // sessionStorage.setItem('phoneNumber', this.phoneNumber);
      sessionStorage.setItem('googleMapUrl', 'https://www.google.com/maps/search/' + this.latitude + ',' + this.longitude);
      sessionStorage.setItem('latitude',this.latitude);
      sessionStorage.setItem('longitude',this.longitude);
      this.$router.push('/call');
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
.bar-gra{
  background-image: linear-gradient(45deg, #303F9F, #d36950);
}
</style>
