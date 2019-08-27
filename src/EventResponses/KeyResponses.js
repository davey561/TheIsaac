import defaultOptions from '../Defaults/defaultOptions';
import {nedge, nodify, edgify, addEdgeSmart, deleteAll, deleteSome, addNodeSmart, keyRename} 
    from "../Old/ModifyGraph";
import {runLayout, colaLayout, dagreLayout, fCoseLayout, layoutThenFit} from '../Old/Layout';
import { saveToText } from '../Old/ConvertToBullets';
import {save, flip,test} from './EventResponses';
import {barSelect} from '../Old/FocusLevels';

export function generalKeyResponses(key, event, cy, database, lastTwoObj, 
    lastEdgeAdded, typeahead, setEleNames, typeMode, setTypeMode,
    eleBeingModified, setEleBeingModified, nedgeInProgress, setNedgeInProgress, firebaseRef) {
   // console.log(`key: ${key}`);
    switch(key){
        //case 'shift': typeahead.getInstance().blur(); break;
        
        //Layouts
        case 'shift+l': runLayout(cy, cy.elements(), defaultOptions.layout); break;
        case 'shift+a': colaLayout(cy); break;
        case 'shift+d': dagreLayout(cy); break;

        //Test
        case 'shift+t': test(cy); break;

        //Backing up
        case 'meta + s': event.preventDefault(); save(cy, firebaseRef); break;
        case 'meta + d': event.preventDefault(); saveToText(cy); break;
        case 'meta + z': event.preventDefault(); break;
        case 'meta + y': event.preventDefault(); break;
        
        //Modifying the graph
        case 'shift+space': event.preventDefault(); addNodeSmart(cy, setEleBeingModified, typeahead, setTypeMode); break;
        case 'shift+enter': addEdgeSmart(cy, lastEdgeAdded, lastTwoObj, setEleBeingModified, typeahead, setTypeMode); break;
        case 'shift+n': nodify(cy); break;
        case 'shift+e': edgify(cy); break;
        case 'command+shift+enter': nedge(cy, lastTwoObj, setEleBeingModified, typeahead, setTypeMode, setNedgeInProgress); break;
        case 'shift+r': event.preventDefault(); keyRename(cy, setTypeMode, typeahead, setEleBeingModified, "rename"); break; //rename
        case 'command+shift+backspace': deleteAll(cy); break;
        case 'shift+backspace': deleteSome(cy); break;

        //Search/Select
        case 'space': break; //Search, rather than traverse (traverse gets triggered just by typing)
        case 'esc': 
            typeahead.getInstance().blur(); 
            cy.elements().unselect(); 
            break;

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
export const numberKeyResponses = (cy, key) => {
    let component = cy.elements().components()[parseInt(key.slice(-1))];
    layoutThenFit(cy, cy.elements(), component, defaultOptions.fCoseOptions);
}
export const shiftNumbersList = () =>{
    let result = [...Array(10).keys()].map((ele)=>
    `shift+${ele}`
    );
    return result;
}
export const alphabetResponses = (cy, key, typeahead) => {
    let instance = typeahead.getInstance();
    instance.clear();
    instance.focus();
}
export const typeaheadResponses = (key, event, cy, typeahead, menuResults, mode)=>{
    switch(key){
        case 'enter':  
            enterResponses(mode, typeahead);
            break;
        case 'esc': event.preventDefault(); typeahead.blur(); typeahead.clear(); break;
    }
}
export const enterResponses = (mode, typeahead) => {
    switch(mode){
        case "rename": case "create":
            typeahead.blur();
            break;
    }
}
