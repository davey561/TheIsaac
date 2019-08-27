export const calclulateEmphasis = (cy) => {
    let sums = {}
    cy.nodes().forEach((ele)=> {
        sums[ele.id()] = 30;
    })
    let prevSums;
    for(let i = 0; i<1000; i++){
        prevSums = {...sums};
        sums = initialize(cy);
        //for each node
        cy.nodes().forEach((node)=> {
            //for each incident edge
            let incidentEdges = node.connectedEdges();
            incidentEdges.forEach((edge)=> {
                //store the neighbor node
                let neighbor = edge.connectedNodes().difference(node);
                sums[neighbor.id()] += 1/incidentEdges.size()*prevSums[node.id()];
            });
        })
        Object.keys(sums).map((key, index) => {
            sums[key] = Math.round(sums[key]);
        });
    }
    return sums;
}
const initialize = (cy) => {
    let sums = {}
    cy.nodes().forEach((ele)=> {
        sums[ele.id()] = 0;
    })
    return sums;
}
