'use strict';

angular.module('intrcApp')
    .factory('history_id', function ($resource, ENV) {
        return $resource(ENV.host + '/api/history_id', null, {'update': {method: 'PUT'}});
    });
