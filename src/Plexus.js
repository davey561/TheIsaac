
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

import firebase from 'firebase';

import 'react-bootstrap-typeahead/css/Typeahead.css'
import defaultOptions from './Old/defaultOptions'

import { runLayout, runLayout2 } from './Old/Layout';
import { save, allEvents, numberKeyResponses, confMessage } from './Old/EventResponses';
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

function Plexus(props){
    const [layout, setLayout] = useState(defaultOptions.fCoseOptions);
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
            
            //typeaheadRef.clear();
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
        typeaheadRef.clear();
    }

    //Things to do just on load
    useEffect(() => {
        const fetchData = async () => {
            //Store firebase reference
            let ref = firebase.database().ref().child('elements');
            //Retrieve elements data
            ref.once('value').then(snap => {
                // console.log(snap.val())
                setEles(JSON.parse(snap.val()))
                return JSON.parse(snap.val())
            })
            //Then create list of element ids. 
            //COMMENTED OUT BECAUSE CYREF NOT NECESSARILY LOADED YET.
            //IT WAS WORKING BEFORE BUT DON'T WANT TO MESS WITH ORDER IN UNCERTAIN TERRITORY 
    
            // .then(eles => {
            //   setEleNames(getElementNames(eles));
            // });
    
            //Store firebase reference
            await setRef(ref);
            //Set loading to false
            await setLoading(false);
        }
        fetchData();
    }, []);
    const runFirstLayout=  () => {
        console.log('inside runFirstLayout');
        if(!loading && fl){
            console.log('inside conditional: !loading and fl');
            //let k =  cyRef.layout(defaultOptions.layout);
            let k =  cyRef.layout({
                name: 'grid',
                stop: () => {
                    console.log('layout k stopped')
                    setFl(false);
                }
            });
            // k.stop = () => {
            //             console.log('layout k stopped')
            //             setFl(false);
            //         };

            // k.on('layoutstop', ()=> {
            //     console.log('layout k stopped')
            //     setFl(false);
            // })
            k.run();

            //await setFl(false);
       } 
       cyRef.on('layoutstop', ()=> console.log('some layout other than k has stopped.'));  
    }
    useEffect(() => {
       // runFirstLayout();
       
    }, [loading]);

    // //runFirstLayout();
    // useLayoutEffect( () => {
    //     //cyRef.stop();
    //     //cyRef.ready(()=> {

    //     let k =  cyRef.layout(defaultOptions.layout);
    //     //k.run();
    //     console.log('156, fl is now: ' + fl);
    // }, [fl]);
    // useEffect(()=>{
    //     cyRef.one('ready', ()=> setFl(false));
    // }, []);

    // useLayoutEffect(()=> {
    //     // if(!fl){
    //     //     console.log(144);
    //     //     cytoscapeEvents(cyRef, lastTwo, setLastTwo, lastEdgeName, 
    //     //         setLastEdgeName, firebaseRef, typeaheadRef, 
    //     //         firstLayout, setFirstLayout);
    //     //     windowEvents(cyRef, setRepeatTracker);
    //     // }
    // }, [fl]);
    return (
        <div>
            <br></br>
            <div id='top'>
            <ButtonToolbar className="button-container"> 
                <Button id="layoutButton" variant="outline-secondary" className="newButton" size='lg'
                    onClick={() => runLayout(cyRef, cyRef.elements(), defaultOptions.layout)}>Layout</Button>
                <Button variant="outline-secondary" className="newButton" size='lg'
                    onClick={() => save(cyRef, firebaseRef)}>Save</Button>
                <Button id="downloadButton" variant="outline-secondary" className="newButton" size='lg'
                    onClick={() => saveToText(cyRef)}>Download</Button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button id="addNodeButton" variant="outline-primary" className="newButton" size="lg"
                    onClick={()=>{addNodeSmart(cyRef,5);}}>Add Node</Button>
                <Button id='lasttwo' variant="outline-primary" className="newButton" size='lg'
                    onClick={()=>addEdgeSmart(cyRef,lastEdgeName, lastTwo)}>&#10233;</Button>
                &nbsp;&nbsp;&nbsp;&nbsp;
            </ButtonToolbar>
            {/* <h3 id = 'lasttwo' className="potential">&#160;&#160;&#160;&#160;&#10233;&#160;&#160;&#160;&#160;</h3> */}
            <Typeahead 
                className = "bar"
                id = "searchSuggest"
                ref={(typeahead) => typeaheadRef = typeahead}
                onChange={(selected) => {
                    setLabel(selected)
                }}
                onInputChange={(text, event) => {
                    //workaround for space bar
                    if(text===' '){
                        typeaheadRef.clear();
                    }
                    setLabel(text)
                }}
                //inputProps={onFocus}
                options={eleNames}
                //selectHintOnEnter={true}
                highlightOnlyResult={true}
                maxResults={10}
                //bsSize="small"
                /* onBlur={() => {
                    typeaheadRef.getInstance().clear();
                }} */
                onFocus={()=>{typeaheadRef.getInstance().clear();}}
                onKeyDown={(evt) => clear(evt)}
            />
            </div>
            {loading ?
                <p>No cytoscape yet</p> :
                <CytoscapeComponent
                    autoFocus
                    id='cy'
                    elements={eles}
                    style={ { width: '100%', height: '740px' }}
                    stylesheet={ getStyle() }
                    layout={defaultOptions.layout}
                    //layout={{name: 'cose'}}
                    cy={(cy) => { cyRef = cy }}
                />}
            <KeyboardEventHandler
                handleKeys={['shift+e', 'shift+n', 'shift+space', 'shift+r', 'shift+backspace',
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

