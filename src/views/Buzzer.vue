<template>
    <v-app>
      <v-btn
        class="button"
        color="#ECEFF1"
        @click="buzzerStart"
          >
          <v-icon dark>
            mdi-alarm-light-outline
            </v-icon>
            スタート
          </v-btn>
      <v-btn
        class="button"
        color="#ECEFF1"
        @click="buzzerStop"
          >
          <v-icon dark>
            mdi-alarm-light-off-outline
            </v-icon>
            ストップ
          </v-btn>
     <v-btn
        class="button"
        color="#ECEFF1"
        @click="backScr"
          >
          <v-icon dark>
            mdi-bacteria
            </v-icon>
            戻る
          </v-btn>
    </v-app>
  </template>

<script>
export default {
  name: 'Home',
  data: () => ({
    buzzer: new Audio(require('@/assets/buzzer/buzzer.mp3')),
  }),
  methods: {
    backScr() {
      this.buzzer.pause()
      this.$router.push('/home');
    },
    buzzerStart:function() {
      this.buzzer.currentTime = 0 // 連続で鳴らせるように
      this.buzzer.play()
    },
    buzzerStop:function() {
        this.buzzer.pause()
    },
  }
}
</script>

<style>
.button {
  margin: 50px;
  padding: 30px;
}
</style>
