import React, {useState} from 'react';
function SampleComponent(props){
    const [cy, setCy] = useState(props.cyRef);
    //console.log(cy.elements()[0].id())
    return (
        <div>
            {props.cyRef ?
            <h3>{
                props.cyRef.elements().size()
                //console.log('line 9: ', props.cyRef.elements()[0].id());
            }
            </h3> : 
            <h3>not yet</h3>}
        </div>
        
    )
}
export default SampleComponent
