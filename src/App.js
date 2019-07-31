import React, {useState} from 'react';
import Todos from './Todos';
import CytoscapeComponent from 'react-cytoscapejs';

function App() {
  const [state, setState] = useState({
    todos: [
      {id: 1, content: 'buy some milk'},
      {id: 2, content: 'Isaac julia sex'}
    ]
  });
  // const [elements, setElements] = useState(
  //     { data: { id: 'one', label: 'Node 1' }, position: { x: 0, y: 0 } },
  //     { data: { id: 'two', label: 'Node 2' }, position: { x: 100, y: 0 } },
  //     { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } }
  // );
  const deleteTodo = (id) => {
    const todos = state.todos.filter(todo => {
      return todo.id != id
    })
    setState({
      todos: todos
    })
  }
  const elements = [
    { data: { id: 'one', label: 'Node 1' }, position: { x: 0, y: 0 } },
    { data: { id: 'two', label: 'Node 2' }, position: { x: 100, y: 0 } },
    { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } }
  ];
  const layout = { name: 'cose' };
  return (
    <div className="todo-app container">
      <h1 className="">Plexus P</h1>
      <CytoscapeComponent elements={elements} style={ { width: '600px', height: '600px' }} layout={layout} />
    </div>
  );
}

export default App;
