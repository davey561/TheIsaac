import { contains, oneEleSatisfiesCondition } from "./TheIsaac";
import PriorityQueue from "js-priority-queue";

export const distributeEmph = (cy, processedWords, nouns) => {
    let relevantNodes = []; //make it a map, searchable by id
    let correspondingNodes =  findCorrespondingNodes(cy, nouns);
    //for each corresponding node
    correspondingNodes.forEach((node) => {
        //look at all of its incident edges
        let incEdges = node.outgoers('edge');
        //for each incident edge, add neighbor to list if not already part
        incEdges.forEach((edge) => {
            let neighbor = edge.connectedNodes().difference(node);
            let alreadyThere = oneEleSatisfiesCondition(relevantNodes, neighbor, (ele)=>ele.neighbor).isThere;
            if(!alreadyThere) {
                relevantNodes.push({neighbor: neighbor, weight: edge.data('weight'), greatestSource: {sourceNode: node, weight: edge.data('weight')} });
            } else{
                //find the entry already recorded
                let entry = alreadyThere.which; //should be the same neighbor as is being looked at
                let neighbor = entry.neighbor;
                let weight = entry.weight + edge.data('weight');
                let greatestSource = (edge.data('weight')>entry.greatestSource) 
                                        ? edge.data('weight')
                                        : entry.greatestSource;
                entry = {neighbor: neighbor, weight: weight, greatestSource: greatestSource};
            }
        });
        // 3) find the one with the greatest weight TODO
        // 4) find the path (for now, one edge) to the one with the greatest thing
    });
}
