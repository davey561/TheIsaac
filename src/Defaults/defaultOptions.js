//I don't think the typing is done super well for these pre-initialization options
// import { NodeCollection, NodeDefinition, CytoscapeOptions, Collection, NodeDataDefinition, ElementDataDefinition, ElementDefinition, CollectionArgument, ElementStylesheetCSS, ElementStylesheetStyle, Stylesheet, LayoutOptions, EdgeDataDefinition } from 'cytoscape';
import cytoscape from 'cytoscape/dist/cytoscape.esm';
import cola from 'cytoscape-cola';
import fcose from 'cytoscape-fcose';
import dagre from 'cytoscape-dagre';

import layout, {animationOptions} from './DefaultLayout';
import style from './DefaultStyle';
import elements from './DefaultElements';

cytoscape.use(fcose);
cytoscape.use(cola);
cytoscape.use(dagre);

class defaultOptions{
  static layout = layout.cose;
  static fCoseOptions = layout.fCose;
  static dagre = layout.dagre;
  static cola = layout.cola;
  static euler = layout.euler;
  static animation = animationOptions;
  
  static style = [
    //the visuals that apply to all objects, both nodes and edges
    style.elements,
    style.nodes,
    style.edges,
    style["over-node"],
    style["selected-node"],
    style["potential-border"],
    style["over-edge"],
    style["selected-edge"]
  ];

  static startingElement = elements.home;
  static plexusEle = elements.williamsSummit;
  static testFamData = elements.familyData;
  static bigFamData = elements.bigFamilyData;
  static Potter = elements.harryPotter;
  static rocketInfo = elements.rocketScience;
  static firebaseConfig = {
    apiKey: "AIzaSyBvMNDIgJHQTcYiYPV3cUaATjg6dE5S-lA",
    authDomain: "cyto-sample.firebaseapp.com",
    databaseURL: "https://cyto-sample.firebaseio.com",
    projectId: "cyto-sample",
    storageBucket: "",
    messagingSenderId: "988037847889",
    appId: "1:988037847889:web:1b4ddbe97a7a348e"
  };
}
export default defaultOptions;
