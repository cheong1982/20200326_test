'use strict';

angular.module('intrcApp')
    .controller('OrgCtrl', function ($route,$rootScope,AuthService, $scope,ngTableParams, $timeout,Modal, $location,Tree,api_report_graph,ENV,Utils,$q) {
        // INHERIT -----------------------------------------------------------------------------------------------------
        $scope.isAuthenticated = AuthService.isAuthenticated();
        //$scope.$parent.updateInformation();
        $scope.isAdmin = AuthService.isAdminCheck();
        $scope.election_id = AuthService.getElectionId();
        var api_params = {};
        api_params['level'] = "0";
        api_params['f_election_id'] = $scope.election_id;
        api_params['group_name_1'] = "";
        api_params['group_name_2'] = "";
        api_params['group_name_3'] = "";

        $scope.select_location = false;
        Tree.get(api_params, function(data){
            if(data.status==200){
                $scope.site_manager = data.objects;

                //$scope.onClickManager($scope.site_manager[0]);
                // $scope.search_user();
            }
        });

        //--------------------------------------------------------------------------------------------------------------
        // Click Event
        //--------------------------------------------------------------------------------------------------------------
        $scope.onClickManager = function (manager) {
            $rootScope.timeout = true;
            if ($scope.selectedManager && $scope.selectedManager != manager) $scope.selectedManager.clicked = false;
            manager.clicked = !manager.clicked;
            $scope.selectedManager = manager;

            var api_params = {};
            api_params['level'] = "1";
            api_params['f_election_id'] = $scope.election_id;
            api_params['group_name_1'] = $scope.selectedManager.group_name;
            api_params['group_name_2'] = "";
            api_params['group_name_3'] = "";
            Tree.get(api_params, function (data) {
                $scope.site_by_manager = data.objects;
            });

            //$scope.search_user_by_tree($scope.selectedManager.deptCode);
            // $scope.search_user();

            $scope.path_manager = $scope.selectedManager.group_name;
            $scope.path_site = "";
            $scope.path_location = "";
            $scope.path_shop = ""
            $scope.path_item1 = "";
        };

        $scope.onClickSite = function (site) {
            $rootScope.timeout = true;
            if ($scope.selectedSite && $scope.selectedSite != site) $scope.selectedSite.clicked = false;
            site.clicked = !site.clicked;
            $scope.selectedSite = site;

            var api_params = {};
            api_params['level'] = "2";
            api_params['f_election_id'] = $scope.election_id;
            api_params['group_name_1'] = $scope.selectedManager.group_name;
            api_params['group_name_2'] = $scope.selectedSite.group_name;
            api_params['group_name_3'] = "";

            Tree.get(api_params, function (data) {
                $scope.locations_by_site = data.objects;
            });

            // $scope.search_user_by_tree($scope.selectedSite.deptCode);

            $scope.path_site = $scope.selectedSite.group_name;
            $scope.path_location = "";
            $scope.path_shop = ""
            $scope.path_item1 = "";
        };

        $scope.onClickLocation = function (location) {
            $rootScope.timeout = true;
            if ($scope.selectedLocation && $scope.selectedLocation != location) $scope.selectedLocation.select = false;
            location.clicked = !location.clicked;
            $scope.selectedLocation = location;
            $scope.selectedLocation.select = !$scope.selectedLocation.select;
            var api_params = {};
            api_params['level'] = "3";
            api_params['f_election_id'] = $scope.election_id;
            api_params['group_name_1'] = $scope.selectedManager.group_name;
            api_params['group_name_2'] = $scope.selectedSite.group_name;
            api_params['group_name_3'] = $scope.selectedLocation.group_name;
            $scope.selectedShop = location;
            $scope.p_code = location.p_code;
            $scope.onClickShop($scope.selectedShop);
            // Tree.get(api_params, function (data) {
            //     $scope.shops_by_location = data.objects;
            // });
            //
            // // $scope.search_user_by_tree($scope.selectedLocation.deptCode);

            $scope.path_location = $scope.selectedLocation.group_name;
            $scope.path_shop = "";
            $scope.path_item1 = "";
        };

        $scope.onClickShop = function (shop) {
            $rootScope.timeout = true;
            if ($scope.selectedShop && $scope.selectedShop != shop) $scope.selectedShop.clicked = false;
            shop.clicked = !shop.clicked;
            $scope.selectedShop = shop;
            $scope.p_code = shop.p_code;

            $scope.full_group_name = $scope.selectedManager.group_name  + "_" + $scope.selectedSite.group_name + "_" + $scope.selectedLocation.group_name;
            $scope.path_shop = $scope.selectedShop.deptName;

            $scope.options = {
                chart: {
                    type: 'lineChart',
                    height: 180,
                    width:600,
                    margin : {
                        top: 20,
                        right: 20,
                        bottom: 40,
                        left: 55
                    },
                    x: function(d){ return d.x; },
                    y: function(d){ return d.y; },
                    useInteractiveGuideline: true,
                    duration: 500,
                    yAxis: {
                        tickFormat: function(d){
                           return d3.format('.01f')(d);
                        }
                    }
                }
            };

            $scope.options1 = angular.copy($scope.options);
            $scope.options1.chart.duration = 0;
            $scope.options1.chart.yDomain = [-0.5,0.5];

            $scope.options2 = angular.copy($scope.options1);
            $scope.options3 = angular.copy($scope.options1);
            $scope.options4 = angular.copy($scope.options1);
            $scope.options5 = angular.copy($scope.options1);
            $scope.options6 = angular.copy($scope.options1);
            $scope.options7 = angular.copy($scope.options1);
            $scope.options8 = angular.copy($scope.options1);


            $scope.run = true;
            $scope.sensor_graph1 =  [{ values: [], key: 'sensor 1 top' }];
            $scope.sensor_graph2 =  [{ values: [], key: 'sensor 1 bottom' }];
            $scope.sensor_graph3 =  [{ values: [], key: 'sensor 2 top' }];
            $scope.sensor_graph4 =  [{ values: [], key: 'sensor 2 bottom' }];
            $scope.sensor_graph5 =  [{ values: [], key: 'sensor 3 top' }];
            $scope.sensor_graph6 =  [{ values: [], key: 'sensor 3 bottom' }];
            $scope.sensor_graph7 =  [{ values: [], key: 'sensor 4 top' }];
            $scope.sensor_graph8 =  [{ values: [], key: 'sensor 4 bottom' }];

            var api_params = {};
            var x = [];
            var sensor_data = [];
            var idx = 0;
            for(var k=0;k<8;k++) {
                x[k] = 0;
            }
            $scope.result_data_load = function(object){
                var graph = null;
                var sKey =  '';
                for(var j=0;j<8;j++){
                    idx = j;

                    if(idx == 0) {graph = $scope.sensor_graph1;sKey = 'sensor_1_1';}
                    else if(idx == 1){graph = $scope.sensor_graph2;sKey = 'sensor_1_2';}
                    else if(idx == 2){graph = $scope.sensor_graph3;sKey = 'sensor_2_1';}
                    else if(idx == 3){graph = $scope.sensor_graph4;sKey = 'sensor_2_2';}
                    else if(idx == 4){graph = $scope.sensor_graph5;sKey = 'sensor_3_1';}
                    else if(idx == 5){graph = $scope.sensor_graph6;sKey = 'sensor_3_2';}
                    else if(idx == 6){graph = $scope.sensor_graph7;sKey = 'sensor_4_1';}
                    else if(idx == 7){graph = $scope.sensor_graph8;sKey = 'sensor_4_2';}

                    sensor_data[idx] = object[sKey];
                    console.log(sensor_data[idx]);
                    for(var i=0;i<sensor_data[idx].length;i++) {
                        graph[0].values.push({x: x[idx], y: sensor_data[idx][i]});
                        if (graph[0].values.length > 200)
                            graph[0].values.shift();
                        x[idx]++;
                    }
                }
                $scope.$apply();
            };
            api_params['first'] = 1;
            api_params['p_code'] = $scope.p_code;
            api_report_graph.get(api_params, function (data) {
                if(data.status==200){
                    $scope.result_data_load(data.objects[0])
                    $scope.run = true;
                }

                $timeout(function () {
                }, 500);
            });

            setInterval(function(){
              if (!$scope.run) return;
                    var api_params = {};
                    api_params['first'] = 0;
                    api_params['p_code'] = $scope.p_code;
                    api_report_graph.get(api_params, function (data) {
                    if(data.status==200){
                        if (!$scope.run)
                            return;
                        $scope.result_data_load(data.objects[0])
                    }
                    $timeout(function () {
                    }, 500);
            });
            }, 1000);
        };
        $scope.$on('$routeChangeStart', function($event, next, current) {
            $scope.run = false;
        });

        $scope.onClose = function () {
        };
    });


