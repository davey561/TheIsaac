
import React, {Component} from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import PropTypes from 'prop-types';
import firebase from 'firebase';

class Plexus extends Component{
    constructor(props){
        super(props);
        const database = firebase.database().ref();
        const elementsRef = database.child('elements');
        this.state = {
            layout: { name: 'cose', animate: true, animationDuration: 1500 },
            cy: {},
            elements: props.eles,
            elesString: props.eles
        }
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
        // this.showEles = this.showEles.bind(this);
    }
    componentDidMount(){
        this.cy.on('click', function(){
            window.alert('shake it');
        })
        // this.cy.layout(this.state.layout).run();
        // this.setState({elesString: this.collectionToString()})
        
        // console.log(this.state.elements2);
    }
    // showEles(){
    //     this.setState({
    //         elesString: this.collectionToString()
    //     })
    // }
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
            <CytoscapeComponent 
                elements={this.state.elements}
                style={ { width: '100%', height: '620px' }}
                layout={this.state.layout}
                cy={(cy) => { this.cy = cy }}
            />
            {/* <h1>elements: {this.state.elesString}  </h1> */}
            {/* <button onClick={this.showEles}>test</button> */}
        </div>
        );
    }
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
