'use strict';

angular.module('intrcApp')
    .factory('api_login', function ($resource, ENV) {
        return $resource(ENV.host + '/api/Login', null, {'update': {method: 'PUT'}});
    });
