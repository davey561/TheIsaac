import React, {useState, useEffect} from 'react';
import {Navbar, Form, InputGroup, FormControl, Button} from 'react-bootstrap'
function Search(props){
  const [input, setInput] = useState(null);
  const handleSearch = e => {
    console.log('handling search')
    props.renderSearch(e.target.value)
  }
  useEffect(() => {
    focusInput();
  })
  const focusInput = () => {
    try{
      input.focus();
    } catch(Exception){}
  }
  return(
  <Navbar className="justify-content-center">
    <Form inline>
      <FormControl 
        type="text" 
        placeholder="Search" 
        className=" mr-sm-2" 
        // autoFocus 
        onChange={handleSearch}
        ref = {input => {setInput(input)}}
      />
      <Button type="submit">Submit</Button>
    </Form>
  </Navbar>
  )
}
export default Search;
