import firebase from 'firebase/app'
import 'firebase/firestore'

// Initialize Cloud Firestore through Firebase
if (!firebase.apps.length) {
  const firebaseConfig = {
    apiKey: 'AIzaSyC6SkPWoi6F3QHbLnMhfkwiM52atQYB6VM',
    authDomain: 'project02-cd1cf.firebaseapp.com',
    databaseURL: 'https://project02-cd1cf.firebaseio.com',
    projectId: 'project02-cd1cf',
    storageBucket: 'project02-cd1cf.appspot.com',
    messagingSenderId: '867998527663',
    appId: '1:867998527663:web:3f581b14e26ecc009f645a',
    measurementId: 'G-5YQGE2HWBR',
  }
  firebase.initializeApp(firebaseConfig)
}

export const db = firebase.firestore()
