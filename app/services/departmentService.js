var app;
(function (app) {
	var services;
	var Department;
	(function (services, Department) {
		var serviceFn = (function () {
			function serviceFn() {
				this.departmentsList = [];

				for(var i=0;i<15;i++)
					this.departmentsList.push(new Department("Department "+i,""));
				return this.departmentsList;
			}
			return serviceFn;
		})();
		angular.module("IVRY-App").factory("departmentsService", serviceFn);
	})(services = app.services || (services = {}), Department = app.Department || (Department = {}));
})(app || (app = {}));
