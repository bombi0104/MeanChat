'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Groups',
	function($scope, Authentication, Groups) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.groups = [];
		$scope.group = undefined;

		var init = function(){
			$scope.groups = Groups.query();
			console.log($scope.groups);
		}

		init();
	}
]);