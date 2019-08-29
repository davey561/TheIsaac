
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
import defaultOptions from './Defaults/defaultOptions'
import { runLayout, makeChangesForInitialLayout } from './Old/Layout';
import { save, setMenuOptions, eventResponses, eventResponseParameters } from './EventResponses/EventResponses';
import { alphabetResponses, numberKeyResponses, typeaheadResponses, shiftNumbersList} from './EventResponses/KeyResponses';
import BarHandler, { onBlurHandler, setBarSettings} from './EventResponses/BarHandlers';
import { saveToText } from './Old/ConvertToBullets';
import LastTwo from './Old/LastTwo';
import {addEdgeSmart, addNodeSmart, nedge} from './Old/ModifyGraph';
// import { async } from 'q';
import logo from './plexusloading.gif';

// //Plexus Components
// import Buttons from './Buttons';
// import SampleComponent from './SampleComponent';

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
    const [stylesheet, setStylesheet] = useState(defaultOptions.style);
    const [nedgeInProgress, setNedgeInProgress] = useState({ongoing: false, ele: {}});

    //Relating to keypress responses
    const [firstLayout, setFirstLayout] = useState(true);
    const [typeMode, setTypeMode] = useState("search"); //the mode of the universal search bar...
        //either "search", "rename", or "create"
    //props for Typeahead (universal bar) component
    const [barOptions, setBarOptions] = useState({
        allowNew: false,
        inputHandler: () => {},
        options: eleNames
    });
    const [eleBeingModified, setEleBeingModified] = useState(-1);
    const [currentName, setCurrentName] = useState("Davey");

    //Component references
    let cyRef = React.createRef();
    let typeaheadRef = React.createRef();


    const [loading, setLoading] = useState(true); //Whether the program is still initializing

    const [homeEmphasis, setHomeEmphasis] = useState() //How much emphasis the hidden homenode has
    
    // Had to do menuResults storings in hacky way, because Typeahead component is lacking
        //In particular, typeahead component doesn't allow retrieval of current menu results,
            //except through assigning a function to the renderMenu prop
    let menuResults; //NOT: const[menuResults, setMenuResults] = useState([]);

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

        //don't render at first with labels, make it's more scratchy

    }, []);

    //After load
    useEffect(() => {
        if(!loading){
            //All non-key-press event responses
            eventResponses(null, null, "cy&window", ...eval(eventResponseParameters));

            //Initially set the options for the universal bar, later updating gets done in CyEvents
            let s = setMenuOptions(cyRef, setEleNames); 
            setBarSettings(setBarOptions, typeMode, menuResults, s);
            //TESTING
            // let input = typeaheadRef.getInstance().getInput();
            // input.onchange = () => console.log('input value: ', input.value);
        }
        console.log('useeffect for [loading]')
    }, [loading]);
    useEffect(()=> {
        console.log("type mode is now: ", typeMode);
        setBarSettings(setBarOptions, typeMode, menuResults, eleNames);
        //setOnChangeHandler();
    }, [typeMode]);

    //for testing purposes
    useEffect(()=> {
        let s = eleBeingModified.data ? eleBeingModified.data('name'): "not defined"
        console.log("element being modified is now: ", s);
        console.log(typeMode);
        console.log(barOptions)
        setCurrentName(getDefInputVal());

        // if(typeaheadRef.getInstance){
        //     typeaheadRef.getInstance().getInput().value = "Davey";

        //     // typeaheadRef.getInstance().getInput().value = getDefInputVal();
        //     // console.log('setting input to ', getDefInputVal())
        // }
        
        //setOnChangeHandler();
    }, [eleBeingModified]);

    // useEffect(()=>{
    //     if(!loading){
    //         setMenuOptions(cy, setEleNames);
    //     }
    // }, [cyRef])
    const getDefInputVal=() => {
        if(eleBeingModified.data){
            console.log('eleBeingmodified name, ', eleBeingModified.data('name'));
            return eleBeingModified.data('name')
        } else{
            return "";
        }
    }
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
                                onClick={() => save(cyRef, firebaseRef, true)}>Save</Button>
                            <Button id="downloadButton" variant="outline-secondary" className="newButton" size='sm'
                                onClick={() => saveToText(cyRef)}>Download</Button>
                            &nbsp;
                            <Button id="addNodeButton" variant="outline-primary" className="newButton" size="sm"
                                onClick={()=>{addNodeSmart(cyRef, setEleBeingModified, typeaheadRef, setTypeMode);}}>Add Node</Button>
                            <Button id='lasttwo' variant="outline-primary" className="newButton" size='sm'
                                onClick={()=>addEdgeSmart(cyRef,lastEdgeName, lastTwo, setEleBeingModified, typeaheadRef, setTypeMode)}>Add Edge: &nbsp; __ &#10233; __</Button>
                        </ButtonToolbar>
                        <div id = 'zoom'>
                            {/* <img id='zoomIcon' src={require('./detective.png')}></img> */}
                            <h4  id='zoomLevel' className='chancery'></h4>
                        </div>
                        <KeyboardEventHandler 
                            className="bar"
                            handleKeys={['esc', 'enter']}
                            onKeyEvent={(key, event)=>typeaheadResponses(key, event, cyRef, typeaheadRef, menuResults, typeMode)}>
                            <Typeahead
                                id = "searchSuggest"
                                ref={(typeahead) => typeaheadRef = typeahead}
                                onInputChange={(text, event) => {
                                   // console.log("value of input: ", typeaheadRef.getInstance().getInput().value)
                                    barOptions.inputHandler(text, event, typeMode, eleBeingModified);
                                }} 

                                newSelectionPrefix="(new) "
                                //allowNew={barOptions.allowNew}
                                allowNew={barOptions.allowNew}
                                onChange={(selected) => {
                                    BarHandler(selected, cyRef, eleBeingModified, typeaheadRef, typeMode);
                                }}
                                options={barOptions.options}
                                //emptyLabel={"Fuck the fuckers"}
                                selectHintOnEnter={true}
                                maxResults={10}
                                //defaultSelected = {[barOptions.defaultInputValue]}
                                /* defaultInputValue={(eleBeingModified.data && eleBeingModified.data('name')?
                                         "Davey": ""
                                )}  */
                                //defaultInputValue="Davey"
                               // defaultInputValue={currentName}
                                //highlightOnlyResult={true}
                                onFocus={()=> console.log(barOptions.options)}
                                onBlur={() => onBlurHandler(typeMode, setTypeMode, nedgeInProgress, setNedgeInProgress, setEleBeingModified, typeaheadRef)}
                                labelKey='name'
                            />
                        </KeyboardEventHandler>
                    </div>
                    <CytoscapeComponent
                        autoFocus
                        id='cy'
                        elements={eles}
                        style={ { width: '100%', height: '740px' }}
                        stylesheet={ stylesheet }
                        layout={makeChangesForInitialLayout(layout)}
                        //layout={defaultOptions.layout}
                        cy={(cy) => { cyRef = cy }}
                        /* textureOnViewport={true}
                        hideEdgesOnViewport={true} */
                        pixelRatio='auto'
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
            <KeyboardEventHandler
                handleKeys={shiftNumbersList()}
                onKeyEvent={(key, event) => {numberKeyResponses(cyRef, key)}
                } 
            />
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

