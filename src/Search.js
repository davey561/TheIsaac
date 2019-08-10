import React from 'react';
import {Navbar, Form, InputGroup, FormControl, Button} from 'react-bootstrap'
function Search(props){
  const handleSearch = e => {
    props.renderSearch(e.target.value)
  }
  return(
  <Navbar className="bg-light justify-content-between">
    <Form inline>
      <InputGroup>
        <InputGroup.Prepend>
          <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          placeholder="Username"
          aria-label="Username"
          aria-describedby="basic-addon1"
        />
      </InputGroup>
    </Form>
    <Form inline>
      <FormControl type="text" placeholder="Search" className=" mr-sm-2" onChange={handleSearch}/>
      <Button type="submit">Submit</Button>
    </Form>
  </Navbar>
  )
}
export default Search;
