import defaultOptions from './defaultOptions';
import cytoscape from '../../node_modules/cytoscape/dist/cytoscape.esm'
import cola from 'cytoscape-cola';
import dagre from 'cytoscape-dagre';
cytoscape.use(cola);
cytoscape.use(dagre);

export function runLayout(cy, eles, layout){
  cy.stop();
  try{
    eles.layout(layout).run();
  } catch (Exception) {}
 
}
export function runLayout2(eles){
  try{
    eles.layout(defaultOptions.fCoseOptions).run();
  } catch (Exception){

  }
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
