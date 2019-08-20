import {runLayoutDefault, randomFCoseLayout, randomLayout, runLayout2} from './Layout';
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

export function keyResponses(key, event, cy, database, lastTwoObj, lastEdgeAdded, repeatTracker, typeahead) {
    
    // console.log(lastTwoObj);
    console.log(`key: ${key}`);
    switch(key){
        case 'shift': typeahead.getInstance().blur(); break;
        //Layouts
        case 'shift+l': runLayout(cy, cy.elements(), defaultOptions.layout); break;
        case 'shift+a': colaLayout(cy); break;
        case 'shift+d': dagreLayout(cy); break;

        //Test
        case 'shift+ t': test(cy); break;

        //Backing up
        case 'meta + s': event.preventDefault(); save(cy); break;
        case 'meta + d': event.preventDefault(); saveToText(cy); break;
        case 'meta + z': event.preventDefault(); break;
        case 'meta + y': event.preventDefault(); break;
        
        //Modifying the graph
        case 'shift+space': addNodeSmart(cy); break;
        case 'shift+enter': addEdgeSmart(cy, lastEdgeAdded, lastTwoObj); break;
        case 'shift+n': nodify(cy); break;
        case 'shift+e': edgify(cy); break;
        case 'command+shift+enter': nedge(cy, lastTwoObj); break;
        case 'shift+r': keyRename(cy, ); break; //rename
        case 'command+shift+backspace': deleteAll(cy); break;
        case 'shift+backspace': deleteSome(cy); break;

        //Search/Select
        case 'shift+space': //typeahead.focus(); 
            typeahead.focus();
        // typeahead.getInstance().clear();
            break;
        case 'esc': typeahead.getInstance().blur(); cy.elements().unselect(); break;

        //Multipurpose
        case 'tab': event.preventDefault(); flip(cy, lastTwoObj, event); break;

        //zoom/pan
        case 'up':
        case 'down': 
        case 'right':
        case 'left':
            break;
        case 'plus':
        case 'minus':
            break;
        case 'shift+b': break;

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
    runLayout(cy, component, defaultOptions.layout);
}
export const alphabetResponses = (cy, key, typeahead) => {
    typeahead.getInstance().focus();
}
export const typeaheadResponses = (key, event, cy, typeahead)=>{
    switch(key){
        case 'enter':  
            console.log(typeahead.getInput());
            //Zoom into the search term node
            barSelect(cy, typeahead.getInstance().getInput().value);
            typeahead.clear();
            typeahead.blur(); break;
        case 'shift': typeahead.blur(); typeahead.clear(); break;
    }
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

