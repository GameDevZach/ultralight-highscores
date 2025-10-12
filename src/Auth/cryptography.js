const argon2 = require('argon2');

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
    /*const parameters = {
    message: String(pass),
    nonce: randomBytes(16),
    parallelism: 4,
    tagLength: 64,
    memory: 65536,
    passes: 3,
    };

    return new Promise((resolve,reject)=>{
        argon2('argon2id', parameters, (err, derivedKey) => {
        if (err){
            throw err;
        }
        console.log(derivedKey.toString('hex'));  // 'af91dad...9520f15'
        resolve(derivedKey);
        });
    })*/
}

module.exports = { HashPass, VerifyPass }