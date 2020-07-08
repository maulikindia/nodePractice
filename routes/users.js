let express = require('express');
let app = express();
let bp = require('body-parser');
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }))
let bcrypt = require('bcryptjs');

let veri = require('../verify');
let fs = require('fs');

let path = require('path');

let multer = require('multer');
// multer.diskStorage(de)

// app.use(express.static(__dirname + 'uploads'))

let users = require('../models/user')

// console.log('==================data========');
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        var dir = './uploads';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        callback(null, dir);
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
    }
});
app.post('/create', async (req, res) => {
    // await users.create(req.body, async (err, respo) => {
    //     if (!err && respo !== null) {
    //         console.log('=========2============');
    //         return res.json({ status: "true", data: respo })
    //     }
    // })
    // Create a new user
    // try {
    const user = new users(req.body)
    await user.save()
    const token = await user.generateAuthToken()
    res.status(201).send({ user, token })
    // } catch (error) {
    //     res.status(400).send(error)
    // }
})


app.use(express.static('uploads'))

app.post('/login', async (req, res) => {
    // console.log('===========auth=============')

    await users.findOne({ email: req.body.email }, async (err, respo) => {
        console.log('--------here------')
        // res.json(respo);
        if (err) {
            return res.json({ status: false, msg: 'err' });
        }
        else if (respo !== null) {
            // if (req.body.password === undefined || req.body.password === null) {
            // return res.json({ 'msg': 'password must be there' });
            // }
            // else {
            // if (bcrypt.compare(req.body.password, respo.password)) {
            let jwt = require('jsonwebtoken');
            let token = jwt.sign({ id: respo.email, name: req.body.name, aid: respo._id }, 'mynameismaulik', { expiresIn: '24h' });

            return res.json({ 'msg': 'user found', token_value: token });
        }
        // else {
        return res.json({ 'msg': 'Invalid password /Email' });
        // }
        // }


    });

});


app.get('/', veri.checkToken, async (req, res) => {

    // let skip = parseInt(req.query.skip);
    let limit = parseInt(req.query.limit);
    let pageNo = req.query.page;
    let pageNext = (req.query.page) + 1
    // skip = (limit * page) - page;
    pageNo = pageNo * limit;
    pageNext = pageNext * limit;
    await users.find({}, async (err, result) => {

        if (err) {
            return res.json({ status: false, msg: 'error', data: {} });
        }
        else {

            let mData = await users.find().skip(pageNo).limit(limit);
            let mData1 = await users.find().skip(pageNext).limit(limit);
            let next = false;
            if (mData1.length > 0) {
                next = true;
            }

            await users.countDocuments({}, async (err, records) => {

                return res.json({
                    next: next,
                    currentPage: req.query.pageNo,
                    totalPages: Math.ceil(records / limit),
                    data: mData
                })

            })
            // let mData = await users.find();
            // return res.json({ status: true, currentPage: page, totalPages: (mData.count / limit), data: result });
        }

    })
    // .limit(limit).skip(skip);
    // .limit(5).skip(3);


});




app.get('/s', veri.checkToken, async (req, res) => {

    let limit = parseInt(req.query.limit);
    let page = req.query.page || 1;
    let skip = req.query.skip;

    skip = (limit * page) - limit;


    await users.find().skip(skip).limit(limit).sort({ 'createdAt': -1 }).exec(async (err, data) => {
        let next = false;
        await users.countDocuments(async (err, count) => {
            if (data.length > 0) {
                next = true;
            }
            return res.json({
                next: next,
                currentPage: page,
                totalPages: Math.ceil(count / limit),
                data: data
            })

        });

    });
    // let mData1 = await users.find().skip(pageNext).limit(limit);
    // let next = false;
    // if (mData1.length > 0) {
    // next = true;
    // }
});







let upload = multer({ storage: storage }).single('myfiles');
let staticObj = 'http://localhost:5556/';
app.post('/file', veri.checkToken, upload, async (req, res) => {
    // if (xerr) {
    //     return res.json({ msg: 'error' });
    // }
    // else {

    res.json({ status: true, msg: 'uploaded sucessfully.', path: staticObj + req.file.filename, filename: req.file.filename })
    // }
    return res.send(req.file)


});


app.post('/code', veri.checkToken, async (req, res) => {

    let mData = await users.findOne({ username: 'maulik' });
    // for await (let data of mData) {
    // let obj = {};
    let code = mData.email;
    mData.code = code;
    // console.log(data.code)
    await mData.save();
    // console.log(data);
    // }
    return res.json({ fetched_data: mData });
});



app.post('/logout', veri.checkToken, async (req, res) => {

    if (req.user !== req.decoded) {
        console.log(req.user);
        console.log(decoded)
        console.log('logout');
    }
});


app.put('/', veri.checkToken, async (req, res) => {
    let set = {
        $set: {
            "email": req.body.email,
            "username": req.body.username
        }
    }
    await users.updateOne({ 'username': 'maulik' }, set, async (err, result) => {
        if (err) {
            return res.json(err);
        }
        else {
            return res.json({ updated_data: result })

        }

    });

});

app.put('/edit', async (req, res) => {

    let mQuery = { email: req.body.email };
    await users.updateMany(mQuery, { $set: req.body }, async (err, respo) => {
        if (!err && respo !== null) {

            return res.json(respo);
        }

    });

});

module.exports = app;