import React, { useState } from 'react';
import Plexus from './Plexus';
// import 'bootstrap';
//Unclear if I need this wrapper component

function App() {
    return (
      <div className="todo-app container">
        <Plexus eles={[]}/>
      </div>
    )
  }

export default App;
