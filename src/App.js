import React, {useState} from 'react';
import Todos from './Todos';
import Plexus from './Plexus'

class App extends React.Component {
  constructor(props){
    super(props)
  }
  componentDidMount(){
    // this.refs.graph.cy.on('click', function(){
    //   window.alert('brushed my teeth with a bottle of jack');
    // })
  }
  render(){
    //ref="graph"
    return (
      <div className="todo-app container">
        <h1 className="">Plexus P</h1>
        <Plexus />
      </div>
    );
  }
}

export default App;
