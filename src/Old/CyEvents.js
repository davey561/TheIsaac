import {save} from './EventResponses';
import {runLayout2} from './Layout';
import cytoscape from '../../node_modules/cytoscape/dist/cytoscape.esm';
import {retrieveNewName, deleteOneNode, rename} from './ModifyGraph';
import defaultOptions from './defaultOptions';



//Cytoscape Events
export function cytoscapeEvents(cy, lastTwoObj, lastEdgeName, setLastEdgeName, firebaseRef, typeahead, first){
  //keep track of last two
   cy.on(
    "add data select tap",
    (event) => {
      if(event.target === cy){
      }
      else if (event.target.isNode()){
        lastTwoObj.update(cy, event.target.id());
      }
      //if an edge has been added
      else if(event.target.isEdge()){
        //if potentialStatus field is defined and true (indicating it's a potential edge), break
        if (typeof event.target.data('potentialStatus') === 'undefined') {
          lastTwoObj.update(cy, event.target.source().id(), event.target.target().id());
        }
      }
      lastTwoObj.style(cy);
      lastTwoObj.renderText(cy);
    }
  );
  //autosave
  cy.pon('layoutstop').then(() => {
    //window.alert('ready');
    cy.on(
      "add remove data",
      function(event){
        save(cy, firebaseRef);
      }
    );

  });
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
      runLayout2(eles);
    }
  )
  cy.on("remove", function(event){
    //TODO delete from selected
    if(event.target.isNode()){
      lastTwoObj.remove(cy, event.target.id());
      lastTwoObj.style(cy);
    }  
  })
  //rename
  cy.on("cxttap",function(event){
    rename(cy, event);
  });

  //Delete node on taphold
  cy.on("taphold",function(event){
    console.log('taphold');
    if(!(event.target === cy)){
      if(event.target.isEdge()){
        document.getElementById('root').click();
        if(window.confirm('Delete "' + event.target.data("type") + 
          '" between ' + event.target.source().data('name') + " and " + 
          event.target.target().data('name')+"?")){
          cy.remove(event.target);
        }
        else {
          
        }
      }
      else if(event.target.isNode()){
        if(window.confirm('Delete "' + event.target.data('name') + '"?')){
            deleteOneNode(event.target, cy);
        }
        else if(event.target.data('level')==1){
          if(window.confirm('Convert back to no intermediate node?')){
            var srcnode = event.target.outgoers('node');
            var trgnode = event.target.incomers('node');

            cy.add([{data:{
              type: event.target.data('name'),
              source: trgnode.id(),
              target: srcnode.id()
            }}]);
            //remove the level 1 conversion contraption
            cy.remove(event.target.connectedEdges());
            cy.remove(event.target);
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
      // lastPotentialEdge = null; 
    }
    
  });
  // updates node text on zoom, updates edge text on position
  cy.on('zoom position', function(evt){
    cy.style().update();
  })
}
