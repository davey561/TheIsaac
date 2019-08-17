
import React, {useState, useEffect, Component} from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';

import fcose from 'cytoscape-fcose';
import dagre from 'cytoscape-dagre';
import cola from 'cytoscape-cola';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import {Typeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css'
import KeyboardEventHandler from 'react-keyboard-event-handler';
import defaultOptions from './Old/defaultOptions'
import { ButtonToolbar, Button } from 'react-bootstrap';
import { runLayoutDefault } from './Old/Layout';
import { runLayout, save, allEvents, numberKeyResponses, confMessage } from './Old/EventResponses';
import {saveToText} from './Old/ConvertToBullets';
import LastTwo from './Old/LastTwo';
import { cytoscapeEvents } from './Old/CyEvents';
import {findGoodLocationForNewNode, addEdgeSmart} from './Old/ModifyGraph';
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


    let cyRef = React.createRef();
    let typeaheadRef = React.createRef();

    //Define function to fetch firebase data
    const fetchData = async () => {
        //Store firebase reference
        let ref = firebase.database().ref().child('elements');
        //Retrieve elements data
        ref.once('value').then(snap => {
            console.log(snap.val())
            setEles(JSON.parse(snap.val()))
            return JSON.parse(snap.val())
        })
        //Then create list of element ids
        .then(eles => {
            setEleNames(getElementNames(eles));
        });
        //Store firebase reference
        await setRef(ref);
    };
    //Return updated stylesheet (with new value for label)
    const getStyle = () => {
        // return [{
        //     selector: 'node',
        //     style: { 'label': label }
        // }]
        return defaultOptions.style;
    }
    const clear = (evt) => {
        if(evt.keyCode==13){
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

    //Things to do just on load
    useEffect(() => {
        fetchData().then(
            () => {
                let ref = firebase.database().ref().child('elements');
                cytoscapeEvents(cyRef, lastTwo, setLastTwo, lastEdgeName, setLastEdgeName, ref)
            }
            // () => cytoscapeEvents(cyRef, lastTwo, setLastTwo, lastEdgeName, setLastEdgeName, firebaseRef)
        );
    }, []);
    useEffect(()=> {
        // window.alert('use effect on ref change')
        // let ref = firebase.database().ref().child('elements');
        // cytoscapeEvents(cyRef, lastTwo, setLastTwo, lastEdgeName, setLastEdgeName, ref);
    }, [firebaseRef]);
    useEffect(()=> {
        window.addEventListener("keyup", event => {
            if (event.keyCode == 76) {
              setRepeatTracker(false);
            }
          });
          window.addEventListener("beforeunload", function (e) {
            confMessage(cyRef,e);
          });
          window.addEventListener("unload", function(evt){
            //saveWhichUser();
            cyRef.nodes().classes('');
            cyRef.elements().deselect();
            save(cyRef);
          });
    }, [cyRef]);
    return (
        <div>
            <br></br>
            <ButtonToolbar className="button-container"> 
                <Button variant="outline-primary" className="newButton" size="sm"
                    onClick={()=>findGoodLocationForNewNode(cyRef,5)}>Add Node</Button>
                    <Button variant="outline-primary" className="newButton" size="sm"
                    onClick={()=>addEdgeSmart(cyRef,lastEdgeName, lastTwo)}>Add Edge</Button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button id="layoutButton" variant="outline-primary" className="newButton" size="sm" 
                    onClick={() => runLayoutDefault(getElements())}>Layout</Button>
                <Button variant="outline-primary" className="newButton" size="sm"
                    onClick={() => save(cyRef, firebaseRef)}>Save</Button>
                <Button id="downloadButton" variant="outline-primary" className="newButton" size="sm"
                    onClick={() => saveToText(cyRef)}>Download</Button>
            </ButtonToolbar>
            <h3 id = 'lasttwo' className="potential">&#160;&#160;&#160;&#160;&#10233;&#160;&#160;&#160;&#160;</h3>
            <Typeahead 
                className = "bar"
                id = "searchSuggest"
                ref={(typeahead) => typeaheadRef = typeahead}
                onChange={(selected) => {
                    setLabel(selected)
                }}
                onInputChange={(text, event) => {
                    setLabel(text)
                }}
                options={eleNames}
                //selectHintOnEnter={true}
                highlightOnlyResult={true}
                maxResults={10}
                //bsSize="small"
                /* onBlur={() => {
                    typeaheadRef.getInstance().clear();
                }} */
                onKeyDown={(evt) => clear(evt)}
            />
            <CytoscapeComponent
                elements={eles}
                style={ { width: '100%', height: '620px' }}
                stylesheet={ getStyle() }
                layout={ {name: 'cose' }}
                cy={(cy) => { cyRef = cy }}
            />
            <KeyboardEventHandler
                handleKeys={['shift+e', 'shift+n', 'shift+space', 'shift+r', 'shift+backspace',
                     'ctrl+d', 'all']}
                onKeyEvent={(key, event) => 
                   allEvents(key, event, cyRef, firebaseRef, lastTwo, lastEdgeName, repeatTracker)
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

