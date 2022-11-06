<template>
  <v-app>
    <v-container class="container indigo darken-2">
      <div class="anim-box poyoyon2 is-animated">
        <img src="../assets/logo_2.png">
      </div>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: "First.vue",
  mounted() {
    setTimeout(this.goSetting, 2000)
  },
  methods: {
    goSetting(){
      this.$router.push('/signup');
    }
  }
}
</script>

<style scoped>
.anim-box.poyoyon2.is-animated {
  animation: poyoyon2 1s ease-in-out 1 forwards;
  display: table-cell;
  vertical-align: middle;

}

.anim-box img {
  width: 100px;
  height: auto;
}

@keyframes poyoyon2 {
  0% {
    transform: scale(1.0, 1.0) translate(0, 0);
  }
  15% {
    transform: scale(0.98, 0.9) translate(0, 5px);
  }
  30% {
    transform: scale(1.02, 1.0) translate(0, 8px);
  }
  50% {
    transform: scale(0.98, 1.05) translate(0, -8px);
  }
  70% {
    transform: scale(1.0, 0.9) translate(0, 5px);
  }
  100% {
    transform: scale(1.0, 1.0) translate(0, 0);
  }
  0%, 100% {
    opacity: 1;
  }
}

.container {
  width: 100%;
  height: 100vh;
  display: table;
}
</style>