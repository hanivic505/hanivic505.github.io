var app;

(function(app){
    var Config = (function () {
        function Config($urlRouterProvider, $stateProvider,USER_ROLES) {
            this.$stateProvider = $stateProvider;
            this.$urlRouterProvider = $urlRouterProvider;
            this.$stateProvider.state('calls-log', {
                url: '/calls-log',
                templateUrl: '/app/calls_log/view.html',
                data:{title:'Calls Log',
					  authorizedRoles:[USER_ROLES.sysAdmin,USER_ROLES.depAdmin]},
            }).state("system",{
				url: "/system",
				templateUrl: "/app/system/view.html",
				data:{title:"System Settings",authorizedRoles:[USER_ROLES.sysAdmin]}
			}).state("target",{
				url:"/target",
				templateUrl:"/app/target/view.html",
				data:{title:"Target",authorizedRoles:[USER_ROLES.depAdmin,USER_ROLES.teamLead]}
			});
            this.$urlRouterProvider.otherwise('/calls-log');
        }
        return Config;
    })();
    Config.$inject = ['$urlRouterProvider', '$stateProvider','USER_ROLES'];
    
    var mainApp=angular.module("IVRY-App",['ui.router','ui.bootstrap','ngFileUpload','uiSwitch']);
    mainApp.config(Config);

    var initApp=function($rootScope,$state/*,AUTH_EVENTS,AuthService*/){
        $rootScope.$state = $state;
//        $rootScope.$on('$stateChangeStart', function (event, next) {
//            var authorizedRoles = next.data.authorizedRoles;
//            if (!AuthService.isAuthorized(authorizedRoles)) {
//              event.preventDefault();
//              if (AuthService.isAuthenticated()) {
//                // user is not allowed
//                $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
//              } else {
//                // user is not logged in
//                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
//              }
//            }
//          });
    };
    initApp.$inject=["$rootScope","$state"/*,"AUTH_EVENTS","AuthService"*/];
    mainApp.run(initApp);
    
	mainApp.controller("MainMenuCtrl",["$scope","$rootScope",function($scope,$rootScope){

	}]);

    mainApp.filter("lines",function(){
        return function(value,selected){
            var filtered=[];
            angular.forEach(selected,function(val,key){
                angular.forEach(value,function(iVal,iKey){
                    if(iVal.lineId==key)
                        if(val){
                            filtered.push(iVal);
                        }
                });
            });
            return filtered;
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
        sysAdmin: 'SysAdmin',
        depAdmin: 'DepAdmin',
        teamLead: 'TeamLead',
        analyst: 'Analyst'
    });
//    mainApp.factory('AuthService', function ($http, Session) {
//        var authService = {};
//
//        authService.login = function (credentials) {
//        return $http
//          .post('/login', credentials)
//          .then(function (res) {
//            Session.create(res.data.id, res.data.user.id,
//                           res.data.user.role);
//            return res.data.user;
//          });
//        };
//
//        authService.isAuthenticated = function () {
//        return !!Session.userId;
//        };
//
//        authService.isAuthorized = function (authorizedRoles) {
//        if (!angular.isArray(authorizedRoles)) {
//          authorizedRoles = [authorizedRoles];
//        }
//        return (authService.isAuthenticated() &&
//          authorizedRoles.indexOf(Session.userRole) !== -1);
//        };
//
//        return authService;
//    });
//    mainApp.service('Session', function () {
//        this.create = function (sessionId, userId, userRole) {
//            this.id = sessionId;
//            this.userId = userId;
//            this.userRole = userRole;
//        };
//        this.destroy = function () {
//            this.id = null;
//            this.userId = null;
//            this.userRole = null;
//        };
//    });
})
(app||(app={}));
$(function(){
    $("body").on("mousedown",'.dropdown-menu.keep-on,.uib-monthpicker button', function(e) {
        //e.stopPropagation();
        
        e.stopImmediatePropagation();
    });
    $("body").on("click",'.dropdown-menu.keep-on,.uib-monthpicker button', function(e) {
        //var dropdown=$(".filter").get(0);
        //if ($.contains(dropdown, e.target)) {
            e.stopPropagation();
        //or return false;
        //}
    }); 
});