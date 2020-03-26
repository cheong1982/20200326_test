'use strict';

angular.module('intrcApp')
    .controller('LoginCtrl', function ($scope, AuthService, $location, Session) {
        $scope.credentials = {
        };

        /* auto focus */
        angular.element('.inp_id').trigger('focus');

        $scope.login = function (credentials) {
            AuthService.login(credentials);
        };

        var accessToken = Session.get('accessToken');

        if(accessToken) {
            $location.path('org', true);
        }


    });

