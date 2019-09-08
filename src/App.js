import React, { useState, useEffect } from 'react';
// import 'bootstrap';
//Unclear if I need this wrapper component
import {renderAll, renderComment, printEles} from './TheIsaac';
import cytoscape from 'cytoscape';
import Chatter from './Chatter';
import * as firebase from 'firebase';
import withFirebaseAuth from 'react-with-firebase-auth'
import 'firebase/auth';

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
const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

function App(props) {
    const [ref, setRef] = useState();
    const [eles, setEles] = useState();
    const [loading, setLoading] = useState(true);
    const[cy, setCy] = useState(cytoscape({
      
      elements: []
    
    }));
    const {
      user,
      signOut,
      signInWithGoogle,
    } = props;
    //const [knowledgeGraph, setKnowledgeGraph] = useState([], )
    useEffect(()=>{
    }, []);
    useEffect(() => {
      const fetchData = async () => {
          //Store firebase reference
          let ref = firebase.database().ref();
          //Retrieve elements data
          ref.once('value').then(async (snap) => {
              // console.log(snap.val())
              let elements = (snap.val()==="[]"? "[]": JSON.parse(snap.val()));
              await setEles(elements)
              //Store firebase reference
              await setRef(ref);
              //Set loading to false
              await setLoading(false);
              //return JSON.parse(snap.val())
              if(elements!=="[]") await cy.add(elements);
              console.log('cy has been set: ',  elements);
          })
      }
      fetchData();

      //don't render at first with labels, make it's more scratchy

  }, []);
  useEffect(()=>{
    if(!loading){
        document.addEventListener('keydown', (event)=>{
          if(event.key==="Enter"){
              renderAll(cy);
          }
        });
        cy.on('add remove', (event)=>{
          //console.log('type: ', event.type, ". target: " + event.target.data('name'));
          firebase.database().ref().set(JSON.stringify(cy.elements().jsons()));
          //console.log('saved');
        })
    }
  }, [loading])
  return (
    <div className="Isaac-Container">
      <h1 id='title'>The Isaac</h1>
      
      {
        user 
          ? <div>
              <p>Hello, {user.displayName}</p>
              <Chatter cy={cy}/>
            </div>
          : <p>Please sign in.</p>
      }
      {
        user
          ? <button onClick={signOut}>Sign out</button>
          : <button onClick={signInWithGoogle}>Sign in with Google</button>
      }
    </div>
  )
}
export default withFirebaseAuth({
    providers,
    firebaseAppAuth,
  })(App);
