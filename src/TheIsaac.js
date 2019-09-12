// var WordPOS = require('../node_modules/wordpos'),
//     wordpos = new WordPOS();
import WordPOS from 'wordpos';
import pos from 'pos';
import { noConflict } from 'q';
import {addNewConcepts, connectConceptsInSameComment} from './ResponseLogic/LearnNewConcepts'
import { distributeEmph } from './ResponseLogic/EmphasisDist';
import { debug } from 'util';
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
    comment = processComment(comment);
    const fiveWs = ['who', 'what', 'where', 'when', 'why'];
    const otherQphrases = ['do you', 'does he', 'does she', 'do they'];
    if(includesAny([...fiveWs, ...otherQphrases, "?"], comment)){
        //window.alert('includes any')
    } else if(includesAny(["hi ", "hello", "how are you", "greetings", "hey"], comment)) {
        let x = Math.random();
        if(x<.2) return "How do you do"
        else if (x<.4) return "What's up with it"
        else if (x<.7) return "Hello mate"
        else{
           return  "Why hello"
        }
    } else{
         //add all new to the graph
        let newConcepts = addNewConcepts(cy, juicyWords);
        //connect it to each other in the graph, making it twice as strong in one direction as in the other
        let newRelations = connectConceptsInSameComment(cy, comment, newConcepts);
    }
   

    //say something back to the user
    //response = saySomethingBack(taggedWords, cy, comment, juicyWords, newConcepts);
    response = distributeEmph(cy, juicyWords);
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
        if(contains(["NN", "PR", "JJ", "VB"], firstTwoLetters)){ //|| tag.slice(0,2)==="PR"){
            nouns.push(word);
        } 
    }
    return {juicyWords: nouns, taggedWords: taggedWords} //have been processed (I's and you's are flipped)
}
export const testFindCorresponding = (cy) => {
    let cn = findCorrespondingNodes(cy, ['davey', 'noah', 'isaac', 'breakfast', 'sdfjsdlfjlsj']);
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
    nouns.forEach((noun)=>{
        let node = cy.$('[name="' + noun + '"]');
        console.assert(node.size()<=1, "there's more than one node with name " + noun);
        if(node){
            relevantNodes = relevantNodes.union(node[0]);
        }
    });
    printCollection(relevantNodes, 'name', "These are the nodes deemed to correspond to the nouns in the comment: ");
    return relevantNodes;
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
export const processComment = (comment) => {
   // debugger;
    return processWords(comment.split(" ")).reduce((comment, word) => comment + " " + word);
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
    } else if(contains(["you", "isaac"], word)){
        newWord="i";
    } else if(contains(["your"], word)){
        newWord="my";
    } else if(contains(["yours"], word)){
        newWord="mine";
    } else if(contains(["my"], word)){
        newWord="your";
    } else if(contains(["mine"], word)){
        newWord="yours";
    } else if(contains(["am"], word)){
        newWord="are";
    } else{
        newWord = word;
    }
    return newWord;
}
const justTheWords= (taggedWords) => {
   return taggedWords.map(word=> word[0]);
}
export const printCollection=(collection, attribute, message)=>{
    console.log(message, collection.toArray().map(ele=>ele.data(attribute)));
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
