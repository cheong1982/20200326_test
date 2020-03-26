'use strict';

angular.module('intrcApp')
    .provider('Session', function Session() {
        this.$get = function () {
            // session key list
            var config_key = {
                token : 'accessToken',         // token
                passOTP : 'passOTP'           // OTP Auth Success Flag
            };

            return {
                get: function (sessionKey) {
                    return sessionStorage[sessionKey];
                },
                set: function (sessionKey, sessionValue) {
                    sessionStorage[sessionKey] = sessionValue;
                },
                clear: function (sessionKey) {
                    sessionStorage.removeItem(sessionKey);
                },
                all_clear: function(){
                    sessionStorage.removeItem(config_key.token);
                    sessionStorage.removeItem(config_key.passOTP);
                }
            };
        }
    });