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

			$httpProvider.interceptors.push("myHttpInterceptor");
		}
		return Config;
	})();
	Config.$inject = ["$httpProvider", "$logProvider", '$urlRouterProvider', '$stateProvider', "$locationProvider", 'USER_ROLES'];

	var mainApp = angular.module("IVRY-App", ['ui.router', 'ui.bootstrap', 'ngFileUpload','ngSanitize', 'angular-storage', 'uiSwitch', 'as.sortable']);
	mainApp.config(Config);

	var initApp = function ($rootScope, $state, AUTH_EVENTS, AuthService) {
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
		$rootScope.$on(AUTH_EVENTS.notAuthorized,function(){
			$rootScope.message={
				body:"You are not AUTHORIZED to Access this location !!",
				type:"warning",
				duration:3000
			}
		});
		$rootScope.$on(AUTH_EVENTS.notAuthenticated,function(){
			$rootScope.message={
				body:"You are not LOGGED IN Yet!!, to Access this location you MUST need to <a href='/login'>LOGIN</a> !!",
				type:"warning",
				duration:3000
			}
		});
	};
	initApp.$inject = ["$rootScope", "$state", "AUTH_EVENTS", "AuthService"];
	mainApp.run(initApp);

	mainApp.controller("MainMenuCtrl", ["$scope", "$rootScope", function ($scope, $rootScope) {

	}]);
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
