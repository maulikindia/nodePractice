let jwt = require('jsonwebtoken');

let checkToken = (req, res, next) => {

    // let token = req.headers['x-access-token']
    // split("")[1];
    let token = req.header('Authorization')
    // .replace('Bearer ', '')
    if (token === null) {
        return res.json({ msg: 'Please come back with validate token' })
    }
    // req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    // if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    // token = token.slice(7, token.length);
    // }
    if (token !== undefined || token !== null) {
        jwt.verify(token, 'mynameismaulik', async (err, decoded) => {
            // console.log(decoded);
            if (err) {
                // console.log('calling from an error');
                return res.json({ status: 'false', 'msg': 'Invalid token  ' });
            }
            else {
                console.log('sucess');
                req.user = decoded;
                next();
            }
        });
    }
    else {
        return res.json({ status: 'false', 'msg': 'token not found/Token is needed' })
    }


}

module.exports = { checkToken: checkToken };