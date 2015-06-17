'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Groups', 'Messages', '$http',
	function($scope, Authentication, Groups, Messages, $http) {
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
		var getGroupMsg = function(group){
			$scope.success = $scope.error = null;

			$http.get('/groups/' + group._id + '/messages')
			.success(function(response){
				$scope.success = true;
				group.messages = response;
			}).error(function(response){
				$scope.error = response.message;
			});
		}

		/**
		 *
		 */
		$scope.selectGroup = function(gr){
			$scope.group = gr;
			updateActiveGroup(gr);
			getGroupMsg(gr);
		};

		var init = function(){
			$scope.groups = Groups.query();
			$scope.groups.$promise.then(function (result) {
    			$scope.selectGroup(result[0]);
			});
		};

		

		init();

		/**
	 	 *
     	 **/
		$scope.sendMsg = function(e){
			if (e.shiftKey && (e.keyCode == 13)) {
				if ($scope.inputMsg.trim().length > 0){
					// Create new Message object
					var message = new Messages ({
						group: $scope.group._id,
						message: $scope.inputMsg.trim()
					});

					message.$save(function(response) {
						console.log("sendMsg - response = ", response);
						// Clear form fields
						$scope.inputMsg = '';
					}, function(errorResponse) {
						$scope.error = errorResponse.data.message;
					});
				}
			}
		}

		
	}
]);