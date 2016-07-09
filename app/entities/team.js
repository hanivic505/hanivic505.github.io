var app;
(function (app) {
	var Team = (function () {
		function Team(title, department, comment) {
			return {
				title: title,
				department: department,
				comment: comment,
				membersCount:function(){return 7;}
			};
		}
		return Team;
	})();
	app.Team = Team;
})(app || (app = {}));
