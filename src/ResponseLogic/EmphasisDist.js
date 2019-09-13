import { contains, findCorrespondingNodes, processComment } from "../TheIsaac";
import {oneEleSatisfiesCondition} from '../Inclusion';
import PriorityQueue from "js-priority-queue";
import {testFindCorresponding} from '../TheIsaac';
import {printCollection, printEdgeWeights} from '../Print';
import { consolidateConcepts, testConsolidateConcepts, replaceIsaacWithI, resetConnectionWeights, normalizeEdgeWeights, normalizeOutgoers } from "../DataCleaning";
/**
 * 
 * @param {*} cy Core Instance of the Knowledge Graph
 */
export const testDistEmph = (cy, responses) => {
    printEdgeWeights(cy, 30);
    console.log(responses);
}
export const distributeEmph = (cy, nouns, correspondingNodes) => {

    let path = []; //keep track of path of concept nodes with which to respond
       //debugger;
       //debugger;
       let selected = getMostRelevantNeighbor(cy, correspondingNodes); //get the single most relevant neighbor of all these nodes
       const originalname = selected.neighbor.data('name');
       const originalweight = selected.weight;
       path.push(selected);
       let weight = selected.weight;
       let counter = 0;
       do {
           //build collection from the past node and all the corresponding nodes
           correspondingNodes = [...correspondingNodes.toArray(), path[path.length-1].neighbor[0]].reduce((collection, ele)=>{
            return collection.union(ele);
           }, cy.collection());
           printCollection(correspondingNodes, 'name', 'new corresponding nodes');
           selected = getMostRelevantNeighbor(cy, correspondingNodes); //run again with last element added
           if(!selected) break;
           path.push(selected);
           weight = weight * selected.weight;
           window.alert(selected.weight + " and " + weight * selected.weight);
           console.log('weight is ' + weight, "original weight is " + originalweight);
           counter++;
           if(path.length>30) {
               //console.log(path.map(ele => ele.weight));
               break;
           }
        } while(/*weight > originalweight*.93 && */ counter<Math.round(Math.random()*2));
    //    } while(/*weight > originalweight*.93 && */ counter<Math.round(Math.random()*3));
       console.log("path: ", path.map(entry=> [entry.neighbor.id(), entry.weight]));
       console.log('path: ', path);
        // from the path, say as many relevant things as possible.
        let response = produceTheComment(path);
        console.log('response', response);
        return response;
}
const produceTheComment = (path) => {
    let thingsToSay = [];
    path.forEach(entry => {
        const statement = entry.greatestSource.name;
        if(!contains(thingsToSay, statement)){
            thingsToSay.push(statement);
        }
    });
    return thingsToSay.reduce((result, newthing)=> `${result}. ${newthing}`);
}
const getMostRelevantNeighbor = (cy, correspondingNodes) => {
    let relevantNodes = getListOfUniqueNeighbors(cy, correspondingNodes);
    //let relevantNodes = correspondingNodes.openNeighborhood();
    if(!relevantNodes || relevantNodes.length==0) return null;
    let max = relevantNodes.reduce((maxEntry, entry) => {
        if(maxEntry.weight<entry.weight){
            return entry;
        } return maxEntry;
    }, relevantNodes[0]);
    console.log('max ', max);
    return max;
    
}

/**
 * Gets list of neighbors that all have unique id (lesser criterion than name uniqueness)
 * @param {} cy 
 * @param {*} correspondingNodes 
 */
const getListOfUniqueNeighbors = (cy, correspondingNodes) => {
    let relevantNodes = []; //array of the nodes
    printCollection(correspondingNodes, "name", "corresponding nodes to nouns in distemph");
    //for each corresponding node
    correspondingNodes.forEach((node) => {
        //look at all of its incident edges
        let incEdges = node.outgoers('edge');
        //for each incident edge, add neighbor to list if not already part
        incEdges.forEach((edge) => {
           // debugger;
            let neighbor = edge.connectedNodes().difference(node);
            //determine whether neighbor is already a part of the growing list of relevant nodes
            let alreadyThere = null;
            let whichIndex = -1;
            let ids = relevantNodes.map(entry=> entry.neighbor.id());
            loopy: for(let i=0; i<relevantNodes.length; i++){
                let entry = relevantNodes[i];
                if (entry.neighbor.id()===neighbor.id()) {
                    alreadyThere = entry;
                    whichIndex = i;
                    break loopy;
                }
            }
            //determine whether the neighbor is itself one of the nodes corresponding to nouns in the comment
            const redundantWithComment = contains(correspondingNodes.toArray(), neighbor[0]);
            if(!redundantWithComment){
                if(!alreadyThere) {
                    relevantNodes.push({
                        neighbor: neighbor, 
                        weight: edge.data('weight'), 
                        greatestSource: {
                            sourceNode: node, 
                            weight: edge.data('weight'),
                            name: edge.data('name')
                        } 
                    });
                } else{
                    //find the entry already recorded
                    let entry = alreadyThere; //should be the same neighbor as is being looked at
                    console.assert(entry.neighbor && entry.weight && entry.greatestSource, "neighbor or weight or greatest source don't exist in this entry")
                    //alreadyThere.neighbor remains unchanged
                    alreadyThere.weight = entry.weight + edge.data('weight');
                    let greatestSource = (edge.data('weight')>entry.greatestSource) 
                            ? {weight: edge.data('weight'), sourceNode: node, name: edge.data('name')}
                            : entry.greatestSource;
                    alreadyThere.greatestSource = greatestSource;
                }
            }
        });
    });
    console.log(relevantNodes.map(entry => entry.neighbor.id()));
    return relevantNodes;
}
function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
}
