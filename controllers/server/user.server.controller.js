/**
 * Created by beiwp on 2016/5/25.
 */

var mongoose = require('mongoose');
var Role = mongoose.model('Role');
var User = mongoose.model('User');
var core = require('../../libs/core');
var config = require('../../config');

var noRedirect = [
    'user/login',
    'user/forget',
    'user/register'
];

/**
 * 项目初始化检验 用户数据为空时 先进入管理注册页面
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.checkUser = function(req,res,next){
    console.log('\n=======user checkuser======'+new Date()+'\n');
    if(req.session.user){
        var path = core.translateAdminDir('/index');
        return res.redirect(path);
    }
    User.find({},function(err,results){
        if(err) return;
        if(results.length > 0 ){
            return next();
        } else {
            return res.render('server/user/install');
        }
    });
};

/**
 * 登录
 * @param req
 * @param res
 * @param next
 */
exports.login = function(req,res,next){
    if(req.method === 'GET'){
        req.session.loinReferer = req.headers.referer;
        res.render('server/user/login');
    } else if (req.method === 'POST'){
        var username = req.body.username;
        var password = req.body.password;
        User.findOne({
            username: username
        }).populate('roles').exec(function(err, user){
            if(!user){
                return res.render('info',{
                   message: '登录失败，查无此人'
                });
            }
            if(user.authenticate(password)){
                //记录登录信息
                user.last_login_date = new Date();
                user.last_login_ip = core.getIp(req);
                req.session.user = user;
                console.log('登录成功',new Date());
                console.log(req.session.user);
                var path = core.translateAdminDir('/');
                var ref = req.session.loginReferer || path;

                for(var i in noRedirect){
                    if(ref.indexOf(noRedirect[i]) > -1){
                        ref = path;
                        break;
                    }
                }
                res.redirect(ref);
            } else {
                res.render('info', {
                    message: '密码不正确'
                });
            }


        });
    }
};

/**
 * 注册
 * @param req
 * @param res
 * @param next
 */
exports.register = function(req, res, next){
    var method = req.method;
    if (method === 'GET') {
        res.render('server/user/register',{})
    } else if (method === 'POST') {
        var obj = req.body;
        Role.findOne({
            status: 202
        },function(err,role){
            console.log(role);
            if(err || !role){
                return res.render('info',{
                    message: '注册失败，未开放角色：' + config.admin.role.user
                });
            }
        });

    };
};

/**
 * 退出登录
 * session.destroy() 注销session
 * @param req
 * @param res
 * @param next
 */
exports.logout = function(req, res, next){
    if(req.session){
        req.session.User = null;
        req.session.destroy();
        console.log('注销成功');
        var path = core.translateAdminDir('/');
        res.redirect(path);
    } else {
      res.render('info',{
        message: '注销失败'
      });
    }
};

exports.list = function(req, res){
    console.log(req.method+'======user controller list ======' + new Date());
    console.log('==== req query ====');
    console.log(req.query);
    console.log(req.param());
    console.log(req.Roles);
    var condition = {};
    if(req.Roles && req.Roles.indexOf('admin') < 0 ){
        condition.author = req.session.user._id;
    };

    User.count(condition,function(err, total){
        console.log(total);
        var query = User.find(condition).populate('author').populate('roles');
        //分页
        var pageInfo = core.createPage(req,total,10);
        query.skip(pageInfo.start);
        query.limit(pageInfo.pageSize);
        query.sort({created: -1});
        query.exec(function(err,results){
            console.log(results);
            core.resJson(res,results,'list');
        });
    });
};

