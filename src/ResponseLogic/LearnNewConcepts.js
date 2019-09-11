import {printCollection} from '../TheIsaac'

export const addNewConcepts = (cy, nouns)=> {
    printCollection(cy.nodes(), 'name');
    let newConcepts = cy.collection();
    console.log('cy: ', cy, "nouns: ", nouns)
    nouns.forEach((noun)=>{
        
        //check if exists (can just check if id exists here, might be multiple); 
            //if not, add it to graph
            // ** Sidenote: can tell which is the original node with that name by seeing if it the id === name.
                //if not original, that equality ^ won't be true.
        let original = cy.getElementById(noun);
        console.log('empty? ', original.empty())
        let newNode;
        if(original.empty()) {
            newNode = cy.add({data: {name: noun, id: noun}});
            newConcepts = newConcepts.union(newNode);
        } else {
            //if it does exist, add too cy, and connect strongly to the other, first instance.
            //  1) find an id for this instance, as there may have been duplicates already
            let i=2; //start at two
            while(!cy.getElementById(noun + i).empty()){
                i++;
                if(i>200) break;
            }
            let newId = noun + i;
            console.log('newid is ' +newId)
            
            //add it
            newNode = cy.add({data: {name: noun, id: newId}});
            newConcepts = newConcepts.union(newNode);
            
            //add connection between it and the good guy, in both directions.
            cy.add({data: {source: newNode.id(), target: original.id(), name: "composes", weight: 1}});
            cy.add({data: {source: original.id(), target: newNode.id(), name: "comprises", weight: 1}});

        }
    });
    console.log(
        'basically at the end'
    )
    //printCollection(cy.nodes(), 'name');
    return newConcepts;
}
/**
 * @param cy Core Instance
 * @param comment string comment that was entered by the user to prompt this response
 * @param newConceptNodes cytoscape collection of the new node concepts that
 *  were added from the user's comment
 */
export const connectConceptsInSameComment = (cy, comment, newConceptNodes) => {
    //get ids of the newConceptNodes
    const newNodeIds = newConceptNodes.toArray().map(ele => ele.id());
    let newEdges = cy.collection();
    for(let src = 0; src<newNodeIds.length; src++){
        for(let trg = 0; trg<newNodeIds.length; trg++){
            //make sure src and trg aren't the same
            if(src!==trg){
                //determine weight (either .1 or .05)
                let weight;
                (trg > src) ? weight = .16: weight = .08;
                let newEdge = cy.add({data: {source: newNodeIds[src], target: newNodeIds[trg], weight: weight, name: comment}});
                newEdges = newEdges.union(newEdge);
            }
        }
    }
    return newEdges;
}
