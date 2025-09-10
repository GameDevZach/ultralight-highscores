// Utilities
const fs = require("fs");

// Init the database
const dbFile = "./.data/scorelator.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const dbWrapper = require("sqlite");
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
            await db.run(
                "CREATE TABLE Highscores (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, score INTEGER, created_dt INTEGER)"
            );

            await db.run(
                "CREATE INDEX score_ind ON Highscores (score, username)"
            );

            await db.run(
                "CREATE INDEX dt_ind ON Highscores (created_dt, score, username)"
            );

            await db.run(
                "CREATE TABLE Logs (id INTEGER PRIMARY KEY AUTOINCREMENT, log TEXT, dt DATETIME)"
            );
        }else{
            console.log("DB Exists... continuing");
        }
    }catch(e){
        console.error(e);
    }
});

module.exports = {
    getTopScores: async (limit) => {
        try {
            return await db.all("SELECT score, username FROM Highscores ORDER BY score DESC LIMIT ?", [limit]);
        } catch(e){
            console.error(e);
        }
    },

    getContiguousScores: async (centerID, limit) => {
        try{
            const halfLimit = Math.ceil(limit / 2);
            const beatenBy = (await db.get("SELECT count(*) FROM Highscores WHERE score > (SELECT score FROM Highscores WHERE id = ? );", [ centerID ]))["count(*)"] + 1;
            const offset = Math.max(0, beatenBy - halfLimit);
            const result = await db.all("SELECT id, score, username FROM Highscores ORDER BY score DESC LIMIT ? OFFSET ?", [limit, offset]);
            return { highscores: result, offset };
        }catch(e){
            console.error(e);
        }
    },

    randomizeDB: async (amount) => {
        const rndAlphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

        try{
            for(let i = 0; i < amount; i++){
                await db.run("INSERT INTO Highscores (username, score, created_dt) VALUES( ? , ?, ? );",[
                    rndAlphabet[Math.floor(Math.random()*40)]+rndAlphabet[Math.floor(Math.random()*40)]+rndAlphabet[Math.floor(Math.random()*40)],
                    Math.floor(Math.random() * 99999),
                    Math.floor(Date.now().valueOf()/1000)
                ]);
            }
        }catch(e){
            console.error(e);
        }
    },

    submitScore: async (username, score) => {
        try{
            const result =  await db.run("INSERT INTO Highscores (username, score, created_dt) VALUES( ? , ?, ? );",[
                username,
                score,
                Math.floor(Date.now().valueOf()/1000)
            ]);
            const beatenBy = await db.get("SELECT count(*) FROM Highscores WHERE score > (SELECT score FROM Highscores WHERE id = ? );", [ result.lastID ]);
            return ({ ...result, place: beatenBy["count(*)"] + 1});
        }catch(e){
            console.error(e);
        }
    }
}