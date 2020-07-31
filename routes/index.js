var express = require('express');
var router = express.Router();
var userModel = require('../models/userModel');
var orderModel = require('../models/orderModel');
const token = require('../Auth/token');

router.get('/', async function(req, res, next){
});
router.post('/userSignup', async function(req, res, next){
    var actual = await userModel.insertUser(req.body);
    res.json(actual);
});

router.post('/authenticateUser', async function (req,res) {
    //check our own database
    const userInfo = await userModel.getUserByEmail(req.body.email);

    if(userInfo.length === 0||req.body.password!==userInfo[0].password){
        res.json({process:"fail"});
    }
    else{
        const userDataPacket = {
            id:userInfo[0].id,
            email: userInfo[0].email,
            password: userInfo[0].password
        };
        const token = await tokenUtil.generateToken(userDataPacket);
        if(!token){
            res.clearCookie('userToken');
        }else {
            res.clearCookie('userToken');
            res.cookie("userToken", token, {expire: new Date() + 1});
            console.log(token);
            res.json({process:"success"});
        }
    }
});

router.post('change', async function (req,res) {
    const userinfo = await token.validateToken(req.cookies.usertoken);
    if(userinfo) {
        const actual = await orderModel.changeItem(req.body);
        res.json(actual);
    }else{
        res.json({process:"fail"})
    }
});

router.post('delete', async function (req,res) {
    const userinfo = await token.validateToken(req.cookies.usertoken);
    if(userinfo) {
        const actual = await orderModel.deleteItem(req.body);
        res.json(actual);
    }else{
        res.json({process:"fail"})
    }
});

router.post('create_order', async function (req,res) {
    const userinfo = await token.validateToken(req.cookies.usertoken);
    if(userinfo){
        const actual = await orderModel.insertItem(req.body);
        res.json(actual);
    }else{
        res.json({process:"fail"})
    }
});


module.exports = router;
