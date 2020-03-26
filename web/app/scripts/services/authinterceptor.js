'use strict';

angular.module('intrcApp')
    .factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {

        return {
            responseError: function (response) {
                if (response.status == 401) {
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated, response);
                }
                else if (response.status == 403) {
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthorized, response);
                }
                else if (response.status == 419 || response.status == 440) {
                    $rootScope.$broadcast(AUTH_EVENTS.sessionTimeout, response);
                }

                return $q.reject(response);
            }
        };
    });
