
import React, {Component} from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import defaultOptions from './DefaultOptions';
import Search from "./Search"

let duration = 2000;
let string = 'Davey';
class Viewport extends Component{
    constructor(props){
        super(props);
        const database = firebase.database().ref();
        const elementsRef = database.child('elements');
        this.state = {
            layout: { name: 'cose', animate: true, animationDuration: 2500, randomize: true },
            cy: {},
            elements: props.eles,
            elesString: props.eles,
            label: props.labeltest
        }
        console.log(this.labeltest)
        elementsRef.once('value').then(snap => {
            this.setState({
                elements: JSON.parse(snap.val()),
            })
            this.setState({
                elesString: this.collectionToString()
            })
        })

        // .then(elements => {
        //     console.log(elements);
        // })
        // this.elements = props.elements;
        console.log("constructor of plexus", this.state.elements);
        // this.componentDidMount = this.componentDidMount.bind(this);
        this.setLabel = this.setLabel.bind(this);
    }
    componentDidMount(){
        this.cy.on('click', () => {
            // window.alert('shake it');
            // let layout = this.cy.layout(this.state.layout);
            // layout.run();
            duration++;
            this.setState({
                layout: { name: 'cose', animate: true, animationDuration: duration, randomize: true }
            })
        })
        this.setState({
            stylesheet:[{ 
                selector: '*',
                style: {
                    "font-family": "Optima",
                    'text-border-width': '5px', 'label': this.state.label
                }
            }]
        });
        // this.cy.layout(this.state.layout).run();
        // this.setState({elesString: this.collectionToString()})
        
        // console.log(this.state.elements2);
    }
    setLabel(l){
        console.log('71')
        this.setState({
            stylesheet:[{ 
                selector: '*',
                style: {
                    label: l
                }
            }]
        })
    }
    getCy(){
        return this.cy;
    }
    collectionToString(){
        let s = ""
        let eles = this.cy.nodes();
        if(eles){
            eles.forEach(function(ele){
                s+= ele.data('name') + ", "
            });
        }
        console.log(s)
        return s;
    }
    render(){
        return (
        <div>
            <Search renderSearch={this.setLabel}/>
            <CytoscapeComponent 
                elements={this.state.elements}
                style={ { width: '100%', height: '620px' }}
                stylesheet={ this.state.stylesheet }
                layout={this.state.layout}
                cy={(cy) => { this.cy = cy }}
            />
            
            {/* <h1>elements: {this.state.elesString}  </h1> */}
            {/* <button onClick={this.showEles}>test</button> */}
        </div>
        );
    }
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
