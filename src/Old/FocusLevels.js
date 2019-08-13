import { Core, Singular, CollectionReturnValue, Collection } from "cytoscape";

//10) Find a connected grahp that contains the searched for node
  //for example and demonstration purposes, find the connected graph containing Davey nodes
//   export function findCxtGraph(cy: Core, ele: Singular){
//     let cxtgraphs:CollectionReturnValue = cy.components();
//     for(var i = 0; i<cxtgraphs.size(); i++){
//       if(cxtgraphs[i].contains(cy.$id(ele.id()))){
//         return cxtgraphs[i];
//       }
//     }
//   }
  //update font-size, width and height; depends on degree, length of name, emphasis, and level
  //also label and emphasis
  //var times = 0;
  export function resetEmph(cy){
    cy.nodes().forEach(function(ele){
      ele.data('emphasis', 1);
      //window.alert('emphasis set to 1, label to name');
    });
    //cy.edges().style({'font-size': 5, /*'width': 1*/});
  }
//   export function degreeEmph(cy: Core){
//     let f = cy.$().degreeCentralityNormalized();
//     //window.alert(Object.values('[name = Davey]'))
//     window.alert(f.degree('#' + cy.nodes()[0].id()));
//   //  window.alert('beginning with degreeemph after f: ' + f.degree('#' + ex));
//     // cy.nodes().forEach(function(ele){
//     //   ele.data('emphasis', f.degree('#' + ele.id())*ele.data('emphasis'));
//     // });
//     window.alert('done with degreeemph');
//     cy.style().update();
//   }
//   //7) Search for node and change layout to center viewport on it
  export function quickSelect(cy){
    var searchterms = window.prompt("Search:", "Davey");
    var results = cy.nodes('[name@*="' + searchterms + '"]');   //searches within the graph for a node that contains searchterms

    //if there is only one result
    if (results.size()==1){
      let result = results[0];
      result.unselect();
      result.select();
    }
  }
  export function searchForNode(cy){
    var searchterms = window.prompt("Search:", "");
    var results = cy.nodes('[name@*="' + searchterms + '"]');   //searches within the graph for a node that contains searchterms

    //if there is only one result
    if (results.size()==1){
      let result = results[0];
      //window.alert("results: " + result.data('name'));
      // result.select();
      resetEmph(cy); //sets emphasis to 1 for all elements
      var focusedarea = cy.elements().components()[0]; //the whole connected graph that includes the desired node
      var focusednodes = focusedarea.filter('node'); //the nodes in this connected graph
      //window.alert(JSON.stringify(focusednodes.jsons()));

    //   //Emphasis calculation:
    //     //Need to find factor by which to multiply size of each node;
    //     //this value is either above 1--deserves more emphasis--or below--deserves less
    //     window.alert('beginning emphasis calculations');
    //     //Temporary array to stor the emphasis values as they're manipulated to perfection:
    //     let temparray: number[] = [];
    //     //debugging: window.alert("distance of path between Davey and Beep: " + cy.elements().aStar({root: results, goal: cy.$('[name="Beep"]')}).distance);
    //     //For every node, get an emphasis value based on its distance from the 'result'
    //     focusednodes.forEach(function(ele){
    //       //window.alert('results: ' + results.data('name') + ', goal: ' + ele.data('name') + ", distance between: " +
    //       // cy.elements().aStar({root: results, goal: ele}).distance);
    //       temparray.push(cy.elements().aStar({root: results, goal: ele}).distance);
    //     });
    //     window.alert('temp array astarred: ' + temparray.toString());
    //     //find the maximum of these values, in order to manipulate them more
    //     var emphmax = Math.max(...temparray); window.alert("max in temp array is")
    //     //window.alert('emphmax found:' + emphmax);
    //     //Find the average of these values
    //     var emphavg = temparray.reduce(function(a, b) { return a + b; }) / temparray.length;
    //     window.alert('average emph has been calculated: ' + emphavg);

    //     //now, if style of nodes was last updated in styleEles function, then w, h, font size of each should vary according to this change in emphasis
    //     //styleEles(cy);
    //      //focusedEdges(cy);
    //     //document.getElementById('styleButton').click();

      //Ways to focus:
        animateFit(cy, results[0]);
    //   //  window.alert('extended neighborhood size: ' + results.openNeighborhood().closedNeighborhood().size());
    //     var morefocused = results.openNeighborhood().closedNeighborhood();

    //     //Animate process of fitting double neighborhood of result node to viewport.
    //   //  document.getElementById('layoutButton').click();
    //     //morefocused
    //   focusedarea






    //     .layout({name: 'concentric', animate: true, 'animationDuration': 3000, animationEasing: 'ease-in-out-sine',
    //         minNodeSpacing: 0, //equidistant: true,
    //         spacingFactor: 1.8, fit: true,
    //         concentric: function(node){
    //           if(node.id()==results[0].id()){ //I don't think the typescript checker works here
    //             return emphmax;
    //           }
    //           else{

    
    //             //a value for each node, about how close it is to the goal node
    //             return (emphmax-cy.elements().aStar({root: results, goal: node}).distance);
    //           }
    //           //return node.data('emphasis');
    //         },
    //         levelWidth: function(nodes){return 1}
    //       })
    //     .run();


        //window.alert('after layout run');
        //To finalize emphasis values, do two things to them.
          //Currently, they measure the distance from result to node. I want correlation to be more distance, less emphasis. So, make them negative to flip the order;
          //But, want all values to be positive as a whole(just stylistically), so add maximum value, so lowest emph value is now 0
          //Finally, divide by emphavg, so average value is now 1, and there's a balance between the nodes enlarged more and less than usual.
          //Extra: accentuate result by raising it to a certain power


        //window.alert('before animated fit');
        //animateFit(cy, results);

        //window.alert('before setEmph');
        //setEmph(cy, focusednodes);
        // focusednodes.forEach(function(ele){
        //   ele.data(
        //     'emphasis', Math.pow( (emphmax-cy.elements().aStar({root: results, goal: ele}).distance)/emphavg, 1.5)
        //   );
        // //  window.alert(ele.data('name') + "'s emphasis: " + ele.data('emphasis'));
        // });

        //window.alert('before styleEles');
         //styleEles(cy);
         //focusedEdges(cy);
        // cy.nodes().style().update();
        //window.alert("layout completed for morefocused area");
        //Run cose-bilkent for all other nodes
        // var x = cy.elements().difference(morefocused);
        // window.alert('loaded difference collection');
        // x.layout({name: 'randomize'}).run();
        // window.alert('cose bilkent layout for other nodes');
        //Zoom a bit more than concentric layout running above

        //cy.style().update();
        // window.alert('search and focus complete');


        // cy.layout({'name': 'concentric', 'animate': true, 'animationDuration': 4000,
        //   minNodeSpacing: 0, //equidistant: true,
        //   spacingFactor: .5,
        //   concentric: function(node){
        //     if(node.id()==results.id()){
        //       return 0;
        //     }
        //     else{
        //       return (-cy.elements().aStar({root: results, goal: node}).distance);
        //     }
        //   },
        //   levelWidth: function(nodes){return 1}
        // })
        // .run();

        //cy.fit(results.closedNeighborhood().closedNeighborhood());
    }
    else if(results.size()>1){
      window.alert('more than one result');
    }
    else if(results.size()==0){
      window.alert("nothing meets that criteria"   );
    }
  }
  export function printArray(array){
    let s = "";
    var i = 0;
    for(i = 0; i = array.length; i++){
      s += array[i] + " | "
    }
  }
  export function animateFit(cy, ele){
    // window.alert('in animate fit');
    // window.alert('ele for fit is ' + ele.data('name'));
    if(!(ele.closedNeighborhood()==undefined)){
      //window.alert('think closed neighborhood aroudn this ele exists');
      var whattofitto  =ele.closedNeighborhood();
    }else{
      // window.alert('closed neighborhood around this ele does not');
    var whattofitto = ele;
    } 
    // window.alert('gonna fit to: ' + whattofitto.data('name'));
  cy.animate(
    {fit:
      {eles: whattofitto, padding: 60}
    },
    {duration: 3000}
  );
  //window.alert('animation code complete, ' + whattofitto.data('name'));
  return whattofitto;
}

 ////focusednodes is the collection of nodes to which the viewport is fitted
//   export function setEmph(cy: Core, focusednodes: Collection, emphmax: number, results: any, emphavg: number ){
//     //for each node in the viewport's focus
//     focusednodes.forEach(function(ele){
//       //set the element's emphasis variable to its distance in the astar
//       ele.data(
//         'emphasis', Math.pow( (emphmax-cy.elements().aStar({root: results, goal: ele}).distance)/emphavg, 3)
//       );
//     //  window.alert(ele.data('name') + "'s emphasis: " + ele.data('emphasis'));
//     });
//     window.alert('done with setEmph');
//     return {};
//     cy.style().update();

//   }
