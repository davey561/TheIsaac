import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as firebase from 'firebase';

 // Initialize Firebase NEED TO UPDATE THIS INFO
 const firebaseConfig = {
  apiKey: "AIzaSyC-PXoygCwFQG9e0rUqh9-BkEQgiycvvzo",
  authDomain: "the-isaac.firebaseapp.com",
  databaseURL: "https://the-isaac.firebaseio.com",
  projectId: "the-isaac",
  storageBucket: "",
  messagingSenderId: "811295976428",
  appId: "1:811295976428:web:bc1eaea80f67cfd054eec9"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//   const app = firebase.initializeApp(firebaseConfig);
ReactDOM.render(<App />, document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
