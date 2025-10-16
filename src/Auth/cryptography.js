const bcrypt = require('bcrypt');

function VerifyPass ( pass, hash ) {
    return bcrypt.compare( pass, hash );
}

function HashPass ( pass ) {
    return bcrypt.hash(String(pass),12);
}

/*const argon2 = require('argon2');

function VerifyPass ( pass, hash){
    return new Promise((resolve, reject)=>{
        argon2.verify(hash,pass).then((verified)=>{
            resolve(verified);
        })
    });
}

function HashPass ( pass ){
    return new Promise((resolve,reject)=>{
        argon2.hash(String(pass)).then((hashedPass)=>{
            console.log(hashedPass);
            resolve(hashedPass);
        })
    });
}*/

module.exports = { HashPass, VerifyPass }