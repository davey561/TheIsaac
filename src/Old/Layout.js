import defaultOptions from './defaultOptions';

export function runLayout(cy, layout){
    layout.run();
}
export function runLayoutDefault(eles){
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
