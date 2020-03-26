'use strict';

angular.module('intrcApp')
    .factory('api_user', function ($resource, ENV) {
        return $resource(ENV.host + '/api/User', null, {'update': {method: 'PUT'}});
    });
