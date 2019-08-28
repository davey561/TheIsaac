import {barSelect} from '../Old/FocusLevels';
import { database } from 'firebase';
import React from 'react';
import {Typeahead, Menu, MenuItem} from 'react-bootstrap-typeahead';
//import {getBarReady} from './BarHandlers'

export const clear = (typeahead) => {
    typeahead.clear();
}
const BarHandler = (selected, cy, ele, typeahead, mode) => {
    if(selected.length==1){
        if(mode==='search'){
            try{
                barSelect(cy, selected[0].id);
            } catch(Exception){}
            typeahead.blur();
        }
        //not where the rename and create part go, they're in onInputChange
    }
    
}
export default BarHandler;

export const inputChangeHandler = (text, event, mode, ele) => {
    switch(mode){
        case "rename": case "create":
            ele.data('name', text);

    }
}
export const onBlurHandler = (mode, setTypeMode, nedgeInProgress, setNedgeInProgress, setEleBeingModified, typeahead) => {
    switch(mode){
        case "rename": 
            setTypeMode('search');
            //setEleBeingModified(-1);
            break;
        case "create":
            //communicating with nedge function in ModfiyGraph.js through react state nedgeInProgress
            if(nedgeInProgress.ongoing){
                // console.assert(nedgeInProgress.ele && nedgeInProgress.ele.isNode(), "stored element for nedgeInProgress either isn't defined or isn't a node");
                // setEleBeingModified(nedgeInProgress.ele);
                // nedgeInProgress.ele.select();
                // getBarReady(null, nedgeInProgress.ele, typeahead, "create", "", setTypeMode);
                // setNedgeInProgress({ongoing: false, ele: null});
            } else {
                setTypeMode('search');
               // setEleBeingModified(-1);
            }
                
            
    }
}
export const retrieveBarOptions = (eleNames) => {
    return {
        search: {
            allowNew: false,
            inputHandler: () => {},
            //focusHandler: () => clear(typeaheadRef)
            options: eleNames
        },
        rename: {
            allowNew: true,
            inputHandler: inputChangeHandler,
        //  focusHandler: () => {}
            options: []
        },
        create: {
            allowNew: true,
            inputHandler: inputChangeHandler,
            //focusHandler: () => {}
            options: []
        }
    }
}
export const setBarSettings = (setBarOptions, typeMode, menuResults, eleNames) => {
    switch(typeMode){
        case "search": 
            //console.log(eleNames);
            setBarOptions(retrieveBarOptions(eleNames).search);
            //console.log('set bar menu options for search as: ', retrieveBarOptions(eleNames).search.options)
            break;
        case "rename":
            setBarOptions(retrieveBarOptions(eleNames).rename);
            break;
        case "create": 
            setBarOptions(retrieveBarOptions(eleNames).create);
            break;
    }
}

export function getBarReady(cy, ele, typeahead, mode, defaultName, setTypeMode, setEleBeingModified){
    console.log(ele.data('name'), mode);
   
   
    let instance = typeahead.getInstance();
    let input = instance.getInput();
    instance.focus();
    setEleBeingModified(ele); //for some reason, very important that this is here.
    switch(mode){
      case "search": 
        setTypeMode('search');
        input.select();
        break;
      case "rename": 
        setTypeMode('rename');
        instance.clear();
        console.log('renaming');
        input.value= defaultName;
        input.select();
        instance.focus();
        break;
      case "create": 
        console.log("settignignsldgnlsglksjlk type mode", setTypeMode);
        setTypeMode('create');
        instance.clear();
        input.value = defaultName;
        input.select();
        break;
    }
    
  }
