// var WordPOS = require('../node_modules/wordpos'),
//     wordpos = new WordPOS();
import WordPOS from 'wordpos';
import pos from 'pos';
import { noConflict } from 'q';
/**
 * Renders the user's comment
 */
export const renderComment = () => {
    let renderedChatBot = document.getElementById('convo');
    let inputdom = document.getElementById('comment-section');
    let input = inputdom.value;
    renderedChatBot.innerHTML = `${renderedChatBot.innerHTML} <br> You:  ${input}`;
   // inputdom.blur();
}
/**
 * Handles all responses to user's submitting a comment 
 * @param {*} cy
 */
export const renderAll = (cy) => {
    let inputdom = document.getElementById('comment-section');
    renderComment();
    renderResponse(respond(inputdom.value, cy));
    inputdom.value = ""; //clears the input field
}

/**
 * Render's Isaac's response
 * @param {*} response 
 */
export const renderResponse = (response) => {
    let renderedChatBot = document.getElementById('convo');
        renderedChatBot.innerHTML = `${renderedChatBot.innerHTML} <br> ...`;
        renderedChatBot.scrollTop = renderedChatBot.scrollHeight;
    setTimeout(()=>{
        let renderedChatBot = document.getElementById('convo');
        renderedChatBot.innerHTML = `${renderedChatBot.innerHTML} <br> <img src = 'TheIsaac.ico' width=40px height = 40px></img> Isaac:  ${response}`;
        renderedChatBot.scrollTop = renderedChatBot.scrollHeight;
    }, Math.random()*1000);
}
export const respond = (comment, cy) => {
    if(Math.random()<.02){
        return "You know what... I'm going to kiss you!'";
    }

    let words = new pos.Lexer().lex(comment);
    let tagger = new pos.Tagger();
    let taggedWords = tagger.tag(words);
    let nouns = [];
    for (let i in taggedWords) {
        let taggedWord = taggedWords[i];
        //flip I and you, and make lowercase
        let word = processWord(taggedWord[0]);
        
        let tag = taggedWord[1];
        let firstTwoLetters = tag.slice(0,2);
        if(contains(["NN", "PR", "JJ"], firstTwoLetters)){ //|| tag.slice(0,2)==="PR"){
            nouns.push(word);
        } 
    }
    //overriding:
    if(taggedWords.length==1) nouns = [taggedWords[0]];
    let lowercaseNouns = nouns.map(noun => {
        noun.toLowerCase()
    })
    
    //add all new to the graph
    learnNewConcepts(cy, nouns);

    //connect it to each other in the graph, making it twice as strong in one direction as in the other
    connectConceptsInSameComment(cy, nouns, comment)

    //see if I know enough about any of em to say something
    let processedWords = processWords(justTheWords(taggedWords));
    if(containsPlural(processedWords, ["who", "what", "when", "where", "why", "?"])){
        return respondForFamiliarTopic(cy, comment, nouns);
    } else if(containsPlural(processedWords, ["are", "is"])) {
        let x = Math.random();
        const divisor = 3;
        const acknowledgments = ["Huh, ok.", "I see.", "Gotcha.", "Cool."]
        for(let i = 0; i<acknowledgments.length; i++){
            if(x<i / divisor){
                return acknowledgments[i];
            }
        }
    }
    return respondForFamiliarTopic(cy, comment, nouns);
}

const learnNewConcepts = (cy, nouns)=> {
    printEles(cy);
    nouns.forEach((noun)=>{
        //check if exists (can just check if id exists here, might be multiple); 
            //if not, add it to graph
        if(!cy.$("[id='"+noun+"']").length>0){
            cy.add({data: {name: noun, id: noun}});
        }
    });
    printEles(cy);
}
export const printEles = (cy) => {
    //console.log("printing all nodes in cy: ", cy.nodes().toArray().map((ele => ele.data('name'))));
}
const connectConceptsInSameComment = (cy, nouns, comment) => {
    for(let src = 0; src<nouns.length; src++){
        for(let trg = 0; trg<nouns.length; trg++){
            //make sure src and trg aren't the same
            if(src!==trg){
                //determine weight (either .1 or .05)
                let weight;
                (trg>src) ? weight = .1: weight = .05;
                cy.add({data: {source: nouns[src], target: nouns[trg], weight: weight, name: comment}});
            }
        }
    }
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
const findCorrespondingNodes = (cy, nouns) => {
    let relevantNodes = cy.collection();
    //console.log('nouns: ', nouns);
    nouns.forEach((noun)=>{
        let node = cy.$("[id='" + noun + "']");
        if(node[0]){
            relevantNodes = relevantNodes.union(node);
        }
    });
    //console.log('relevant nodes: ', relevantNodes.size());
    printEles(relevantNodes);
    return relevantNodes;
}
const contains = (array, value) => {
    //console.log('value being tested for contains is : ' , value)
    let contains = false;
    array.forEach((ele)=>{
        if(ele===value){
           // console.log(ele + " is " + value)
            contains=true;
        }
    })
    return contains;
}
const containsPlural = (array, values) => {
    let included = false;
    values.forEach(value => {
        if (contains(array, value)){
            included = true;
        }
    });
    return included;
}
const processWord = (word) => {
    return secondPersonFlip(word.toLowerCase());
}
const processWords= (words) => {
    return words.map(word=> processWord(word));
}
const secondPersonFlip = (word)=> {
    let newWord;
    if(contains(["i", "me"], word)){
        newWord="you";
    } else if(contains(["you"], word)){
        newWord="i";
    } else if(contains(["your"], word)){
        newWord="my";
    } else if(contains(["yours"], word)){
        newWord="mine";
    } else if(contains(["my"], word)){
        newWord="your";
    } else if(contains(["mine"], word)){
        newWord="yours";
    } else{
        newWord = word;
    }
    return newWord;
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
const respondForFamiliarTopic = (cy, comment, nouns) => {
    console.log('nouns: ', nouns);
    let topic = doIKnowEnoughToSaySomething(cy, nouns, .3);
    if(topic){
        return responseForFamiliarTopic(topic, nouns);
    }
    return (nouns[0]? "I don't know much about " + nouns[0] + ". Tell me more!": 
        comment + " to you too.");
}
const justTheWords= (taggedWords) => {
   return taggedWords.map(word=> word[0]);
}
