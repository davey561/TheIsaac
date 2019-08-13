import { Core, EdgeCollection } from "cytoscape";
import {runLayoutDefault} from "./EventResponses"

export function addNode(cy, label, location){
    if (label==null) return null;
    return cy.add(
        //@ts-ignore
        { 
            data: {
                id: label[1], 
                name: label[0],
                emphasis: 1,
                //  merged_as_mutual: false, 
                //  level: 0
            }, 
            position: location
        }
    );
  }
  export function retrieveNewName(cy, isNode){
    let nodename = String(window.prompt("Name:", ""));
    if((nodename=="null")||(nodename=="")){return null;}
    return findUniqueName(cy, nodename, isNode);
  }
  export function findUniqueName(cy, nodename, isNode){
    let counter = 1;
    let id = nodename + counter;
    let ele_type = (isNode ? "node": "edge");
    let group = (isNode ? cy.nodes(): cy.edges());
    while (group.is(`[id = "${id}"]`)) {
      if(!window.confirm(
        `There is another ${ele_type} with this name. 
        Confirm that you'd like this name.`)){
        return null;
      }
      counter++;
      id = nodename + counter;
    }
    return [nodename, id];
  }
//   function renameEdge(){
  
//   }
  
//   //5) Generate relationship node and remove original edge
//   //similar to another function above (3). once I have the time to compare the two of them, one should go.
//   function generateIntermediateNode(cy, edge){
//     // window.alert('inIN');
//     let sourcenode = edge.source(); let targetnode = edge.target(); let edgename = edge.data('type'); let added;
//     let srcpos = sourcenode.position(); let tarpos=targetnode.;
//     let avex = (srcpos.x + tarpos.x)/2; //average x position
//     let avey = (srcpos.y + tarpos.y)/2; //average y position
//     //Add intermediate node
//     // window.alert('x: ' + avex +", " + 'y: ' + avey +", " +'edgename: ' + edgename +", ");
//     var interNode =
//     cy.add([{
//       //group: "nodes",
//       position: {x: avex, y: avey},
//       style: {
//         //label: 'data(name)',
//         shape: 'triangle',
//         width: '6px', height: '6px',
//         'font-size': 3 //(it is not ideal to hardcode font-size eventually, but just for sake of getting it workable)
//       },
//       data:{name: edgename, emphasis: .5, level: 1}
//     }]);
  
//     // window.alert('IN added');
//     let source2inter =
//     cy.add([{
//       group: "edges",
//       data: {
//         source: sourcenode.id(),
//         target: interNode.id()
//       },
//       // style: {
//       //   'curve-style': 'bezier'
//       // }
//     }]);
//     // window.alert('source2inter added');
//     let inter2target =
//     cy.add([{
//       group: "edges",
//       data: {
//         source: interNode.id(),
//         target: targetnode.id()
//       },
//       // style: {
//       //     'curve-style': 'bezier'
//       //   }
//       }]);
//      // window.alert('inter2target added');
//     cy.remove(edge);
//     return interNode.merge(source2inter).merge(inter2target);
//     relatNodesStyle(cy); //**This is not ideal, but I don't know whether this or the style set at initialization above is causing the shape of IN to be triangular, think it's the styling above
//     // window.alert('at end of IN');
//   }
  
  //6) Add an edge, given a source and target
  export function addEdge(cy, sourcenode, targetnode, lastEdgeAdded){
    let edgename = newEdgePrompt(false, cy, sourcenode, targetnode, lastEdgeAdded);
    //If the edgename given is blank, or user hits cancel stop this function. Otherwise, continue.
    if(edgename=="null"){return 0;}
    //Add new edge
    return addNewEdge(cy, sourcenode, targetnode, edgename);
    
    //window.alert('edge name: ' + edgename +', source node: ' + sourcenode.data('name'));
  }
  
  export function addNewEdge(cy, sourcenode, targetnode, edgename){
    cy.add([
      {
        group: "edges",
        data: { name: edgename, source: sourcenode.id(), target: targetnode.id()}
      }
    ]);
    return edgename;
  }
  export function addNewEdge2(cy, srcid, trgid, edgename){
    //window.alert([srcid, trgid].toString());
    return cy.add([
      {
        group: "edges",
        data: { name: edgename, source: srcid, target: trgid}
      }
    ]);
  }
  
 export function newEdgePrompt(plural, cy, sourcenode, targetnode, lastEdgeAdded){
    let temp;
    if(plural){
      temp = "all others selected";
    }
    else{
      temp = targetnode.data('name');
    }
    //if last edge added is not zero
    if(lastEdgeAdded==0){
      lastEdgeAdded = '';
    }

    let edgename =
      String(window.prompt(
        "Type of new edge, from " + sourcenode.data('name') +
        " to " + temp + ":", lastEdgeAdded
      ));
      return edgename;
  }
  export function findGoodLocationForNewNode(cy, radius){
    let extent = cy.extent(); //gets dimensions of the viewport frame in terms of model coordinates
    //window.alert(JSON.stringify(extent));
    let newX;
    let newY;
    let goodLocation; //boolean value indicating whether node has been placed in a
    let i = 0;
    let paddedExtent = [extent.x1 + radius, extent.x2-radius, extent.y1+radius, extent.y2-radius];
    let nodesInViewport = cy.collection();
    do{
      goodLocation = true;
      newX = randomIntInRange(paddedExtent[0], paddedExtent[1]);
      newY = randomIntInRange(paddedExtent[2], paddedExtent[3]);
      // window.alert("viewport: " + (extent.x1 + width) + ", " + (extent.x2-width) + "; " +  (extent.y1+height) + ", "  + (extent.y2-height));
      //window.alert("newX,Y: " + newX + ", " + newY);
      cy.nodes(':visible').forEach(function(ele){
        //if this element is in the viewport
       // window.alert('position of ' + ele.data('name') + ": " + ele.position().x + ", " + ele.position().y);
        if(between(ele.position().x, paddedExtent[0], paddedExtent[1]) 
        && between(ele.position().y, paddedExtent[2], paddedExtent[3])  ){
         // window.alert(ele.data('name') + "is deemed in");
          nodesInViewport.union(ele);
          let tempDist = distance(newX, newY, ele.position().x, ele.position().y);
          if(tempDist< ele.numericStyle('width')){
            goodLocation = false;
          }
        }
      });
      i++;
      if(i>3000){
        // window.alert("Extent is too crowded with nodes to find good location, so zooming out and rerunning.");
        // window.alert('over2000');
        let nodesInViewport = findNodesInViewport(cy, radius);
        // window.alert('nodes in viewport: ' + nodesInViewport.toArray().toString());
        // const zoomout = nodesInViewport.animation({
        //   //@ts-ignore
        //   zoom: cy.zoom()/4
        // });
        // zoomout.play();
        // zoomout.promise().then(function(){
        //   cy.center(nodesInViewport);
        //   console.log('promise happned');
        // });
        cy.zoom(cy.zoom()/4);
        cy.center(nodesInViewport);
        findGoodLocationForNewNode(cy, radius);
        return null;
      }
      //window.alert(i);
    } while(!goodLocation);
    let newnode = addNode(cy, retrieveNewName(cy, true), {x: newX, y: newY});
  }
  function randomIntInRange(x1, x2){
    return Math.floor(Math.random()*(x2-x1) + x1);
  }
  export function distance(x1, y1, x2, y2){
    return (Math.sqrt(Math.pow(x1-x2, 2)+Math.pow(y1-y2, 2)));
  }
  export function distanceBetweenPoints(P1, P2){
    return (Math.sqrt(Math.pow(P1.x-P2.x, 2)+Math.pow(P1.y-P2.y, 2)));
  }
  export function  updatePotentialEdge(cy, lastTwo, lastPotentialEdge){
    // window.alert(lastTwo.toString());
    try{
      cy.remove(lastPotentialEdge);
    } catch(Exception){
    
    }
    console.assert(lastTwo.length>=2, "lastTwo is not equal to or greater than two, and a potential edge is tryna be drawn");
    try{
      let newPotEdge = cy.add([
        {
          group: "edges",
          data: { name: "", source: lastTwo[0], target: lastTwo[1], potentialStatus: true}
        }
      ]);
      newPotEdge.addClass('potential-edge');
      return newPotEdge;
    } catch(Exception){
      return -1;
    }
  }
  function between(x, x1, x2){
    if(x>x1&&x<x2) return true;
    return false;
  } 
//export {addNode, retrieveNewName};
function findNodesInViewport(cy, radius){
  let extent = cy.extent();
  let paddedExtent = [extent.x1, extent.x2, extent.y1, extent.y2];
  let nodesInViewport = cy.collection();
  cy.nodes().forEach(function(ele){
    //if this element is in the viewport
    // window.alert('position of ' + ele.data('name') + ": " + ele.position().x + ", " + ele.position().y);
    if(between(ele.position().x, paddedExtent[0], paddedExtent[1]) 
    && between(ele.position().y, paddedExtent[2], paddedExtent[3])  ){
      // window.alert(ele.data('name') + "is deemed in");
      nodesInViewport = nodesInViewport.union(ele);
    }
  });
  return nodesInViewport;
}
  