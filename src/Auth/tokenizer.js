var jwt = require('jsonwebtoken');
const { GetNowInSeconds } = require("../Utils/datetime.util");

const RANDOM_CHARACTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*";
const RANDOM_STR_LENGTH = 12;
const TOKEN_LIFETIME_SECONDS = process.env.TOKEN_EXP_DAYS * 24 * 60 * 60; // * hours, minutes, seconds

function GetRandomString(){
    let retStr = "";
    for(let i = 0; i < RANDOM_STR_LENGTH; i++){
        retStr += RANDOM_CHARACTERS[Math.floor(Math.random()*RANDOM_CHARACTERS.length)];
    }
    return retStr;
}

function MakeTokenObject(user_id){
    const nowInSeconds = GetNowInSeconds();
    const tokenPayload = {
        user_id,
        created_dt: nowInSeconds,
        exp: nowInSeconds + TOKEN_LIFETIME_SECONDS,
        rand: GetRandomString()
    }
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET);

    return {...tokenPayload, token};
}

module.exports = {
    GetRandomString,
    MakeTokenObject,
}