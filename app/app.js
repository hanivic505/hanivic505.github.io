var app;

(function (app) {
	var Config = (function () {
		function Config($httpProvider, $urlRouterProvider, $stateProvider, $locationProvider, USER_ROLES) {
			this.$stateProvider = $stateProvider;
			this.$urlRouterProvider = $urlRouterProvider;
			$locationProvider.html5Mode(true);
			this.$stateProvider
				.state('login', {
					url: '/login',
					templateUrl: '/app/pages/login/view.html',
					data: {
						title: 'Login'
					},
				})
				.state('calls-log', {
					url: '/calls-log',
					templateUrl: '/app/pages/calls_log/view.html',
					data: {
						title: 'Calls Log',
						authorizedRoles: [USER_ROLES.sysAdmin, USER_ROLES.depAdmin]
					},
					controller: "CallLogCtrl as vm",
					resolve: {
						ctrlData: function (callLogService) {
							return callLogService.get(10,1,[]).then(function (data) {
								console.info("resolve",data);
								return data;
							});
						},
					}
				})
				.state("system", {
					url: "/system",
					templateUrl: "/app/pages/system/view.html",
					data: {
						title: "System Settings",
						authorizedRoles: [USER_ROLES.sysAdmin]
					}
				})
				.state("target", {
					url: "/target",
					templateUrl: "/app/pages/target/view.html",
					data: {
						title: "Target",
						authorizedRoles: [USER_ROLES.depAdmin, USER_ROLES.teamLead]
					}
				})
				.state("teams", {
					url: "/teams",
					templateUrl: "/app/pages/teams/view.html",
					data: {
						title: "Teams",
						authorizedRoles: [USER_ROLES.depAdmin]
					}
				})
				.state("users", {
					url: "/users",
					templateUrl: "/app/pages/users/view.html",
					data: {
						title: "Users",
						authorizedRoles: [USER_ROLES.depAdmin]
					}
				})
				.state("audit", {
					url: "/audit",
					templateUrl: "/app/pages/audit/view.html",
					data: {
						title: "Audit",
						authorizedRoles: [USER_ROLES.depAdmin]
					}
				})
				.state("rights", {
					url: "/rights",
					templateUrl: "/app/pages/rights/view.html",
					data: {
						title: "User Access Rights",
						authorizedRoles: [USER_ROLES.depAdmin]
					}
				})
				.state("departments", {
					url: "/departments",
					templateUrl: "/app/pages/departments/view.html",
					data: {
						title: "Departments",
						authorizedRoles: [USER_ROLES.sysAdmin]
					}
				});
			this.$urlRouterProvider.otherwise('/login');

			var interceptor = ['$q', '$injector', function ($q, $injector) {
				var error;
				//				console.info("loading")

				function success(response) {
					// get $http via $injector because of circular dependency problem
					$http = $http || $injector.get('$http');
					if ($http.pendingRequests.length < 1) {
						$('#loadingWidget').hide();
					}
					return response;
				}

				function error(response) {
					// get $http via $injector because of circular dependency problem
					$http = $http || $injector.get('$http');
					if ($http.pendingRequests.length < 1) {
						$('#loadingWidget').hide();
					}
					return $q.reject(response);
				}

				//				return function (promise) {
				//					$('#loadingWidget').show();
				//					return promise.then(success, error);
				//				}
				return {
					'request': function (config) {
						// same as above
						$('#loadingWidget').show();
						return config;
					},
					'requestError': function (rejection) {
						// do something on error
						$('#loadingWidget').hide();
						//						if (canRecover(rejection)) {
						//							return responseOrNewPromise
						//						}

						return $q.reject(rejection);
					},
					'response': function (response) {
						// same as above
						$('#loadingWidget').hide();
						return response;
					},
					'responseError': function (rejection) {
						// do something on error
						$('#loadingWidget').hide();
						//						if (canRecover(rejection)) {
						//							return responseOrNewPromise
						//						}
						return $q.reject(rejection);
					}
				};
        	}];
			$httpProvider.interceptors.push(interceptor);
		}
		return Config;
	})();
	Config.$inject = ["$httpProvider", '$urlRouterProvider', '$stateProvider', "$locationProvider", 'USER_ROLES'];

	var mainApp = angular.module("IVRY-App", ['ui.router', 'ui.bootstrap', 'ngFileUpload', 'angular-storage', 'uiSwitch', 'as.sortable']);
	mainApp.config(Config);

	var initApp = function ($rootScope, $state, AUTH_EVENTS, AuthService) {
		$rootScope.$state = $state;
		$rootScope.AuthService = AuthService;
		$rootScope.closeAlert = function () {
			$rootScope.message = null;
		};
		$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
			$rootScope.message=null;
			//			console.info('$stateChangeStart', event, toState);
			//			var authorizedRoles = next.data.authorizedRoles;
			//			if (!AuthService.isAuthorized(authorizedRoles)) {
			//				event.preventDefault();
			//				if (AuthService.isAuthenticated()) {
			//					// user is not allowed
			//					$rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
			//				} else {
			//					// user is not logged in
			//					$rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
			//				}
			//			}
		});
	};
	initApp.$inject = ["$rootScope", "$state", "AUTH_EVENTS", "AuthService"];
	mainApp.run(initApp);

	mainApp.controller("MainMenuCtrl", ["$scope", "$rootScope", function ($scope, $rootScope) {

	}]);
	mainApp.filter("lines", function () {
		return function (value, selected) {
			var filtered = [];
			angular.forEach(selected, function (val, key) {
				angular.forEach(value, function (iVal, iKey) {
					if (iVal.lineId == key)
						if (val) {
							filtered.push(iVal);
						}
				});
			});
			return filtered;
		};
	});
	mainApp.filter("columnsFilter", function ($rootScope, $timeout) {
		return function (value, filterBy) {
			//			console.log("columnsFilter")
			angular.forEach(value, function (val, key) {
				if (!angular.isUndefined(filterBy)) {
					if (filterBy.toLowerCase() !== "" && val.title.toLowerCase().indexOf(filterBy.toLowerCase()) !== -1) {
						val["picked"] = true;
						$rootScope.$broadcast("columnsFiltered");
					} else
						val["picked"] = false;
				}
			});
			//			var promise = $timeout(function () {
			//			}, 2000);
			return value;
		};
	});
	mainApp.filter('wavesurferTimeFormat', function () {
		return function (input) {
			if (!input) {
				return "00:00";
			}

			var minutes = Math.floor(input / 60);
			var seconds = Math.ceil(input) % 60;

			return (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
		};
	});
	//
	mainApp.constant('AUTH_EVENTS', {
		loginSuccess: 'auth-login-success',
		loginFailed: 'auth-login-failed',
		logoutSuccess: 'auth-logout-success',
		sessionTimeout: 'auth-session-timeout',
		notAuthenticated: 'auth-not-authenticated',
		notAuthorized: 'auth-not-authorized'
	}).constant('USER_ROLES', {
		all: '*',
		sysAdmin: 'ADMIN',
		depAdmin: 'DEPT_ADMIN',
		teamLead: 'TEAM_LEADER',
		analyst: 'ANALYST'
	}).constant("API_BASE_URL", "http://git.solve-it-services.com:8000/ivry-web");
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
					Session.create(res.data.user);
					$http.get(API_BASE_URL + "/lookups", {
						headers: {
							'X-Access-Token': store.get("token")
						}
					}).success(function (response) {
						$rootScope.lookups = response.data;
						$rootScope.callsLogColumns = utilitiesServices.columnsAdapterIn($rootScope.lookups.reportColumnLus);
						console.log("lookups", response.data);
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
				authorizedRoles.indexOf(Session.userRole) !== -1);
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
})(app || (app = {}));
$(function () {
	$("body").on("mousedown", '.dropdown-menu.keep-on,.uib-monthpicker button', function (e) {
		//e.stopPropagation();

		e.stopImmediatePropagation();
	});
	$("body").on("click", '.dropdown-menu.keep-on,.uib-monthpicker button', function (e) {
		//var dropdown=$(".filter").get(0);
		//if ($.contains(dropdown, e.target)) {
		e.stopPropagation();
		//or return false;
		//}
	});
});
