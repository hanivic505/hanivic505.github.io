var app;

(function (app) {
	var Config = (function () {
		function Config($httpProvider, $logProvider, $urlRouterProvider, $stateProvider, $locationProvider, USER_ROLES) {
			this.$stateProvider = $stateProvider;
			this.$urlRouterProvider = $urlRouterProvider;
			//			$logProvider.debugEnabled(false);
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
						authorizedRoles: [USER_ROLES.sysAdmin, USER_ROLES.depAdmin, USER_ROLES.teamLead]
					},
					controller: "CallLogCtrl as vm",
					resolve: {
						ctrlData: function (callLogService) {
							return callLogService.get(1).then(function (data) {
								console.info("resolve", data);
								return data;
							});
						},
						linesData: function (linesTreeService) {
							return linesTreeService.get().then(function (data) {
								console.info("lines resolve", data);
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
					},
					controller: "TargetCtrl as vm",
					resolve: {
						linesData: function (linesTreeService) {
							return linesTreeService.get().then(function (data) {
								console.info("lines resolve", data);
								return data;
							});
						},
					}
				})
				.state("teams", {
					url: "/teams",
					templateUrl: "/app/pages/teams/view.html",
					controller: "TeamsCtrl as vm",
					data: {
						title: "Teams",
						authorizedRoles: [USER_ROLES.sysAdmin, USER_ROLES.depAdmin]
					},
					resolve: {
						ctrlData: function (teamService) {
							return teamService.get().then(function (data) {
								console.info("resolve", data);
								return data;
							});
						}
					}
				})
				.state("users", {
					url: "/users",
					templateUrl: "/app/pages/users/view.html",
					controller: "UsersCtrl as vm",
					data: {
						title: "Users",
						authorizedRoles: [USER_ROLES.sysAdmin, USER_ROLES.depAdmin, USER_ROLES.teamLead]
					},
					resolve: {
						ctrlData: function (usersService) {
							return usersService.get().then(function (data) {
								console.info("resolve", data);
								return data;
							});
						}
					}
				})
				.state("audit", {
					url: "/audit",
					templateUrl: "/app/pages/audit/view.html",
					data: {
						title: "Audit",
						authorizedRoles: [USER_ROLES.sysAdmin, USER_ROLES.depAdmin, USER_ROLES.teamLead]
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
					controller: "DepartmentsCtrl as vm",
					data: {
						title: "Departments",
						authorizedRoles: [USER_ROLES.sysAdmin]
					},
					resolve: {
						ctrlData: function (departmentsService) {
							return departmentsService.get().then(function (data) {
								console.info("resolve", data);
								return data;
							});
						}
					}
				});
			this.$urlRouterProvider.otherwise('/login');

			$httpProvider.interceptors.push("myHttpInterceptor");
		}
		return Config;
	})();
	Config.$inject = ["$httpProvider", "$logProvider", '$urlRouterProvider', '$stateProvider', "$locationProvider", 'USER_ROLES'];

	var mainApp = angular.module("IVRY-App", ['ui.router', 'ui.bootstrap', 'ngFileUpload', 'ngSanitize', 'angular-storage', 'uiSwitch', 'as.sortable']);
	mainApp.config(Config);

	var initApp = function ($rootScope, $log, $state, AUTH_EVENTS, AuthService) {
		$rootScope.$state = $state;
		$rootScope.showSpinner = false;
		$rootScope.AuthService = AuthService;
		$rootScope.closeAlert = function () {
			$rootScope.message = null;
		};
		$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
			$rootScope.message = null;
			//			console.info('$stateChangeStart', event, toState, toParams, fromState, fromParams, options);
			var authorizedRoles = toState.data.authorizedRoles;
			//			console.log(toState.url != "/login" && AuthService.isAuthorized(authorizedRoles));
			if (toState.url != "/login" && !AuthService.isAuthorized(authorizedRoles)) {
				event.preventDefault();
				if (AuthService.isAuthenticated()) {
					// user is not allowed
					//					console.warn(AUTH_EVENTS.notAuthorized);
					$rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
				} else {
					// user is not logged in
					//					console.warn(AUTH_EVENTS.notAuthenticated);
					$rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
				}
			}
		});
		$rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
			$log.debug("$stateChangeError", error);
		});
		$rootScope.$on(AUTH_EVENTS.notAuthorized, function () {
			$rootScope.message = {
				body: "You are not AUTHORIZED to Access this location !!",
				type: "warning",
				duration: 3000
			}
		});
		$rootScope.$on(AUTH_EVENTS.notAuthenticated, function () {
			$rootScope.message = {
				body: "You are not LOGGED IN Yet!!, to Access this location you MUST need to <a href='/login'>LOGIN</a> !!",
				type: "warning",
				duration: 3000
			}
		});
		$rootScope.$on("redirect_login", function () {
			AuthService.logout();
			$state.go("login");
		});
	};
	initApp.$inject = ["$rootScope", "$log", "$state", "AUTH_EVENTS", "AuthService"];
	mainApp.run(initApp);

	mainApp.controller("MainMenuCtrl", ["$scope", "$rootScope", function ($scope, $rootScope) {

	}]);
	//	mainApp.directive('convertToNumber', function () {
	//		return {
	//			require: 'ngModel',
	//			link: function (scope, element, attrs, ngModel) {
	//				ngModel.$parsers.push(function (val) {
	//					return val != null ? parseInt(val, 10) : null;
	//				});
	//				ngModel.$formatters.push(function (val) {
	//					return val != null ? '' + val : null;
	//				});
	//			}
	//		};
	//	});
	//
	mainApp.directive('passwordVerify', passwordVerify);

	function passwordVerify() {
		return {
			restrict: 'A', // only activate on element attribute
			require: '?ngModel', // get a hold of NgModelController
			link: function (scope, elem, attrs, ngModel) {
				if (!ngModel) return; // do nothing if no ng-model

				// watch own value and re-validate on change
				scope.$watch(attrs.ngModel, function () {
					validate();
				});

				// observe the other value and re-validate on change
				attrs.$observe('passwordVerify', function (val) {
					validate();
				});

				var validate = function () {
					// values
					var val1 = ngModel.$viewValue;
					var val2 = attrs.passwordVerify;

					// set validity
					ngModel.$setValidity('passwordVerify', val1 === val2);
				};
			}
		}
	}
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

})(app || (app = {}));

//jQuery Plugins overrides
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
