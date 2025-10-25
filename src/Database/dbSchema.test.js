const test = require('node:test');
const assert = require('assert');
// Utilities
const fs = require("fs");
const TESTDB_NAME = 'TESTDB.db';

const sqlite3 = require("sqlite3").verbose();
const dbWrapper = require("sqlite");
const dbSchema = require("./dbSchema.js");

test("Test Database Initialization", async () => {
    let db;

    dbWrapper.open({
        filename: TESTDB_NAME,
        driver: sqlite3.Database
    })
    .then(async dataBase => {
        db = dataBase;
        try{
            console.log("Initialize DB...");
            for(const schemaStatement of dbSchema.init){
                console.log(`Run: ${schemaStatement}`);
                await db.run(schemaStatement);
            };
            await db.run("INSERT INTO DBEvents (version, msg) VALUES( ?, ? );",[
                dbSchema.init.length,
                `Created DB version ${dbSchema.init.length} from scratch.`
            ]);
            await db.close();
            await fs.unlink(TESTDB_NAME, () => {
                console.log("Test DB removed...");
            });
        }catch(e){
            console.error(e);
        }
    });
    
})