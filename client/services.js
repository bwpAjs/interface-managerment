/**
 * Created by beiwp on 2016/6/22.
 */
'use strict';

mainApplicationModule

.factory('userService',['$resource',
        function($resource){
            return $resource('/admin/user/list/:userId',{
                userId:'@id'
            },{

            })
        }
    ]);