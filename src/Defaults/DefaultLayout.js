export const IDEAL_EDGE_LENGTH = 20;
export const ANIMATION_DURATION = 800;

const layout = {
    cose: {
        name: 'cose',
        animate: 'end',  animationEasing: 'ease', animationDuration: ANIMATION_DURATION,
        randomize: false,
        refresh: 1,
        idealEdgeLength: IDEAL_EDGE_LENGTH,
        fit: true,
        nodeRepulsion: 5000,
        gravity: 50,
        nodeDimensionsIncludeLabels: true,
        padding: 30
    },
    fCose: {
        name: 'fcose', //uses the cose-bilkent layout, downloaded from internet, good for compound graphs
        animate: true,  animationEasing: 'ease', animationDuration: ANIMATION_DURATION,
        randomize: false,
        idealEdgeLength: .7*IDEAL_EDGE_LENGTH,
        fit: false,
        nodeDimensionsIncludeLabels: true,
        padding: 30,
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
        randomize: false,
        //gravityRange: .1,
        animationEasing: 'ease',
        //quality: 'proof',
        springLength: IDEAL_EDGE_LENGTH*5,
        // springCoeff: .005,
        dragCoeff: .1,
        ungrabifyWhileSimulating: true,
        //theta: .01
        fit: false
    }
}
export default layout;

export const animationOptions = {
    animate: 'end',  animationEasing: 'ease-out', animationDuration: ANIMATION_DURATION
}
