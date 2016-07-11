var app;
(function (app) {
	var Team = (function () {
		function Team(title, department, comment) {
			return {
				title: title,
				department: department,
				comment: comment,
				members: [
					{
						id: 15,
						name: "Team Lead Fifteen"
							},
					{
						id: 16,
						name: "Team Lead Sixteen"
							}
						],
				membersCount: function () {
					return this.members.length;
				}
			};
		}
		return Team;
	})();
	app.Team = Team;
})(app || (app = {}));
