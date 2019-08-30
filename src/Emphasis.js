import { DEF_EDGE_WEIGHT } from "./Old/ModifyGraph";

// export const calculateEmphasis = (cy, numberIterations, howGradual) => {
//     let sums = initialize (cy, 60);
//     let prevSums; //meant to temporarily store nodes' past emphasis values
//     let incidentEdges; //temporarily store edges incident to given node
//     let numNeighbors; //number of incident edges/neighbors (temporary)
//     let home_connection;
//     let totalIncidence; // sum of weights of incident edges
//     for(let i = 0; i<numberIterations; i++){
//         prevSums = {...sums};
//         sums = initializeHalf(cy,{...sums}, howGradual); //if howGradual is 1, sums are initialized to 0
       
//         //For each node...
//         cy.nodes().forEach((node)=> {
//             //Find the incident edges
//             incidentEdges = node.connectedEdges();
//             numNeighbors = (incidentEdges.size()/* + 1 for home node*/)

//             //Sum up edge weights to determine the divisor for normalization.
//             // let home_connection = node.data('home-connection');
//             //home_connection = 0;
//            // totalIncidence = home_connection; //for home node
//             totalIncidence = 0;
//             incidentEdges.forEach((edge) => {
//                 totalIncidence+= edge.data('weight');
//             });

//             //For each incident edge
//             incidentEdges.forEach((edge)=> {
//                 //store the corresponding neighbor node
//                 let neighbor = edge.connectedNodes().difference(node);
//                 let weight = edge.data('weight');
//                 //if(totalIncidence>1){
//                     weight = weight/totalIncidence;
//                // }
//                 // sums[neighbor.id()] += (edge.data('weight')/ totalIncidence) / factor * prevSums[node.id()];
//                 sums[neighbor.id()] += weight / howGradual * prevSums[node.id()];

//             });
//             //statehood constant (the purpose the home node would have served):
//                 //sums['home'] += (home_connection/ 1) / factor * prevSums[node.id()];
//         });
//         //for the home node:
//         //first sum up the stuff, add to its sum number
//         //let total_incidence = 1;
//         // cy.nodes().forEach((neighbor) => {
//         //     total_incidence+= neighbor.data('home-connection');
//         // })
//         // cy.nodes().forEach((neighbor) => {
//         //     let fract = neighbor.data('home-connection')/total_incidence;
//         //     sums[neighbor.id()] += fract / factor * prevSums['home']
//         // });
//     }
//     // Object.keys(sums).map((key, index) => {
//     //     sums[key] = Math.round(sums[key]);
//     // });
//     return sums;
// }

//the calculation, without home node:
export const calculateEmphasis = (cy, numberIterations, howGradual) => {
    let sums = initialize(cy, 4200);
    let prevSums; //meant to temporarily store nodes' past emphasis values
    let incidentEdges; //temporarily store edges incident to given node
    let numNeighbors; //number of incident edges/neighbors (temporary)
    let totalIncidence; // sum of weights of incident edges
    let holdsOnto;
    for(let i = 0; i<numberIterations; i++){
        prevSums = {...sums};
        sums = initialize(cy, 0);
       
        //For each node...
        cy.nodes().forEach((node)=> {
            //Find the incident edges
            incidentEdges = node.connectedEdges();
            numNeighbors = incidentEdges.size();
            
            //Find the sum of weights of the incident edges
            totalIncidence = 0;
            incidentEdges.forEach((edge) => {
                totalIncidence+= edge.data('weight');
            });

            //Transfer juice to neighbors along each incident edge.
            incidentEdges.forEach((edge)=> {
                let neighbor = edge.connectedNodes().difference(node); //the corresponding neighbor node
                let weight = edge.data('weight'); //the edge's weight
               // if(totalIncidence>1){
                    weight = weight / totalIncidence;
               // }
                // sums[neighbor.id()] += (edge.data('weight')/ totalIncidence) / factor * prevSums[node.id()];
                sums[neighbor.id()] += weight / howGradual * prevSums[node.id()];

            });

            //statehood constant (the purpose the home node would have served):
            sums[node.id()]+= 10;
        });
        
        
    }
    // Object.keys(sums).map((key, index) => {
    //     sums[key] = Math.round(sums[key]);
    // });
    return sums;
}
//Initializes the emphasis of each of the nodes with some initial value
const initialize = (cy, initialValue) => {
    let sums = {}
    cy.nodes().forEach((ele)=> {
        sums[ele.id()] = initialValue;
        //sums[ele.id()] = ele.data('emphasis');
    })
    sums['home'] = initialValue;
    return sums;
}

//Initializes emphasis of all the nodes according to their previous
const initializeWithPastData = (cy, prevSums, factor) => {
    let sums = {}
    cy.nodes().forEach((ele)=> {
        sums[ele.id()] = prevSums[ele.id()] * (factor-1) / factor;
    })
    sums['home'] = prevSums['home'] * (factor-1) / factor;
    return sums;
}

//Initailizes emphases of all the nodes according to their data stored emphasis
const initializeWithEmphasisData = (cy) => {
    let sums = {}
    cy.nodes().forEach((ele)=> {
        //sums[ele.id()] = initialValue;
        sums[ele.id()] = ele.data('emphasis');
    })
    sums['home'] = 40;
    return sums;
}
