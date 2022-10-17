<template>
  <v-app>
    <div class="text-center">
      <p>着信</p>
      <p>{{ name }}</p>
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
          mdi-phone-hangup
        </v-icon>
      </v-btn>
    </div>
  </v-app>
</template>

<script>

export default {
  name: "call",
  data: () => ({
    name: 'たかし',
    flagOnCall: true,
    ringtone: new Audio(require('@/assets/ringtone/ringtone2.mp3')),
    // voice: new Audio(require('@/assets/voice/voice1.wav')),
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
    emergencyCall:function() {
      // Download the helper library from https://www.twilio.com/docs/node/install
      // Find your Account SID and Auth Token at twilio.com/console
      // and set the environment variables. See http://twil.io/secure

      const accountSid = process.env.VUE_APP_ACCOUNT_SID;
      const authToken = process.env.VUE_APP_AUTH_TOKEN;

      const client = require('twilio')(accountSid, authToken);

      client.calls
          .create({
            twiml: '<Response><Say>Ahoy, World!</Say></Response>',
            to: '+818047100803',
            from: '+14057844680',
          })
          .then(call => console.log(call.sid));
    }
  }
}
</script>

<style scoped>

</style>
