let express = require('express');
let app = express();
let morgan = require('morgan');
app.use(morgan('dev'))
let con = require('dotenv').config()

let config = require('./config');
// app.use(express.static(__dirname + 'uploads'))
let users = require('./routes/users');
app.use('/usr', users)
app.listen(process.env.PORT, async (err) => {
    if (err) {
        return console.error(err);
    }
    console.log('==========================================');
    console.log('server is running  at..' + process.env.PORT);
    console.log('==========================================');
})