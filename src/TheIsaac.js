// var WordPOS = require('../node_modules/wordpos'),
//     wordpos = new WordPOS();
import WordPOS from 'wordpos';
import pos from 'pos';
import { noConflict } from 'q';
import {addNewConcepts, connectConceptsInSameComment} from './ResponseLogic/LearnNewConcepts'
import { distributeEmph } from './ResponseLogic/EmphasisDist';
import {processComment, processWord} from './DataCleaning';
import {printCollection} from './Print';
import { debug } from 'util';
/**
 * Renders the user's comment
 */
export const renderComment = (setResponses, responses) => {
    let renderedChatBot = document.getElementById('convo');
    let inputdom = document.getElementById('comment-section');
    let input = inputdom.value;
    renderedChatBot.innerHTML = `${renderedChatBot.innerHTML} <br> You:  ${input}`;
    setResponses([...responses, input]);
    console.log('responses, from inside RC, are ',  responses);
   // inputdom.blur();
}
/**
 * Handles all responses to user's submitting a comment 
 * @param {*} cy
 */
export const renderAll = (cy, responses, setResponses, pushResponse) => {
    let inputdom = document.getElementById('comment-section');
    renderComment(setResponses, responses);
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

    juicyWords = removeToBeFromConsideration(juicyWords);
    let correspondingNodes =  findCorrespondingNodes(cy, juicyWords).relevantNodes; //get the nodes that correspond to the given nouns
    let learn = whetherToLearn(comment, cy, juicyWords, correspondingNodes);
    console.log("whether to learn: ", learn);
    if(learn!=-1) return learn;

    //say something back to the user
    //response = saySomethingBack(taggedWords, cy, comment, juicyWords, newConcepts);
    response = distributeEmph(cy, juicyWords, correspondingNodes);
    setResponses([...responses, response]);
    console.log(responses);
    return response;
}
// const detectIgnorance = juicyWords => {
//     juicyWords.forEach(word => {

//     })
// }
const removeToBeFromConsideration = juicyWords => {
    const toBeConjugations = ['are', 'is', 'do'];
    let wordsToRemove = [];
    juicyWords = juicyWords.reduce((list, word) => {
        if(contains(toBeConjugations, word)){
            return list;
        } else{
            list.push(word);
            return list;
        }
    }, []);
    return juicyWords;
}
const whetherToLearn = (comment, cy, juicyWords, correspondingNodes) => {
    comment = processComment(comment);
    const fiveWs = ['who', 'what', 'where', 'when', 'why'];
    const otherQphrases = ['do you', 'does he', 'does she', 'do they'];
    if(includesAny([...fiveWs, ...otherQphrases, "?"], comment)){
        //add all new to the graph
            let newConcepts = addNewConcepts(cy, juicyWords);
            //connect it to each other in the graph, making it twice as strong in one direction as in the other
            let newRelations = connectConceptsInSameComment(cy, comment, newConcepts);
            return -1;
        //window.alert('includes any')
    } else if(includesAny([" hi", "hi ", "hello", "how are you", "greetings", "hey"], comment)) {
        let x = Math.random();
        if(x<.2) return "How do you do"
        else if (x<.4) return "What's up with it"
        else if (x<.7) return "Hello mate"
        else{
           return  "Why hello"
        }
    } else{
        let ignorance = detectIgnorance(correspondingNodes, juicyWords, cy);
        if (ignorance.ignorant) {
            return askToLearn(ignorance.which);
        } else {
            //add all new to the graph
            let newConcepts = addNewConcepts(cy, juicyWords);
            //connect it to each other in the graph, making it twice as strong in one direction as in the other
            let newRelations = connectConceptsInSameComment(cy, comment, newConcepts);
            return -1;
        }
    }
}
export const askToLearn =(targetConcept) => {
    return "I don't know much about " + targetConcept + ". Tell me more!";
}
/**
 * finds whether Isaac is ignorant about one of the keywords mentioned
 * @param {*} correspondingNodes 
 * @param {*} nouns 
 */
const detectIgnorance = (correspondingNodes, keywords, cy) => {
    const ignorant = false;
    let which;
    if(ignorant){
        keywords.forEach(word => {
            debugger;
            if(contains(
                    cy.nodes().toArray().map(ele=> ele.data('name')),
                    word
                )){
                which = word;
                ignorant = true;
            }
        });
    }
    return {ignorant: ignorant, which: which};
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
        if(contains(["NN", "PR", "JJ", "VB"], firstTwoLetters)){ //|| tag.slice(0,2)==="PR"){
            nouns.push(word);
        } 
    }
    return {juicyWords: nouns, taggedWords: taggedWords} //have been processed (I's and you's are flipped)
}
export const testFindCorresponding = (cy) => {
    let cn = findCorrespondingNodes(cy, ['davey', 'noah', 'isaac', 'breakfast', 'sdfjsdlfjlsj']).relevantNodes;
    printCollection(cn, 'id', "These are the corresponding nodes found in the test: ");
}
/**
 * Tested and works
 * @param {*} cy 
 * @param {*} nouns 
 */
export const findCorrespondingNodes = (cy, nouns) => {
    console.log('in find corresponding ids, nouns are ', nouns);
    let relevantNodes = cy.collection();
    let unknownWords = [];
    nouns.forEach((noun)=>{
        let node = cy.$('[name="' + noun + '"]');
        console.assert(node.size()<=1, "there's more than one node with name " + noun);
        if(node){
            relevantNodes = relevantNodes.union(node[0]);
        } else{
            unknownWords.push(noun);
        }
    });
    printCollection(relevantNodes, 'name', "These are the nodes deemed to correspond to the nouns in the comment: ");
    return {relevantNodes: relevantNodes, unknownWords: unknownWords};
}
export const contains = (array, value) => {
    let contains = false;
    array.forEach((ele)=>{
        if(ele===value){
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
const includesAny = (array, comment)=>{
    let contains = false;
    array.forEach(ele => {
        if(comment.includes(ele)) {
            contains= true;
        }
    })
    return contains;
}
