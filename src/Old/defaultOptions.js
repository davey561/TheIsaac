//I don't think the typing is done super well for these pre-initialization options
// import { NodeCollection, NodeDefinition, CytoscapeOptions, Collection, NodeDataDefinition, ElementDataDefinition, ElementDefinition, CollectionArgument, ElementStylesheetCSS, ElementStylesheetStyle, Stylesheet, LayoutOptions, EdgeDataDefinition } from 'cytoscape';
import cytoscape from 'cytoscape/dist/cytoscape.esm';
import cola from 'cytoscape-cola';
import fcose from 'cytoscape-fcose';
import dagre from 'cytoscape-dagre';
import {TB_RATIO, MIN_FONT_SIZE, sizeNodeText, setTextMaxWidth, setNodeLabel, WEIRD_TEXT_SIZING_FACTOR} from './Clean';
import {distance,distanceBetweenPoints} from './ModifyGraph';
import {arrAvg} from './Miscellaneous';

cytoscape.use(fcose);
cytoscape.use(cola);
cytoscape.use(dagre);
const IDEAL_EDGE_LENGTH = 20;
export const ANIMATION_DURATION = 800;

class defaultOptions{
  // simpleLayout = (setFl) =>
  //   {return {
  //     stop: () => {
  //         console.log('layout k stopped')
  //         setFl(false);
  //     },
  //     name: 'cose'
  // }};
  static layout = {
    name: 'cose', //uses the cose-bilkent layout, downloaded from internet, good for compound graphs
    animate: 'end',  animationEasing: 'ease-out', animationDuration: 400,
    randomize: false,
    idealEdgeLength: IDEAL_EDGE_LENGTH, 
    //edgeelasty: 4,
    fit: true,
    nodeRepulsion: 5000, 
    //gravityRange: 10000000, 
    gravity: 50,
    nodeDimensionsIncludeLabels: true,
    // tilingPaddingHorizontal: 4,
    // tile: true,
    // initialEnergyOnIncremental: .5,
    // Amount of vertical space to put between degree zero nodes during tiling (can also be a function)
    // tilingPaddingVertical: 1,
    padding: 30
  };
  static fCoseOptions = {
    name: 'fcose', //uses the cose-bilkent layout, downloaded from internet, good for compound graphs
    animate: true,  animationEasing: 'ease', animationDuration: ANIMATION_DURATION,
    randomize: false,
    idealEdgeLength: IDEAL_EDGE_LENGTH, 
    //edgeelasty: 4,
    fit: false,
    // nodeRepulsion: 5000, 
    //gravityRange: 10000000, 
    // gravity: 50,
    nodeDimensionsIncludeLabels: true,
    // tilingPaddingHorizontal: 4,
    // tile: true,
    // initialEnergyOnIncremental: .5,
    // Amount of vertical space to put between degree zero nodes during tiling (can also be a function)
    // tilingPaddingVertical: 1,
    padding: 30
  };
  static dagre = {
    name: 'dagre',
    rankSep: IDEAL_EDGE_LENGTH,
    nodeSep: IDEAL_EDGE_LENGTH,
    animate: true, animationDuration: ANIMATION_DURATION,
    randomize: true,
    fit: true,
    nodeDimensionsIncludeLabels: true,
    padding: 30
  };
  static cola = {
    name: 'cola',
    animate: true,
    refresh: 1,
    randomize: false,
    edgeLength: (edge) => {return 30}
  };
  static euler = {
    name: 'euler',
    animate: 'end',
    animationDuration: ANIMATION_DURATION,
    randomize: false,
    //gravityRange: .1,
    animationEasing: 'ease',
    //quality: 'proof',
    springLength: IDEAL_EDGE_LENGTH*5,
    // springCoeff: .005,
    dragCoeff: .1,
    ungrabifyWhileSimulating: true,
    //theta: .01
    fit: false

  }
  static animation = {
    animate: 'end',  animationEasing: 'ease-out', animationDuration: ANIMATION_DURATION
  }
  
  static style = [ //there isn't a good type for data that initializes stylesheet--'Stylesheet' is for one selector, i believe, and 'Stylesheet[]' doesn't work because Labels interface isn't fully incorporated
    //the visuals that apply to all objects, both nodes and edges
    { selector: '*',
      style: {
        "font-family": "Optima",
        // 'min-zoomed-font-size': '2px', 
        'text-border-width': '5px', 'label': 'data(name)'
        //'text-background-padding': '20px', 'text-background-color':  'black', 'text-background-opacity': .2
      }
    },
    { selector: 'node',
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
        'text-max-width': function(ele){
          return setTextMaxWidth(ele);
        },
        'font-size': function(ele){
          return Math.floor(sizeNodeText(ele)/2)*2;
        },
        label: function(ele){
          return setNodeLabel(ele);
        }
      }
    },
    { selector: 'edge',
      style: {
        //'label': 'data(type)',
        'width': function(ele){
          return (ele.source().degree() + ele.target().degree())/4
        },
        'font-size': function (ele){
          // console.log('oh hello');
          // return sizeEdgeFont(ele);
          let c = edgeTextCalcs(ele);
          if (!c.label || c.label.length==0){return 1;}
          let fontSize;
          //if label is too long
          if (c.label.length >= c.maxStrLength){
            fontSize =  MIN_FONT_SIZE;
          } 
          //if the label fits, either make it large enough to fill the line, 
          // or as large as a k-letter label would be in the average of the two nodes
          else {
            const k = 5;
            let fontCap = arrAvg([ele.target().renderedWidth(), ele.source().renderedWidth()])/k;
            fontSize = Math.min(c.rendLength/c.label.length, fontCap);
          }
          return WEIRD_TEXT_SIZING_FACTOR* 9/10 * fontSize/c.currZoomLevel;
        },
        'label': function(ele){
          let c = edgeTextCalcs(ele);
          //if label is too long
          if (c.label.length > c.maxStrLength){
            if(c.maxStrLength > 1){
              c.label = c.label.slice(0, c.maxStrLength - 1) + '.';
            } else {
              c.label = '';
            }
          } 
          return c.label;
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
    { selector: '.over-node',
      style: 
      {
        'border-width' : 1
      }
    },
    { selector: '.selected-node',
    style: 
    {
      'border-style' : 'double',
      'border-width' : 2
    }
    },
    { selector: '.selected-over-node',
      style: 
      {
        'border-style' : 'double',
        'border-width' : 3
      }
    },
    { selector: '.potential-border',
      style: 
      {
        'border-width': 2,
        'border-color': '#0000FF',
        // 'border-style': 'solid'
      }
    },
    // { selector: '.potential-edge',
    //   style: 
    //   {
    //     'line-color' : 'Gainsboro',
    //     'line-style' : 'dashed',
    //   }
    // },
    { selector: '.over-edge',
      style: 
      {
        'line-style' : 'dotted',
        'line-color' : 'Gainsboro'
      }
    },
    { selector: '.selected-edge',
      style: 
      { 
        'line-style' : 'solid',
        'line-color' : 'black'
      }
    },
    { selector: '.selected-over-edge',
      style: 
      { 
        'line-style' : 'dotted',
        'line-color' : 'black'
      }
    }
  ];
  
  static blank = [];
  static startingElement = [{data: {name: 'Home'}}];
  static plexusEle = [
      {data: {id: 'Williams Summit', name: 'Williams Summit'}}
  ];
  static testFamData = [
    {data: { id: 'Davey', name: 'Davey'} },
    {data: { id: 'Maddie', name: 'Maddie'} },
    {data: { id: 'Lisa', name: 'Lisa'} },
    {data: { id: 'Aaron', name: 'Aaron'} },
    {data: { name: 'married to', source: 'Lisa',target: 'Aaron'}},
    {data: { name: 'parent of', source: 'Lisa',target: 'Davey'}},
    {data: { name: 'parent of', source: 'Lisa',target: 'Maddie'}},
    {data: { name: 'parent of', source: 'Aaron',target: 'Davey'}},
    {data: { name: 'parent of', source: 'Aaron',target: 'Maddie'}},
    {data: { name: 'sibling of', source: 'Davey', target: 'Maddie'}}
  ];
  static bigFamData =[
    { data: { name: 'Davey'} },
    { data: { name: 'Maddie' } },
    { data: { name: 'Lisa' } },
    { data: { name: 'Aaron' } },
    //mom's snamee
    { data: { name: 'Marcella' } },
    { data: { name: 'Steve' } },
    { data: { name: 'David Rosen' } },
    { data: { name: 'David Sax' } },
    //related to Julie
    { data: { name: 'Julie' } },
    { data: { name: 'Michael' } },
    { data: { name: 'Beep' } },
    { data: { name: 'Suzan' } },
    { data: { name: 'Ann' } },
    { data: { name: 'Jeremy' } },
    { data: { name: 'Josh' } },
    { data: { name: 'Dan' } },
    { data: { name: 'Jamie' } },
    //related to Irma
    { data: { name: 'Irma' } },
    { data: { name: 'Henrietta Lang' } },
    { data: { name: 'Issacher Burt Rothschild' } },
    { data: { name: 'Burt' } },
    { data: { name: 'Eddie' } },
    { data: { name: 'Krista' } },
    //Krista's side
    { data: { name: 'Edwin Flint Moore', nickname: 'Ted'} }, //dad
    { data: { name: 'Carolyn Moore' } }, //mom
    { data: { name: 'Kellye Nicol', nickname: "Suing Sister" } },
    { data: { name: 'Rustyn Mooney', nickname: "Good Sister" } },
    { data: { name: 'Heidi Moore' } },
    { data: { name: 'Timothy Everett Moore' } },
    { data: { name: 'Heidi Floros', nickname: "bio greek sister" } }, //biological sister, greek
    { data: { name: 'Romy' } },
    //dad's side
    { data: { name: 'Barbara' } },
    { data: { name: 'Jerome' } },
    { data: { name: 'Howard' } },
    { data: { name: 'Jon',  /*remarried_kid: "true"*/} },
    { data: { name: 'Brian' } },
    { data: { name: 'Margie' } },
    { data: { name: 'Sarah' } },
    { data: { name: 'Bill' } },
    { data: { name: 'Shirley' } },
    { data: { name: 'Abraham' } },
    { data: { name: 'Alvin' } },
    //pasha's family
    { data: { name: 'Pasha' } },
    { data: { name: 'Sanam' } },
    { data: { name: 'Shad' } },
    { data: { name: 'Leila' } },
    //Davey's other town friends
    { data: { name: 'Connor' } },
    { data: { name: 'William' } },
    { data: { name: 'Matteo' } },
    //Matteo's family
    {data: {name: 'Luca'}},
    //relations
    {data: { name: 'parent of', source: 'Lisa',target: "Davey"}},
    {data: { name: 'parent of', source: 'Lisa',target: 'Maddie'}},
    {data: { name: 'parent of', source: 'Barbara',target: 'Aaron'}},
    {data: { name: 'parent of', source: 'Barbara',target: 'Jon'}},
    {data: { name: 'parent of', source: 'Marcella',target: 'Lisa'}},
    {data: { name: 'parent of', source: 'Marcella',target: 'Burt'}},
    {data: { name: 'parent of', source: 'Krista',target: 'Eddie'}},
    {data: { name: 'parent of', source: 'Krista',target: 'Romy'}},
    {data: { name: 'parent of', source: 'Edwin Flint Moore',target: 'Krista'}},
    {data: { name: 'parent of', source: 'Edwin Flint Moore',target: 'Kellye Nicol'}},
    {data: { name: 'parent of', source: 'Edwin Flint Moore',target: 'Rustyn Mooney'}},
    {data: { name: 'parent of', source: 'Edwin Flint Moore',target: 'Timothy Everett Moore'}},
    {data: { name: 'married to', source: 'Edwin Flint Moore',target: 'Carolyn Moore'}},
    {data: { name: 'married to', source: 'Lisa',target: 'Aaron'}},
    {data: { name: 'married to', source: 'Krista',target: 'Burt'}},
    {data: { name: 'married to', source: 'Marcella',target: 'David Rosen'}},
    {data: { name: 'remarried to', source: 'Marcella',target: 'David Sax'}},
    {data: { name: 'partner', source: 'Jon',target: 'Brian'}},
    {data: { name: 'partner', source: 'Marcella',target: 'Steve'}},
    {data: { name: 'parent of', source: 'Irma',target: 'Marcella'}},
    {data: { name: 'parent of', source: 'Irma',target: 'Julie'}},
    {data: { name: 'married to', source: 'Julie',target: 'Michael'}},
    {data: { name: 'parent of', source: 'Julie',target: 'Beep'}},
    {data: { name: 'parent of', source: 'Julie',target: 'Suzan'}},
    {data: { name: 'parent of', source: 'Julie',target: 'Ann'}},
    {data: { name: 'parent of', source: 'Beep',target: 'Jeremy'}},
    {data: { name: 'parent of', source: 'Beep',target: 'Josh'}},
    {data: { name: 'parent of', source: 'Beep',target: 'Jamie'}},
    {data: { name: 'married to', source: 'Beep',target: 'Dan'}},
    {data: { name: 'parent of', source: 'Shirley',target: 'Barbara'}},
    {data: { name: 'parent of', source: 'Shirley',target: 'Margie'}},
    {data: { name: 'married to', source: 'Shirley',target: 'Abraham'}},
    {data: { name: 'sibling', source: 'Shirley',target: 'Alvin'}},
    {data: { name: 'married to', source: 'Margie',target: 'Bill'}},
    {data: { name: 'parent', source: 'Margie',target: 'Sarah'}},
    {data: { name: 'originally married to', source: 'Barbara',target: 'Jerome'}},
    {data: { name: 'divorced from', source: 'Barbara',target: 'Jerome'}},
    {data: { name: 'married to', source: 'Barbara',target: 'Howard'}},
    {data: { name: 'married to', source: 'Sanam',target: 'Shad'}},
    {data: { name: 'parent of', source: 'Sanam',target: 'Pasha'}},
    {data: { name: 'parent of', source: 'Sanam',target: 'Leila'}},
    {data: { name: 'boys with', source: 'Davey',target: 'Pasha'}},
    {data: { name: 'boys with', source: 'Davey',target: 'Connor'}},
    {data: { name: 'boys with', source: 'Davey',target: 'William'}},
    {data: { name: 'boys with', source: 'Davey',target: 'Matteo'}},
    {data: { name: 'sibling of', source: 'Luca',target: 'Matteo'}}
  ]
  static Potter = [
    {data: { id: 'James Potter'} }, {data: { id: 'Lily Potter'} },
    {data: { id: 'Severus Snape'} }, {data: { id: 'Sirius Black'} },
    {data: { type: 'married', source: 'James Potter',target: 'Lily Potter'}},
    {data: { type: 'hates', source: 'Severus Snape',target: 'James Potter'}},
    {data: { type: 'best friends', source: 'James Potter',target: 'Sirius Black'}},
    {data: { type: 'dislikes', source: 'Sirius Black', target: "Severus Snape"}},
    {data: { type: 'loves', source: 'Severus Snape', target: "Lily Potter"}},
    {data: { type: 'likes', source: 'Lily Potter', target: "Severus Snape"}}
  ];
  static rocketInfo = [
    {data: { id: 'combustion'} }, {data: { id: 'fuel'} },
    {data: { id: 'oxygen'} }, {data: { id: 'ignition threshold'} },
    {data: { id: 'heat'} }, {data: { id: 'chemical reaction'} },
    {data: { id: 'fire'} }, {data: { id: 'rocket'} },
    {data: { id: 'propellant system'} },
    {data: { type: 'uses', source: 'combustion',target: 'oxygen'}},
    {data: { type: 'uses', source: 'combustion',target: 'fuel'}},
    {data: { type: 'seen as', source: 'combustion',target: 'fire'}},
    {data: { type: 'launches', source: 'combustion', target: "rocket"}},
    {data: { type: 'causes', source: 'heat', target: "combustion"}},
    {data: { type: 'has', source: 'fuel', target: "ignition threshold"}},
    {data: { type: 'is a quantity of', source: 'ignition threshold', target: "heat"}},
    {data: { type: 'is a type of', source: 'combustion', target: "chemical reaction"}},
    {data: { type: 'occurs in', source: 'combustion', target: "propellant system"}},
    {data: { type: 'at bottom of', source: 'propellant system', target: "rocket"}}
  ];
  static firebaseConfig = {
    apiKey: "AIzaSyBvMNDIgJHQTcYiYPV3cUaATjg6dE5S-lA",
    authDomain: "cyto-sample.firebaseapp.com",
    databaseURL: "https://cyto-sample.firebaseio.com",
    projectId: "cyto-sample",
    storageBucket: "",
    messagingSenderId: "988037847889",
    appId: "1:988037847889:web:1b4ddbe97a7a348e"
  };
}
export default defaultOptions;

function edgeTextCalcs(ele){
  let label = ele.data('name');
  let rendLength = distanceBetweenPoints(ele.renderedTargetEndpoint(), ele.renderedSourceEndpoint());
  let modelLength = distanceBetweenPoints(ele.targetEndpoint(), ele.sourceEndpoint());
  let currZoomLevel = rendLength/modelLength;
  let maxStrLength = Math.floor(rendLength/MIN_FONT_SIZE); //maximum number of characters in a string at the min font size
  return {
    'maxStrLength': maxStrLength,
    'currZoomLevel': currZoomLevel,
    'label': label,
    'rendLength': rendLength
  }
}

export function sizeEdgeFont(ele){
  let c = edgeTextCalcs(ele);
  if (c.label.length==0){return 0;}
  let fontSize;
  //if label is too long
  if (c.label.length >= c.maxStrLength){
    fontSize =  MIN_FONT_SIZE;
  } 
  //if the label fits, either make it large enough to fill the line, 
  // or as large as a k-letter label would be in the average of the two nodes
  else {
    const k = 5;
    let fontCap = arrAvg([ele.target().renderedWidth(), ele.source().renderedWidth()])/k;
    fontSize = Math.min(c.rendLength/c.label.length, fontCap);
  }
  return WEIRD_TEXT_SIZING_FACTOR* 9/10 * fontSize/c.currZoomLevel;
}
