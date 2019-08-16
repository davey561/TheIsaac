
import React, {useState, useEffect, Component} from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import fcose from 'cytoscape-fcose';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import {Typeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css'
import {Snackbar} from '@material/react-snackbar';
import LastTwoComponent from './Old/LastTwoComponent';
// import '@material/react-snackbar/dist/snackbar.css';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import defaultOptions from './Old/defaultOptions'
import { ButtonToolbar, Button } from 'react-bootstrap';
import { runLayoutDefault } from './Old/Layout';
import { runLayout, save } from './Old/EventResponses';
import {saveToText} from './Old/ConvertToBullets';
import LastTwo from './Old/LastTwo';
import { cytoscapeEvents } from './Old/CyEvents';
cytoscape.use(fcose);

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
        let [source, target] = lastTwo.getNames(cyRef);
        setLastTwoText(source + "&#160;&#160;&#160;&#160;&xrArr;&#160;&#160;&#160;&#160;" + target);
        // window.alert('use effect on ref change')
        // let ref = firebase.database().ref().child('elements');
        // cytoscapeEvents(cyRef, lastTwo, setLastTwo, lastEdgeName, setLastEdgeName, ref);
    }, [cyRef, lastTwo]);
    return (
        <div>
            <br></br>
            {/* <div id = 'lasttwo' className="potential"><h3>Davey &#160;&#160;&#160;&#160;&#10233;&#160;&#160;&#160;&#160; Davey</h3></div> */}
            <ButtonToolbar className="button-container"> 
                <Button variant="outline-primary" className="newButton">Add Node</Button>
                <Button id="layoutButton" variant="outline-primary" className="newButton" 
                    onClick={() => runLayoutDefault(getElements())}>Layout</Button>
                <Button variant="outline-primary" className="newButton" 
                    onClick={() => save(cyRef, firebaseRef)}>Save</Button>
                <Button id="downloadButton" variant="outline-primary" className="newButton"
                    onClick={() => saveToText(cyRef)}>Download</Button>
            </ButtonToolbar>
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
                handleKeys={['all']}
                onKeyEvent={(key, e) => console.log(`do something upon keydown event of ${key}`)} 
            />
            <p>{label}</p>
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

