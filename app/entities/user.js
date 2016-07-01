var app;
(function (app) {
	var User = (function () {
		function User(fName, lName, mobile, email, loginName, password, role, department, team) {
			return {
				firstName: fName,
				lastName: lName,
				mobileNo: mobile,
				email: email,
				loginName: loginName,
				password: password,
				roleId: role,
				departmentId: department,
				teamId: team
			};
		}
		return User;
	})();
	app.User = User;
})(app || (app = {}));
