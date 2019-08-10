import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as firebase from 'firebase';

 // Initialize Firebase
 const firebaseConfig = {
    apiKey: "AIzaSyCj2i9CSgQRFWIf60pX2Sx5bStinFh8Tvs",
    authDomain: "plexus-74145.firebaseapp.com",
    databaseURL: "https://plexus-74145.firebaseio.com",
    projectId: "plexus-74145",
    storageBucket: "",
    messagingSenderId: "110353849498",
    appId: "1:110353849498:web:cf1ffb735c0f146a"
  };
  const app = firebase.initializeApp(firebaseConfig);
ReactDOM.render(<App />, document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
