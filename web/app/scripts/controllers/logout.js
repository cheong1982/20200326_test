'use strict';

angular.module('intrcApp')
    .controller('LogoutCtrl', function ($rootScope,$location, Session,api_logout) {
        Session.all_clear();

        var argument = {};
        argument['type'] = false;    //logout
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
        var os_versions = {Windows: "Win", MacOS: "Mac", UNIX: "X11", Linux: "Linux"};

        for(var key in os_versions) {
            if (appVersion.indexOf(os_versions[key]) != -1) {
                os_ver = key;
            }
        }
        argument['os_ver'] = os_ver || "unknown";   //os version

        var api_params = {};
        api_params['user_id'] = $rootScope.auth.user_id;
        api_params['f_election_id'] = $rootScope.auth.f_election_id;
        api_logout.save({},api_params, function (data) {
                if (data.status == 200){
                }
        });

        $location.path("/login", true);

    });
