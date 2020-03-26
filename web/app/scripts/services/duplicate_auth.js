/**
 * Created by 박원배 on 2016-02-24.
 */

'use strict';

angular.module('intrcApp')
  .factory('Duplicate_Auth', function ($resource, ENV) {
    return $resource(ENV.host + '/api2/v1/DuplicateCheck', null, {'update': {method: 'PUT'}});
  });
