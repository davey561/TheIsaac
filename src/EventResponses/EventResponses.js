import {runLayoutDefault, randomFCoseLayout, randomLayout, traversalLayout} from '../Old/Layout';
import defaultOptions from '../Defaults/defaultOptions';
import firebase from 'firebase';
import cytoscape from 'cytoscape/dist/cytoscape.esm';
import {addNode, retrieveNewName, addEdge, findGoodLocationForNewNode, 
    newEdgePrompt, addNewEdge,addNewEdge2, updatePotentialEdge, 
    findUniqueName, nedge, nodify, edgify, addEdgeSmart, deleteAll, deleteSome, addNodeSmart} 
    from "../Old/ModifyGraph";
import {runLayout, colaLayout, dagreLayout, fCoseLayout} from '../Old/Layout';
import { saveToText } from '../Old/ConvertToBullets';
import {quickSelect, barSelect} from '../Old/FocusLevels';
import {numberKeyDown} from '../Old/Miscellaneous';
import { cytoscapeEvents } from './CyEvents';
import {generalKeyResponses} from './KeyResponses';
import windowEvents from './WindowEvents';
import { calclulateEmphasis } from '../Emphasis';

export const eventResponseParameters = "[cyRef, firebaseRef, lastTwo, \
    typeaheadRef, setEleNames, setLastTwo, lastEdgeName, setLastEdgeName, \
    firstLayout, setFirstLayout, layout, typeMode, setTypeMode, eleBeingModified, setEleBeingModified, nedgeInProgress, setNedgeInProgress]";

export function eventResponses(key, event, eventKind,
    cyRef, firebaseRef, lastTwo,
    typeaheadRef, setEleNames, setLastTwo, lastEdgeName, setLastEdgeName, 
    firstLayout, setFirstLayout, layout, typeMode, setTypeMode, eleBeingModified, setEleBeingModified, nedgeInProgress, setNedgeInProgress){
    switch(eventKind){
        case "key": 
            generalKeyResponses(key, event, cyRef, firebaseRef, lastTwo, lastEdgeName, 
                typeaheadRef, setEleNames, typeMode, setTypeMode, eleBeingModified, setEleBeingModified, nedgeInProgress, setNedgeInProgress);
            break;
        case "cy&window":
            cytoscapeEvents(cyRef, lastTwo, setLastTwo, lastEdgeName, 
                setLastEdgeName, firebaseRef, typeaheadRef, 
                firstLayout, setFirstLayout, layout, setEleNames,
                typeMode, setTypeMode, eleBeingModified, setEleBeingModified);
            windowEvents(cyRef);
            break;
    }
}
export function save(cy, firebaseRef){
    //@ts-ignore
    // let mode = document.getElementById('codeSelection').value;
    // firebaseRef.child("Users").child(mode).set(JSON.stringify(elements.jsons()));
    
    // localStorage.setItem('graphitems', JSON.stringify(cy.elements().jsons()));
    //Operate the snackbar
    firebase.database().ref().child('elements').set(JSON.stringify(cy.elements().jsons()));
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}
export const test = (cy) =>{
    // cy.style().update();
    // cy.nodes().forEach((ele)=> {
    //     ele.data('emphasis', 1);
    // })
    
    // console.log(cy.nodes()[0].data(), cy.edges()[0].data());
    // let pr = cy.elements().pageRank();
    // let arrEles = cy.nodes().toArray();
    // let rankings = arrEles.map((ele)=> {
    //     pr.rank(ele);
    // });
    // cy.nodes().forEach((ele)=>{
    //     ele.data('emphasis', 20*pr.rank(ele));
    // });
    // cy.on('tap', (event)=> {
    //     if(event.target!==cy && event.target.isNode()){
    //         event.target.data('emphasis', 25*pr.rank(event.target));
    //     }
    // })
    // console.log(rankings);
    let emphases = calclulateEmphasis(cy);
    console.log(emphases);
    cy.nodes().forEach((ele) => {
        ele.data('emphasis', emphases[ele.id()])
    });

    //cy.nodes().style('width')
    
}
export const flip = (cy, lastTwo, event) => {
event.preventDefault();
    lastTwo.switch(cy);
}
export function confMessage(cy, e){
    var confirmationMessage = "\o/";
  
    (e || window.event).returnValue = confirmationMessage; //Gecko + IE
    return confirmationMessage;                            //Webkit, Safari, Chrome
}
function saveWhichUser(){
    //@ts-ignore
    localStorage.setItem('User', document.getElementById('codeSelection').value);
}
export const getElementData = (cy) => {
    let data = cy.nodes(':visible').map((ele) => {
        return ele.data();
    });
    //console.log(data);
    return data;
}
export const setMenuOptions = (cy, setEleNames) => {
    let sorted = getElementData(cy).sort((a,b)=>{
        return ((a.name<b.name) ? -1 : 1)
    });
    setEleNames(sorted);
    return sorted;
}

