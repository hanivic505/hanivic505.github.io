var app;
(function (app) {
	var User;
	(function (User) {
		var Team = (function () {
			function Team(title, department, comment) {
				this.obj = {
					title: title,
					department: department,
					comment: comment,
					//					members: {
					teamLeads: [],
					teamAnalysts: [],
					//					},
					membersCount: function () {
						return this.teamLeads.length + this.teamAnalysts.length;
					}
				};
				for (var i = 0; i < 6; i++) {
					this.obj.teamLeads.push(new User(i + 1, "Team" + i, "Lead" + i, "01010101" + i, "TeamL" + i + "@mail.com", "TLUser" + i, "P@ssw0rd", 2, 2, 2));
					this.obj.teamAnalysts.push(new User(i + 1, "Team" + i, "Analyst" + i, "01010101" + i, "TeamL" + i + "@mail.com", "TLUser" + i, "P@ssw0rd", 3, 2, 2));
				}
				return this.obj;
			}
			return Team;
		})();
		app.Team = Team;
	})(User = app.User || (User = {}));
})(app || (app = {}));
