/**
 * Created by ksm on 2014-12-09.
*/
angular.module('intrcApp')
    .factory('api_report_graph', function ($resource, ENV) {
        return $resource(ENV.host + '/api/ReportGraph', null, {'update': {method: 'PUT'}});
    });
