<template>
  <v-app>
    <!-- Call.vueはスマホの電話画面みたいに作りたい -->
    <div>
      <ui>
        <ul>
          <!-- v-ifでアイコンで消えるのは良くなさそう -->
          <div>
            <p>応答</p>
            <v-btn
                class="mx-2"
                fab
                dark
                large
                color="cyan"
                @click="recognizeVoice"
                v-if="isOnCall"
            >
              <v-icon dark>
                mdi-phone
              </v-icon>
            </v-btn>
          </div>
        </ul>
        <ul>
          <div>
          <p>終了</p>
          <!-- 彼氏の名前が表示されるようにする -->
          <!-- 通話を切るボタン -->
          <!-- このボタンが押されたら、着信拒否・電話を終了になる→正常に終了されたので通報しなくて良い -->
          <v-btn
              class="mx-2"
              fab
              dark
              large
              color="pink"
              @click="offCall"
              v-if="isOnCall"
          >
            <v-icon dark>
              mdi-phone-hangup
            </v-icon>
          </v-btn>
        </div>
        </ul>
      </ui>
    <p>{{ messagea }}</p>
    <p>{{ messagem }}</p>
    <!-- <p>{{ messageリザルト }}</p> -->
  </div>
  </v-app>
</template>


<script>
import axios from 'axios';
export default {
  name: "call",
  data: () => ({
    isOnCall: true,
    ringtone: new Audio(require('@/assets/ringtone/ringtone2.mp3')),
    name: sessionStorage.getItem('name'),
    // voice: new Audio(require('@/assets/voice/voice1.wav')),
    audio: new Audio(require('@/assets/voice/call01.mp3')),
    audio2: new Audio(require('@/assets/voice/call02.wav')),
    audio3: new Audio(require('@/assets/voice/call03.wav')),
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
    // 3秒経つと着信音が鳴る
    setTimeout(this.ringTone, 3000)
  },
  methods: {
    // 着信音を鳴らす
    ringTone:function() {
      this.ringtone.currentTime = 0 // 連続で鳴らせるように
      this.ringtone.play()
      setTimeout(this.emergencyCall,300)
    },
    // フェイク通話をする
    onCall:function() {
      this.isOnCall = false
      this.ringtone.pause()
    },
    // フェイク通話を終了する
    offCall:function() {
      this.isOnCall = true
      this.ringtone.pause()
    },
    // 緊急通報を発信
    emergencyCall:function() {
      // 初期値を入力している
      const accountSid = process.env.VUE_APP_ACCOUNT_SID;
      const authToken = process.env.VUE_APP_AUTH_TOKEN;
      const phoneNumberFrom = process.env.VUE_APP_PHONE_NUMBER;
      const phoneNumberTo = '+81' + sessionStorage.getItem('phoneNumber').slice(1);
      const googleMapUrl = sessionStorage.getItem('googleMapUrl');

      // voiceで緊急連絡をする
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

      // SMSで緊急連絡をする
      var SMSData = qs.stringify({
        // <who>さんの応答が<where>で途絶えましたに変更
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
    // 10秒後に音声認識を開始
    recognizeVoice:function(){
      this.startAiVoice()
      setTimeout(this.useMicrophone, 10000)
    },
    // 音声認識
    useMicrophone:function(){
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      this.makeMessagem();
      recognition.onresult = (event) => {
        //認識した文字の長さが1文字以上だと音声を認識したとする
        if( 0 < event.results.length ){
          // アラートは毎回ボタンを押さないといけないので廃止。
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
    // フェイク通話の音声を再生
    startAiVoice: function() {
      this.offCall();
      this.makeMessagea();
      setTimeout(this.playAiVoice, 3000)
    },
    // フェイク通話をリピート再生
    repeatAiVoice: function() {
      this.makeMessagea();
      setTimeout(this.playAiVoice, 300)
    },
    // ランダムに流すように変更
    playAiVoice:function () {
      this.audio.play()
    },
    // 使っていない！！
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
