
import React, {useState, useEffect} from 'react';
import CytoscapeComponent from 'react-cytoscapejs';

function Plexus(props){
    // const [cy, setCy] = useState({
    // })
    let cyRef = React.createRef();
    const elements = [
    { data: { id: 'one', label: 'Node 1' }, position: { x: 0, y: 0 } },
    { data: { id: 'two', label: 'Node 2' }, position: { x: 100, y: 0 } },
    { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } }
    ];
    const layout = { name: 'cose' };
    const testfx = () => {
        window.alert(cy.nodes()[0].style('label'));
    }
    useEffect(() => {
        
    });
    return (
        <div>
            <CytoscapeComponent 
                elements={elements} 
                style={ { width: '100%', height: '620px' }} 
                layout={layout} 
                cy={(cy) => { myCyRef = cy }}
            />
            <button onClick={testfx}>test</button>
        </div>
    )
}
export default Plexus;
