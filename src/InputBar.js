import React from 'react';
import {Typeahead, Menu, MenuItem} from 'react-bootstrap-typeahead';

function InputBar(props){
    const[mode, setMode] = useState('search'); //either "search", "traverse", "newNode", "newEdge", "renameNode", or "renameEdge"
    return (
        <Typeahead 
            //className = "bar"
            id = "searchSuggest"
            ref={(typeahead) => typeaheadRef = typeahead}
            onChange={(selected) => {
                setLabel(selected)
            }}
            onInputChange={(text, event) => {
                setLabel(text)
            }}
            options={eleNames}
            selectHintOnEnter={true}
            highlightOnlyResult={true}
            maxResults={10}
            onKeyDown={(evt) => clear(evt)}
            labelKey='name'
            renderMenu={(results, menuProps) => 
                {
                    menuResults = results;
                    return (<Menu {...menuProps}>
                    {results.map((result, index) => (
                        <MenuItem option={result} position={index}>
                        {result.name}
                        </MenuItem>
                    ))}
                    </Menu>)
                }
            }
        />
    )
}
