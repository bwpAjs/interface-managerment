/**
 * Created by beiwp on 2016/5/25.
 */

var mainApplicationModuleName = 'mean';

var mainApplicationModule = angular.module(mainApplicationModuleName,['ngResource','ngRoute','user','me']);


//搜索引擎爬虫 优化
mainApplicationModule.config(['$locationProvider','$routeProvider',
    function($locationProvider,$routeProvider){

        /*$locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });*/
        //$locationProvider.html5Mode(true);//去除url中总是默认带有"#"

        $locationProvider.hashPrefix('!');

        $routeProvider
            .when('/users/list',{
                templateUrl: '../users/views/user.client.list.html',
                controller: 'userController'
            })
            .when('/users/list/add',{
                templateUrl: '../users/views/user.client.add.html',
                controller: 'userController'
            })
            .when('/users/list/:id/view',{
                templateUrl: '../users/views/user.client.view.html',
                controller: 'userController'
            })
    }
]);

mainApplicationModule.factory('CommonUtil',[
   function(){
       this.token = window.token;
       this.user = window.user;
       return {
           token: this.token,
           user: this.user
       }
   }
]);

//facebook 身份验证后 再 OAuth回调中 会在URL的#加 修饰符
if(window.location.hash == '#_=_') window.location.hash = '#!';

angular.element(document).ready(function(){
    angular.bootstrap(document,[mainApplicationModuleName]);
});