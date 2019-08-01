
import React, {useState, useEffect} from 'react';
import CytoscapeComponent from 'react-cytoscapejs';

class Plexus extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            elements: [
                { data: { id: 'one', label: 'Node 1' }, position: { x: 0, y: 0 } },
                { data: { id: 'two', label: 'Node 2' }, position: { x: 100, y: 0 } },
                { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } }
            ],
            layout: { name: 'cose' },
            cy: {}
        }
    }
    componentDidMount(){
        this.cy.on('click', function(){
            window.alert('shake it');
        })
    }
    getCy(){
        return this.cy;
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
            {/* <button onClick={testfx}>test</button> */}
        </div>
        );
    }
}
// function Plexus (){
//     // const[cy, setCy] = useState(null);
//     const[eles, setEles] = useState(
//         { data: { id: 'one', label: 'Node 1' }, position: { x: 0, y: 0 } },
//         { data: { id: 'two', label: 'Node 2' }, position: { x: 100, y: 0 } },
//         { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } }
//     )
//     const [layout, setLayout] = useState({ name: 'cose' });
//     useEffect(() => this.refs.cy.on('click', function(){
//         window.alert('shake it');
//     }));
//     return (
//         <div>
//             <CytoscapeComponent 
//                 elements={eles} 
//                 style={ { width: '100%', height: '620px' }} 
//                 layout={layout} 
//                 cy={(cy) => { this.cy = cy }}
//             />
//             {/* <button onClick={testfx}>test</button> */}
//         </div>
//     );
// }
export default Plexus;
