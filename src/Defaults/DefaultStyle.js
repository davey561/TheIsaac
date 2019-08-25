import {TB_RATIO, MIN_FONT_SIZE, sizeNodeText, setTextMaxWidth, setNodeLabel, WEIRD_TEXT_SIZING_FACTOR} from '../Old/Clean';
import {edgeTextCalcs, sizeEdgeFont} from '../Old/TextSizing';
import {arrAvg} from '../Old/Miscellaneous';
import { distance, distanceBetweenPoints } from '../Old/ModifyGraph';
const style = {
    elements:  { selector: '*',
        style: {
        "font-family": "Optima",
        // 'min-zoomed-font-size': '2px', 
        'text-border-width': '5px', 'label': 'data(name)'
        //'text-background-padding': '20px', 'text-background-color':  'black', 'text-background-opacity': .2
        }
    }, 
    nodes: { selector: 'node',
        style: {
        'shape': 'ellipse',
        'text-valign': 'center', //this might be what causes the wrapping issue TODO
        'text-halign': 'center',
        'border-style' : 'solid',
        'text-justification': 'center',
        'text-overflow-wrap': 'whitespace',
        'background-color': '#FE5454',
        'background-opacity': .9,
        'width': function(ele){
            return 8*(2+ele.degree());
        },
        'height': function(ele){
            return 8*(2+ele.degree());
        },
        'font-family': 'monospace',
        'text-wrap': 'wrap',
        // 'text-max-width': function(ele){
        //     return setTextMaxWidth(ele);
        // },
        'font-size': function(ele){
            //return Math.floor(sizeNodeText(ele));
            return 1.5*ele.width() / ele.data('name').length; //so buffering less
            //return MIN_FONT_SIZE; //so buffering is less
        },
        label: function(ele){
           // return setNodeLabel(ele);
           return ele.data('name'); //so buffers less
        }
        }
    },
    edges: { selector: 'edge',
        style: {
        //'label': 'data(type)',
        'width': function(ele){
            return (ele.source().degree() + ele.target().degree())/4
        },
        'font-size': function (ele){
            // console.log('oh hello');
            // return sizeEdgeFont(ele);
            
            //let c = edgeTextCalcs(ele);

            // if (!c.label || c.label.length==0){return 1;}
            // let fontSize;
            // //if label is too long
            // if (c.label.length >= c.maxStrLength){
            // fontSize =  MIN_FONT_SIZE;
            // } 
            // //if the label fits, either make it large enough to fill the line, 
            // // or as large as a k-letter label would be in the average of the two nodes
            // else {
            // const k = 5;
            // let fontCap = arrAvg([ele.target().renderedWidth(), ele.source().renderedWidth()])/k;
            // fontSize = Math.min(c.rendLength/c.label.length, fontCap);
            // }
            // return WEIRD_TEXT_SIZING_FACTOR* 9/10 * fontSize/c.currZoomLevel;
            //return MIN_FONT_SIZE; //simplied so that buffering is less
            return 6 + 0.3 * arrAvg([ele.source().width(), ele.target().width()]) / ele.data('name').length; //so buffering less
        },
        'label': function(ele){
            // let c = edgeTextCalcs(ele);
            // //if label is too long
            // if (c.label.length > c.maxStrLength){
            // if(c.maxStrLength > 1){
            //     c.label = c.label.slice(0, c.maxStrLength - 1) + '.';
            // } else {
            //     c.label = '';
            // }
            // } 
            // return c.label;
            return ele.data('name'); //so buffers less
        },
        'font-family': 'monospace',
        'curve-style': 'bezier',
        'source-endpoint': 'outside-to-line', 'target-endpoint': 'outside-to-line',
        'control-point-step-size': '30px',
        'text-rotation': 'autorotate',
        'target-arrow-shape': 'vee',
        'arrow-scale': '.6',
        'line-color': 'Gainsboro',
        'target-arrow-color': 'Navy',
        'source-arrow-color': 'Navy'
            //fixed from the background color scandal
        }
    },

    //Custom style classes
    'over-node': { selector: '.over-node',
        style: 
        {
        'border-width' : 2
        }
    },
    'selected-node': { selector: '.selected-node',
        style: 
        {
        'border-style' : 'double'
        }
    },
    'potential-border': { selector: '.potential-border',
      style: 
      {
        'border-width': 2,
        'border-color': '#0000FF',
        // 'border-style': 'solid'
      }
    },
    'over-edge': { selector: '.over-edge',
        style: 
        {
        'line-style' : 'dotted',
        }
    },
    'selected-edge': { selector: '.selected-edge',
        style: 
        {
        'line-color' : 'black',
        //'line-fill': 'radial-gradient'
        }
    }


}
export default style;
