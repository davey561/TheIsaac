import React, {useEffect} from 'react';
import {renderAll} from './TheIsaac';
import firebase from 'firebase';

function Chatter({cy, loading}){
    // useEffect(()=>{
        
    //     if(!loading){
    //         window.alert('hello!')
    //         document.addEventListener('keydown', (event)=>{
    //           window.alert('key presed');
    //           if(event.key==="Enter"){
    //               renderAll(cy);
    //               window.alert('40')
    //           }
    //         cy.on('add remove', (event)=>{
    //           //console.log('type: ', event.type, ". target: " + event.target.data('name'));
    //           firebase.database().ref().set(JSON.stringify(cy.elements().jsons()));
    //           //console.log('saved');
    //         })
    //       });
    //     }
    //   }, [loading])
    return (
        <div id = "chatter">
            <p id = "convo">
                Isaac:  I like crew.
            </p>
            <div id = "input">
                Say something: <input id = "comment-section" type="text" name="comment"></input>
                <input id = "submit-button" type="submit" value="Submit" onClick={() => renderAll(cy)} ></input>
            </div>
        </div>
    )
}
export default Chatter;
