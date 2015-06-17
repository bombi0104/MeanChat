'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Groups', 'Messages', '$http', '$timeout', '$window',
	function($scope, Authentication, Groups, Messages, $http, $timeout, $window) {
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
		};

		/**
		 *
		 */
		$scope.selectGroup = function(gr){
			$scope.group = gr;
			updateActiveGroup(gr);
			if (gr.messages === undefined){
				getGroupMsg(gr);	
			}
		};

		/**
		 *
		 */
		var init = function(){
			$scope.groups = Groups.query();
			$scope.groups.$promise.then(function (result) {
    			$scope.selectGroup(result[0]);
			});
		};

		/**
	 	 *
     	 **/
     	var receiveMsg = function(msg) {
     		var gr = $scope.groups.getbyId(msg.group);

     		if (gr.messages != null ) {
     			if (gr.messages.indexOf(msg) < 0){
     				gr.messages.push(msg);
     			}

				$scope.groups.moveTop(gr);
				notifyMe(gr.name, msg.message);
			}
		}
		

		init();

		/**
	 	 *
     	 **/
		$scope.sendMsg = function(e){
			if (e.shiftKey && (e.keyCode === 13)) {
				if ($scope.inputMsg.trim().length > 0){
					// Create new Message object
					var message = new Messages ({
						group: $scope.group._id,
						message: $scope.inputMsg.trim()
					});

					message.$save(function(response) {
						// Set name for display
						response.user = {
							displayName:$scope.authentication.user.displayName
						};
						
						// Clear form fields
						$scope.inputMsg = '';
						// // Add created msg to current group's messages;
						// $scope.group.messages.push(response);
						receiveMsg(response);
					}, function(errorResponse) {
						$scope.error = errorResponse.data.message;
					});
				}
			}
		};

		/**
	 	 *
     	 **/
		$scope.formatDate = function(st){
    		var tmp = st.match(/^\d{4}-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    		return tmp[2] + '/' + tmp[1] + ' ' + tmp[3] + ':' + tmp[4];  //dd/MM hh:mm
    	};

    	/**
		 * Show Notification
		 * https://developer.mozilla.org/en/docs/Web/API/notification
	     **/
		var notifyMe = function(groupName, msg){
	        // Let's check if the browser supports notifications
	        if (!("Notification" in window)) {
	            alert("This browser does not support desktop notification");
	        }
	        else if (Notification.permission === "granted") {
	            // If it's okay let's create a notification
	            var options = {
	      			body: msg,
	      			tag: 'MeanChat'
	      			// icon: theIcon
	  			}
	            
	            var notification = new Notification(groupName, options);

	            notification.onclick = function(){
	            	$window.focus();
	            };

	            $timeout(function(){
	            	notification.close();
	            }, 10000);
	        }

	          // Otherwise, we need to ask the user for permission
	          // Note, Chrome does not implement the permission static property
	          // So we have to check for NOT 'denied' instead of 'default'
          	else if (Notification.permission !== 'denied') {
	            Notification.requestPermission(function (permission) {

	              // Whatever the user answers, we make sure we store the information
	              if(!('permission' in Notification)) {
	                Notification.permission = permission;
	              }

	              // If the user is okay, let's create a notification
	              if (permission === "granted") {
	                var notification = new Notification(msg);
	              }
	          });
	        }
    	};
	}
]);