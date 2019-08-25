import defaultOptions from '../Defaults/defaultOptions';
import cytoscape from '../../node_modules/cytoscape/dist/cytoscape.esm'
import cola from 'cytoscape-cola';
import dagre from 'cytoscape-dagre';
import { animateFitDirect } from './FocusLevels';
import {ANIMATION_DURATION} from '../Defaults/DefaultLayout';

cytoscape.use(cola);
cytoscape.use(dagre);

export function runLayout(cy, eles, layout){
  cy.stop();
  try{
    eles.layout(layout).run();
  } catch (Exception) {}
 
}
export function runLayout3(createdLayout){
  createdLayout.stop();
  try{
    createdLayout.run();
  } catch (Exception) {}
}
export function traversalLayout(cy, eles, layout){
  //using this try catch cuz sometimes is fired without an eles at all
  try{
    if(cy.animated()) {cy.stop()}
    else {eles.closedNeighborhood().closedNeighborhood() // no longer using kruskal
        .createLayout(defaultOptions.fCoseOptions).run();}
    animateFitDirect(cy, eles, ANIMATION_DURATION*.8);
    
  } catch (Exception){}
}
export const layoutThenFit = (cy, elesToLayout, elesToFit, layout) => {
  elesToLayout.createLayout(layout).run();
  animateFitDirect(cy, elesToFit, ANIMATION_DURATION);
}
export function randomLayout (cy){
  let layoutOptions = 
  {
    name: 'random', 
    animate: defaultOptions.layout['animate'], 
    animationDuration: defaultOptions.layout['animationDuration'], 
    animationEasing: defaultOptions.layout['ease-out']
  };
  cy.layout(layoutOptions).run();
}
export function colaLayout(cy){
  cy.layout(defaultOptions.cola).run();
 // window.alert('hello');
}
export function dagreLayout(cy){
  cy.layout(defaultOptions.dagre).run();
}
export function fCoseLayout(cy){
  if(!cy.animated()){
  // console.log('inside l')
    let randomFCose = {...defaultOptions.fCoseOptions};
    randomFCose.randomize = true;
    runLayout(cy, cy.layout(randomFCose));

  }
}
export const makeChangesForInitialLayout = (layout) => {
  let realLayout = {...layout};
  //first,unrelatedly, change fit setting of layout to true
  realLayout.fit=true;
  realLayout.animate= 'end';  
  realLayout.animationEasing='ease-in-out-quint'; 
  realLayout.animationDuration= 2.5*ANIMATION_DURATION;
  realLayout.randomize=false;
  //realLayout.ease
  return realLayout;
}
// export const setFitToFalse = (layout) => {
//   let realLayout = {...layout};
//   realLayout.fit = false;
//   realLayout.animate = 'end';
//   realLayout.animationDuration = .5 * ANIMATION_DURATION; //so that layout animation doesn't interfere much
//   return realLayout;
// }
