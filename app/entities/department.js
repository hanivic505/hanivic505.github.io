var app;
(function (app) {
	var User;
	var Team;
	(function (Team, User) {
		var Department = (function () {
			function Department(title, comment, maxNoOfRecLines) {
				this.obj = {
					title: title,
					comment: comment,
					maxNoOfRecLines: maxNoOfRecLines,
					lines: [],
					assignedLines: function () {
						return this.lines.length;
					},
					teams: [],
					teamsCount: function () {
						return this.teams.length;
					}
				};
				for (j = 0; j < 3; j++) {
					this.obj.teams.push(new Team("Team " + j + " of Dep " + this.obj.title, this.obj.title, ""));
					//					for (var i = 0; i < 6; i++) {
					//						this.obj.teams[j].teamLeads.push(new User(i + 1, "Team" + i, "Lead" + i, "01010101" + i, "TeamL" + i + "@mail.com", "TLUser" + i, "P@ssw0rd", 2, 2, 2));
					//						this.obj.teams[j].teamAnalysts.push(new User(i + 1, "Team" + i, "Analyst" + i, "01010101" + i, "TeamL" + i + "@mail.com", "TLUser" + i, "P@ssw0rd", 3, 2, 2));
					//					}
				}
				return this.obj;
			}
			return Department;
		})();
		app.Department = Department;
	})(Team = app.Team || (Team = {}), User = app.User || (User = {}));
})(app || (app = {}));
