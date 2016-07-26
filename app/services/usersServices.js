var app;
(function (app) {
	var services;
	var User;
	(function (services, User) {
		var serviceFn = (function () {
			function serviceFn() {
				this.usersList = [];

				for(var i=0;i<15;i++)
					this.usersList.push(User(i+1,"Farid"+i,"Nabil"+i,"010101010"+i,"teamLead"+i+"@mail.com","TL_User"+i,"P@ssw0rd",2,1,1));
				return this.usersList;
			}
			return serviceFn;
		})();
		angular.module("IVRY-App").factory("usersService", serviceFn);
	})(services = app.services || (services = {}), User = app.User || (User = {}));
})(app || (app = {}));
