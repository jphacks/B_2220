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
    userLocation: null,
  }),
  mounted() {
    const {Client} = require("@googlemaps/google-maps-services-js");
    const client = new Client({});
    client
        .reverseGeocode({
          headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          params: {
            latlng: [sessionStorage.getItem('latitude'), sessionStorage.getItem('longitude')],
            key: process.env.VUE_APP_GOOGLE_MAPS_API_KEY,
          },
          timeout: 1000, // milliseconds
        })
        .then((r) => {
          console.log(this.userLocation = r.data.results[0].formatted_address);
        })
        .catch((e) => {
          console.log(e.response.data.error_message);
        });
    setTimeout(this.ringTone, 3000)
  },
  methods: {
    ringTone:function() {
      this.ringtone.currentTime = 0 // 連続で鳴らせるように
      this.ringtone.play()
      setTimeout(this.emergencyCall,300)
    },
    onCall:function() {
      this.flagOnCall = false
      this.ringtone.pause()
    },
    offCall:function() {
      this.flagOnCall = true
      this.ringtone.pause()
    },
    emergencyCall:function() {
      const accountSid = process.env.VUE_APP_ACCOUNT_SID;
      const authToken = process.env.VUE_APP_AUTH_TOKEN;
      const phoneNumberFrom = process.env.VUE_APP_PHONE_NUMBER;
      const phoneNumberTo = '+81' + sessionStorage.getItem('phoneNumber').slice(1);
      const googleMapUrl = sessionStorage.getItem('googleMapUrl');

      var qs = require('qs');
      var callData = qs.stringify({
        'Twiml': '<Response><Say>' + googleMapUrl + '</Say></Response>',
        'To': phoneNumberTo,
        'From': phoneNumberFrom
      });
      var callConfig = {
        method: 'post',
        url: 'https://api.twilio.com/2010-04-01/Accounts/' + accountSid + '/Calls.json',
        headers: {
          'Authorization': 'Basic ' + btoa(accountSid + ':' + authToken),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : callData
      };

      axios(callConfig)
          .then(function (response) {
            console.log(JSON.stringify(response.data));
          })
          .catch(function (error) {
            console.log(error);
          });

      var SMSData = qs.stringify({
        'Body': this.name + 'さんの応答が' + this.userLocation + '付近で途絶えました。',
        'To': phoneNumberTo,
        'From': phoneNumberFrom
      });
      var SMSConfig = {
        method: 'post',
        url: 'https://api.twilio.com/2010-04-01/Accounts/' + accountSid + '/Messages.json',
        headers: {
          'Authorization': 'Basic ' + btoa(accountSid + ':' + authToken),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : SMSData
      };

      axios(SMSConfig)
          .then(function (response) {
            console.log(JSON.stringify(response.data));
          })
          .catch(function (error) {
            console.log(error);
          });
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
