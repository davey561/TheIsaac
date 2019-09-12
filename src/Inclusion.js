import {contains} from './TheIsaac';

export const containsGeneral = (array, value, condition) => {
    let result = {isThere: false, which: null};
    array.forEach((ele)=>{
        if(condition(ele)===value){
           // console.log(ele + " is " + value)
            result={isThere: true, which: ele};
        }
    })
    return contains;
}
export const oneEleSatisfiesCondition = (array, values, condition)=>{
    let result = {isThere: false, which: null};
    values.forEach(value => {
        let tempResult = containsGeneral(array, value, condition);
        if (tempResult.isThere){
            result = tempResult;
        }
    });
    return result;
}
export const inThere = (collection, value) => {
    let included = {inThere: false, which: null};
    collection.forEach((entry)=>{
        if (entry === value) included.inThere = true;
    });
    return included;
}
