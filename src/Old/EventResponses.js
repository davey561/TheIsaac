import * as firebase from 'firebase';

import "./style.css";
import defaultOptions from "./defaultOptions";
import cytoscape from "cytoscape/dist/cytoscape.esm";
// import {cytoscapeCoseBilkent} from '../node_modules/cytoscape-cose-bilkent/cytoscape-cose-bilkent';
import {Core} from "cytoscape";
import {addNode, retrieveNewName, addEdge, findGoodLocationForNewNode, 
  newEdgePrompt, addNewEdge,addNewEdge2, updatePotentialEdge, findUniqueName} from "./ModifyGraph";
import { searchForNode,quickSelect, animateFit } from "./FocusLevels";
import { cluster } from "./ClusterZoom";
import {cleanNodes, colaLayout, dagreLayout} from './Clean';
import {retrieve, initialize, setEmphasesByCloseness, initCy} from './Initialize';
//isaac is a beast- but davey saaid that i didnt say that but if davey said it then it must be true so take that noah you stupid butt just kiddng
import {concatName, collectionToString, numberKeyDown} from './Miscellaneous';

export function save(cy){
    //before saving, remove all style classes
    // cy.nodes().classes('');
    let elements = cy.elements();
    let firebaseRef = firebase.database().ref();
    //@ts-ignore
    let mode = document.getElementById('codeSelection').value;
    firebaseRef.child("Users").child(mode).set(JSON.stringify(elements.jsons()));
    // firebaseRef.child("style").set(JSON.stringify(cy.elements().jsons()));

    localStorage.setItem('graphitems', JSON.stringify(cy.elements().jsons()));
    //@ts-ignore
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}
function saveWhichUser(){
  //@ts-ignore
  localStorage.setItem('User', document.getElementById('codeSelection').value);
}
export function runLayout(cy, layout){
    layout.run();
  }
export function runLayoutDefault(eles){
  try{
    eles.layout(defaultOptions.fCoseOptions).run();
  } catch (Exception){

  }
}
export function randomLayout (cy){
  let layoutOptions = 
  {
    name: 'random', 
    animate: defaultOptions.layout['animate'], 
    animationDuration: defaultOptions.layout['animationDuration'], 
    animationEasing: defaultOptions.layout['ease-out']
  };
  cy.layout(layoutOptions).run();
}

export function confMessage(cy, e){
  var confirmationMessage = "\o/";

  (e || window.event).returnValue = confirmationMessage; //Gecko + IE
  return confirmationMessage;                            //Webkit, Safari, Chrome
}

function deleteOneNode(targnode, cy){
  cy.remove(targnode); 
}
export function allEvents(cy, lastTwoObj, lastEdgeAdded, lastPotentialEdge, allData) {
  console.log(lastTwoObj);
  // document.addEventListener('DOMContentLoaded', function(){
    //Button Responses
    (document.getElementById("layoutButton")).addEventListener("click", function(){
      runLayout(cy, cy.layout(defaultOptions.fCoseOptions));
    });
    (document.getElementById("localStorageButton")).addEventListener("click", function(){
      save(cy);
    });
    document.getElementById('codeSelection').addEventListener('change', function(ele){
      console.log('onchange');
      const previous = cy.elements();
      let firebaseRef = firebase.database().ref();
      //@ts-ignore
      let mode = document.getElementById('codeSelection').value;
      let elementsPromise = firebaseRef.child("Users").child(mode).once('value');
      elementsPromise.then(function(snapshot){
        console.log(snapshot.val());
        cy.add(JSON.parse(snapshot.val()));
        cy.remove(previous);
        runLayout(cy, cy.layout(defaultOptions.fCoseOptions));
      });
    });
    document.getElementById('toBullets').addEventListener('click', function(ele){
      saveToText(cy);
      window.alert('h')
    });


    //the variable that tracks the layout repeat
    let repeatTracker = false;

    //watching for the layout button coming up
    window.addEventListener("keyup", event => {
      if (event.keyCode == 76) {
        repeatTracker = false;
      }
    });

window.addEventListener("beforeunload", function (e) {
    confMessage(cy,e);
  });
  window.addEventListener("unload", function(evt){
    saveWhichUser();
    cy.nodes().classes('');
    cy.elements().deselect();
    save(cy);
    
    // window.alert(cy.nodes().classes())
  });
// //Save elements in graph to local storage
// (document.getElementById("localStorageButton") as HTMLElement).addEventListener("click", function(){save(cy)});
  //Keydown responses

    document.onkeydown = function(evt) {
      //@ts-ignore
      evt = evt || window.event;

      //l
      if (evt.keyCode == 76) {
        if(repeatTracker == false){
          let randomFCose = {...defaultOptions.fCoseOptions};
          randomFCose.randomize = true;
          runLayout(cy, cy.layout(randomFCose));
        }
        repeatTracker = true;
        // window.alert("l");
      }

      //a
      else if(evt.keyCode ==65){
        colaLayout(cy);
      }
      //d
      else if (evt.keyCode == 68){
        dagreLayout(cy);
      }
      //c
      else if (evt.keyCode == 67) {
        cleanNodes(cy);
      }
      //t
      else if (evt.keyCode == 84) {
        cy.style().update();
        saveToText(cy);
      }
      //s
      else if (evt.keyCode == 83) {
         save(cy);
      }
      //if escape pressed
      else if (evt.keyCode == 27) {
          cy.elements().unselect();
      }
      else if (evt.keyCode == 9){
        evt.preventDefault();
        lastTwoObj.switch(cy);
      }
      //letter r for randomize
      else if(evt.keyCode==82){
        randomLayout(cy);
      }
      else if(evt.keyCode == 13){
        let eventualEdge = retrieveNewName(cy, false);
        let eventualNode = retrieveNewName(cy, true);
        let pastSelected = cy.getElementById(lastTwoObj.lastTwo[1]);
        let newNode = addNode(cy, eventualNode, {x: 0, y: 0});
        let newEdge = addNewEdge(cy, pastSelected, newNode, eventualEdge[0]);
      }
    }

   //Other Responses
   //keep track of last two
   cy.on("add select", function(event){
    //  cy.style().update();
    //  ele.select();
    });
   cy.on(
    "add data select tap",
    function(event){
      
      let targnode = event.target;
      
      if(targnode === cy){
      }
      else if (targnode.isNode()){
        lastTwoObj.update(cy, event.target.id());
      }
      //if an edge has been added
      else if(targnode.isEdge()){
        //if potentialStatus field is defined and true (indicating it's a potential edge), break
        if (typeof targnode.data('potentialStatus') === 'undefined') {
          lastTwoObj.update(cy, event.target.source().id(), event.target.target().id());
        }
      }
      lastTwoObj.style(cy);
      lastTwoObj.renderText(cy);
    }
  );
  //autosave
  cy.on(
    "add remove data",
    function(event){
      save(cy);
    }
  );
  cy.on(
    "add remove select tap", function(event){
      let isnode = true;
      let eles;
      if(event.target !== cy){
        if(event.target.isEdge()){
          isnode = false;
          eles = cy.collection();
          eles = eles.union(event.target.source()).union(event.target.target()).closedNeighborhood();
        } else if (event.target.isNode()){
          eles = event.target.closedNeighborhood();
        }
        if(eles.length == 1){
          return;
        }
      }
      runLayoutDefault(eles);
    }
  )
  cy.on("remove", function(event){
    //TODO delete from selected
    if(event.target.isNode()){
      lastTwoObj.remove(cy, event.target.id());
      lastTwoObj.style(cy);
    }  
  })
    cy.on("cxttap",function(event){
        if(event.target !== cytoscape && event.target.isNode()){
           event.target.data('name', retrieveNewName(cy, true)[0]);
        }
        else if (event.target.isEdge()){
          event.target.data('name', retrieveNewName(cy, false)[0]);
        }

    });

    //Delete node on taphold
    cy.on("taphold",function(event){
      if(!(event.target === cy)){
        var targnode = event.target;
        if(targnode.isEdge()){
          document.getElementById('cy').click();
          if(window.confirm('Delete "' + event.target.data("type") + '" between ' + targnode.source().data('name') + " and " + targnode.target().data('name')+"?")){
            cy.remove(targnode);
          }
          else {
            
          }
        }
        else if(targnode.isNode()){

        //if a normal node
        if(window.confirm('Delete "' + targnode.data('name') + '"?')){
            deleteOneNode(targnode, cy);
          } 
            //if it's a relationship node, allow user to revert it back to normal edge
          //window.alert('right before level one check, level is: ' + targnode.data('level'));
        else if(targnode.data('level')==1){
          if(window.confirm('Convert back to no intermediate node?')){
            var srcnode = targnode.outgoers('node');
            var trgnode = targnode.incomers('node');

            cy.add([{data:{
              type: targnode.data('name'),
              source: trgnode.id(),
              target: srcnode.id()
            }}]);
            //remove the level 1 conversion contraption
            cy.remove(targnode.connectedEdges());
            cy.remove(targnode);
          }
        }
        }
      }
      //deleteSome(cy);
    }); 
    //Thicken node border on mouseover
    cy.on("mouseover",function(event){
      var targnode = event.target;

    if(targnode === cy){}
    else if(targnode.isNode()){
      if (!targnode.hasClass('selected-node')){
        targnode.addClass('over-node');
      }
      else {
        targnode.removeClass('over-node');
        targnode.addClass('selected-over-node');
      }
    }
    else if(targnode.isEdge()){
      if (targnode.hasClass('potential-edge')){
        targnode.addClass('over-edge');
        cy.style().update();
      }
      else if (!targnode.hasClass('selected-edge')){
        targnode.addClass('over-edge');
        cy.style().update();
      }
      else if (!targnode.hasClass('selected-edge')){
        targnode.addClass('over-edge');
      }
      else {
        targnode.removeClass('over-edge');
        targnode.addClass('selected-over-edge');
      }
    }
  });

  //Makes border disappear when mouse returns off of the node
  cy.on("mouseout",function(event){
    let targnode = event.target;
    if(targnode === cy){}
    else if(targnode.isNode()){
      if (targnode.hasClass('selected-over-node')){
        targnode.removeClass('selected-over-node');
        targnode.addClass('selected-node');
      }
      else{
        targnode.removeClass('over-node');
      }
    }
    else if(targnode.isEdge()){
      // window.alert('oh hello' + targnode.data('potentialStatus'))
      if (targnode.hasClass('selected-over-edge')){
        targnode.removeClass('selected-over-edge');
        targnode.addClass('selected-edge');
      }
      else{
        targnode.removeClass('over-edge');
      }
    }
  });

    //keep track of selection
    cy.on("select",function(event){
      let targnode = event.target;
      if(event.target.isNode()){
        if(targnode.hasClass('over-node')){
          targnode.removeClass('over-node');
          targnode.addClass('selected-over-node');
        }
        //Make border double-lined and larger on selection
        else if (targnode.hasClass('selected-over-node')){

        }
        else {
          targnode.addClass('selected-node');
        }
      }
      else if (event.target.isEdge()){
        // targnode.style('line-color', 'black');\
        if(targnode.hasClass('over-edge')){
          targnode.removeClass('over-edge');
          targnode.addClass('selected-over-edge');
        }
        else if (targnode.hasClass('selected-over-edge')){

        }
        else {
          targnode.addClass('selected-edge');
        }
        // cy.$(targnode).select();
        // window.alert('edge selected is black')
      }
      // //Turns out you cannot select an edge, so this is useless
      // else if(targnode.isEdge()){
      //   targnode.style('line-color', 'cyan');
      // }
      // cy.style().update();
    });
  
    //on deselection
    cy.on("unselect",function(event){
      let targnode = event.target;
      if(event.target.isNode()){
        //Make border of nodes back to normal style and width.
        if (targnode.hasClass('selected-over-node')){
          targnode.removeClass('selected-over-node');
          targnode.removeClass('selected-node');
          targnode.removeClass('over-node');
        }
        else {
          targnode.removeClass('selected-node');
        }
      }
      else if(event.target.isEdge()){
        if (targnode.hasClass('selected-over-edge')){
          targnode.removeClass('selected-over-edge');
          targnode.removeClass('selected-edge');
          targnode.removeClass('over-edge');
        }
        else {
          targnode.removeClass('selected-edge');
        }
      }
    });
    
    //when you click on potential edges they turn into edges
    cy.on("tapend",function(event){
      // console.log('oh hello tap' + typeof targnode.data('potentialStatus') !== 'undefined')
      //if the event's target is not the cy background, and this is in fact this last potential edge
      if((event.target !== cy)&&(typeof event.target.data('potentialStatus')!=="undefined")) {
        event.target.removeClass('potential-edge');
         lastTwoObj.lastTwo[0] = 'undefined';
        lastPotentialEdge = null; 
      }
      
    });
    // updates node text on zoom, updates edge text on position
    cy.on('zoom position', function(evt){
      cy.style().update();
    })

  //double keypress!
  var map = {}; 
  onkeydown = onkeyup = function(e){
    // e = e || event; // to deal with IE
    map[e.keyCode] = e.type == 'keydown';
    if(map[16] && map[32]){ // SHIFT Space, davey imagined we'd use this for something else
    
    }
    //Select with space pressed
    else if ((!map[16]) && map[32]){
      quickSelect(cy);
      map = {};
    }
    //nodify with shift n
    else if (map[16] && map[78]){
      nodify(cy);
    }
  //adding a node with n
  else if ((!map[16]) && map[78]){
      findGoodLocationForNewNode(cy, 5);
      map = {};
  }
  //edgify on shift e
  else if (map[16] && map[69]){
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
  //regular edge with e
  else if ((!map[16]) && map[69]){
    map = {};
    let sourceNode = null; let targetNode =null;
        //I think this check to see if there are any selected nodes
        if(lastTwoObj.lastTwo.length==2){
          sourceNode = cy.$('[id="'+lastTwoObj.lastTwo[0]+'"]');
          targetNode = cy.$('[id="'+lastTwoObj.lastTwo[1]+'"]');
        }
        // else if(cy.nodes().filter(':selected').length>1) {
        //   //Store and keep track of the first two (will be in the order they were selected).
        //   sourceNode = cy.$('[id="'+cy.nodes().filter(':selected')[0]+'"]');
        //   targetNode = cy.$('[id="'+cy.nodes().filter(':selected')[1]+'"]');
        // }
        //Allow user to add edge
        if(sourceNode!=null && targetNode!=null){
          lastEdgeAdded = addEdge(cy, sourceNode, targetNode, lastEdgeAdded);
        }
    } 
    // //shift backspace to delete everything
    else if (map[16] && map[8]) {
      if(window.confirm('Delete all nodes and edges?')){
        cy.remove(cy.elements());
      }
      map = {};
    }
     //backspace to delete node
    else if (!map[16] && map[8]) {
      if(cy.elements().filter(':selected').length>0){
        let copy = cy.elements().filter(':selected').slice(0); //make copy of selectedNodes, because selectedNodes can change in every iteration
        //(cy.on("remove", ...) in fx below)
        let ids = cy.elements().filter(':selected').reduce( concatName );
        if(window.confirm('Delete "' + ids + '"?')){
          copy.forEach(function(ele){deleteOneNode(ele, cy)});
        }
      }
      map = {};
    }
    else if (numberKeyDown(map)[0]) {
      console.log('hello');
      //@ts-ignore
      let number = numberKeyDown(map)[1]-48;
      
      try{
        //@ts-ignore
        let component = cy.elements().components()[number];
        runLayoutDefault(component);
      }catch(Exception){

      }
      
    }
  }
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
// Downloads a text document containing the stringified json of all elements in graph
function saveToText(cy){
    let s = compilePropositionList(cy);
    var file = new Blob([s], {type: 'plain/text'}); //creates new plain text file
    if (window.navigator.msSaveOrOpenBlob) // IE10+// No clue what this does
        window.navigator.msSaveOrOpenBlob(file);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        let d = new Date();
        a.download = `MyPlexusOn${d.getMonth()}-${d.getDate()}.txt`;
        //window.alert(a.getAttribute("download"));
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
      }
}
function makePropositionList(cy){
  //Make list of edges
  let s = "";
  cy.edges().forEach(function(ele){
  s += `\n - ${ele.source().data('name')} ~ ${ele.data('name')} ~ ${ele.target().data('name')}`
  });
  return s;
}
function compilePropositionList(cy){
   //Make list of edges
   let s = "";
   let nodeList = "";
   let incidents;
   let nodeName;
   cy.nodes().forEach(function(node){
    nodeName = node.data('name')
    s += `\n - ${nodeName}`
    incidents = node.outgoers('edge');
    let relation;
    let edgeName;
    incidents.forEach(function(edge){
      edgeName = edge.data('name');
      relation = (edgeName.length==0 ? '': `${edge.data('name')}`)
      s += `\n  - ${relation} ${edge.target().data('name')}`
    });
    nodeList += nodeName + ", "
   });
   nodeList.slice(-2, 2);
   s+= `\n${nodeList}`;
   return s;
}
