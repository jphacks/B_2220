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
          @click="onCall"
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
  </div>
  <div> 
      <p>自動音声を流す</p>
      <p>{{ name }}</p>
      <v-btn
          class="mx-2"
          fab
          dark
          large
          color="green"
          @click="startAiVoice"
      >
        <v-icon dark>
          AI
        </v-icon>
      </v-btn>
    </div>
    <div> 
      <p>自動音声2を流す</p>
      <p>{{ name }}</p>
      <v-btn
          class="mx-2"
          fab
          dark
          large
          color="green"
          @click="startAiVoice2"
      >
        <v-icon dark>
          AI2
        </v-icon>
      </v-btn>
    </div>
    <div> 
      <p>自動音声3を流す</p>
      <p>{{ name }}</p>
      <v-btn
          class="mx-2"
          fab
          dark
          large
          color="green"
          @click="startAiVoice3"
      >
        <v-icon dark>
          AI3
        </v-icon>
      </v-btn>
    </div>
    <div> 
      <p>発声</p>
      <v-btn
          class="mx-2"
          fab
          dark
          large
          color="yellow"
          @click="useMicrophone"
      >
        <v-icon dark>
          話す
        </v-icon>
      </v-btn>
    </div>
  </v-app>
</template>


<script>
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
  }),
  mounted() {
    setTimeout(this.ringTone, 3000)
  },
  methods: {
    ringTone:function() {
      this.ringtone.currentTime = 0 // 連続で鳴らせるように
      this.ringtone.play()
    },
    onCall:function() {
      this.flagOnCall = false
      this.ringtone.pause()
      setTimeout(this.emergencyCall,100)
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
            twiml: '<Response><Say>' + googleMapUrl + '</Say></Response>',
            to: phoneNumberTo,
            from: phoneNumberFrom,
          })
          .then(call => console.log(call.sid));
    },
    useMicrophone:function(){
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      if ('SpeechRecognition' in window) {
        // ユーザのブラウザは音声合成に対応しています。
        console.log('音声合成に対応しています。');
      } else {
        // ユーザのブラウザは音声合成に対応していません。
        console.log('音声合成に対応していません。');
      }
      recognition.onresult = (event) => {
        if( 0 > event.results.length ){
          alert('音声が取得できませんでした。');
        }else{
          alert(event.results[0][0].transcript);
        }
      }
      recognition.start();
    },
    startAiVoice:function () {
      this.audio.currentTime = 0 // 連続で鳴らせるように
      this.audio.play() // 鳴らす
    },
    startAiVoice2:function () {
      this.audio2.currentTime = 0 // 連続で鳴らせるように
      this.audio2.play() // 鳴らす
    },
    startAiVoice3:function () {
      this.audio3.currentTime = 0 // 連続で鳴らせるように
      this.audio3.play() // 鳴らす
    }
  }
}
</script>

<style scoped>

</style>
