var app;
(function (app) {
	var services;
	var User;
	(function (services, User) {
		var serviceFn = (function ($rootScope, $http, store, API_BASE_URL) {
			function serviceFn($rootScope, $http, store, API_BASE_URL) {
				return {
					conditions: [],
					orders: [],
					pageSize: 10,
					currentPage: 1,
					get: function (pgNum, condition) {
						console.info("usersService.get:before", this.currentPage, this.conditions, this.orders);
						this.conditions = condition == undefined ? this.conditions : condition;
						//this.orders = order;
						this.currentPage = pgNum == undefined ? this.currentPage : pgNum;
						console.info("usersService.get:after", this.currentPage, this.conditions, this.orders);
						return $http.post(API_BASE_URL + "/user-list/search", {
							pageSize: this.pageSize,
							pageNumber: this.currentPage,
							andConditions: this.conditions,
							order: this.orders
						}, {
							headers: {
								"X-Access-Token": store.get("token")
							},
						}).then(function (response) {
							return response.data.data;
						}, function (error) {
							$rootScope.message = {
								body: error.data.message,
								type: 'danger',
								duration: 5000,
							};
							return [];
						});
					},
					getAssignedUsers:function(line){
						return $http.get(API_BASE_URL+"/line-user/line/"+line.id,{
							headers:{
								"X-Access-Token":store.get("token")
							}
						}).then(function(response){
							console.info("usersService::getAssignedUsers",response);
							return response.data.data;
						},function(error){});
					},
					assignUsers:function(line,users){
						return $http.put(API_BASE_URL+"/line/user",{
							line:{
								id:line.id
							},
							systemUsers:users
						},{
							headers:{
								"X-Access-Token":store.get("token")
							}
						});
					},
				};
			}
			return serviceFn;
		})();
		angular.module("IVRY-App").factory("usersService", ["$rootScope", "$http", "store", "API_BASE_URL",serviceFn]);
	})(services = app.services || (services = {}), User = app.User || (User = {}));
})(app || (app = {}));
