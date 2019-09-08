import React, { useState, useEffect } from 'react';
// import 'bootstrap';
//Unclear if I need this wrapper component
import {renderAll, renderComment, printEles} from './TheIsaac';
import cytoscape from 'cytoscape';
import firebase from 'firebase';

function App() {
    const [ref, setRef] = useState();
    const [eles, setEles] = useState();
    const [loading, setLoading] = useState(true);
    const[cy, setCy] = useState(cytoscape({
      
      elements: [ // list of graph elements to start with
        // { // node a
        //   data: { name: 'my knowledge', id: 'my knowledge' }
        // }
      ]
    
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
              console.log('cy has been set: ',  elements);
          })
      }
      fetchData();

      //don't render at first with labels, make it's more scratchy

  }, []);
  useEffect(()=>{
    if(!loading){
        document.addEventListener('keypress', (event)=>{
          if(event.key==="Enter"){
              renderAll(cy);
          }
        cy.on('add remove', (event)=>{
          //console.log('type: ', event.type, ". target: " + event.target.data('name'));
          firebase.database().ref().set(JSON.stringify(cy.elements().jsons()));
          //console.log('saved');
        })
      });
    }
  }, [loading])
    return (
      <div className="Isaac-container">
        <h1>The Isaac</h1>
        
        <div id = "chatter">
            <p id = "convo">
                Isaac: I like crew.
            </p>
            <div id = "input">
                Say something: <input id = "comment-section" type="text" name="comment"></input><br></br>
                <input type="submit" value="Submit" onClick={() => renderAll(cy)} onBlur={()=>{this.value=''}}></input>
            </div>
        </div>
      </div>
    )
  }

export default App;
