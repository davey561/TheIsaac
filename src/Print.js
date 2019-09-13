export const printCollection=(collection, attribute, message)=>{
    console.log(message, collection.toArray().map(ele=>ele.data(attribute)));
}
export const printEdgeWeights = (cy, howMany) => {
    let dataToPrint = cy.edges().toArray().map(edge=> [edge.data('name'), edge.data('weight')]);
    if(dataToPrint.length<howMany){
        howMany = dataToPrint.length;
    }
    console.log(dataToPrint.slice(0,howMany));
}
