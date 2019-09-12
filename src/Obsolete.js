/** 
 * Say something back to the user
*/
const saySomethingBack = (taggedWords, cy, comment, nouns) => {
    //see if I know enough about any of em to say something
    const processedWords = processWords(justTheWords(taggedWords));
    // if(containsPlural(processedWords, ["who", "what", "when", "where", "why", "?"])){
    //     return respondForFamiliarTopic(cy, comment, nouns);
    // } else if(containsPlural(processedWords, ["are", "is"])) {
    //     let x = Math.random();
    //     const divisor = 3;
    //     const acknowledgments = ["Huh, ok.", "I see.", "Gotcha.", "Cool."]
    //     for(let i = 0; i<acknowledgments.length; i++){
    //         if(x<i / divisor){
    //             return acknowledgments[i];
    //         }
    //     }
    // }
    return respondForFamiliarTopic(cy, comment, nouns);
}
/**
 * No threshold now, because it will say the most relevant thing that hasn't been said yet. 
 *  If there's nothing else to say (this is the effective threshold), then whatever
 * @param {} cy 
 * @param {*} nouns 
 */
const whichTopic = (cy, nouns) => {
    //make list of nodes that the comment relates to, summing juice as we go
        //do this recursively, and stop going if node juice gets down to some threshold(I'm thinking .04, if each node starts with about 1 and has .1 connectiosn)
    //take difference between those nodes and all the nodes referenced in the comment
    //take difference between those nodes and all the nodes that have been used thus far in the conversation

   
}
const doIKnowEnoughToSaySomething = (cy, nouns, threshold) => {
    //first, find all the nodes that correspond to nouns
    let relevantNodes = findCorrespondingNodes(cy, nouns);
    let max = {value: 0, node: null}
    let tempSum = 0;

    relevantNodes.forEach((node)=> {
        tempSum = sumOfIncidentEdgeWeights(node);
        if(tempSum>max.value){
            max = {value: tempSum, node: node}
        }
    });
   // console.log('max is: ',  max);
    if(max.value>threshold){
        return max.node;
    }
    return null;
}
const sumOfIncidentEdgeWeights = (node) => {
    let sum = 0;
    let incidentEdges = node.outgoers('edge');
    incidentEdges.forEach((edge)=> sum+=edge.data('weight'));
    return sum;
}
const strongestRelation = (node, currentTopics) => {
    let maxWeight = 0;
    let strongest = {name: "", weight: maxWeight, connectsTo: null}; 
    let currWeight; let neighbor;
    node.outgoers('edge').forEach((edge) =>{
        currWeight = edge.data('weight');
        neighbor = edge.connectedNodes().difference(node);
        if(neighbor.data('name')==='face'){
            //console.log('face');
        }
        let included = contains(currentTopics, neighbor.data('name'));
        if((currWeight>maxWeight) && (!included)){
            //console.log('neighbor name is ' + neighbor.data('name'), 'needs to be true ' + (!contains))
            strongest = {name: edge.data('name')||"", weight: currWeight, connectsTo: neighbor};
            //console.log('just set strongest relat, connects to: ' + strongest.connectsTo.data('name'));
        }
    });
    return strongest;
}
const responseForFamiliarTopic = (topic, nouns)=>{
    let strongestRelat = strongestRelation(topic, nouns);
    let responseWords = strongestRelat.name.split(" ").map(
        word => secondPersonFlip(word.toLowerCase())
    );
    //window.alert(responseWords);
    let responseString = responseWords.reduce((str, word)=> str + " " + word); 
    return `${responseString}`
}
const respondForFamiliarTopic = (cy, comment, conceptNames) => {
    console.log('new concept names: ', conceptNames);
    let topic = doIKnowEnoughToSaySomething(cy, conceptNames, .3);
    if(topic){
        return responseForFamiliarTopic(topic, conceptNames);
    }
    return (conceptNames[0]? "I don't know much about " + conceptNames[0] + ". Tell me more!": 
        comment + " to you too.");
}
