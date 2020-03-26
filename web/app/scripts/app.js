'use strict';

angular
    .module('intrcApp', [
        'ngRoute',
        'ngResource',
        'ui.bootstrap',
        'ngTable',
        'xeditable',
        'ui.select2',
        'angularFileUpload',
        'angular-loading-bar',
        'highcharts-ng',
        'nvd3'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/org', {
                templateUrl: 'views/nec_org.html',
                controller: 'OrgCtrl'
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .when('/logout', {
                templateUrl: 'views/logout.html',
                controller: 'LogoutCtrl'
            })
            .when('/report_graph', {
                templateUrl: 'views/report_graph.html',
                controller: 'ReportGraphCtrl'
            })
            .otherwise({
                redirectTo: '/login'
            });
    })
    .run(function ($route, Session, $rootScope, $location, AUTH_EVENTS, AuthService, editableOptions) {
        var original = $location.path;

        $location.path = function (path, reload) {
            if (reload === false) {
                var lastRoute = $route.current;
                var un = $rootScope.$on('$locationChangeSuccess', function () {
                    $route.current = lastRoute;
                    un();
                });
            }

            return original.apply($location, [path]);
        };

        $rootScope.$on('$locationChangeStart', function (event, next) {
            var accessToken = Session.get('accessToken');
            var passOTP = Session.get('passOTP');
            var current_url = $location.absUrl();

            //----------------------------------------------------------------------------------------------------------
            // valide token
            //----------------------------------------------------------------------------------------------------------
            if (!accessToken) {
                if (next.templateUrl != 'views/login.html') {
                    $location.path('/login');
                }
                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
            }

            //----------------------------------------------------------------------------------------------------------
            // valide otp
            //----------------------------------------------------------------------------------------------------------
            if (accessToken && (passOTP == 'false')) {
                if (next.templateUrl != 'views/login_otp.html') {
                    $location.path('/login-otp');
                }
                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
            }
            //----------------------------------------------------------------------------------------------------------
            // mobile location change
            //----------------------------------------------------------------------------------------------------------
            //if (current_url.indexOf("/m") == -1){
            //    if (next.templateUrl != 'views/m.live_status.html' || next.templateUrl != 'views/m.report.html'){
            //        $location.path('/m.dash');
            //    }
            //}
        });

        editableOptions.theme = 'bs3';
    });
