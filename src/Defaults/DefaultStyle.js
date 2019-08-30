import {TB_RATIO, MIN_FONT_SIZE, sizeNodeText, setTextMaxWidth, setNodeLabel, WEIRD_TEXT_SIZING_FACTOR} from '../Old/Clean';
import {edgeTextCalcs, sizeEdgeFont} from '../Old/TextSizing';
import {arrAvg} from '../Old/Miscellaneous';
import { distance, distanceBetweenPoints } from '../Old/ModifyGraph';
const calcSize = (ele) => {
    // let old = 8*(2+ele.degree());
    // return old;
    let emph = ele.data('emphasis');
    //emphasis should represent area of the node's ellipse, not the width or height
    //area of an ellipse = pi*width/2*height/2, so if width=height, width is emph/pi^0.5*2
    //return Math.round(Math.sqrt((emph / Math.pi))*2);
    return Math.round(Math.sqrt(emph/ Math.PI)*2);
            
}
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
        width: (ele) => calcSize(ele),
        height: (ele) => calcSize(ele),
        'font-family': 'monospace',
        'text-wrap': 'wrap',
        'text-max-width': function(ele){
            return 1.1*ele.width();
            //return setTextMaxWidth(ele);
        },
        'font-size': function(ele){
            //return Math.floor(sizeNodeText(ele));
            let l;
            ele.data('name') && ele.data('name').length>0 ? l = ele.data('name').length : l=5;
            return 0.6 * ele.width() / Math.sqrt(l); //so buffering less
            //return MIN_FONT_SIZE; //so buffering is less
        },
        label: function(ele){
           // return setNodeLabel(ele);
           if(ele.data('name') && ele.data('name').length>0){
               return ele.data('name');
           }
           return ""; //so buffers less
        }
        }
    },
    edges: { selector: 'edge',
        style: {
        //'label': 'data(type)',
        width: function(ele){
            return (ele.source().data('emphasis') + ele.target().data('emphasis'))/2000
            // return 1;
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
            let l;
            ele.data('name') && ele.data('name').length>0 ? l = ele.data('name').length : l=5;
            return 2 + .25 * arrAvg([ele.source().width(), ele.target().width()]) / Math.sqrt(l); //so buffering less
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
           
            //so buffers less
           if(ele.data('name') && ele.data('name').length>0){
               return ele.data('name');
           }
           return "";
        },
        'font-family': 'monospace',
        'curve-style': 'bezier',
        'source-endpoint': 'outside-to-line', 'target-endpoint': 'outside-to-line',
        'control-point-step-size': '30px',
        'text-rotation': 'autorotate',
        'target-arrow-shape': 'vee',
        'arrow-scale': '.6',
        // 'line-color': 'Gainsboro',
        //Innovating a little with edge color:
        'line-color': 'mapData(weight, 0, 1, white, red)',
        'target-arrow-color': 'Navy',
        'source-arrow-color': 'Navy'
            //fixed from the background color scandal
        }
    },

    //Custom style classes
    'home-node': { selector: '.home-node',
        style: 
        {
            'display' : 'none',
            'visibility': 'invisible',
            // 'width': 0,
            // height: 0

        }
    },
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
        'line-color' : '#7da2ff',
        //'line-fill': 'radial-gradient'
        }
    }
}
export default style;
