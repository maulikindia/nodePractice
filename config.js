let express = require('express');
let app = express();
let con = require('dotenv').config();

let mongoose = require('mongoose');


mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true }, async (err) => {

    if (err) {
        return console.error(err);
    }
    console.log('==========================================');
    console.log('         Welcome to Server                    ');
    console.log('==========================================')
});

module.exports = app;

