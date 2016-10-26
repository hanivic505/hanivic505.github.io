var app;
(function (app) {
	var mainApp = angular.module("IVRY-App");
	mainApp.factory('myHttpInterceptor', ['$q', '$rootScope', '$injector', "$log",// "AuthService",
    	function ($q, $rootScope, $injector, $log/*, AuthService*/) {
			$rootScope.showSpinner = false;
			$rootScope.http = null;
			return {
				'request': function (config) {
					$rootScope.showSpinner = true;
					return config || $q.when(config);
				},
				'requestError': function (rejection) {
					$rootScope.http = $rootScope.http || $injector.get('$http');
					if ($rootScope.http.pendingRequests.length < 1) {
						$rootScope.showSpinner = false;
					}
					$log.error("Request ERROR : ", rejection);
					return $q.reject(rejection);
				},
				'response': function (response) {
					$rootScope.http = $rootScope.http || $injector.get('$http');
					if ($rootScope.http.pendingRequests.length < 1) {
						$rootScope.showSpinner = false;
					}
					return response || $q.when(response);
				},
				'responseError': function (rejection) {
					$rootScope.http = $rootScope.http || $injector.get('$http');
					if ($rootScope.http.pendingRequests.length < 1) {
						$rootScope.showSpinner = false;
					}
					if (rejection.status > 399 && rejection.status < 500) {
//						AuthService.logout();
						$rootScope.$broadcast("redirect_login");
					}
					$log.error("Response ERROR : ", rejection);
					return $q.reject(rejection);
				}
			}
    	}
	]);
	mainApp.factory('AuthService', function ($rootScope, $http, store, Session, utilitiesServices, API_BASE_URL) {
		var authService = {};

		authService.login = function (credentials) {
			return $http({
					method: "POST",
					url: API_BASE_URL + '/auth/login',
					headers: {
						'X-User-Name': credentials.userName,
						'X-Password': credentials.password
					},
				})
				.success(function (res) {
					console.log(res);
					store.set("token", res.data.token);
					$http.get(API_BASE_URL + "/lookups", {
						headers: {
							'X-Access-Token': store.get("token")
						}
					}).success(function (response) {
						$rootScope.lookups = response.data;
						$rootScope.callsLogColumns = utilitiesServices.columnsAdapterIn($rootScope.lookups.reportLus[0].reportColumnLus);
						$rootScope.teamsColumns = utilitiesServices.columnsAdapterIn($rootScope.lookups.reportLus[2].reportColumnLus);
						console.log("lookups", response.data, $rootScope.callsLogColumns);
						Session.create(res.data.user);
					});
					//				$httpProvider.defaults.headers.common['X-Access-token'] = store.get("token");
					//						res.data.user.role);
					//					return res.data.user;
				}).error(function (err) {
					$rootScope.message = {
						body: err.data.message,
						type: 'danger',
						duration: 50000
					}
				});
		};
		authService.logout = function () {
			Session.destroy();
		};
		authService.isAuthenticated = function () {
			return !!Session.userName;
		};

		authService.isAuthorized = function (authorizedRoles) {

			if (!angular.isArray(authorizedRoles)) {
				authorizedRoles = [authorizedRoles];
			}
			return (authService.isAuthenticated() &&
				authorizedRoles.indexOf(Session.role) !== -1);
		};

		return authService;
	});
	mainApp.service('Session', function ($rootScope, $state, store, USER_ROLES) {
		this.create = function (user) {
			this.userName = user.firstName + " " + user.lastName;
			this.role = user.accessRoles[0].code;
			$rootScope.session = this;
			$rootScope.userRoles = USER_ROLES;
			//			console.info(this)
			switch (this.role) {
				case USER_ROLES.sysAdmin:
					$state.go("system");
					break;
				case USER_ROLES.depAdmin:
					$state.go("calls-log");
					break;
				case USER_ROLES.teamLead:
					$state.go("calls-log");
					break;
				case USER_ROLES.analyst:
					$state.go("calls-log");
					break;
				default:
					$state.go("login");
					break;
			}
		};
		this.destroy = function () {
			this.userName = null;
			store.remove("token");
			$state.go("login");
		};
	});
})(app || (app = {}))
