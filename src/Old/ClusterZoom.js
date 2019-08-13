import {Core, Collection, NodeDefinition} from 'cytoscape';
import cytoscape from "cytoscape/dist/cytoscape.esm";
export function cluster(cy){

    // console.log(fw.distance("#Davey", cy.$('[name="PHIL 202"]')));
    let fw = cy.elements().floydWarshall();
    let numClusters = 4;

    let clusters = cy.elements().mcl({
        k: numClusters, 
        distance: 
            function(nodeP, nodeQ){
                //console.log(nodeP);
                return fw.distance(nodeP, nodeQ);
            },

        inflateFactor: 1.5,
        maxIterations: 1000
    });
    console.log(clusters);
    // clusters[0].style('background-color', 'blue');
    // clusters[1].style('background-color', 'green');
    // clusters[2].style('background-color', 'orange');
    // clusters[3].style('background-color', 'purple');

    let colors = ['blue', 'green', 'orange', 'purple'];

    for (let i = 0; i < clusters.length; i ++)
    {
        clusters[i].style('background-color', colors[i]);
    }

    


    //window.alert("distance btw davey and jerome: " + cy.elements().dijkstra('#Davey').distanceTo(cy.$("#Burt")));
    // cy.edges().forEach(function(edge){
    //     edge.data('weight', 1);
    // });
    // let clusters = cy.elements().kMedoids({
    //     k:4,
    //     // attributes: [
    //     //     function(edge) {
    //     //         return 1;
    //     //     }
    //     // ]
    //    // distance: function (nodeP, nodeQ){

    //     //     return cy.elements().aStar(nodeP, nodeQ);
    //     // }
    //   });
     // console.log(clusters)
    //  console.log("First element of first cluster: " + clusters[0][0].data('name'));
        // clusters[0].style('background-color', 'blue');
        // if(clusters.length>1) {
        //     clusters[1].style('background-color', 'red');
        // } 
        // clusters[2].style('background-color', 'green');
        // clusters[3].style('background-color', 'purple');
   // let s: String = "";
}
function dist(nodeP, nodeQ){

}
