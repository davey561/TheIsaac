import defaultOptions from './defaultOptions';
import {nedge, nodify, edgify, addEdgeSmart, deleteAll, deleteSome, addNodeSmart, keyRename} 
    from "./ModifyGraph";
import {runLayout, colaLayout, dagreLayout, fCoseLayout} from './Layout';
import { saveToText } from './ConvertToBullets';
import {save, flip} from './EventResponses';
import {barSelect} from './FocusLevels';

export function generalKeyResponses(key, event, cy, database, lastTwoObj, 
    lastEdgeAdded, repeatTracker, typeahead, setEleNames) {
    console.log(`key: ${key}`);
    switch(key){
        //case 'shift': typeahead.getInstance().blur(); break;
        
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
    let component = cy.elements().components()[parseInt(key)];
    runLayout(cy, component, defaultOptions.layout);
}
export const alphabetResponses = (cy, key, typeahead) => {
    typeahead.getInstance().focus();
}
export const typeaheadResponses = (key, event, cy, typeahead, menuResults)=>{
    switch(key){
        case 'enter':  
            console.log(typeahead.getInput());
            //Zoom into the search term node
            try{
                barSelect(cy, menuResults[0].name);
            } catch(Exception){}
            typeahead.clear();
            typeahead.blur(); break;
        case 'shift': typeahead.blur(); typeahead.clear(); break;
    }
}
