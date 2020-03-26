'use strict';

angular.module('intrcApp')
    .controller('ApplicationCtrl', function ($scope, $rootScope,$http, $location, $route, Session, AuthService, Modal) {
        // COMMON ------------------------------------------------------------------------------------------------------
        $scope.tree_uri = "views/tree.html";
        $scope.path_uri = "views/path.html";

        $rootScope.timeout = false;
        $scope.isAuthenticated = AuthService.isAuthenticated();
        $scope.playAlert = setInterval(function () {
            if($scope.isAuthenticated == true && $rootScope.user_right == 8 && $rootScope.timeout == false){
                var change_uri ="/logout";
                $location.path(change_uri, true);
                $route.reload();
            }
            $rootScope.timeout = false;
        },30*60*1000);

        $scope.$watch(AuthService.isAuthenticated, function(newVal){//watch - isAuthenticated at services/api/access.js
            $scope.isAuthenticated = newVal;
            $scope.isAdmin = AuthService.isAdminCheck();
            $scope.user_name = AuthService.getUserName();
            $scope.user_id = AuthService.getUserId();
            if($scope.isAuthenticated){
                $scope.accessToken = Session.get('accessToken');
                $http.defaults.headers.get = {token: $scope.accessToken};
                $http.defaults.headers.get['If-Modified-Since'] = new Date().getTime();
                $http.defaults.headers.get['Cache-Control'] = 'no-cache';
                $http.defaults.headers.get['Pragma'] = 'no-cache';
                $http.defaults.headers.put["token"] = $scope.accessToken;
                $http.defaults.headers.post["token"] = $scope.accessToken;
                $http.defaults.headers.common["token"] = $scope.accessToken;

            }else{
                var change_uri ="/logout";
                $location.path(change_uri, true);
                $route.reload();
            }
        });


        $scope.onActiveMenu = function(current_uri, link_tag){
            if(current_uri == link_tag){
                return true;
            }else{
                return false;
            }
        };

        $scope.report_nav_menu = [
            {
                title: '일일통계',
                icon: 'folder-open',
                link_tag: 'report_list',
                a_href: './#/report_list'
            },
        ];


        $scope.currentURI = function () {
            var fullUrl = $location.absUrl();
            if(fullUrl.indexOf("org") != -1)
                return "org";
            else if (fullUrl.indexOf("report_graph") != -1)
                return "report_graph";
            else
                return "login";

        };

        $scope.movePage = function(page){
            window.scrollTo(0,0);
            //etc param remove

            var change_uri = '';
            if(page == 'logout'){
                change_uri = '/logout';
            }
            else if(page == 'org') {
                change_uri = '/org';
            }
            else if(page == 'report_graph') {
                change_uri = '/report_graph';
            } else {
                change_uri = '/login';
            }

            var full_uri = $location.absUrl();
            var uri_split = full_uri.split('#');
            var current_uri = uri_split[1];

            if(current_uri != change_uri){
                $location.path(change_uri, true);
            } else {
                $route.reload();
            }
        };


        $scope.refreshPage = function () {
            $route.reload();
        };

        // UPDATE ------------------------------------------------------------------------------------------------------
        $scope.updateInformation = function(){
            $scope.isAuthenticated = AuthService.isAuthenticated();

            if($scope.isAuthenticated){
                $scope.accessToken = Session.get('accessToken');
                $http.defaults.headers.get = {token: $scope.accessToken};
                $http.defaults.headers.get['If-Modified-Since'] = new Date().getTime();
                $http.defaults.headers.get['Cache-Control'] = 'no-cache';
                $http.defaults.headers.get['Pragma'] = 'no-cache';
                $http.defaults.headers.put["token"] = $scope.accessToken;
                $http.defaults.headers.post["token"] = $scope.accessToken;
                $http.defaults.headers.common["token"] = $scope.accessToken;
            }else{
                var change_uri ="/logout";
                $location.path(change_uri, true);
            }
        };

        $scope.ResetPassword = function () {
            Modal.open(
                'views/reset_modal.html',
                'ResetCtrl',
                'lg',
                {
                }
            );
        };

        $scope.onLogout = function () {
             $scope.movePage('logout');
        };

    });

