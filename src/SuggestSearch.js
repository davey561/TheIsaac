//from Basic Example in http://ericgio.github.io/react-bootstrap-typeahead/
import React, {Component, Fragment, Typeahead, FormGroup, Control} from 'react';
// import Fragment from 'react-bootstrap';
// import {FormGroup} from 'react-bootstrap';

class SuggestSearch extends React.Component {
    // state = {
    //     multiple: false,
    // };
    render() {
      const {multiple} = false;
      return (
        <div>
            <Fragment>
                <Typeahead
                    labelKey="name"
                    multiple={multiple}
                    options={[1,2,3]}
                    placeholder="Choose a state..."
                />
                <FormGroup>
                    <Control
                    checked={multiple}
                    onChange={(e) => this.setState({multiple: e.target.checked})}
                    type="checkbox">
                    Multi-Select
                    </Control>
                </FormGroup>
            </Fragment>
        </div>
      );
    }
}
export {SuggestSearch};
