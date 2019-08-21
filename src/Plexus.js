
import React, {useState, useEffect, useLayoutEffect} from 'react';
import PropTypes from 'prop-types';

import CytoscapeComponent from 'react-cytoscapejs';
import {Typeahead, Menu, MenuItem} from 'react-bootstrap-typeahead';
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

import { runLayout, traversalLayout } from './Old/Layout';
import { save, confMessage, setMenuOptions } from './Old/EventResponses';
import {generalKeyResponses, alphabetResponses, numberKeyResponses, typeaheadResponses} from './Old/KeyResponses';
import { saveToText } from './Old/ConvertToBullets';
import LastTwo from './Old/LastTwo';
import { cytoscapeEvents } from './Old/CyEvents';
import {addEdgeSmart, addNodeSmart} from './Old/ModifyGraph';
import { quickSelect, barSelect } from './Old/FocusLevels';
import windowEvents from './Old/WindowEvents';
import { async } from 'q';

import logo from './plexusloading.gif';

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
    const [lastTwo, setLastTwo] = useState(new LastTwo());
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
    
    //need to do this in hacky way
    //const[menuResults, setMenuResults] = useState([]);
    let menuResults;

    //Return updated stylesheet (with new value for label)
    const getStyle = () => {
        return defaultOptions.style;
    }
    const setFitToTrue = (layout) => {
        let realLayout = {...layout};
        //first,unrelatedly, change fit setting of layout to true
        realLayout.fit=true;
        realLayout.animate= 'end';  
        realLayout.animationEasing='ease-in-out-quint'; 
        realLayout.animationDuration= 2.5*ANIMATION_DURATION;
        realLayout.refresh=50;
        realLayout.randomize=false;
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
            //Then create list of element ids--OBSOLETE, NOW DONE IN CYEVENTS
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
                firstLayout, setFirstLayout, layout, setEleNames);
            windowEvents(cyRef, setRepeatTracker);
            setMenuOptions(cyRef, setEleNames);
        }
    }, [loading]);
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
                    &nbsp;
                    <Button id="addNodeButton" variant="outline-primary" className="newButton" size="lg"
                        onClick={()=>{addNodeSmart(cyRef,5);}}>Add Node</Button>
                    <Button id='lasttwo' variant="outline-primary" className="newButton" size='lg'
                        onClick={()=>addEdgeSmart(cyRef,lastEdgeName, lastTwo)}>&#10233;</Button>
                </ButtonToolbar>
                <KeyboardEventHandler 
                    className="bar"
                    handleKeys={['shift', 'enter']}
                    onKeyEvent={(key, event)=>typeaheadResponses(key, event, cyRef, typeaheadRef, menuResults)}>
                    
                    <Typeahead 
                        //className = "bar"
                        id = "searchSuggest"
                        ref={(typeahead) => typeaheadRef = typeahead}
                        onChange={(selected) => {
                            setLabel(selected)
                        }}
                        onInputChange={(text, event) => {
                            setLabel(text)
                        }}
                        options={eleNames}
                        selectHintOnEnter={true}
                        highlightOnlyResult={true}
                        maxResults={10}
                        //onKeyDown={(evt) => clear(evt)}
                        labelKey='name'
                        renderMenu={(results, menuProps) => 
                            {
                                menuResults = results;
                                return (<Menu {...menuProps}>
                                {results.map((result, index) => (
                                    <MenuItem option={result} position={index}>
                                    {result.name}
                                    </MenuItem>
                                ))}
                                </Menu>)
                            }
                        }
                    />
                </KeyboardEventHandler>
            </div>
            {loading ?
                <p id='loading'>
                    <img src={logo} id='loader'></img> <br></br>
                    Awaking...
                </p> :
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
                    generalKeyResponses(key, event, cyRef, firebaseRef, lastTwo, lastEdgeName, 
                                repeatTracker, typeaheadRef, setEleNames)
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

