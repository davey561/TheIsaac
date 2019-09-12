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


