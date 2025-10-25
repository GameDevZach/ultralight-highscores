function GetNowInSeconds(){
    return(Math.floor(Date.now().valueOf()/1000));
}

module.exports = {
    GetNowInSeconds
}