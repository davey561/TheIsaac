import React, {useEffect, useState} from 'react';
import {renderAll} from './TheIsaac';
import firebase from 'firebase';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { testDistEmph } from './ResponseLogic/EmphasisDist';

function Chatter({cy, loading}){
    const [allResponses, setAllResponses] = useState(["I like crew"]); //even indices are Isaac, odd indices are user
    // const [pushResponse, setPushResponse] = useState(); //will be a function to push response
    return (
        <KeyboardEventHandler
            handleKeys={['enter', "shift+t"]}
            onKeyEvent={(key, event)=> eventResponses(key, event, cy, allResponses, setAllResponses)}>
            <div id = "chatter">
                <p id = "convo">
                    Isaac:  {allResponses[0]}.
                </p>
                <div id = "input">
                    Say something: <input id = "comment-section" type="text" name="comment" autoFocus={true}></input>
                    <input id = "submit-button" type="submit" value="Submit" onClick={() => renderAll(cy, allResponses, setAllResponses)} ></input>
                </div>
            </div>
        </KeyboardEventHandler>
    )
}
export default Chatter;
const testChatter = (responses, setAllResponses) => {
    console.log(responses);
}

const eventResponses = (key, event, cy, allResponses, setAllResponses) => {
    console.log("key: ", key);
    if(key==="enter"){
        
        renderAll(cy, allResponses, setAllResponses, /*newPushResponse*/);
    }
    // else if(key==='shift+t'){
    //     event.preventDefault();
    //     //testChatter(allResponses, setAllResponses);
    //     testDistEmph(cy);
    // }
}

