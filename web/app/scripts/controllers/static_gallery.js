/**
 * Created by ksm on 2014-12-22.
 */

angular.module('intrcApp')
    .controller('SGalleryCtrl', function ($scope,$modalInstance, img_uri) {
        $scope.img_uri = img_uri;

        $scope.onClose = function () {
            $modalInstance.dismiss('cancel');
        }
    });
