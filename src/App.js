import React, { useState, useEffect } from 'react';
// import 'bootstrap';
//Unclear if I need this wrapper component
import {renderAll, renderComment} from './TheIsaac';
import cytoscape from 'cytoscape';

function App() {
    const[cy, setCy] = useState(cytoscape({
      
      elements: [ // list of graph elements to start with
        // { // node a
        //   data: { name: 'my knowledge', id: 'my knowledge' }
        // }
      ]
    
    }));
    //const [knowledgeGraph, setKnowledgeGraph] = useState([], )
    useEffect(()=>{
      document.addEventListener('keydown', (event)=>{
          console.log('event: ', event)
          if(event.key==="Enter"){
              renderAll(cy);
          }
      });
    }, []);
    return (
      <div className="Isaac-container">
        <h1>The Isaac</h1>
        <div id = "chatter">
            <p id = "convo">
                Isaac: I like crew.
            </p>
            <div id = "input">
                Say something: <input id = "comment-section" type="text" name="comment"></input><br></br>
                <input type="submit" value="Submit" onclick={()=>{}/*renderAll*/} onblur="this.value=''"></input>
            </div>
        </div>
      </div>
    )
  }

export default App;
