import {runLayoutDefault} from './Layout';
import defaultOptions from './defaultOptions';
import firebase from 'firebase';
import cytoscape from '../../node_modules/cytoscape/dist/cytoscape.esm';
import {addNode, retrieveNewName, addEdge, findGoodLocationForNewNode, 
    newEdgePrompt, addNewEdge,addNewEdge2, updatePotentialEdge, findUniqueName} from "./ModifyGraph";

export function allEvents(cy, database, lastTwoObj, lastEdgeAdded) {
}

export function save(cy, firebaseRef){
    //before saving, remove all style classes
    // cy.nodes().classes('');
    // let elements = cy.elements();
    //@ts-ignore
    // let mode = document.getElementById('codeSelection').value;
    // firebaseRef.child("Users").child(mode).set(JSON.stringify(elements.jsons()));
    
    // localStorage.setItem('graphitems', JSON.stringify(cy.elements().jsons()));
    //Operate the snackbar
    
    
       //window.alert('saving');
        firebase.database().ref().child('elements').set(JSON.stringify(cy.elements().jsons()));
        var x = document.getElementById("snackbar");
        x.className = "show";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    // } catch (Exception) {
    //    // window.alert('catching');
    // }
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
