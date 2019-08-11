import React, { useState } from 'react';
import Viewport from './Viewport'
import Search from './Search'
import defaultOptions from './DefaultOptions';

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
