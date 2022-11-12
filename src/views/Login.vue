<template>
  <v-app>
    <div class="login-box">
      <v-card class="login-form">
        <v-card-title class="login-title">Login</v-card-title>
        <v-card-subtitle>ユーザー情報をご入力ください</v-card-subtitle>
        <v-btn text color="light-blue" to="signup">新規登録はこちら</v-btn>
        <v-form
            ref="form"
            v-model="valid"
            lazy-validation
        >

          <v-text-field
              v-model="email"
              :rules="emailRules"
              label="メールアドレス"
              required
          ></v-text-field>

          <v-text-field
              v-model="password"
              label="パスワード"
              type="password">
          </v-text-field>

          <v-btn
              color="success"
              class="login-btn"
              @click="submit"
              :disabled="isValid">
            LOGIN
          </v-btn>

          <v-btn>
            CLEAR
          </v-btn>

          <v-alert
              dense
              text
              type="success"
              class="success-message"
              v-if="message"
          >
            {{ message }}
          </v-alert>

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
    auth: null,
    valid: true,
    name: '',
    nameRules: [
      v => !!v || 'Name is required',
      v => (v && v.length <= 10) || 'Name must be less than 10 characters',
    ],
    email: '',
    emailRules: [
      v => !!v || 'メールアドレスを入力してください',
      v => /.+@.+\..+/.test(v) || 'メールアドレスが不正です',
    ],
    password: '',
    message: '',
    errorMessage: ''
  }),
  mounted() {
    if (localStorage.message) {
      this.message = localStorage.message
      localStorage.message = ''
    }
  },
  computed: {
    isValid() {
      console.log("isValid", this.valid);
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
      const authUser = async() => {
        try {
          const result = await firebase.auth().signInWithEmailAndPassword(this.email, this.password)
          console.log("success")
          console.log("user", result.user)

          this.auth = {
            displayName: result.user.displayName,
            email: result.user.email,
            uid: result.user.uid,
            refreshToken: result.user.refreshToken,
            photoURL: result.user.photoURL
          }

          this.auth.phoneNumber = await this.getPhoneNumber()
          localStorage.setItem('user', JSON.stringify(this.auth))
          console.log("localStorage", JSON.parse(localStorage.getItem('user')))
          this.$router.push('/setting')
        }
        catch (error) {
          console.log("fail", error)
          this.errorMessage = "ログインに失敗しました"
        }
      }
      authUser()
    },
    async getPhoneNumber() {
      // 電話番号の取得
      const db = firebase.firestore();
      const userRef = db.collection("users").doc(this.auth.uid);
      try {
        const doc = await userRef.get()
        if (doc.exists) {
          console.log("Document data:", doc.data());
          const phoneNumber = doc.data().phoneNumber;
          console.log("電話番号", phoneNumber);
          // authオブジェクトに電話番号を追加
          return phoneNumber;

        } else {
          // doc.data() will be undefined in this case
          console.log("電話番号がせていされていません");
        }
      }
      catch(error) {
        console.log("Error getting document:", error);
      }
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

.success-message {
  margin-top: 20px;
}

.error-message {
  margin-top: 20px;
}
</style>
