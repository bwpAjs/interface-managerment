/**
 * Created by beiwp on 2016/6/22.
 */
'use strict';

mainApplicationModule


.controller('userController',['$scope','userService',function($scope,userService){

        //列表
        $scope.list = function(){
            $scope.users = userService.query();
        };

        //查看
        $scope.findOne = function(){

        }

}]);