import React, { useState } from 'react';
import Viewport from './Viewport'
import Search from './Search'
import defaultOptions from './DefaultOptions';

function App() {
    const eles = useState(
      []
    );
    const [test,setTest] = useState("Davey");
    // const renderSearch = (string) => {
    //   setTest(string)
    // };
    const getTest = () => {
      return test;
    }
    return (
      <div className="todo-app container">
        {/* <h1 className="">{this.state.elements}</h1> */}
        {/* <Search renderSearch={setTest}/> */}
        <Viewport eles={eles} labeltest={test}/>
        <h1>test: {test}</h1>
      </div>
    )
  }

export default App;
