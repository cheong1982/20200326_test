/**
 * Created by ksm on 2014-12-09.
 */
angular.module('intrcApp')
    .factory('ResetPassword', function ($resource, ENV) {
        return $resource(ENV.host + '/api/ResetPassword', null, {'update': {method: 'PUT'}});
    });
