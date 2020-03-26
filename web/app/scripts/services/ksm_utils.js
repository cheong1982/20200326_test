/**
 * Created by ksm on 2015-01-15.
 */

'use strict';

angular.module('intrcApp')
    .factory('Utils', function ($http, ENV, $q, $window) {
        return {
            isImage: function(src) {
                var deferred = $q.defer();

                var image = new Image();
                image.onerror = function() {
                    deferred.resolve(false);
                };
                image.onload = function() {
                    deferred.resolve(true);
                };
                //image.src = src;
                image.src = src+ '?cache=' + (new Date()).getTime();

                return deferred.promise;
            }
        };
    });
