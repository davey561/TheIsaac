
import React, {useState, useEffect} from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import defaultOptions from './DefaultOptions';
import Search from "./Search"

let duration = 2000;
let string = 'Davey';
function Viewport(props){
    const [layout, setLayout] = useState({ 
        name: 'cose', 
        animate: true, 
        animationDuration: 6500, 
        randomize: true 
    });
    const [cy, setCy] = useState({});
    const [eles, setEles] = useState(props.eles);
    const [label, setLabel] = useState(props.labeltest);
    // let database; let elementsRef;
    // const [database, setDatabase] = useState();
    const [elementsRef, setRef] = useState();
    const [stylesheet, setStylesheet] = useState(
        [{ 
            selector: '*',
            style: {
                "font-family": "Optima",
                'text-border-width': '5px', 'label': label
            }
        }]
    );
    let cyRef = React.createRef();
    useEffect(() => {
        const fetchData = async () => {
            // database = firebase.database().ref();
            let ref = firebase.database().ref().child('elements');
            ref.once('value').then(snap => {
                setEles(JSON.parse(snap.val()))
            });
            setRef(ref);
        };
        fetchData();
        cyRef.on('click', () => {
            // window.alert('shake it');
            // let layout = this.cy.layout(this.state.layout);
            // layout.run();
            duration++;
            setLayout({ 
                name: 'cose', 
                animate: true, 
                animationDuration: duration, 
                randomize: true 
            });
        })
    }, []);
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
    const getStylesheet = () => {
        return { 
            selector: '*',
            style: {
                "font-family": "Optima",
                'text-border-width': '5px', 'label': label
            }
        }
    }
    return (
        <div>
            <Search 
                renderSearch={setLabel}
                ref = {(search) => {this.setState({focus: search.focusInput})}}
                autoFocus
            />
            <CytoscapeComponent
                elements={eles}
                style={ { width: '100%', height: '620px' }}
                stylesheet={ getStylesheet() }
                layout={ layout }
                cy={(cy) => { cyRef = cy }}
            />
        </div>
        );
}
Viewport.propTypes = {
    elements: PropTypes.array
};
Viewport.defaultProps = {
    elements: []
    // [
    //     { data: { id: 'one', label: 'Node 1' }, position: { x: 0, y: 0 } },
    //     { data: { id: 'two', label: 'Node 2' }, position: { x: 100, y: 0 } },
    //     { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } }
    // ],
};
export default Viewport;

