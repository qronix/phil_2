function isRealString(testString){
    if(typeof testString === 'string' && testString.length>0){
        return true;
    }else{
        return false;
    }
}