'use strict';

angular.module('intrcApp')
    .factory('Tree', function ($resource, ENV) {
        return $resource(ENV.host + '/api/GroupTree', null, {'update': {method: 'PUT'}});
    });
