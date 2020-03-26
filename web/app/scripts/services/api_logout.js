'use strict';

angular.module('intrcApp')
    .factory('api_logout', function ($resource, ENV) {
        return $resource(ENV.host + '/api/Logout', null, {'update': {method: 'PUT'}});
    });
