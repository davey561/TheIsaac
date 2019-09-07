// var WordPOS = require('../node_modules/wordpos'),
//     wordpos = new WordPOS();
import WordPOS from 'wordpos';
import pos from 'pos';
export const renderComment = () => {
    let renderedChatBot = document.getElementById('convo');
    let inputdom = document.getElementById('comment-section');
    let input = inputdom.value;
    //console.log('currently rendered text is ' + renderedText)

    renderedChatBot.innerHTML = `${renderedChatBot.innerHTML} <br> You: ${input}`;
   // inputdom.blur();
}
export const renderAll = (cy) => {
    let inputdom = document.getElementById('comment-section');
    renderComment();
    let ran = Math.random();
        renderResponse(respond(inputdom.value, cy));
    inputdom.value = "";
}
export const renderResponse = (response) => {
    let renderedChatBot = document.getElementById('convo');
        renderedChatBot.innerHTML = `${renderedChatBot.innerHTML} <br> ...`;
        renderedChatBot.scrollTop = renderedChatBot.scrollHeight;
    setTimeout(()=>{
        let renderedChatBot = document.getElementById('convo');
        renderedChatBot.innerHTML = `${renderedChatBot.innerHTML} <br> Isaac: ${response}`;
        renderedChatBot.scrollTop = renderedChatBot.scrollHeight;
    }, Math.random()*2000);
}
export const respond = (comment, cy) => {
    let result = "I didn't come up with a response";
    // let wordpos = new WordPOS({profile: true});
    // console.log(wordpos);
    // wordpos.isAdjective('awesome', function(r){console.log(r)});
    //wordpos.getNouns(comment, (r)=> console.log(r));

    let words = new pos.Lexer().lex(comment);
    let tagger = new pos.Tagger();
    let taggedWords = tagger.tag(words);
    let nouns = [];
    console.log('the nouns:')
    for (let i in taggedWords) {
        let taggedWord = taggedWords[i];
        let word = taggedWord[0];
        let tag = taggedWord[1];
        if(tag.slice(0,2)==="NN"){
            nouns.push(word);
            console.log(word);
        } 
    }
    console.log('cy elements: ', cy.elements());



    return result;
}
