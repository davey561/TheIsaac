import defaultOptions, { ANIMATION_DURATION } from './defaultOptions';
import cytoscape from '../../node_modules/cytoscape/dist/cytoscape.esm'
import cola from 'cytoscape-cola';
import dagre from 'cytoscape-dagre';
import { animateFitDirect } from './FocusLevels';
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
export function runLayout2(cy, eles, layout){
  console.log('running euler');
  //console.log(layout.randomize);
  //using this try catch cuz sometimes is fired without an eles at all
  try{
    eles.closedNeighborhood().closedNeighborhood().kruskal().createLayout(defaultOptions.fCoseOptions).run();
    if(!cy.animated()) animateFitDirect(cy, eles, ANIMATION_DURATION);
  } catch (Exception){}
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
export function fCoseLayout(cy, repeatTracker){
  // console.log('outside repeat tracker', repeatTracker);
  if(!repeatTracker){
  // console.log('inside l')
  let randomFCose = {...defaultOptions.fCoseOptions};
  randomFCose.randomize = true;
  runLayout(cy, cy.layout(randomFCose));

  }
  repeatTracker = true;
}
