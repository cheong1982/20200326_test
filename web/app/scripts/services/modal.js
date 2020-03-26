'use strict';

angular.module('intrcApp')
    .factory('Modal', function ($modal) {
        return {
            open: function (templateUrl, controller, size, resolve, postProcess) {
                var modalInstance = $modal.open({
                    templateUrl: templateUrl,
                    controller: controller,
                    size: size,
                    resolve: resolve
                });
                modalInstance.result.then(postProcess);
            }

        };
    });