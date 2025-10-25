// Utilities
const fs = require("fs");

// Init the database
const dbFile = "./.data/scorelator.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const dbWrapper = require("sqlite");
const dbSchema = require("./dbSchema.js");
const { GetNowInSeconds } = require("../Utils/datetime.util.js");
let db;

dbWrapper.open({
    filename: dbFile,
    driver: sqlite3.Database
})
.then(async dataBase => {
    db = dataBase;
    try{
        if(!exists){
            console.log("Initialize DB...");
            for(const schemaStatement of dbSchema.init){
                console.log(`Run: ${schemaStatement}`);
                await db.run(schemaStatement);
            };
            await db.run("INSERT INTO DBEvents (version, msg) VALUES( ?, ? );",[
                dbSchema.init.length,
                `Created DB version ${dbSchema.init.length} from scratch.`
            ]);
        }else{
            console.log("DB Exists... check version for schema changes");
            const curVersion = (await db.get("SELECT id, version, msg FROM DBEvents ORDER BY version DESC LIMIT ?", [1])).version;
            if(curVersion < dbSchema.init.length){
                console.log(`DB Schema updating to new version ${dbSchema.init.length} from old version ${curVersion}`);
                for(let i = curVersion; i < dbSchema.init.length; i++){
                    console.log(`Run: ${dbSchema.init[i]}`);
                    await db.run(dbSchema.init[i]);
                }
                console.log(`DB Schema update complete`);
            }else{
                console.log(`Matched version: ${curVersion}`);
            }
        }
    }catch(e){
        console.error(e);
    }
});

module.exports = {
    getTopScores: async (limit) => {
        try {
            return await db.all("SELECT score, user_id FROM Highscores ORDER BY score DESC LIMIT ?", [limit]);
        } catch(e){
            console.error(e);
        }
    },

    getUserByName: async (username) => {
        try {
            return await db.get("SELECT id, username FROM User WHERE username = ?", [username]);
        }catch(e){
            console.error(e);
        }
    },

    getUsers: async () => {
        try{
            return await db.all("SELECT id, username, email, created_dt FROM User")
        }catch(e){
            console.error(e);
        }
    },

    getHash: async (user_id) => {
        try {
            return await db.get("SELECT id, hashed_pass FROM Passcode WHERE id = ?", [user_id]);
        }catch(e){
            console.error(e);
        }
    },

    getContiguousScores: async (centerID, limit) => {
        try{
            const halfLimit = Math.ceil(limit / 2);
            const beatenBy = (await db.get("SELECT count(*) FROM Highscores WHERE score > (SELECT score FROM Highscores WHERE id = ? );", [ centerID ]))["count(*)"] + 1;
            const offset = Math.max(0, beatenBy - halfLimit);
            const result = await db.all("SELECT id, score, user_id FROM Highscores ORDER BY score DESC LIMIT ? OFFSET ?", [limit, offset]);
            return { highscores: result, offset };
        }catch(e){
            console.error(e);
        }
    },

    randomizeDB: async (amount) => {
        const rndAlphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

        try{
            for(let i = 0; i < amount; i++){
                await db.run("INSERT INTO Highscores (user_id, score, created_dt) VALUES( ? , ?, ? );",[
                    rndAlphabet[Math.floor(Math.random()*40)]+rndAlphabet[Math.floor(Math.random()*40)]+rndAlphabet[Math.floor(Math.random()*40)],
                    Math.floor(Math.random() * 99999),
                    Math.floor(Date.now().valueOf()/1000)
                ]);
            }
        }catch(e){
            console.error(e);
        }
    },

    submitScore: async (user_id, score) => {
        try{
            const result =  await db.run("INSERT INTO Highscores (user_id, score, created_dt) VALUES( ? , ?, ? );",[
                user_id,
                score,
                GetNowInSeconds()
            ]);
            const beatenBy = await db.get("SELECT count(*) FROM Highscores WHERE score > (SELECT score FROM Highscores WHERE id = ? );", [ result.lastID ]);
            return ({ ...result, place: beatenBy["count(*)"] + 1});
        }catch(e){
            console.error(e);
        }
    },

    createAccount: async (username, email, hashedPass) => {
        try{
            const result =  await db.run("INSERT INTO User (username, email, created_dt) VALUES( ? , ?, ? );",[
                username,
                email,
                Math.floor(Date.now().valueOf()/1000)
            ]);
            console.log(result);
            const passResult = await db.run("INSERT INTO Passcode (id, hashed_pass) VALUES( ?, ? );",[
                result.id,
                hashedPass
            ]);
            return ({ ...result});
        }catch(e){
            console.error(e);
        }
    },
}