"use strict";

const JokeDB = require('./JokeDB')
const express = require('express')


const app = express()
const port = 3000


const jokeDB = new JokeDB()

app.use(express.static('public'))


app.get('/joke/random', async (req, res) => {
    res.send(await jokeDB.getRandomJoke())
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})