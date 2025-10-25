module.exports = {
    init: [
        "CREATE TABLE DBEvents (id INTEGER PRIMARY KEY AUTOINCREMENT, version INTEGER, msg TEXT)",
        "CREATE TABLE Highscores (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, score INTEGER, created_dt INTEGER)",
        "CREATE INDEX ScoreIndex ON Highscores (score, user_id)",
        "CREATE INDEX ScoreDateIndex ON Highscores (created_dt, score, user_id)",
        "CREATE TABLE User (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, email TEXT, created_dt INTEGER)",
        "CREATE TABLE Passcode (id INTEGER PRIMARY KEY, hashed_pass TEXT)",
        "CREATE TABLE AuthToken (id INTEGER PRIMARY KEY, user_id INTEGER, token TEXT, created_dt INTEGER, exp INTEGER)",
        "CREATE INDEX TokenDateIndex ON AuthToken (exp)",
        "CREATE TABLE Logs (id INTEGER PRIMARY KEY AUTOINCREMENT, log TEXT, dt DATETIME)",
        "CREATE INDEX JWTLookupIndex ON AuthToken (user_id, token)",
        // Add HERE! Only the latest are run for an update...
    ]
}