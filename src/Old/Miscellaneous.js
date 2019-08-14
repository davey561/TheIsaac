export function concatName( prevVal, ele, i, eles ){
  if( prevVal ){
    return prevVal + ', ' + ele.data('name');
  } else {
    return ele.data('name');
  }
};

export const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length
export function hasWhiteSpace(s) {
  return s.indexOf(' ') >= 0;
}
export function collectionToString(eles){
  let s = ""
  eles.forEach(function(ele){
    s+= ele.data('name') + ", "
  });
  return s;
}
// const collectionToString = () => {
//   let s = ""
//   let eles = cyRef.nodes();
//   if(eles){
//       eles.forEach(function(ele){
//           s+= ele.data('name') + ", "
//       });
// //   }
//   console.log(s)
//   return s;
// }

//Convert object to array with corresponding indices:
// export function toArray(obj, range){
//   let arr = []
//   let numberKeys = 
//   return Object.keys(obj).map(key => {Number(key)}).
// }
export function numberKeyDown(obj) {
  for (let i = 48; i <=57; i++){
    if(obj[i]){
      return [true, i];
    }
  }
  return [false];
}
