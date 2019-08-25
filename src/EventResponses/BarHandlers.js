import {barSelect} from '../Old/FocusLevels';
import { database } from 'firebase';

export const clear = (typeahead) => {
    typeahead.clear();
}
const BarHandler = (selected, cy, ele, typeahead, mode) => {
    console.log('changeOnned baby')
    if(selected.length==1){
        switch(mode){
            case "search": 
                console.log('search')
                try{
                    barSelect(cy, selected[0].id);
                } catch(Exception){}
                typeahead.blur();
                break;
            case "rename": //this is not where the rename part goes
                // console.log('called');
                // ele.data('name', selected[0].name);
                break;
    
            case "create": 
            default: console.warn("Mode given as input to bar handler is ", mode, ", which is not valid. \
                Must be either search, rename, or clear");
        }
    }
    
}
export default BarHandler;

export const inputChangeHandler = (text, event, mode, ele) => {
    switch(mode){
        case "rename": 
            ele.data('name', text);

    }
}
export const onBlurHandler = (mode, setTypeMode) => {
    switch(mode){
        case "rename": 
            setTypeMode('search');
    }
}
