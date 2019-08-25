
//React
import React, {useState, useEffect, Fragment} from 'react';
import PropTypes from 'prop-types';

//Other Components
import CytoscapeComponent from 'react-cytoscapejs';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { ButtonToolbar, Button } from 'react-bootstrap';
import {Typeahead, Menu, MenuItem} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css'

//Cytoscape
import cytoscape from 'cytoscape';

//Cytoscape Layouts
import fcose from 'cytoscape-fcose';
import dagre from 'cytoscape-dagre';
import cola from 'cytoscape-cola';
import coseBilkent from 'cytoscape-cose-bilkent';
import euler from 'cytoscape-euler';

//Firebase
import firebase from 'firebase';

//Plexus files
import defaultOptions, { ANIMATION_DURATION } from './Defaults/defaultOptions'
import { runLayout, traversalLayout, makeChangesForInitialLayout } from './Old/Layout';
import { save, confMessage, setMenuOptions, eventResponses, eventResponseParameters } from './EventResponses/EventResponses';
import {generalKeyResponses, alphabetResponses, numberKeyResponses, typeaheadResponses} from './EventResponses/KeyResponses';
import BarHandler, { inputChangeHandler, onBlurHandler, clear, focusHandler} from './EventResponses/BarHandlers';
import { saveToText } from './Old/ConvertToBullets';
import LastTwo from './Old/LastTwo';
import { cytoscapeEvents } from './EventResponses/CyEvents';
import {addEdgeSmart, addNodeSmart} from './Old/ModifyGraph';
import windowEvents from './EventResponses/WindowEvents';
import { async } from 'q';
import logo from './plexusloading.gif';

//Plexus Components
import Buttons from './Buttons';
import SampleComponent from './SampleComponent';

//Register external layouts
cytoscape.use(fcose);
cytoscape.use(cola);
cytoscape.use(dagre);
cytoscape.use(coseBilkent);
cytoscape.use(euler);

//The Plexus Component
function Plexus(props){
    const [layout, setLayout] = useState(defaultOptions.layout); //initial layout
    const [eles, setEles] = useState([]); //initial set of elements
    const [eleNames, setEleNames] = useState([]); //dynamically updating set of element names
    const [firebaseRef, setRef] = useState(); //reference to Firebase database
    const [label, setLabel] = useState("Davey"); //for debugging purposes; will eventually be removed once 'rename' uses universal top bar
    const [lastTwo, setLastTwo] = useState(new LastTwo()); //object that stores the last two nodes with which the user interacted
    const [lastEdgeName, setLastEdgeName] = useState(""); //the name of the last edge added, to be used as default when adding new edge

    //Relating to keypress responses
    const [enteredText, setEnteredText] = useState("");
    const [typeMode, setTypeMode] = useState("search");
    //export {setTypeMode};
    const [barOptions, setBarOptions] = useState({
        allowNew: true,
        renderMenu: ()=>{},
        inputHandler: () => {},
        focusHandler: () => typeaheadRef.getInstance().clear(),
        //defaultInputValue: (x) => {}

    });
    const [eleBeingModified, setEleBeingModified] = useState(-1);
    const [defaultInputValue, setDefaultInputValue] = useState("Davey");
        //typeMode can be "search", "rename", or "create"

    //Component references
    let cyRef = React.createRef();
    let typeaheadRef = React.createRef();
    //let firebaseRef;
    const [cy, setCy] = useState("json");
    //

    const[firstLayout, setFirstLayout] = useState(true); //Whether the first layout has occurred yet
    const [loading, setLoading] = useState(true); //Whether the program is still initializing
    
    // Had to do menuResults storings in hacky way, because Typeahead component is lacking
        //In particular, typeahead component doesn't allow retrieval of current menu results,
            //except through assigning a function to the renderMenu prop
    let menuResults;
    //const[menuResults, setMenuResults] = useState([]);

    //Fetch elements data to start.
    useEffect(() => {
        const fetchData = async () => {
            //Store firebase reference
            let ref = firebase.database().ref().child('elements');
            //Retrieve elements data
            ref.once('value').then(async (snap) => {
                // console.log(snap.val())
                await setEles(JSON.parse(snap.val()))
                //Store firebase reference
                await setRef(ref);
                //Set loading to false
                await setLoading(false);
                //return JSON.parse(snap.val())
            })
        }
        fetchData();
    }, []);

    //After load
    useEffect(() => {
        if(!loading){
            //All non-key-press event responses
            eventResponses(null, null, "cy&window", ...eval(eventResponseParameters));

            //Initially set the options for the universal bar
            setMenuOptions(cyRef, setEleNames);

            setCy(cyRef);
        }
    }, [loading]);
    // useEffect(()=>{
    //     switch(typeMode){
    //         case "search": 
    //             //typeaheadRef.getInstance().getInput().value = lastTwo.getNames()[1]
    //             setDefaultInputValue(lastTwo.target()); break;
    //         case "rename": case "create": 
    //             setDefaultInputValue(eleBeingModified); break;
    //     }
    // }, [lastTwo.lastTwo])
    //for typeahead mode change
    useEffect(()=> {
        switch(typeMode){
            case "search": 
                setBarOptions({
                    allowNew: false,
                    renderMenu: (results, menuProps) => {
                        menuResults = results;
                        return (<Menu {...menuProps}>
                        {results.map((result, index) => (
                            <MenuItem option={result} position={index}>
                            {result.name}
                            </MenuItem>
                        ))}
                        </Menu>)
                    },
                    inputHandler: () => {},
                    //focusHandler: () => clear(typeaheadRef)
                });
                break;
            case "rename":
                setBarOptions({
                    allowNew: true,
                    //renderMenu:
                    inputHandler: inputChangeHandler,
                 //  focusHandler: () => {}

                });
                break;
            case "create": 
                setBarOptions({
                    allowNew: true,
                    //renderMenu: ()=>{},
                    inputHandler: inputChangeHandler,
                    //focusHandler: () => {}
                });
                break;
        }
        setEleNames(eleNames); //no change here
        //setOnChangeHandler();
    }, [typeMode]);

    return (
        <div>
            <br></br>
            {loading ?
                <p id='loading'>
                    Awaking <br>
                    </br><img src={logo} id='loader'></img> 
                </p> :
                <Fragment>
                    {/* <SampleComponent cyRef={"hello"}/> */}
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
                            handleKeys={['esc', 'enter']}
                            onKeyEvent={(key, event)=>typeaheadResponses(key, event, cyRef, typeaheadRef, menuResults, typeMode)}>
                            <Typeahead
                                id = "searchSuggest"
                                ref={(typeahead) => typeaheadRef = typeahead}
                                onInputChange={(text, event) => {
                                    barOptions.inputHandler(text, event, typeMode, eleBeingModified);
                                }} 

                                newSelectionPrefix="(new) "
                                //allowNew={barOptions.allowNew}
                                allowNew={barOptions.allowNew}
                                onChange={(selected) => {
                                    BarHandler(selected, cyRef, eleBeingModified, typeaheadRef, typeMode);
                                }}
                                options={eleNames}
                                selectHintOnEnter={true}
                                maxResults={10}
                                //defaultSelected = {[barOptions.defaultInputValue]}
                                //highlightOnlyResult={true}
                                onBlur={() => onBlurHandler(typeMode, setTypeMode)}
                                labelKey='name'
                                renderMenu={barOptions.renderMenu}
                            />
                        </KeyboardEventHandler>
                    </div>
                    <CytoscapeComponent
                        autoFocus
                        id='cy'
                        elements={eles}
                        style={ { width: '100%', height: '740px' }}
                        stylesheet={ defaultOptions.style }
                        layout={makeChangesForInitialLayout(layout)}
                        cy={(cy) => { cyRef = cy }}
                    />
                </Fragment>
            }
            <KeyboardEventHandler
                handleKeys={['shift+e', 'shift+n', 'shift+space', 'shift+r', 'shift+backspace', 
                    'shift+space', 'shift+enter', 'shift+l', 'shift+a', 'shift+d', 'shift+t',
                    'meta+s', 'meta+d', 'meta+z', 'meta+y', 'command+shift+enter', "shift+backspace",
                    'command+shift+backspace', 'shift+b',
                    'ctrl+d', 'all']}
                onKeyEvent={(key, event) => 
                    eventResponses(key, event, "key", ...eval(eventResponseParameters))
                } 
            />
            {/* <KeyboardEventHandler
                handleKeys={['numeric']}
                onKeyEvent={(key, event) => {numberKeyResponses(cyRef, key)}
                } 
            /> */}
            <KeyboardEventHandler
                handleKeys={['alphabetic', 'numeric']}
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
// Plexus.propTypes = {
//     eles: PropTypes.array,
//     stylesheet: PropTypes.array
// };
export default Plexus;

