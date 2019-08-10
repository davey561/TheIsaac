import React, { useState } from 'react';
import Plexus from './Plexus'
import Search from './Search'

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
        <Search renderSearch={setTest}/>
        <Plexus eles={eles}/>
        <h1>test: {JSON.stringify(test)}</h1>
      </div>
    )
  }

export default App;
