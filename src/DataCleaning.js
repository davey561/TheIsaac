import {contains} from './TheIsaac';
/**
 * Consolidate nodes with same name into the same concept
 * Deletes all the nodes in the graph! Not sure why
 * @param {*} cy 
 */
export const consolidateConcepts = (cy) => {
    let nameList = []; //list of names that have been collected so far
    //make a list of names first
    cy.nodes().forEach((node)=>{
        if(!contains(nameList, node.data('name'))){
            nameList.push(node.data('name'));
        }
    });
    console.log('Namelist: ', nameList);
    nameList.forEach(name => {
        let releNodes = cy.collection(); //list of all nodes with the name
        cy.nodes().forEach(node => {
            if(node.data('name') === name){
                releNodes = releNodes.union(node);
            }
        });
        const nodeToKeep = releNodes[0];
        let releNodesBad = releNodes.difference(nodeToKeep);
        //get edges leaving and coming into the group of nodes with this name
        const outgoers = releNodesBad.outgoers('edge');
        const incomers = releNodesBad.incomers('edge');
        outgoers.forEach(edge => {
            //transfer this same edge to the nodeToKeep
            cy.add({
                data: {
                    source: nodeToKeep,
                    target: edge.target().id(),
                    weight: edge.data('weight'),
                    name: edge.data('name')
                }
            });
        });
        //delete the old outgoers
        cy.remove(outgoers);
        incomers.forEach(edge => {
            //transfer this same edge to the nodeToKeep
            cy.add({
                data: {
                    source: edge.source().id(),
                    target: nodeToKeep,
                    weight: edge.data('weight'),
                    name: edge.data('name')
                }
            });
        });
        //delete the old incomers
        cy.remove(incomers);

        //delete all the other nodes with this name
        cy.remove(releNodesBad);
        console.log('single node kept? ' + nodeToKeep.inside());
    })
}
export const testConsolidateConcepts = (cy) => {
    let nameList = []; //list of names that have been collected so far
    //make a list of names first
    cy.nodes().forEach((node)=>{
        if(!contains(nameList, node.data('name'))){
            nameList.push(node.data('name'));
        }
    });
    if(nameList.length<cy.nodes().size()){
        return "still fewer names: "//, nameList, cy.nodes().toArray().map(ele=> ele.data('name'));
    }
    else if (nameList.length==cy.nodes().size()){
        console.log('consolidate concepts worked: ', cy.nodes().toArray().map(ele=> ele.data('name')));
        return "worked";
    } else {
        console.warn("releNodes did something we have no clue how to explain.");
        return "wat the fuck";
    }
}
export const replaceIsaacWithI = (cy) => {
    cy.edges().forEach(edge => {
        let index = 0;
            const oldName = edge.data('name');
            const lowerCaseName = oldName.toLowerCase();
            const isaacIndex = lowerCaseName.indexOf("isaac");
            
            if(isaacIndex!=-1){
                let ivsme = isaacIndex < 4 ? "I": "me";
                let newName = oldName.slice(0,isaacIndex-1) + ivsme + oldName.slice(isaacIndex+"isaac".length);
                edge.data('name', newName);
            }
        
        
    })
}
export const resetConnectionWeights = (cy, resetValue) => {
    cy.edges().forEach(edge => edge.data('weight', resetValue));
}
export const normalizeOutgoers = (cy, ele) => {
        let outgoers = ele.outgoers('edge');
        let outgoingWeight = 0;
        //get total outgoing weight
        outgoers.forEach(outgoer => {
            console.assert(outgoer.data('weight'));
            outgoingWeight += outgoer.data('weight');
        });
        //normalize
        outgoers.forEach(outgoer => {
            let weight = outgoer.data('weight');
            console.assert(weight);
            outgoer.data('weight', weight / outgoingWeight);
        });
}
export const normalizeEdgeWeights = (cy) => {
    cy.nodes().forEach(ele=> {
        let outgoers = ele.outgoers('edge');
        let outgoingWeight = 0;
        //get total outgoing weight
        outgoers.forEach(outgoer => {
            console.assert(outgoer.data('weight'));
            outgoingWeight += outgoer.data('weight');
        });
        //normalize
        outgoers.forEach(outgoer => {
            let weight = outgoer.data('weight');
            console.assert(weight);
            outgoer.data('weight', weight / outgoingWeight);
        });
    });
}
export const processEdgeNames = cy => {
    cy.edges().forEach(edge => {
        edge.data('name', processComment(edge.data('name')));
    })
}
export const processComment = (comment) => {
    // debugger;
     return processWords(comment.split(" ")).reduce((comment, word) => comment + " " + word);
 }
export const processWord = (word) => {
     return secondPersonFlip(word.toLowerCase());
 }
export const processWords= (words) => {
     return words.map(word=> processWord(word));
 }
export const secondPersonFlip = (word)=> {
     let newWord;
     if(contains(["i", "me"], word)){
         newWord="you";
     } else if(contains(["you", "isaac"], word)){
         newWord="i";
     } else if(contains(["your"], word)){
         newWord="my";
     } else if(contains(["yours"], word)){
         newWord="mine";
     } else if(contains(["my"], word)){
         newWord="your";
     } else if(contains(["mine"], word)){
         newWord="yours";
     } else if(contains(["am"], word)){
         newWord="are";
     } else{
         newWord = word;
     }
     return newWord;
 }
 const justTheWords= (taggedWords) => {
    return taggedWords.map(word=> word[0]);
 }
 /**
  * Remove all edges with particular name
  */
 export const removeSpecificEdges = (cy, targetName) => {
    let edgesToRemove = cy.collection();
    cy.edges().forEach(edge=>{
        if (edge.data('name') === targetName) {
            edgesToRemove = edgesToRemove.union(edge);
        }
    });
    cy.remove(edgesToRemove);
}
export const reduceEdgeWeight  = (cy, divisor) => {
    cy.edges().forEach(edge => {
        let newWeight = edge.data('weight') / divisor;
        edge.data('weight', newWeight);
    });
}

export const normalizeEdgeWeights2 = (targetNode) => {
    let n = targetNode.neighborhood('edge');
    let tempWeight = 0;
    n.forEach(edge => {
        tempWeight+= edge.data('weight');
    });
    n.forEach(edge => {
        if(!edge.data('weight')) edge.data('weight', .04);
        else if(edge.data('weight')>1) edge.data('weight', .5);
        else edge.data('weight', edge.data('weight')/ tempWeight);
    })
}


