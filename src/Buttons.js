// import React from 'react';
// import { ButtonToolbar, Button } from 'react-bootstrap';
// import { runLayoutDefault } from './Old/Layout';
// import { runLayout, save } from './Old/EventResponses';
// import {saveToText} from './Old/ConvertToBullets';

// const Buttons = React.forwardRef(({getElements, firebaseRef}, cyRef) => (
//     <ButtonToolbar className="button-container"> 
//         {/* <Button variant="outline-primary" className="newButton">Add Node</Button> */}
//         <Button id="layoutButton" variant="outline-primary" className="newButton" 
//             onClick={() => runLayoutDefault(getElements())}>Layout</Button>
//         <Button variant="outline-primary" className="newButton" 
//             onClick={() => save(cyRef.current, firebaseRef)}>Save</Button>
//         <Button id="downloadButton" variant="outline-primary" className="newButton"
//             onClick={() => saveToText(cyRef)}>Download</Button>
//     </ButtonToolbar> 
// ));
// export default Buttons;
