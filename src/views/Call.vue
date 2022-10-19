<template>
  <v-app>
    <div>
      <div>
      <p>応答</p>
      <v-btn 
          class="mx-2"
          fab
          dark
          large
          color="cyan"
          @click="recognizeVoice"
          v-if="flagOnCall"
      >
        <v-icon dark>
        </v-icon>
      </v-btn>
    </div>
    <div> 
      <p>終了</p>
      <p>{{ name }}</p>
      <v-btn
          class="mx-2"
          fab
          dark
          large
          color="pink"
          @click="offCall"
          v-if="flagOnCall"
      >
        <v-icon dark>
          mdi-phone-hangup
        </v-icon>
      </v-btn>
    </div>
    <p>{{ messagea }}</p>
    <p>{{ messagem }}</p>
  </div>
  </v-app>
</template>


<script>
import axios from 'axios';
export default {
  name: "call",
  data: () => ({
    flagOnCall: true,
    ringtone: new Audio(require('@/assets/ringtone/ringtone2.mp3')),
    name: sessionStorage.getItem('name'),
    // voice: new Audio(require('@/assets/voice/voice1.wav')),
    audio: new Audio(require('@/assets/voice/call01.mp3')),
    audio2: new Audio(require('@/assets/voice/call02.wav')),
    audio3: new Audio(require('@/assets/voice/call03.wav')),
    address: '',
  }),
  async mounted() {
    this.address = await this.getAddressFromGPS();
    console.log("住所", this.address);
    setTimeout(this.ringTone, 3000)
  },
  methods: {
    // セッションストレージに保存した緯度経度から、住所を取得する
    async getAddressFromGPS(){
      const req = 'http://geoapi.heartrails.com/api/json?method=searchByGeoLocation&x='+ sessionStorage.getItem('longitude') + '&y=' + sessionStorage.getItem('latitude');
      // console.log(req);
      const res =  await axios.get(req);
      console.log("住所", JSON.stringify(res.data));
      // 都道府県・市区町村・町域名を取得して返却
      return res.data.response.location[0].prefecture + res.data.response.location[0].city + res.data.response.location[0].town;
    },
    ringTone:function() {
      this.ringtone.currentTime = 0 // 連続で鳴らせるように
      this.ringtone.play()
    },
    onCall:function() {
      this.flagOnCall = false
      this.ringtone.pause()
      setTimeout(this.emergencyCall,300)
    },
    offCall:function() {
      this.flagOnCall = true
      this.ringtone.pause()
    },
    emergencyCall:function() {
      // Download the helper library from https://www.twilio.com/docs/node/install
      // Find your Account SID and Auth Token at twilio.com/console
      // and set the environment variables. See http://twil.io/secure

      const accountSid = process.env.VUE_APP_ACCOUNT_SID;
      const authToken = process.env.VUE_APP_AUTH_TOKEN;
      const phoneNumberFrom = process.env.VUE_APP_PHONE_NUMBER;
      const phoneNumberTo = '+81' + sessionStorage.getItem('phoneNumber').slice(1);
      const googleMapUrl = sessionStorage.getItem('googleMapUrl');

      const client = require('twilio')(accountSid, authToken);

      client.calls
          .create({
            twiml: '<Response><Say  language="ja-jp">' + this.address + '</Say></Response>',
            to: phoneNumberTo,
            from: phoneNumberFrom,
          })
          .then(call => console.log(call.sid));
      client.messages
          .create({
            body: this.name + 'さんの応答が' + this.address + '付近で途絶えました。 \n' + googleMapUrl,
            to: phoneNumberTo,
            from: phoneNumberFrom,
          })
          .then(message => console.log(message.sid));

    },
    recognizeVoice:function(){
      this.startAiVoice()
      setTimeout(this.useMicrophone, 10000)
    },
    useMicrophone:function(){
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      this.makeMessagem();
      recognition.onresult = (event) => {
        if( 0 < event.results.length ){
          alert(event.results[0][0].transcript);
          this.repeatAiVoice();
          setTimeout(this.useMicrophone, 10000)
        }
      };
      recognition.onnomatch = function(){
        alert('音声が認識できませんでした。');
        this.emergencyCall();
      };
      recognition.onerror= function(){
        console.log('音声認識エラーが発生しました。');
        this.emergencyCall();
      };
      // recognition.onsoundend = function(){
      //   console.log('音声検出終了');
      // };
      recognition.start();
    },
    startAiVoice: function() {
      this.offCall();
      this.makeMessagea();
      setTimeout(this.playAiVoice, 3000)
    },
    repeatAiVoice: function() {
      this.makeMessagea();
      setTimeout(this.playAiVoice, 300)
    },
    playAiVoice:function () {
      this.audio.play()
    },
    makeMessagem:function () {
      return{
        messagem : '音声認識を開始します。'
      }
    },
    makeMessagea:function () {
      return{
        messagea : 'AI音声を再生します。'
      }
    }
  }
}
</script>

<style scoped>

</style>
