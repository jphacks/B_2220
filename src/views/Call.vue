<template>
  <v-app>
    <v-container class="bg-image">

      <div class="d-flex justify-space-around mb-16 mt-16">
        <h1 class="white--text">たくと</h1>
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

      <div class="d-flex justify-space-around pt-10">
        <div>
          <v-btn
              elevation="0"
              class="mx-2"
              color="white"
              fab
              outlined
              x-large
              @click="buzzerStart"
          >
            <v-icon color="white">
              mdi-bell-ring
            </v-icon>
          </v-btn>
          <p class="white--text font-weight-bold mt-2">防犯ブザー</p>
        </div>
        <div>
          <v-btn
              elevation="0"
              class="mx-2"
              color="white"
              fab
              outlined
              x-large
              @click="emergencyCall"
          >
            <v-icon color="white">
              mdi-car-emergency
            </v-icon>
          </v-btn>
          <p class="white--text font-weight-bold mt-2">緊急通報</p>
        </div>
        <div class="app">
          <v-btn
              elevation="0"
              class="mx-2"
              color="white"
              fab
              outlined
              x-large
          >
            <v-icon color="white">
              mdi-message-text
            </v-icon>
          </v-btn>
          <p class="white--text font-weight-bold mt-2">メッセージ</p>
        </div>
      </div>
        
      <div class="d-flex justify-space-around mb-10 pt-3">
        <div>
          <v-btn
              elevation="0"
              class="mx-2"
              color="white"
              fab
              outlined
              x-large
              v-if="status=='ready'"
              @click="startRecording"
          >
            <v-icon color="white">
              mdi-message-text
            </v-icon>
          </v-btn>
          <p class="white--text font-weight-bold mt-2">録音開始</p>
        </div>

        <div>
          <v-btn
              elevation="0"
              class="mx-2"
              color="white"
              fab
              outlined
              x-large
              v-if="status=='recording'"
              @click = "stopRecording"
          >
            <v-icon color="white">
              mdi-bell-ring
            </v-icon>
          </v-btn>
          <p class="white--text font-weight-bold mt-2">録音停止</p>
        </div>
      </div>
      
      <div class="d-flex justify-space-around mb-5">
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
          <p class="white--text font-weight-bold mt-2">終了</p>
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
          <p class="white--text font-weight-bold mt-2">応答</p>
        </div>
      </div>
      <div class="message" v-if="message">
        <p class="white--text"> {{ message }} </p>
      </div>
    </v-container>
  </v-app>
</template>


<script>
import axios from 'axios';
import firebase from "firebase/app";
import "firebase/firestore";
// import Vue from 'vue';
export default {
  name: "call",
  data: () => ({
    // firebaseに保存されているuser情報
    user: null,
    flagOnCall: true,
    ringtone: new Audio(require('@/assets/ringtone/ringtone2.mp3')),
    buzzer: new Audio(require('@/assets/buzzer/buzzer.mp3')),
    name: '',
    // voice: new Audio(require('@/assets/voice/voice1.wav')),
    audio: new Audio(require('@/assets/voice/call01.mp3')),
    audio2: new Audio(require('@/assets/voice/call02.wav')),
    audio3: new Audio(require('@/assets/voice/call03.wav')),
    userAddress: null,
    audio4: new Audio(require('@/assets/voice/call04.wav')),
    audio5: new Audio(require('@/assets/voice/call05.wav')),
    message: '',
    firebaseUid: '',
    // -----以下は、マップマッチングのための変数-----
    userLocationArray: [],
    date: null,
    // -----以下は、録音機能のための変数-----
    status: 'init',     // 状況
    recorder: null,     // 音声にアクセスする "MediaRecorder" のインスタンス
    audioData: [],      // 入力された音声データ
    audioExtension: ''  // 音声ファイルの拡張子
  }),
  mounted() {
    // 日付を取得してfirebaseのドキュメント名にする
    this.date = new Date();
    this.date = this.date.toLocaleString().split('/').join('-').split(' ').join('-').split(':').join('-');

    // firebaseのユーザ情報をキャッシュから取得
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.firebaseUid = this.user.uid;
    this.name = this.user.name;

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
          console.log(this.userAddress = r.data.results[0].formatted_address);
        })
        .catch((e) => {
          console.log(e.response.data.error_message);
        });
    setTimeout(this.ringTone, 3000)
    // this.emergencyCall();

    // -----マイクにアクセスここから-----
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        this.recorder = new MediaRecorder(stream);
        this.recorder.addEventListener('dataavailable', e => {
            this.audioData.push(e.data);
            this.audioExtension = this.getExtension(e.data.type);
        });
        this.recorder.addEventListener('stop', () => {
            const audioBlob = new Blob(this.audioData);
            const url = URL.createObjectURL(audioBlob);
            let a = document.createElement('a');
            a.href = url;
            a.download = Math.floor(Date.now() / 1000) + this.audioExtension;
            document.body.appendChild(a);
            a.click();
        });
        this.status = 'ready';
    });
    // -----マイクにアクセスここまで-----
  },
  methods: {
    buzzerStart(){
      this.buzzer.currentTime = 0 // 連続で鳴らせるように
      this.buzzer.play()
    },
    buzzerStop(){
      this.buzzer.pause()
    },
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
      this.buzzer.pause()
      this.$router.push('/setting');
    },
    emergencyCall:function() {
      const accountSid = process.env.VUE_APP_ACCOUNT_SID;
      const authToken = process.env.VUE_APP_AUTH_TOKEN;
      const phoneNumberFrom = process.env.VUE_APP_PHONE_NUMBER;
      const phoneNumberTo = '+81' + this.user.phoneNumber.slice(1);


      const db = firebase.firestore();
      db.collection("users").doc(this.firebaseUid).collection("latlng").doc(this.date).set({
        locationArray: [
          sessionStorage.getItem('longitude') + ',' + sessionStorage.getItem('latitude')
        ],
      }).then(() => {
        console.log("Document successfully written!");
      }).catch((error) => {
        console.error("Error writing document: ", error);
      });
      this.getLocation();
      setInterval(this.getLocation,20000);

      var qs = require('qs');
      var callData = qs.stringify({
        'Twiml': '<Response><Say voice="alice" language="ja-JP" loop="2">' + this.name + 'さんの応答が途絶えました。ショートメッセージから位置情報を確認して下さい。</Say></Response>',
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
        'Body': this.name + 'さんの応答が途絶えました。' + location.protocol + '//' + location.host + '/map?uid=' + this.firebaseUid + '&date=' + this.date,
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
    getLocation(){
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position){
              let coords = position.coords;
              // 緯度経度だけ取得
              let latitude = coords.latitude;
              let longitude = coords.longitude;
              const db = firebase.firestore();
              db.collection('users').doc(this.firebaseUid).collection('latlng').doc(this.date).update({
                locationArray: firebase.firestore.FieldValue.arrayUnion( longitude + ',' + latitude)
              });
            }.bind(this),
            function(error) {
              console.error(error);
            }
        );
      } else {
        console.error("Geolocation APIに対応していません");
      }
    },
    // -----SpeechRecognitionの設定ここから-----
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
    // -----SpeechRecognitionの設定ここまで-----

    // -----AI音声設定ここから-----
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
    },
    // -----AI音声設定ここまで-----

    // -----録音を開始／ストップする部分ここから-----
    startRecording() {
      this.status = 'recording';
      this.audioData = [];
      this.recorder.start();
    },
    stopRecording() {
      this.recorder.stop();
      this.status = 'ready';
    },
    // -----マイクの使用設定ここまで-----

    // -----音声ファイルの拡張子を取得するここから-----
    getExtension(audioType) {

      let extension = 'wav';
      const matches = audioType.match(/audio\/([^;]+)/);

      if(matches) {

          extension = matches[1];

      }

      return '.'+ extension;

      }
    // -----音声ファイルの拡張子を取得するここから-----
  }
}
</script>

<style scoped>
.bg-image{
  background-image: url("../assets/call_bg_1_blur.jpeg");
  background-size: cover;
  height: 100vh;
  width: 100%;
}

</style>
