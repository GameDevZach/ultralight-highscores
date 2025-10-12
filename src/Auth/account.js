

function AccountRoutes(fastify,db){
    const { HashPass, VerifyPass } = require('./cryptography.js');
    /**
     * Post new user stuffs
     */
    fastify.post("/accounts", async (request, reply) => {
        const { username, pass, email } = request.body;
    
        if(username.length > process.env.CHAR_LIMIT)return reply.send({ error: 'Name too long', message: 'Name too long', code: 400, statusCode: 400 });

        
        const hashedPass = await HashPass(pass);

        result = await db.createAccount(username, email, hashedPass);
        
        return reply.send(result);
    });

    /**
     * Post login
     */
    fastify.post("/login", async (request, reply) => {
        const { username, pass } = request.body;
        const res = await db.getUserByName(username);
        console.log(res);
        const hashres = await db.getHash(res.id);
        console.log(hashres);
        const verified = await VerifyPass(String(pass), hashres.hashed_pass);
        console.log("Verified?:" + verified ? " Yes" : " No");
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