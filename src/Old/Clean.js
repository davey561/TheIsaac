import {Core} from 'cytoscape';
import cytoscape from 'cytoscape/dist/cytoscape.esm';
//import cola from 'cytoscape-cola';
import cola from 'cytoscape-cola';
//import dagre from 'cytoscape-dagre';
import dagre from 'cytoscape-dagre';
import defaultOptions from './defaultOptions'
import {distance} from './ModifyGraph';
import { hasWhiteSpace } from './Miscellaneous';
cytoscape.use(cola);
cytoscape.use(dagre);

export const TB_RATIO = 2;
export const WEIRD_TEXT_SIZING_FACTOR = 1.5;
export const MIN_FONT_SIZE = 8;

export function cleanNodes(cy){
    cy.nodes().forEach(function(ele){
        ele.style('text-max-width', ele.style('width'));
        ele.data('id', ele.data('name'));
        //console.log(ele.data('name') + "'s textmaxwidht is being set to " + ele.data('width'));
    });
    
}
export function colaLayout(cy){
    cy.layout(defaultOptions.cola).run();
   // window.alert('hello');
}
export function dagreLayout(cy){
    cy.layout(defaultOptions.dagre).run();
}
export function sizeNodeText(ele){
  let c = fullNodeTextCalcs(ele);
  let fontSize;

  //if label is blank, return 1
  if(typeof c.label ==='undefined' || c.label.length==0){
    return 1;
  }
  //if the maxStrLength is 1 or 0, return small font size
  else if(c.maxStrLength<=1){
    return 1/2*MIN_FONT_SIZE;
  }
   //else if label is too long, return min font size
  else if (c.label.length > c.maxStrLength){
    fontSize = MIN_FONT_SIZE;
  }
  else if (!hasWhiteSpace(c.label)){
    fontSize = c.tbWidth/c.label.length;
  }
  //
  else {
    fontSize = 
        Math.floor(Math.sqrt(
        (c.tbHeight * c.tbWidth)/(2.25 * c.label.length)
      ));
  }
  return WEIRD_TEXT_SIZING_FACTOR * fontSize/c.currZoomLevel;
}
export function setTextMaxWidth(ele){
  const c = nodeTextCalcs(ele);
  return 0.75 * WEIRD_TEXT_SIZING_FACTOR * c.tbWidth/c.currZoomLevel;
}

export function setNodeLabel(ele){
  const c = fullNodeTextCalcs(ele);
    //if label is too long
  if(typeof c.label === "undefined"){
    return 1;
  }
  if (c.label.length > c.maxStrLength){
    if(c.maxStrLength > 1){
      c.label = c.label.slice(0, c.maxStrLength - 1) + '.';
    } else {
      c.label = '';
    }
  } 
  return c.label;
}
function nodeTextCalcs(ele){
  let rendDiam = ele.renderedWidth();
  let currZoomLevel = rendDiam/ele.width();
  let tbWidth = rendDiam * Math.pow((1+1/(Math.pow(TB_RATIO,2))),-0.5);
  let tbHeight = tbWidth/TB_RATIO;
  let label = ele.data('name');
  return {
    'rendDiam': rendDiam,
    'currZoomLevel': currZoomLevel,
    'tbWidth': tbWidth,
    'tbHeight': tbHeight, 
    'label': label
  }
}
function fullNodeTextCalcs(ele){
  let c = nodeTextCalcs(ele);
  c['lineCharLim'] = Math.floor(c.tbWidth/MIN_FONT_SIZE);
  c['maxNumOfLines'] = Math.floor(c.tbHeight/(2.25 * MIN_FONT_SIZE));
  c['maxStrLength'] = c.lineCharLim * c.maxNumOfLines;
  return c;
}
