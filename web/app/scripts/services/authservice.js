'use strict';

angular.module('intrcApp')
    .factory('AuthService', function ($http, $rootScope, $location, ENV, Session, Duplicate_Auth,Modal) {
        var url = ENV.host + '/api/Login';
        // Public API here
        $rootScope.isAdmin = false;
        $rootScope.election_name = '';
        $rootScope.election_code = '';
        $rootScope.election_id = -1;
        $rootScope.right_codes = '';
        $rootScope.user_name = '';
        $rootScope.user_id = '';
        $rootScope.election_group_type = 1;
        // $rootScope.auth = null;
        return {
            login: function (credentials) {
                return $http({
                    method: 'post',
                    url: url,
                    headers: {'Content-Type': 'application/json'},
                    data: credentials
                })
                .success(function (data) {
                    var auth = data.objects[0];
                    $rootScope.auth = auth;
                    // alert(auth.election_name);
                    if(auth.user_right == 1){
                        $rootScope.isAdmin = true;
                    }else{
                        $rootScope.isAdmin = false;
                    }
                    Session.set('user_right', auth.user_right);
                    $rootScope.user_name = auth.user_name;
                    $rootScope.user_id = auth.user_id;
                    $rootScope.user_right = auth.user_right;

                    $rootScope.election_id = auth.election_id;
                    $rootScope.election_name = auth.election_name;
                    $rootScope.election_code = auth.election_code;
                    $rootScope.right_codes = auth.right_codes;
                    $rootScope.election_group_type = auth.election_group_type;

                    if(auth.duplicate){
                        var r = confirm("다른 사용자가 이미 로그인 중입니다.");
                        if (r == true) {
                            var argument = {};
                            argument['token'] = auth.token;    // token
                            argument['userID'] = auth.userID;

                            Duplicate_Auth.update(argument);     // token update

                        } else { // 취소
                            return;
                        }
                    }

                    if(auth.login){
                        Session.set('accessToken', auth.token);
                        $http.defaults.headers.get = {token: auth.token};
                        $http.defaults.headers.get['If-Modified-Since'] = new Date().getTime();
                        $http.defaults.headers.get['Cache-Control'] = 'no-cache';
                        $http.defaults.headers.get['Pragma'] = 'no-cache';
                        $http.defaults.headers.put["token"] = auth.token;
                        $http.defaults.headers.post["token"] = auth.token;
                        $http.defaults.headers.common["token"] = auth.token;

                        if(auth.userOTP){
                            Session.set('passOTP', false);
                            $location.path('/login-otp');
                        }else{
                            Session.clear('passOTP');

                            var argument = {};
                            argument['type'] = true;    //login

                            var userAgent = window.navigator.userAgent;
                            var browser_ver = null;
                            var os_ver = null;

                            if(userAgent.indexOf("Firefox") != -1)                                         browser_ver = "Firefox";
                            if(userAgent.indexOf("Opera") != -1)                                           browser_ver = "Opera";
                            if(userAgent.indexOf("Chrome") != -1)                                          browser_ver = "Chrome";
                            if(userAgent.indexOf("Safari") != -1 && userAgent.indexOf("Chrome") == -1)    browser_ver = "Safari";

                            if(userAgent.indexOf("MSIE 6") != -1)                                          browser_ver = "Internet Explorer 6";
                            if(userAgent.indexOf("MSIE 7") != -1)                                          browser_ver = "Internet Explorer 7";
                            if(userAgent.indexOf("MSIE 8") != -1)                                          browser_ver = "Internet Explorer 8";
                            if(userAgent.indexOf("MSIE 9") != -1)                                          browser_ver = "Internet Explorer 9";
                            if(userAgent.indexOf("MSIE 10") != -1)                                         browser_ver = "Internet Explorer 10";
                            if(userAgent.indexOf("rv") != -1)                                               browser_ver = "Internet Explorer 11";

                            argument['browser_ver'] = browser_ver || "unknown"; // browser version

                            var appVersion = window.navigator.appVersion;
                            var appplatform = window.navigator.appName + window.navigator.platform;
                            var os_versions = {Windows: "Win", MacOS: "Mac", UNIX: "X11", Linux: "Linux"};

                            for(var key in os_versions) {
                              if (appVersion.indexOf(os_versions[key]) != -1) {
                                os_ver = key;
                              }
                            }
                            argument['os_ver'] = os_ver || "unknown";   //os version


                            var change_uri = "/org";

                            $location.path(change_uri);
                        }
                    }else if(!auth.login && auth.err_code==100){
                        Modal.open(
                            'views/alert_modal.html',
                            'AlertCtrl',
                            'sisung',
                            {
                                alertTitle: function () {
                                    return "로그인";
                                },
                                alertMsg: function () {
                                    return "ID/PW가 일치하지 않습니다.";
                                }
                            }
                        );
                    }else if(!auth.login && auth.err_code==101){
                        Modal.open(
                            'views/alert_modal.html',
                            'AlertCtrl',
                            'sisung',
                            {
                                alertTitle: function () {
                                    return "로그인";
                                },
                                alertMsg: function () {
                                    return "선거가 끝났습니다.(관리자에게 문의 바랍니다.)";
                                }
                            }
                        );
                    }

                    else{
                      alert("서버 Error.");
                    }
                });
            },
            isAuthenticated: function () {
                var accessToken = Session.get('accessToken');
                var passOTP = Session.get('passOTP');
                var isAuth = false;

                // [ Case by ] Login Success
                if(!!accessToken){
                    // [ Case by ] do not use OTP
                    if(passOTP == undefined){
                        isAuth = true;
                    // [ Case by ] use OTP
                    }else{
                        isAuth = passOTP;
                    }
                // [ Case by ] Login Fail
                }else{
                    isAuth = false;
                }

                return isAuth;
            },

            isAdminCheck:function () {

                var user_right = Session.get('user_right');
                if (user_right == 1 || user_right == 8 || user_right == 2)
                    $rootScope.isAdmin = true;
                else
                    $rootScope.isAdmin = false;
                return $rootScope.isAdmin;
            },
            getElectionName:function () {
                return $rootScope.election_name;
            },
            getElectionCode:function () {
                return $rootScope.election_code;
            },
            getElectionId:function () {
                return $rootScope.election_id;
            },
            isRight(code){
                return $rootScope.right_codes.includes(code,0);
            },
            getUserName(){
                return $rootScope.user_name;
            },
            getUserId(){
                return $rootScope.user_id;
            },
            getUserRight(){
                return $rootScope.user_right;
            },
            getElectionGroupType(){
                return $rootScope.election_group_type;
            }
        };
    });
