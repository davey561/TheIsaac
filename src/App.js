import React, { useState } from 'react';
import Viewport from './Viewport';


function App() {
    const eles = useState(
      []
    )
    return (
      <div className="todo-app container">
        <Viewport eles={eles}/>
      </div>
    )
  }

export default App;
