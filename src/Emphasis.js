export const calculateEmphasis = (cy) => {
    let sums = initializeWithCurrEmphases(cy);
    //window.alert('ehl');
    let prevSums;
    for(let i = 0; i<600; i++){
        prevSums = {...sums};
        sums = initialize(cy,0);
        //for each node
        cy.nodes().forEach((node)=> {
            //for each incident edge
            let incidentEdges = node.connectedEdges();
            let numNeighbors = (incidentEdges.size()+1/*for home node*/)
            incidentEdges.forEach((edge)=> {
                //store the neighbor node
                let neighbor = edge.connectedNodes().difference(node);
                sums[neighbor.id()] += 1 / numNeighbors * prevSums[node.id()];
            });
            //statehood constant (the purpose the home node would have served):
            sums['home'] += 1 / numNeighbors * prevSums[node.id()];
        });
        //for the home node:
        cy.nodes().forEach((neighbor) => {
            sums[neighbor.id()] += 1 / cy.nodes().size() * prevSums['home']
        });
    }
    Object.keys(sums).map((key, index) => {
        sums[key] = Math.round(sums[key]);
    });
    return sums;
}
const initialize = (cy, initialValue) => {
    let sums = {}
    cy.nodes().forEach((ele)=> {
        sums[ele.id()] = initialValue;
        //sums[ele.id()] = ele.data('emphasis');
    })
    sums['home'] = initialValue;
    return sums;
}
const initializeWithCurrEmphases = (cy) => {
    let sums = {}
    cy.nodes().forEach((ele)=> {
        //sums[ele.id()] = initialValue;
        sums[ele.id()] = ele.data('emphasis');
    })
    sums['home'] = 120;
    return sums;
}
