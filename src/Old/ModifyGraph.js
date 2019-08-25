import { Core, EdgeCollection } from "cytoscape";
import {runLayoutDefault} from "../EventResponses/EventResponses";
import cytoscape from '../../node_modules/cytoscape/dist/cytoscape.esm';
import {concatName} from './Miscellaneous';
import { async } from "q";

export function addNode(cy, label, location){
    if (label==null) return null;
    let newNode = cy.add(
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
    newNode.select();
    return newNode;
  }
  export function retrieveNewName(cy, isNode, existsAlready){
    let nodename = String(window.prompt("Name:", ""));
    if(nodename=="null"){return -1;}
    return findUniqueName(cy, nodename, isNode, existsAlready);
  }
  export function findUniqueName(cy, nodename, isNode, existsAlready){
    let counter = 0;
    let id = nodename + counter;
    let ele_type = (isNode ? "node": "edge");
    let group = (isNode ? cy.nodes(): cy.edges());
    //while there's a node with the current name, ask if it's ok
    let currentTaken = (isNode? group.is(`[name = "${nodename}"]`): false)
    if(currentTaken){
      if(!window.confirm(
        `There is another ${ele_type} with this name. Confirm that you'd like this name.`))
      {
        return -1;
      }
    }
    do {
      counter++;
      id = nodename+counter;
    } while(group.is(`[id = "${id}"]`));
    return [nodename, id];
  }
  export function getBarReady(cy, ele, typeahead, mode, defaultName){
    let instance = typeahead.getInstance();
    instance.clear();
    instance.focus();
    let input = instance.getInput();
    switch(mode){
      case "search": 
        
        break;
      case "rename": 
        console.log('renaming');
        input.value= defaultName;
        break;
      case "create": 
        input.value = defaultName;
        input.select();
        break;
    }
    
  }
  export function keyRename(cy, setTypeMode, typeahead, setEleBeingModified, typeMode){
    let eles = cy.elements().filter(':selected');
    if(eles.length!=1){
      return -1;
    } else{
      let ele = eles[0];
      setEleBeingModified(ele);
      setTypeMode('rename');
      getBarReady(cy, ele, typeahead, typeMode, ele.data('name'));
    }
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
    let newCoords = {};
    let goodLocation; //boolean value indicating whether node has been placed in a
    let i = 0;
    let paddedExtent = {
      x1: extent.x1 + radius,
      x2: extent.x2 - radius,
      y1: extent.y1 + radius,
      y2: extent.y2 - radius
    }
    //Find all the nodes currently in the viewport
    let nodesInViewport = findNodesInViewport(cy, radius);
    do{
      goodLocation = true;
      newCoords = {
        x: randomIntInRange(paddedExtent.x1, paddedExtent.x2),
        y: randomIntInRange(paddedExtent.y1, paddedExtent.y2)
      }
      cy.nodes().forEach(function(ele){
        //if this element is in the viewport
        if(between(ele.position().x, paddedExtent.x1, paddedExtent.x2) 
        && between(ele.position().y, paddedExtent.y1, paddedExtent.y2))
        {
          nodesInViewport.union(ele);
          if(distanceBetweenPoints(newCoords, ele.position()) < ele.numericStyle('width')){
            goodLocation = false;
            //window.alert('woulda been too close');
          }
        }
      });
      i++;
      if(i>3000){
        // let nodesInViewport = findNodesInViewport(cy, radius);

        // let zooming = async() => {cy.zoom(cy.zoom()/4)};
        // zooming().then(()=>{
        //   cy.center(nodesInViewport);
        //   return findGoodLocationForNewNode(cy, radius);
        // });
        // return null;
        window.alert('viewport is too crowded for new node. zooming out to add it')
        return -1;
      }
    } while(!goodLocation);
    return newCoords;
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
function findNodesInViewport(cy, radius) {
  let paddedExtent = getPaddedExtent(cy, radius);
  let nodesInViewport = cy.collection();
  cy.nodes().forEach(function(ele){
    if(between(ele.position().x, paddedExtent.x1, paddedExtent.x2) 
    && between(ele.position().y, paddedExtent.y1, paddedExtent.y2))
    {
      nodesInViewport.union(ele);
    }
  });
  return nodesInViewport;
}
export function deleteOneNode(targnode, cy){
  cy.remove(targnode); 
}
export function addEdgeSmart(cy, lastEdgeAdded, lastTwoObj){
  let sourceNode = null; let targetNode =null;
  //I think this check to see if there are any selected nodes
  if(lastTwoObj.lastTwo.length==2){
    sourceNode = cy.$('[id="'+lastTwoObj.lastTwo[0]+'"]');
    targetNode = cy.$('[id="'+lastTwoObj.lastTwo[1]+'"]');
  }
  //Allow user to add edge
  if(sourceNode!=null && targetNode!=null){
    lastEdgeAdded = addEdge(cy, sourceNode, targetNode, lastEdgeAdded);
  }
}
export function nedge(cy, lastTwoObj){
  let eventualEdge = retrieveNewName(cy, false);
  let eventualNode = retrieveNewName(cy, true);
  let pastSelected = cy.getElementById(lastTwoObj.lastTwo[1]);
  let newNode = addNode(cy, eventualNode, {x: 0, y: 0});
  let newEdge = addNewEdge(cy, pastSelected, newNode, eventualEdge[0]);
}
export function nodify (cy){
  if (cy.edges().filter(':selected').length == 1){
    let newName = cy.edges().filter(':selected').data("name");
    let unique = findUniqueName(cy, newName, true);
    newName = unique[0];
    let newId = unique[1];
    let sourceX = cy.edges().filter(':selected').source().position().x;
    let sourceY = cy.edges().filter(':selected').source().position().y;
    let targetX = cy.edges().filter(':selected').target().position().x;
    let targetY = cy.edges().filter(':selected').target().position().y;
    let newNodeX = (sourceX + targetX)/2;
    let newNodeY = (sourceY + targetY)/2;
    cy.add({
      data: { id: newId, name: newName },
      position: { x: newNodeX, y: newNodeY }
    }).select();
    cy.add({
      data: { source: cy.edges().filter(':selected').source().id(),
              target: newId,
              name: ''
            }
    });
    cy.add({
      data: { source: newId,
              target: cy.edges().filter(':selected').target().id(),
              name: ''
            }
    });
    cy.remove(cy.edges().filter(':selected'));
  }
}
export function edgify(cy){
  if (cy.nodes().filter(':selected').length == 1){
    if (cy.nodes().filter(':selected').incomers('edge').length==1 && cy.nodes().filter(':selected').outgoers('edge').length==1){
      let edge = cy.nodes().filter(':selected');
      if(edge.length == 1){
        let unique = findUniqueName(cy, edge.data('name'), false);
        let [newName, newId] = unique;
        cy.add({
          data: { name: newName,
            source: cy.nodes().filter(':selected').incomers('node').id(),
            target: cy.nodes().filter(':selected').outgoers('node').id()
          }
        }).select();
        cy.remove(cy.nodes().filter(':selected'));
      }
    }
  }
}
export function deleteAll(cy){
  if(window.confirm('Delete all nodes and edges?')){
    cy.remove(cy.elements());
  }
}
export function deleteSome(cy){
  if(cy.elements().filter(':selected').length>0){
    let copy = cy.elements().filter(':selected').slice(0); //make copy of selectedNodes, because selectedNodes can change in every iteration
    //(cy.on("remove", ...) in fx below)
    let ids = cy.elements().filter(':selected').reduce( concatName );
    if(window.confirm('Delete "' + ids + '"?')){
      copy.forEach(function(ele){deleteOneNode(ele, cy)});
    }
  }
}
export function addNodeSmart(cy){
  let coords = findGoodLocationForNewNode(cy,5);
  let newName = retrieveNewName(cy, true);
  if(newName!=-1){
    addNode(cy, newName, coords);
  }
  cy.container().focus();
  console.log(352);
}
function getPaddedExtent(cy, radius){
  let extent = cy.extent();
  return {
    x1: extent.x1 + radius,
    x2: extent.x2 - radius,
    y1: extent.y1 + radius,
    y2: extent.y2 - radius
  }
}
  