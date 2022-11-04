import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyAg4G6k_v_vTPqU-KKlSsUapEmAGALf1kY",
  authDomain: "cool-snowfall-365911.firebaseapp.com",
  projectId: "cool-snowfall-365911",
  storageBucket: "cool-snowfall-365911.appspot.com",
  messagingSenderId: "594282392358",
  appId: "1:594282392358:web:c606d35be3e374f1322fe7"
};
console.log(firebaseConfig);


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
