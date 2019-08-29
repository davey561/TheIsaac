export const IDEAL_EDGE_LENGTH = 20;
export const ANIMATION_DURATION = 800;

const layout = {
    cose: {
        name: 'cose',
        animate: 'end',  animationEasing: 'ease', animationDuration: ANIMATION_DURATION,
        randomize: false, //seems to be random regardless of whether this is true or false
        refresh: 1,
        idealEdgeLength: IDEAL_EDGE_LENGTH/20,
        edgeElasticity: IDEAL_EDGE_LENGTH/8,
        // edgeElasticity: function(ele){
        //     if(ele.data('name')){
        //         return ele.data('name')*8
        //     } else {
        //         return 30;
        //     }
        // },
        // idealEdgeLength: function(edge){
        //     if(typeof edge.data('name') ==undefined) {
        //         return 30;
        //     }else if ( edge.data('name').length==0 ){
        //         return 30;
        //     }
        //     return edge.data('name')*8+10;
        // },
        nodeOverlap: 100,
        fit: true,
        nodeRepulsion: 20000,
        gravity: 500,
        nodeDimensionsIncludeLabels: true,
        padding: 30,
        componentSpacing: 10
    },
    fCose: {
        name: 'fcose', //uses the cose-bilkent layout, downloaded from internet, good for compound graphs
        animate: true,  animationEasing: 'ease', animationDuration: ANIMATION_DURATION,
        randomize: false,
        idealEdgeLength: 1*IDEAL_EDGE_LENGTH,
        edgeElasticity: .1,
        fit: false,
        nodeDimensionsIncludeLabels: true,
        padding: 30,
        nodeRepulsion: 5000
        //quality: 'draft',
        //sampleType: false,

    },
    dagre: {
        name: 'dagre',
        rankSep: IDEAL_EDGE_LENGTH,
        nodeSep: IDEAL_EDGE_LENGTH,
        animate: true, animationDuration: ANIMATION_DURATION,
        randomize: true,
        fit: true,
        nodeDimensionsIncludeLabels: true,
        padding: 30
    },
    cola: {
        name: 'cola',
        animate: true,
        refresh: 1,
        randomize: false,
        edgeLength: (edge) => {return 30}
    },
    euler: {
        name: 'euler',
        animate: 'end',
        animationDuration: ANIMATION_DURATION,
        randomize: true,
        //gravityRange: .1,
        animationEasing: 'ease',
        //quality: 'proof',
        springLength: IDEAL_EDGE_LENGTH,
        // springCoeff: .005,
        dragCoeff: .1,
        ungrabifyWhileSimulating: true,
        //theta: .01
        fit: false,
        //springLength: edge=> 30,
        springLength: edge => {
            if(typeof edge.data('name')!== 'undefined' && edge.data('name').length==0){
                return 16 * (Math.pow(edge.data('name').length, 1/4) + 8);
            }
            return 10;
        }
    }
}
export default layout;

export const animationOptions = {
    animate: 'end',  animationEasing: 'ease-out', animationDuration: ANIMATION_DURATION
}
