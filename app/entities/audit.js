var app;
(function (app) {
	var Audit = (function () {
		function Audit(id, user, role, department, team, callLog, dateLog, timeLog, eventLog) {
			return {
				id: id,
				user: user,
				role: role,
				department: department,
				team: team,
				callLog: callLog,
				logDate: dateLog,
				logTime: timeLog,
				logEvent: eventLog
			};
		}
		return Audit;
	})();
	app.Audit = Audit;
})(app || (app = {}));
