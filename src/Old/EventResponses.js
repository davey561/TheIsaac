import {runLayoutDefault, randomFCoseLayout, randomLayout} from './Layout';
import defaultOptions from './defaultOptions';
import firebase from 'firebase';
import cytoscape from '../../node_modules/cytoscape/dist/cytoscape.esm';
import {addNode, retrieveNewName, addEdge, findGoodLocationForNewNode, 
    newEdgePrompt, addNewEdge,addNewEdge2, updatePotentialEdge, 
    findUniqueName, nedge, nodify, edgify, addEdgeSmart, deleteAll, deleteSome, addNodeSmart} 
    from "./ModifyGraph";
import {runLayout, colaLayout, dagreLayout, fCoseLayout} from './Layout';
import { saveToText } from './ConvertToBullets';
import {quickSelect} from './FocusLevels';
import {numberKeyDown} from './Miscellaneous';

export function allEvents(key, event, cy, database, lastTwoObj, lastEdgeAdded, repeatTracker) {
    
    console.log(lastTwoObj);
    console.log(`key: ${typeof key}`);
    switch(key){
        //Layouts
        case 'l': fCoseLayout(cy, repeatTracker); break;
        case 'a': colaLayout(cy); break;
        case 'd': dagreLayout(cy); break;
        case 'shift+r': randomLayout(cy); break;

        //Test
        case 't': test(cy); break;
        case 'ctrl+b': window.alert('f word'); break;

        //Backing up
        case 's': save(cy); break;
        case 'ctrl+d': saveToText(cy); break;
        case 'z': break;
        case 'y': break;
        
        //Modifying the graph
        case 'n': addNodeSmart(cy); break;
        case 'e': addEdgeSmart(cy, lastEdgeAdded, lastTwoObj); break;
        case 'shift+n': nodify(cy); break;
        case 'shift+e': edgify(cy); break;
        case 'enter': nedge(cy, lastTwoObj); break;
        case 'r': break;
        case 'shift+backspace': deleteAll(cy); break;
        case 'backspace': deleteSome(cy); break;

        //Search/Select
        case 'space': quickSelect(cy); break;
        case 'shift+space': break;
        case 'esc': cy.elements().unselect(); break;

        //Multipurpose
        case 'tab': flip(cy, lastTwoObj, event); break;

        //zoom/pan
        case 'up':
        case 'down': 
        case 'right':
        case 'left':
            break;
        case 'plus':
        case 'minus':
            break;
        case 'b': break;

        case 'numeric': console.log('numbers recognized'); break;


    }
}

export function save(cy, firebaseRef){
    //before saving, remove all style classes
    // cy.nodes().classes('');
    // let elements = cy.elements();
    //@ts-ignore
    // let mode = document.getElementById('codeSelection').value;
    // firebaseRef.child("Users").child(mode).set(JSON.stringify(elements.jsons()));
    
    // localStorage.setItem('graphitems', JSON.stringify(cy.elements().jsons()));
    //Operate the snackbar
    
    
       //window.alert('saving');
        firebase.database().ref().child('elements').set(JSON.stringify(cy.elements().jsons()));
        var x = document.getElementById("snackbar");
        x.className = "show";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    // } catch (Exception) {
    //    // window.alert('catching');
    // }
}
const test = (cy) =>{
    // cy.style().update();
}
const flip = (cy, lastTwo, event) => {
event.preventDefault();
    lastTwo.switch(cy);
}
export const numberKeyResponses = (cy, key) => {
    let component = cy.elements().components()[parseInt(key)];
    runLayoutDefault(component);
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
