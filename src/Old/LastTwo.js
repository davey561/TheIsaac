/*
Stores the ID's of the last two nodes to be played with.
Has some common methods for updating them.

*/

import React from 'react';
import {collectionToString} from './Miscellaneous'


function LastTwo(props){
    this.lastTwo = [null,null];
    this.potClass = "potential-border";
    this.update = function(cy, ...newones){
        if (newones.length<=2) {
            for(let i = 0; i<newones.length; i++){
                //only add this as another if the last one added isn't identical
                if(!(this.lastTwo.length>=2 && this.lastTwo[1]===newones[i] || 
                    (this.lastTwo.length==1 && this.lastTwo[0]===newones[i]))) {
                        this.add(cy, newones[i]);
                }
            }
        }
        this.renderText(cy);
    }
    this.remove = function(cy, id){
        //this.lastTwo.splice(this.lastTwo.indexOf(id), 1);
        this.lastTwo[this.lastTwo.indexOf(id)] = null;
        this.renderText(cy);
    };
    this.getNames = function(cy) {
        let names = [];
        for(let i = 0; i<2; i++){
            if(typeof this.lastTwo[i] === 'undefined' || this.lastTwo[i] == null) {
                names[i] = '__';
            } else {
                names[i] = cy.getElementById(this.lastTwo[i]).data('name');
            }
        }
        return names;
    }
    this.add = function(cy, id){
        this.lastTwo.push(id);
        this.lastTwo.shift();
        this.renderText(cy);
    };
    this.style = (cy) => {
        cy.nodes().removeClass(this.potClass);
        this.toNodes(cy).addClass(this.potClass);
        //console.log(collectionToString(this.toNodes(cy)))
    }
    this.toNodes = (cy) => {
        let eles = cy.collection();
        for(let i = 0; i<this.lastTwo.length; i++){
            eles = eles.union(cy.getElementById(this.lastTwo[i]));
        }
        return eles;
    }
    this.switch = (cy) => {
        let temp = this.lastTwo[0];
        this.lastTwo[0] = this.lastTwo[1];
        this.lastTwo[1] = temp;
        this.renderText(cy);
    }
    this.renderText = (cy) => {
        let [source, target] = this.getNames(cy);
        return document.getElementById("lasttwo").innerHTML = 
        source + "&#160;&#160;&xrArr;&#160;&#160;" + target;
    }
    this.source = () => {
        return this.lastTwo[0];
    }
    this.target = () => {
        return this.lastTwo[1];
    }

}
export default LastTwo;
