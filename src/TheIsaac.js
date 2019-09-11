// var WordPOS = require('../node_modules/wordpos'),
//     wordpos = new WordPOS();
import WordPOS from 'wordpos';
import pos from 'pos';
import { noConflict } from 'q';
import {addNewConcepts, connectConceptsInSameComment} from './ResponseLogic/LearnNewConcepts'
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
export const renderAll = (cy, responses, setResponses, pushResponse) => {
    let inputdom = document.getElementById('comment-section');
    renderComment();
    renderResponse(respond(inputdom.value, cy, responses, setResponses, pushResponse));
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
export const respond = (comment, cy, responses, setResponses, pushResponse) => {
    //console.log('all responses ', allResponses);
    let response = 'default';
    //Randomly occasionally say the famous Isaac line.
    
    if(Math.random()<.01){
        return "You know what... I'm going to kiss you!'";
    }
    
    //tag the words.
    let {taggedWords, juicyWords} = tagWords(comment);
    
    //if there's a one word response, do something special? TOFIGUREOUT
        //link it to all words from the previous comment
    
    //add all new to the graph
    
    let newConcepts = addNewConcepts(cy, juicyWords);
    console.log('after new concepts added');
    printCollection(newConcepts, "name", "New Concepts: ");

    //connect it to each other in the graph, making it twice as strong in one direction as in the other
    let newRelations = connectConceptsInSameComment(cy, comment, newConcepts);
    printCollection(newRelations, 'name', "New Relations");

    //say something back to the user
    //return saySomethingBack(taggedWords, cy, comment, juicyWords, newConcepts);
    setResponses([...responses, response]);
    return response;
}
const tagWords = (comment) => {
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
        //If word is a noun, personal pronoun, or adjective (if it's a juicy relevant word, add it)
        if(contains(["NN", "PR", "JJ"], firstTwoLetters)){ //|| tag.slice(0,2)==="PR"){
            nouns.push(word);
        } 
    }
    return {juicyWords: nouns, taggedWords: taggedWords} //have been processed (I's and you's are flipped)
}



/** 
 * Say something back to the user
*/
const saySomethingBack = (taggedWords, cy, comment, nouns) => {
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
export const findCorrespondingNodes = (cy, nouns) => {
    console.log('in find corresponding ids, nouns are ', nouns);
    let relevantNodes = cy.collection();
    //console.log('nouns: ', nouns);
    nouns.forEach((noun)=>{
        let node = cy.getElementById(noun);
        if(node[0]){
            relevantNodes = relevantNodes.union(node);
        }
    });
    //console.log('relevant nodes: ', relevantNodes.size());
    printCollection(relevantNodes, 'name');
    return relevantNodes;
}
export const contains = (array, value) => {
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
export const containsGeneral = (array, value, condition) => {
    //console.log('value being tested for contains is : ' , value)
    let result = {isThere: false, which: null};
    array.forEach((ele)=>{
        if(condition(ele)===value){
           // console.log(ele + " is " + value)
            result={isThere: true, which: ele};
        }
    })
    return contains;
}
export const oneEleSatisfiesCondition = (array, values, condition)=>{
    let result = {isThere: false, which: null};
    values.forEach(value => {
        let tempResult = containsGeneral(array, value, condition);
        if (tempResult.isThere){
            result = tempResult;
        }
    });
    return result;
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
export const printCollection=(collection, attribute, message)=>{
    console.log(message, collection.toArray().map(ele=>ele.data(attribute)));
}
