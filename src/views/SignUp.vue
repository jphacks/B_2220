<template>
  <v-app>
    <div class="login-box">
      <v-card class="login-form">
        <v-card-title class="login-title">SignUp</v-card-title>
        <v-card-subtitle>ユーザー情報をご入力ください</v-card-subtitle>
        <v-btn text color="light-blue" to="login">ログイン画面はこちら</v-btn>
        <v-form
            ref="form"
            v-model="valid"
            lazy-validation
        >
          <v-text-field
              v-model="name"
              :rules="nameRules"
              label="氏名（漢字）"
              required
          ></v-text-field>

          <v-text-field
              v-model="email"
              :rules="emailRules"
              label="メールアドレス"
              required
          ></v-text-field>

          <v-text-field
              v-model="password"
              label="パスワード"
              type="Password"
          ></v-text-field>

          <v-text-field
              v-model="phoneNumber"
              :rules="phoneRules"
              label="緊急連絡先"
              required
              >
          </v-text-field>
          <p>{{ this.phoneNumber }}</p>

          

          <v-btn
              color="success"
              class="login-btn"
              @click="submit"
              :disabled="isValid">
            SIGN UP
          </v-btn>

          <v-btn>
            CLEAR
          </v-btn>

          <v-alert
              dense
              outlined
              type="error"
              class="error-message"
              v-if="errorMessage"
          >
            {{ errorMessage }}
          </v-alert>

        </v-form>

      </v-card>
    </div>
  </v-app>
</template>

<script>
import firebase from "@/firebase/firebase"

export default {
  data: () => ({
    valid: true,
    name: '',
    nameRules: [
      v => !!v || '名前を入力してください',
      v => (v && v.length <= 10) || '名前は10文字以内で入力してください',
    ],
    email: '',
    emailRules: [
      v => !!v || 'メールアドレスを入力してください',
      v => /.+@.+\..+/.test(v) || 'メールアドレスが不正です',
    ],
    password: '',
    phoneNumber: '',
    phoneRules: [
      v => !!v || '半角・ハイフン無しで入力してください',
    ],
    errorMessage: ""
  }),
  computed: {
    isValid() {
      return !this.valid;
    }
  },
  methods: {
    validate() {
      this.$refs.form.validate()
    },
    reset() {
      this.$refs.form.reset()
    },
    resetValidation() {
      this.$refs.form.resetValidation()
    },
    submit() {
      console.log("submit call")
      firebase.auth()
          .createUserWithEmailAndPassword(this.email, this.password)
          .then(async (result) => {
            console.log("success", result)
            await result.user.updateProfile({
              displayName: this.name,
            });
            console.log("update user", result.user)

            localStorage.message = "新規作成に成功しました"

            // 電話番号の追加
            const db = firebase.firestore();
            const userRef = db.collection("users").doc(result.user.uid);
            userRef.set({
              phoneNumber: this.phoneNumber
            })
            .then(() => {
              console.log("phoneNumber successfully written!");
            })
            .catch((error) => {
              console.error("phoneNumber writing document: ", error);
            });

            this.$router.push('/login')

          })
          .catch((error) => {
            console.log("fail", error)

            this.errorMessage = "ユーザーの新規作成に失敗しました。";

          })

    }
  },
}
</script>

<style scoped>
.login-form {
  margin: 0px;
  padding: 30px;
}

.login-box {
  width: 80%;
  height: 80%;
  margin: auto;
  padding: 50px 30px;
}

.login-title {
  display: inline-block;
}

.login-btn {
  margin-right: 20px;
}

.error-message {
  margin-top: 20px;
}
</style>
