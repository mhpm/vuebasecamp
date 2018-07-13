import firebase from 'firebase'
import 'firebase/firestore'

var config = {
    apiKey: "AIzaSyAhB5qZkdp9bq5IPn81kMbcPW1A88cadhU",
    authDomain: "vuebasecamp.firebaseapp.com",
    databaseURL: "https://vuebasecamp.firebaseio.com",
    projectId: "vuebasecamp",
    storageBucket: "vuebasecamp.appspot.com",
    messagingSenderId: "1027173573234"
  };
const firebaseApp = firebase.initializeApp(config);
firebaseApp.firestore().settings({ timestampsInSnapshots:true});

// export firestore database
export default firebaseApp