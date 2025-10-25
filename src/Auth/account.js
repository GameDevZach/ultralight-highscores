const { MakeTokenObject } = require('./tokenizer.js');


function AccountRoutes(fastify,db){
    const { HashPass, VerifyPass } = require('./cryptography.js');
    /**
     * Post new user stuffs
     */
    fastify.post("/accounts", async (request, reply) => {
        const { username, password, email } = request.body;
    
        if(username.length > process.env.CHAR_LIMIT)return reply.send({ error: 'Name too long', message: 'Name too long', code: 400, statusCode: 400 });

        
        const hashedPass = await HashPass(password);

        result = await db.createAccount(username, email, hashedPass);
        
        return reply.send(result);
    });

    /**
     * Post login
     */
    fastify.post("/login", async (request, reply) => {
        const { username, password } = request.body;
        const user = await db.getUserByName(username);
        const hashres = await db.getHash(user.id);
        const verified = await VerifyPass(String(password), hashres.hashed_pass);
        if(verified){
            const tokenObj = MakeTokenObject(user.id);
            return reply.send(tokenObj); // payload is also outside of token for client awareness
        }else{
            throw new Error("Password does not match!");
        }
    })

    /** 
     * Get Accounts
     * TODO: Don't leave this in for everyone to use! Admin only?
     */
    fastify.get("/allaccounts", async (request, reply) => {
        const res = await db.getUsers();
        console.log(res);
        return reply.send(res);
    })
}


module.exports = { AccountRoutes };