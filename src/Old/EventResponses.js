import {runLayoutDefault, randomFCoseLayout, randomLayout, traversalLayout} from './Layout';
import defaultOptions from './defaultOptions';
import firebase from 'firebase';
import cytoscape from '../../node_modules/cytoscape/dist/cytoscape.esm';
import {addNode, retrieveNewName, addEdge, findGoodLocationForNewNode, 
    newEdgePrompt, addNewEdge,addNewEdge2, updatePotentialEdge, 
    findUniqueName, nedge, nodify, edgify, addEdgeSmart, deleteAll, deleteSome, addNodeSmart, keyRename} 
    from "./ModifyGraph";
import {runLayout, colaLayout, dagreLayout, fCoseLayout} from './Layout';
import { saveToText } from './ConvertToBullets';
import {quickSelect, barSelect} from './FocusLevels';
import {numberKeyDown} from './Miscellaneous';


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
    let data = cy.nodes().map((ele) => {
        return ele.data();
    });
    console.log(data);
    return data;
}
export const setMenuOptions = (cy, setEleNames) => {
    setEleNames(getElementData(cy).sort((a,b)=>{
        return ((a.name<b.name) ? -1 : 1)
    }));
}

