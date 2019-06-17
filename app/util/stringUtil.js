function stringify(data,exclude) {
    let base='';
    Object.keys(data).sort().map(key=>{
        if (!exclude || exclude[key]) {
            base+=key+data[key];
        }
    });
    return base;
}

module.exports={
    stringify
}