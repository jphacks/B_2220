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
    audio4: new Audio(require('@/assets/voice/call04.wav')),
    audio5: new Audio(require('@/assets/voice/call05.wav')),
    message: '',
  }),
  mounted() {
    // var config = {
    //   method: 'searchByGeolocation',
    //   url: 'http://geoapi.heartrails.com/api/json?method=searchByGeoLocation',
    //   data: {
    //     x: 35.6797777,
    //     y: 139.77165
    //   }
    // };
    // axios(config)
    //     .then(function (response) {
    //       console.log(JSON.stringify(response.data));
    //     })
    //     .catch(function (error) {
    //       console.log(error);
    //     });
    setTimeout(this.ringTone, 3000)
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
        'Body': this.name + 'さんの応答が' + '途絶えました。',
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
    // マイクの使用設定
    useMicrophone:function(){
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      this.message = '音声認識中'
      recognition.onresult = (event) => {
        if( 0 < event.results.length ){
          console.log(event.results[0][0].transcript);
          this.repeatAiVoice();
          setTimeout(this.useMicrophone, 10000)
        }else if(event.results.length == 0){
          console.log("認識した音声はありません。");
          this.emergencyCall();
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
      recognition.onsoundend = function(){
        console.log('音声検出終了');
      };
      recognition.start();
    },
    startAiVoice: function() {
      this.offCall();
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
