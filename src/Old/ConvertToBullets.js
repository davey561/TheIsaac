// Downloads a text document containing the stringified json of all elements in graph
export function saveToText(cy){
    let s = compilePropositionList(cy);
    var file = new Blob([s], {type: 'plain/text'}); //creates new plain text file
    if (window.navigator.msSaveOrOpenBlob) // IE10+// No clue what this does
        window.navigator.msSaveOrOpenBlob(file);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        let d = new Date();
        a.download = `MyPlexusOn${d.getMonth()}-${d.getDate()}.txt`;
        //window.alert(a.getAttribute("download"));
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
      }
}
export function makePropositionList(cy){
  //Make list of edges
  let s = "";
  cy.edges().forEach(function(ele){
  s += `\n - ${ele.source().data('name')} ~ ${ele.data('name')} ~ ${ele.target().data('name')}`
  });
  return s;
}
export function compilePropositionList(cy){
   //Make list of edges
   let s = "";
   let nodeList = "";
   let incidents;
   let nodeName;
   cy.nodes().forEach(function(node){
    nodeName = node.data('name')
    s += `\n - ${nodeName}`
    incidents = node.outgoers('edge');
    let relation;
    let edgeName;
    incidents.forEach(function(edge){
      edgeName = edge.data('name');
      relation = (!edgeName ? '': `${edge.data('name')}`)
      s += `\n  - ${relation} ${edge.target().data('name')}`
    });
    nodeList += nodeName + ", "
   });
   nodeList.slice(-2, 2);
   s+= `\n${nodeList}`;
   return s;
}
