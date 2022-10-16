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
    voice: new Audio(require('@/assets/voice/voice1.wav')),
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
      this.voice.play()
    },
  }
}
</script>

<style scoped>

</style>