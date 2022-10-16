<template>
  <v-app id="inspire">
    <sidebar/>
    <v-app-bar
        app
        shrink-on-scroll
    >

      <v-toolbar-title>ルームの一覧</v-toolbar-title>
      <CreateRoom />

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      
      <template>
  <v-form v-model="valid">
    <v-container>
      <v-row>
        <v-col
          cols="12"
          md="4"
        >
        <p>{{ phoneNumber }}</p>
        <p>1.発信する電話番号を入力してください</p>
          <v-text-field
            v-model="phoneNumber"
            label="電話番号を入力してください"
            required
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
        <p>{{ name }}</p>
        <p>2.あなたの名前を入力してください</p>
          <v-text-field
            v-model="name"
            label="名前を入力してください"
            required
          ></v-text-field>
        </v-col>
        
        <v-col
          cols="12"
          md="4"
        >

        <p>3.位置情報の取得を許可してください</p>
        <div>
        </div>
        <template>
        <div class="text-center">
          <v-btn
            class="ma-2"
            :loading="loading"
            :disabled="loading"
            color="secondary"
            @click="getLocation"
          >
            Accept Terms
          </v-btn>
          <p>{{ latitude }}</p>
          <p>{{ longitude }}</p>

          </div>
        </template>

        <p>4.あなたの名前を入力してください</p>
        <template>
          <div class="text-center">
            <v-btn
              class="ma-2"
              :loading="loading"
              :disabled="loading"
              color="secondary"
              @click="loader = 'loading'"
            >
              Accept Terms
            </v-btn>

          </div>
        </template>

          
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
    </v-main>
  </v-app>
</template>

<script>
import Sidebar from '@/components/layouts/Sidebar'
import CreateRoom from '@/components/modal/CreateRoom'
import firebase from "@/firebase/firebase"

export default {
  components: {
    Sidebar,
    CreateRoom
  },
  data: () => ({
    rooms: [],
    name: '',
    phoneNumber: '',
    latitude: 0,
     longitude: 0
  }),
  mounted() {
    this.getRooms()
  },
  methods: {
    getLocation () {
      console.log('getLocationCalled');
     if (process.client) {
       if (!navigator.geolocation) {
         alert('現在地情報を取得できませんでした。お使いのブラウザでは現在地情報を利用できない可能性があります。エリアを入力してください。')
         return
       }

       const options = {
         enableHighAccuracy: false,
         timeout: 5000,
         maximumAge: 0
       }

       navigator.geolocation.getCurrentPosition(this.success, this.error, options)
     }
   },

   success (position) {
     this.latitude = position.coords.latitude
     this.longitude = position.coords.longitude
   },

   error (error) {
     switch (error.code) {
       case 1: //PERMISSION_DENIED
         alert('位置情報の利用が許可されていません')
         break
       case 2: //POSITION_UNAVAILABLE
         alert('現在位置が取得できませんでした')
         break
       case 3: //TIMEOUT
         alert('タイムアウトになりました')
         break
       default:
         alert('現在位置が取得できませんでした')
         break
     }
   },

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



    }
  }
  //
}
</script>