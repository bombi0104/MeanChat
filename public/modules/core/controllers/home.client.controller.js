'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Groups',
	function($scope, Authentication, Groups) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.groups = [];
		$scope.group = undefined;


		/**
		 *
		 */
		var updateActiveGroup = function(gr){
			$scope.groups.forEach(function(group){
				if (group._id === gr._id) {
					group.active = true;
				} else {
					group.active = false;
				}
			});
		};

		/**
		 *
		 */
		$scope.selectGroup = function(gr){
			$scope.group = gr;
			console.debug('%j',gr);
			updateActiveGroup(gr);

		};

		var init = function(){
			$scope.groups = Groups.query();
			$scope.groups.$promise.then(function (result) {
    			$scope.selectGroup(result[0]);
			});
			$scope.selectGroup($scope.groups[0]);
		};

		

		init();

		
	}
]);