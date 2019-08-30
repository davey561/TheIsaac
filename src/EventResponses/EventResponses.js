import {runLayoutDefault, randomFCoseLayout, randomLayout, traversalLayout} from '../Old/Layout';
import defaultOptions from '../Defaults/defaultOptions';
import firebase from 'firebase';
import cytoscape from 'cytoscape/dist/cytoscape.esm';
import {addNode, retrieveNewName, addEdge, findGoodLocationForNewNode, 
    newEdgePrompt, addNewEdge,addNewEdge2, updatePotentialEdge, 
    findUniqueName, nedge, nodify, edgify, addEdgeSmart, deleteAll, deleteSome, addNodeSmart, DEF_EDGE_WEIGHT} 
    from "../Old/ModifyGraph";
import {runLayout, colaLayout, dagreLayout, fCoseLayout} from '../Old/Layout';
import { saveToText } from '../Old/ConvertToBullets';
import {quickSelect, barSelect} from '../Old/FocusLevels';
import {numberKeyDown, arrAvg} from '../Old/Miscellaneous';
import { cytoscapeEvents } from './CyEvents';
import {generalKeyResponses} from './KeyResponses';
import windowEvents from './WindowEvents';
import { calculateEmphasis } from '../Emphasis';

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
                typeaheadRef, setEleNames, typeMode, setTypeMode, eleBeingModified, setEleBeingModified, nedgeInProgress, setNedgeInProgress, firebaseRef);
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
export function save(cy, firebaseRef, showSaved){
    //@ts-ignore
    // let mode = document.getElementById('codeSelection').value;
    // firebaseRef.child("Users").child(mode).set(JSON.stringify(elements.jsons()));
    
    // localStorage.setItem('graphitems', JSON.stringify(cy.elements().jsons()));
    //Operate the snackbar
    firebase.database().ref().child('elements').set(JSON.stringify(cy.elements().jsons()));
    if(showSaved){
        var x = document.getElementById("snackbar");
        x.className = "show";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }
}
export const test = (cy) =>{
        let i = 0;


        cy.edges().forEach((edge) => {
            if(typeof edge.data('weight') === 'undefined'){
                edge.data('weight', DEF_EDGE_WEIGHT);
            }
        })
        // cy.nodes().forEach((node)=>{
        //     node.data('emphasis', 8*(2+node.degree()));
        // })
        // console.log(cy.nodes().toArray().map((ele)=> ele.width()));
        
        // cy.nodes().forEach((node) => {
        //     console.log('home connection for ', node.data('name'), ": ", node.data('home-connection'));
        //    // if(!typeof node.data('home-connection')){
        //         node.data('home-connection', 0.00001);
        //         node.data('emphasis', 1);
        //     //}
        // });

        // let emphases;
        // let hello = setTimeout(()=>{
        //         // let goose = cy.$('[name = "maddie"]');
        //         // //console.log('goose"s home connection', goose.data('home-connection'));
        //         // if(i>=1) goose.data('home-connection', 2/ Math.sqrt(i));
        //     emphases = calculateEmphasis(cy, 10, 1);
        //     console.log(emphases);
        //     cy.nodes().forEach((ele) => {
        //         ele.data('emphasis', emphases[ele.id()])
        //     });
        //     i++;
        // }, 1000);
        let emphases = calculateEmphasis(cy, 1, 1);
       // console.log(emphases);
        cy.nodes().forEach((ele) => {
            ele.data('emphasis', emphases[ele.id()])
        });
        let widths = cy.nodes().toArray().map((ele)=> ele.width())
        console.log(emphases);
        

        
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
        return ((a.emphasis>b.emphasis) ? -1 : 1)
    });
    setEleNames(sorted);
    return sorted;
}

