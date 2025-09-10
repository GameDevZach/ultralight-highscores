// Utilities we need
require('dotenv').config();
const fs = require("fs");
const path = require("path");

// Require the fastify framework and instantiate it
const fastify = require("fastify")({
    // Set this to true for detailed logging:
    logger: false,
  });

  // We use a module for handling database operations in /src
const data = require("./src/data.json");
const db = require("./src/" + data.database);

/**
 * Post route for score
 */
fastify.post("/subscore", async (request, reply) => {
    const startTime = Date.now().valueOf();
    const { username, newscore } = request.body;
  
    const truncatedName = username.substring(0,process.env.CHAR_LIMIT);

    result = await db.submitScore(truncatedName, newscore);
    
    console.log("POST score took " + (Date.now().valueOf()-startTime) + "ms");
    return reply.send({ newID: result.lastID, username: truncatedName, place: result.place });
});

/**
 * GET top scores
 * 
 * JSON Body Options
 * limit (the number of top highscores to return)
 */
fastify.get("/scores", async (request, reply) => {
  const startTime = Date.now().valueOf();
  let { limit=100 } = request.query;
  limit = Math.min(process.env.MAX_SCORES_RETURNED, limit);

  const result = await db.getTopScores(limit);

  console.log("GET scores with " + result.length + " results took " + (Date.now().valueOf()-startTime) + "ms");
  return reply.send({ highscores: result });
})

/**
 * GET contiguous scores
 * 
 */
fastify.get("/contiguous", async (request, reply) => {
  const startTime = Date.now().valueOf();
  let { lastID, limit=11 } = request.query;
  limit = Math.min(process.env.MAX_SCORES_RETURNED, limit);

  const result = await db.getContiguousScores(lastID, limit);

  console.log("GET contiguous with " + result.highscores.length + " results took " + (Date.now().valueOf()-startTime) + "ms");
  return reply.send(result)
})

/**
 * POST Randomizer Data
 * 
 * JSON Body Options
 * key: admin key
 * amount: number of random highscores you want to generate
 */
fastify.post("/admin/randomizeDB", async (request, reply) => {
  const startTime = Date.now().valueOf(); 

  let { key, amount } = request.body;
  if(key != process.env.ADMIN_KEY)return reply.send({ msg: "Ah ah ah, not without the magic word"});
  await db.randomizeDB(amount);

  console.log("POST randomizer data took " + (Date.now().valueOf()-startTime) + "ms");
  return reply.send({ msg: "You done F'd up the database, ready to stress test" });
})
  

// Run the server and report out to the logs
console.log(process.env.PORT);
fastify.listen(
    { port: process.env.PORT, host: "0.0.0.0" },
    function (err, address) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`Your app is listening on ${address}`);
    }
  );
  