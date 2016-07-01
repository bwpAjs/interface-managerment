var express = require('express');
var router = express.Router();
var core = require('../../libs/core');
var users = require('../../controllers/server/user.server.controller');

router.use(function(req,res,next){
    console.log('user routes===='+new Date());
    res.locals.Path = 'user';
    next();
});

router.route('/login').all(users.checkUser,users.login);
router.route('/register').all(users.register);
router.route('/logout').all(users.logout);
router.route('/list').get(users.list);

//权限判断
router.use(function(req,res,next){
    if(!req.session.user){
        var path = core.translateAdminDir('/user/login');
        return res.redirect(path);
    }
    next();
});


module.exports = function(app){
    var path = core.translateAdminDir('/user');
    app.use(path,router);
};
