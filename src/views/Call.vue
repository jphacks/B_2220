<template>
  <v-app>
    <v-container>
      <div class="d-flex justify-space-around mb-16">
        <h1>山田 太郎</h1>
        <v-avatar
          color="grey"
          size="50"
        >
          <v-icon
            dark
            size="45"
          >
            mdi-account-circle
          </v-icon>
        </v-avatar>
      </div>
      <div class="d-flex justify-space-around mb-6">
        <div>
          <v-btn
              elevation="0"
              class="mx-2"
              color="white"
              fab
              x-large
          >
            <v-icon color="grey">
              mdi-bell-ring
            </v-icon>
          </v-btn>
          <p>リマインド</p>
        </div>
        <div>
          <v-btn
              elevation="0"
              class="mx-2"
              color="white"
              fab
              x-large
          >
            <v-icon color="grey">
              mdi-radiobox-marked
            </v-icon>
          </v-btn>
          <p>録音</p>
        </div>
        <div>
          <v-btn
              elevation="0"
              class="mx-2"
              color="white"
              fab
              x-large
          >
            <v-icon color="grey">
              mdi-message-text
            </v-icon>
          </v-btn>
          <p>メッセージ</p>
        </div>
      </div>
      <div class="d-flex justify-space-around mb-6">
        <div>
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
          <p>終了</p>
        </div>
        <div></div>
        <div>
          <v-btn
              class="mx-2"
              fab
              dark
              large
              color="green"
              @click="recognizeVoice"
              v-if="flagOnCall"
          >
            <v-icon dark>
              mdi-phone
            </v-icon>
          </v-btn>
          <p>応答</p>
        </div>
      </div>
      <div class="message" v-if="message">
        <p> {{ message }} </p>
      </div>
    </v-container>
  </v-app>
</template>


<script>
import axios from 'axios';
// import Vue from 'vue';
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
    audio4: new Audio(require('@/assets/voice/call04.wav')),
    audio5: new Audio(require('@/assets/voice/call05.wav')),
    message: '',
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
    // this.emergencyCall();
  },
  methods: {
    ringTone:function() {
      this.ringtone.currentTime = 0 // 連続で鳴らせるように
      this.ringtone.play()
      // setTimeout(this.emergencyCall,300)
    },
    onCall:function() {
      this.flagOnCall = false
      this.ringtone.pause()
    },
    offCall:function() {
      this.flagOnCall = true
      this.ringtone.pause()
      this.$router.push('/');
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
    // マイクの使用設定
    useMicrophone:function(){
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      const makeEmergencyCall = this.emergencyCall;
      this.message = '音声認識中'
      recognition.onresult = (event) => {
        if( 0 < event.results.length ){
          console.log(event.results[0][0].transcript);
          this.repeatAiVoice();
          setTimeout(this.useMicrophone, 10000)
        }else if(event.results.length == 0){
          console.log("認識した音声はありません。");
        }
      };
      recognition.onnomatch = function(){
        console.log('音声が認識できませんでした。');
        makeEmergencyCall();
      };
      recognition.onerror= function(){
        console.log('音声認識エラーが発生しました。');
        makeEmergencyCall();
      };
      recognition.onsoundend = function(){
        console.log('音声検出終了');
      };
      recognition.start();
    },
    recognizeVoice:function(){
       this.startAiVoice()
        setTimeout(this.useMicrophone, 10000)
     },
    startAiVoice: function() {
      this.ringtone.pause()
      setTimeout(this.playAiVoice, 3000)
      this.message = 'AI応答中'
    },
    repeatAiVoice: function() {
      setTimeout(this.playRandAiVoice, 3000)
      this.message = 'AI応答中'
    },
    playAiVoice:function () {
      this.audio.play()
    },
    playRandAiVoice:function () {
      const rand = Math.floor(Math.random() * 4);
      if (rand === 0) {
        this.audio2.play()
      } else if (rand === 1) {
        this.audio3.play()
      } else if (rand === 2) {
        this.audio4.play()
      } else {
        this.audio5.play()
      }
    }
  }
}
</script>

<style scoped>

</style>
