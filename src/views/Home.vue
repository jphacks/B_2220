<template>
  <v-app>
    <v-btn
          class="button"
          color="#ECEFF1"
          @click="makeCall"
        >
        <v-icon dark>
          mdi-phone
        </v-icon>
          電話をかける
        </v-btn>
    <v-btn
          class="button"
          color="#ECEFF1"
          @click="makeBuzzer"
        >
        <v-icon dark>
          mdi-bell-ring
        </v-icon>
          防犯ブザーを鳴らす
        </v-btn>
  </v-app>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  data: () => ({
    buzzer: new Audio(require('@/assets/buzzer/buzzer.mp3')),
  }),
  methods: {
    makeCall() {
      this.$router.push('/roomlist');
    },
    makeBuzzer(){
      this.$router.push('/buzzer');
    },
  }
}
</script>

<style scoped>
.button {
  margin: 50px;
  padding: 30px;
}
</style>
