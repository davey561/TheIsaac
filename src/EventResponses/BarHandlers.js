import {barSelect} from '../Old/FocusLevels';
import { database } from 'firebase';
import React from 'react';
import {Typeahead, Menu, MenuItem} from 'react-bootstrap-typeahead';

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
                break;
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
        case "create":
            ele.data('name', text);

    }
}
export const onBlurHandler = (mode, setTypeMode) => {
    switch(mode){
        case "rename": case "create":
            setTypeMode('search');
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
            console.log(eleNames);
            setBarOptions(retrieveBarOptions(eleNames).search);
            console.log('set bar menu options for search as: ', retrieveBarOptions(eleNames).search.options)
            break;
        case "rename":
            setBarOptions(retrieveBarOptions(eleNames).rename);
            break;
        case "create": 
            setBarOptions(retrieveBarOptions(eleNames).create);
            break;
    }
}
