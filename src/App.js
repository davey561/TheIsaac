import React, { useState, useEffect } from 'react';
// import 'bootstrap';
//Unclear if I need this wrapper component
import {renderAll, renderComment, printEles} from './TheIsaac';
import cytoscape from 'cytoscape';
import Chatter from './Chatter';
import * as firebase from 'firebase';
import withFirebaseAuth from 'react-with-firebase-auth'
import 'firebase/auth';
import LoginPage from './LoginPage';
import { testDistEmph } from './ResponseLogic/EmphasisDist';
import CytoscapeComponent from 'react-cytoscapejs';


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
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState();
    let cyRef = React.createRef();
    const [elementsForRef, setElements] = useState([{data: {id: '1'}}]);
    const[cy, setCy] = useState(cytoscape({
      elements: []
    }));
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
          })
      }
      fetchData();
      document.addEventListener('unload', ()=>{
        window.alert('unloading')
        firebase.auth().signOut();
      });
      //don't render at first with labels, make it's more scratchy

  }, []);
  useEffect(()=>{
    if(!loading /*&& user*/) {
        cy.on('add remove data', (event)=>{
          firebase.database().ref().set(JSON.stringify(cy.elements().jsons()));
          setElements(cy.elements());
        });
      }
    },
    [loading, /*user*/]
  )
  return (
    <div className="Isaac-Container">
      <h1 id='title'>The Isaac</h1>
      {/* {user && !loading
        ? <div>
            <Chatter cy={cy}/>
          </div>
        : <LoginPage setUser={setUser} setLoggedIn={setLoggedIn}/>
      } */}
      <h1>The Chatbot's consciousness is under development. Check back again in November</h1>
      {/* <Chatter cy={cy}/> */}
      {/* <CytoscapeComponent style={ { width: '900px', height: '600px' } } cy={(cy) => { cyRef = cy }} elements={elementsForRef} layout ={{name: 'cose'}}/> */}
    </div>
  )
}
export default App;

const test = (cy) => {
  testDistEmph(cy);
}
