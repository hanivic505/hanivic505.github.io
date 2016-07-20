var app;
(function (app) {
	var User = (function () {
		function User(id, fName, lName, mobile, email, loginName, password, role, department, team) {
			return {
				id: id,
				firstName: fName,
				lastName: lName,
				mobileNo: mobile,
				email: email,
				loginName: loginName,
				password: password,
				roleId: role, // 1. Department Admin 2. Team Lead 3. Analyst
				role: role,
				departmentId: department,
				department: department,
				teamId: team,
				team: team
			};
		}
		return User;
	})();
	app.User = User;
})(app || (app = {}));
