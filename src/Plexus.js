
import React, {useState, useEffect, Component} from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import {Typeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import defaultOptions from './Old/defaultOptions'

function Plexus(props){
    const [layout, setLayout] = useState({ 
        name: 'cose', 
        animate: 'end', 
        animationDuration: 1200, 
        randomize: true 
    });
    const [cy, setCy] = useState({});
    const [eles, setEles] = useState(props.eles);
    const [eleIds, setEleIds] = useState(["1", "3", "5"])
    const [label, setLabel] = useState(props.labeltest);
    // let database; let elementsRef;
    // const [database, setDatabase] = useState();
    const [elementsRef, setRef] = useState();
    const [stylesheet, setStylesheet] = useState(
        [{ 
            selector: 'node',
            style: {
                "font-family": "Optima",
                'text-border-width': '5px', 'label': label
            }
        }]
    );
    const [click,setClick] = useState(false);
    let cyRef = React.createRef();
    let typeaheadRef = React.createRef();
    useEffect(() => {
        const fetchData = async () => {
            let ref = firebase.database().ref().child('elements');
            ref.once('value').then(snap => {
                setEles(JSON.parse(snap.val()))
                return JSON.parse(snap.val())
            }).then(eles => {
                console.log(getElementIds(eles));
                setEleIds(getElementIds(eles));
                // console.log(getElementIds(eles))
            });
            setRef(ref);
        };
        fetchData();
        cyRef.on('', () => {
            cyRef.layout(layout).run()
        })
        cyRef.on('click', () => {
            cyRef.layout(layout).run();
        })
    }, []);
    useEffect(() => {
        console.log('effect for style being used!')
    })
    const collectionToString = () => {
        let s = ""
        let eles = cyRef.nodes();
        if(eles){
            eles.forEach(function(ele){
                s+= ele.data('name') + ", "
            });
        }
        console.log(s)
        return s;
    }
    const getStyle = () => {
        return [{ 
                    selector: 'node',
                    style: {
                        "font-family": "Optima",
                        'text-border-width': '5px', 'label': label
                    }
                }]
        // return defaultOptions.style;
    }
    const clear = (evt) => {
        if(evt.keyCode==13){
            typeaheadRef.blur();
        }
    }
    const getElementIds = (eles) => {
        return cyRef.nodes().map((ele) => {
            return ele.id();
        });
    }
    return (
        <div>
            {/* <Search 
                renderSearch={setLabel}
                //ref = {(search) => {this.setState({focus: search.focusInput})}}
                autoFocus
            /> */}
            <br></br>
            <Typeahead id = "searchSuggest"
                ref={(typeahead) => typeaheadRef = typeahead}
                onChange={(selected) => {
                    setLabel(selected)
                }}
                onInputChange={(text, event) => {
                    setLabel(text)
                }}
                options={eleIds}
                //selectHintOnEnter={true}
                highlightOnlyResult={true}
                maxResults={10}
                bsSize="small"
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
                click = {click}
            />
            <KeyboardEventHandler
                handleKeys={['a', 'b', 'c']}
                onKeyEvent={(key, e) => console.log(`do something upon keydown event of ${key}`)} 
            />
        </div>
    );
}
Plexus.propTypes = {
    elements: PropTypes.array
};
Plexus.defaultProps = {
    elements: []
    // [
    //     { data: { id: 'one', label: 'Node 1' }, position: { x: 0, y: 0 } },
    //     { data: { id: 'two', label: 'Node 2' }, position: { x: 100, y: 0 } },
    //     { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } }
    // ],
};
export default Plexus;

