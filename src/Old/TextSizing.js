import {distance,distanceBetweenPoints} from '../Old/ModifyGraph';
import {arrAvg} from '../Old/Miscellaneous';
import {MIN_FONT_SIZE, WEIRD_TEXT_SIZING_FACTOR} from '../Old/Clean';

export function edgeTextCalcs(ele){
    let label = ele.data('name');
    let rendLength = distanceBetweenPoints(ele.renderedTargetEndpoint(), ele.renderedSourceEndpoint());
    let modelLength = distanceBetweenPoints(ele.targetEndpoint(), ele.sourceEndpoint());
    let currZoomLevel = rendLength/modelLength;
    let maxStrLength = Math.floor(rendLength/MIN_FONT_SIZE); //maximum number of characters in a string at the min font size
    return {
      'maxStrLength': maxStrLength,
      'currZoomLevel': currZoomLevel,
      'label': label,
      'rendLength': rendLength
    }
}
  
export function sizeEdgeFont(ele){
    let c = edgeTextCalcs(ele);
    if (c.label.length==0){return 0;}
    let fontSize;
    //if label is too long
    if (c.label.length >= c.maxStrLength){
        fontSize =  MIN_FONT_SIZE;
    } 
    //if the label fits, either make it large enough to fill the line, 
    // or as large as a k-letter label would be in the average of the two nodes
    else {
        const k = 5;
        let fontCap = arrAvg([ele.target().renderedWidth(), ele.source().renderedWidth()])/k;
        fontSize = Math.min(c.rendLength/c.label.length, fontCap);
    }
    return WEIRD_TEXT_SIZING_FACTOR* 9/10 * fontSize/c.currZoomLevel;
}
