
import React, {useState, useEffect, useLayoutEffect} from 'react';
import PropTypes from 'prop-types';

import CytoscapeComponent from 'react-cytoscapejs';
import {Typeahead} from 'react-bootstrap-typeahead';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { ButtonToolbar, Button } from 'react-bootstrap';

import cytoscape from 'cytoscape';

import fcose from 'cytoscape-fcose';
import dagre from 'cytoscape-dagre';
import cola from 'cytoscape-cola';
import coseBilkent from 'cytoscape-cose-bilkent';
import euler from 'cytoscape-euler';

import firebase from 'firebase';

import 'react-bootstrap-typeahead/css/Typeahead.css'
import defaultOptions, { ANIMATION_DURATION } from './Old/defaultOptions'

import { runLayout, runLayout2 } from './Old/Layout';
import { save, allEvents, numberKeyResponses, confMessage, alphabetResponses } from './Old/EventResponses';
import { saveToText } from './Old/ConvertToBullets';
import LastTwo from './Old/LastTwo';
import { cytoscapeEvents } from './Old/CyEvents';
import {addEdgeSmart, addNodeSmart} from './Old/ModifyGraph';
import { quickSelect, barSelect } from './Old/FocusLevels';
import windowEvents from './Old/WindowEvents';
import { async } from 'q';

cytoscape.use(fcose);
cytoscape.use(cola);
cytoscape.use(dagre);
cytoscape.use(coseBilkent);
cytoscape.use(euler);

function Plexus(props){
    const [layout, setLayout] = useState(defaultOptions.layout);
    const [eles, setEles] = useState([]);
    const [eleNames, setEleNames] = useState([]);
    const [firebaseRef, setRef] = useState();
    const [label, setLabel] = useState("Davey");
    const [stylesheet, setStylesheet] = useState([{ 
        selector: 'node',
        style: {
            "font-family": "Optima",
            'text-border-width': '5px', 'label': label
        }
    }]);
    const [lastTwo, setLastTwo] = useState(new LastTwo());
    const [lastTwoText, setLastTwoText] = useState();
    const [lastEdgeName, setLastEdgeName] = useState("");

    //constants pertaining specifically to keypress responses
    const [repeatTracker, setRepeatTracker] = useState(false);
    const [enteredText, setEnteredText] = useState("");
    const [typeMode, setTypeMode] = useState("search");
        //typeMode can be "search", "rename", or "create"

    let cyRef = React.createRef();
    let typeaheadRef = React.createRef();
    //let firebaseRef;
    const[firstLayout, setFirstLayout] = useState(true);
    const [fl, setFl] = useState(true);
    const [loading, setLoading] = useState(true);

    //Return updated stylesheet (with new value for label)
    const getStyle = () => {
        return defaultOptions.style;
    }
    const clear = (evt) => {
        if(evt.keyCode==13){
            // setEnteredText(typeaheadRef.getInput());
            console.log(typeaheadRef.getInput());
            //Zoom into the search term node
            barSelect(cyRef, typeaheadRef.getInstance().getInput().value);
            
            typeaheadRef.clear();
            typeaheadRef.blur();
        }
    }
    const getElementNames = () => {
        return cyRef.nodes().map((ele) => {
            return ele.data('name');
        });
    }
    const getElements = () => {
        return cyRef.elements();
    }
    const clear1= () => {
        typeaheadRef.getInstance().clear();
    }
    const setFitToTrue = (layout) => {
        let realLayout = {...layout};
        //first,unrelatedly, change fit setting of layout to true
        realLayout.fit=true;
        realLayout.animate= 'end';  
        realLayout.animationEasing='ease-in-sine'; 
        realLayout.animationDuration= 2*ANIMATION_DURATION;
        realLayout.refresh=50;
        //realLayout.ease
        return realLayout;
    }

    //For testing in this layout branch mode
    //THIS IS THE NEWLY COMMENTED PART
    useEffect(() => {
        const fetchData = async () => {
            // //Store firebase reference
            let ref = firebase.database().ref().child('elements');
            // //Retrieve elements data
            ref.once('value').then(async (snap) => {
                // console.log(snap.val())
                await setEles(JSON.parse(snap.val()))
                //Store firebase reference
                await setRef(ref);
                //Set loading to false
                await setLoading(false);
                return JSON.parse(snap.val())
            })

           // setEles(defaultOptions.Potter);


            //Then create list of element ids. 
            //COMMENTED OUT BECAUSE CYREF NOT NECESSARILY LOADED YET.
            //IT WAS WORKING BEFORE BUT DON'T WANT TO MESS WITH ORDER IN UNCERTAIN TERRITORY 
    
            // .then(eles => {
            //   setEleNames(getElementNames(eles));
            // });
    
            
        }
        fetchData();
    }, []);
    useEffect(() => {
        if(!loading){
            //event responses (nonkey)
            cytoscapeEvents(cyRef, lastTwo, setLastTwo, lastEdgeName, 
                setLastEdgeName, firebaseRef, typeaheadRef, 
                firstLayout, setFirstLayout, layout);
            windowEvents(cyRef, setRepeatTracker);
        }
    }, [loading]);
    useEffect(()=>{
        if(!loading){
            setEleNames(getElementNames());
        }
    }, [cyRef])
    return (
        <div>
            <br></br>
            <div id='top'>
            <ButtonToolbar className="button-container"> 
                <Button id="layoutButton" variant="outline-secondary" className="newButton" size='sm'
                    onClick={() => runLayout(cyRef, cyRef.elements(), defaultOptions.layout)}>Layout</Button>
                <Button variant="outline-secondary" className="newButton" size='sm'
                    onClick={() => save(cyRef, firebaseRef)}>Save</Button>
                <Button id="downloadButton" variant="outline-secondary" className="newButton" size='sm'
                    onClick={() => saveToText(cyRef)}>Download</Button>
                &nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;
                <Button id="addNodeButton" variant="outline-primary" className="newButton" size="lg"
                    onClick={()=>{addNodeSmart(cyRef,5);}}>Add Node</Button>
                <Button id='lasttwo' variant="outline-primary" className="newButton" size='lg'
                    onClick={()=>addEdgeSmart(cyRef,lastEdgeName, lastTwo)}>&#10233;</Button>
                &nbsp;&nbsp;&nbsp;&nbsp;
            </ButtonToolbar>
            <Typeahead 
                    className = "bar"
                    id = "searchSuggest"
                    ref={(typeahead) => typeaheadRef = typeahead}
                    onChange={(selected) => {
                        setLabel(selected)
                    }}
                    onInputChange={(text, event) => {
                        //workaround for space bar
                        {/* if(text===' '){
                            typeaheadRef.getInstance().clear();
                        } */}
                        setLabel(text)
                    }}
                    //inputProps={onFocus}
                    options={eleNames}
                    selectHintOnEnter={true}
                    highlightOnlyResult={true}
                    maxResults={10}
                    //onFocus={()=>clear1()}
                    onKeyDown={(evt) => clear(evt)}
                />
            {/* <h3 id = 'lasttwo' className="potential">&#160;&#160;&#160;&#160;&#10233;&#160;&#160;&#160;&#160;</h3> */}
            </div>
            {loading ?
                <p id='loading'>Awakening...</p> :
                <CytoscapeComponent
                    autoFocus
                    id='cy'
                    elements={eles}
                    style={ { width: '100%', height: '740px' }}
                    stylesheet={ getStyle() }
                    layout={setFitToTrue(layout)}
                    cy={(cy) => { cyRef = cy }}
                />}
            <KeyboardEventHandler
                handleKeys={['shift+e', 'shift+n', 'shift+space', 'shift+r', 'shift+backspace', 
                    'shift+space', 'shift+enter', 'shift+l', 'shift+a', 'shift+d', 'shift+t',
                    'meta+s', 'meta+d', 'meta+z', 'meta+y', 'command+shift+enter', "shift+backspace",
                    'command+shift+backspace', 'shift+b',
                     'ctrl+d', 'all']}
                onKeyEvent={(key, event) => 
                   allEvents(key, event, cyRef, firebaseRef, lastTwo, lastEdgeName, repeatTracker, typeaheadRef)
                } 
            />
            <KeyboardEventHandler
                handleKeys={['numeric']}
                onKeyEvent={(key, event) => {numberKeyResponses(cyRef, key)}
                } 
            />
            <KeyboardEventHandler
                handleKeys={['alphabetic']}
                onKeyEvent={(key, event) => {alphabetResponses(cyRef, key, typeaheadRef)}
                } 
            />
            {/* <p>{label}</p> */}
            <div id="snackbar">
                Memorized
            </div>
        </div>
    );
}
Plexus.propTypes = {
    eles: PropTypes.array,
    stylesheet: PropTypes.array
};
export default Plexus;

