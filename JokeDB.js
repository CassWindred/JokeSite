"use strict";

const fs = require('fs')
const sqlite3 = require('sqlite3').verbose();

class JokeDB {

    constructor(databaseName = "jokes.db", inputJsonFile = "jokes.json", rebuildDatabase = false) {
        const dbPath = "./" + databaseName

        if (!rebuildDatabase && fs.existsSync(dbPath)) {
            this.db = new sqlite3.Database(databaseName, sqlite3.OPEN_READONLY)
        } else {
            this.db = this.#createDatabase(databaseName, inputJsonFile)
        }
    }

    async getRandomJoke() {
        return new Promise((resolve, reject) => {

            // This is a fairly inefficient way to select a random row, however it is the most readable
            // Given the small size of this database the processing time is negligible
            // A different approach may be better in a more performance-critical context
            this.db.get("SELECT * FROM jokes ORDER BY RANDOM() LIMIT 1;", (err, row) => {
                if (err) throw err
                resolve(row)
            })

        })
    }

    #getJokesFromJSON(inputJsonFile) {
        let data = fs.readFileSync(inputJsonFile)
        let jokes = JSON.parse(data)
        return jokes
    }

    #createDatabase(databaseName, inputJsonFile) {
        const db = new sqlite3.Database(databaseName)

        db.serialize(() => {

            db.run("CREATE TABLE jokes (ID INTEGER, type TEXT, setup TEXT, punchline TEXT);",
                err => {
                    if (err) throw err
                })

            let jokes = this.#getJokesFromJSON(inputJsonFile)

            const statement = db.prepare("INSERT INTO jokes VALUES(?, ?, ?, ?);")

            jokes.forEach(joke => {
                statement.run(joke.id, joke.type, joke.setup, joke.punchline, err => {
                    if (err) throw err;
                })
            });

            statement.finalize()

        })

        return db



    }


}

module.exports = JokeDB