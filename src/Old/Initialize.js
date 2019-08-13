import {ElementDefinition, CytoscapeOptions, Core, ElementsDefinition} from 'cytoscape';
import defaultOptions from './defaultOptions';
import {cleanNodes} from './Clean';
import {cluster} from './ClusterZoom';
import * as firebase from 'firebase';
import cytoscape from "../../node_modules/cytoscape/dist/cytoscape.esm";
export function retrieve(firebaseRef){
    // //RETRIEVE SAVED ELEMENTS from local storage in localStorage and record whether program is retrieving saved elements or beginning anew.
    // //Saving and retrieving graph elements and style
   
   
    // return [cyops, freshstart];
}
export function initCy(savedEles){
  let cyops = {
    container: document.getElementById('cy'), //container is necessary for visualization
    elements: savedEles,
    // style: defaultOptions.style,
    layout: defaultOptions.layout,
    selectionType: 'additive',
    textureOnViewport: true,
    //autoungrabify: false
  }
  return cytoscape(cyops); //cytoscape viewport object; rectangle where all the stuff happens
}
export function initialize(data){
  //Initialize Cy
  //@ts-ignore
  let mode = document.getElementById('codeSelection').value;
  console.log(data);
  let savedEles = JSON.parse(data[mode]); //will store JSON-formatted cy.elements()
  console.log(savedEles);
  let cy = initCy(savedEles);
  //Run initial functions
  cy.style(defaultOptions.style);
  cy.elements().unselect();
  newFeatureTest(cy);
  return [cy, data];
// assignEmphases(cy);
//cy.edges.$('#dislikes').style('source-arrow-shape', 'vee').style('target-arrow-shape', 'vee');
}
function newFeatureTest(cy){
   //cluster(cy);
    // setEmphasesByCloseness(cy);
}

export function assignEmphases(cy){
    cy.nodes().forEach(function(ele){
      let size = ele.degree();
      ele.style('width', (4+size)*4); ele.style('height', (4+size)*4);
    })
    cy.style().update();
    // window.alert('FINISHED');
  }
 export function deselectAll(cy){
    cy.elements().deselect();
  }
  export function setEmphasesByPageRank(cy){
    let pr = cy.elements().pageRank(
      {
        dampingFactor: 0.8, 
        precision: .000001,
        iterations: 1000
      });
    let s = '';
    cy.nodes().forEach(function(ele){
      let size = 100000 * pr.rank(ele);
      s = s + ", " + size;
      ele.style('width', Math.sqrt(size)); 
      ele.style('height', Math.sqrt(size));
      ele.style('font-size', 3*Math.sqrt(size)/(ele.data('name').length));
    });
    cy.style().update();
  }
  export function setEmphasesByCloseness(cy){
    cy.on('zoom', function(event){
      // let close = cy.elements().ccn(
      //   {
      //     dampingFactor: 0.8, 
      //     precision: .000001,
      //     iterations: 1000
      //   });
      // let s = '';
      cy.nodes().forEach(function(ele){
        // let size = 10*(close.closeness(ele) + 10);
        // s = s + ", " + size; 
        // ele.style('width', (2/Math.sqrt(Math.PI))*Math.sqrt(size)); 
        // ele.style('height', (2/Math.sqrt(Math.PI))*Math.sqrt(size));
        // sizeText(cy, ele);
      });
    });
  }


