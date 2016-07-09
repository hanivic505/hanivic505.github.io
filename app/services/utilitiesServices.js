var app;
(function (app) {
	var services;
	(function (services) {
		var serviceFn = (function () {
			function serviceFn() {
				return {
					getIcon: function (param) {
						var obj = {};
						switch (param) {
						case false:
							obj.icon = "fa-unlock fg-red";
							obj.title = "Unlocked";
							break;
						case true:
							obj.icon = "fa-lock fg-green";
							obj.title = "Locked";
							break;
						case 10:
							obj.icon = "fa-circle-o";
							obj.title = "UnMarked";
							break;
						case 11:
							obj.icon = "fa-exclamation fg-red";
							obj.title = "Important";
							break;
						case 12:
							obj.icon = "fa-search";
							obj.title = "Revise Later";
							break;
						case 13:
							obj.icon = "fa-check fg-green";
							obj.title = "Reviewed";
							break;
						case 14:
							obj.icon = "fa-times fg-red";
							obj.title = "Irrelevent";
							break;
						default:
							break;
						}
						return obj;
					},
					getTimeDiff: function (end, start) {
						var hourDiff = end - start;
						var diffHrs = Math.floor((hourDiff % 86400000) / 3600000);
						var diffMins = Math.floor(((hourDiff % 86400000) % 3600000) / 60000);
						//diffMins = diffMins + (diffHrs * 60);

						//var timeDiff=end.getTime()-start.getTime();
						return diffHrs + ":" + diffMins;
					},
					getLineName: function (value) {
						var idx = 0;
						/* jshint node: true */
						angular.forEach(value, function (val, key) {
							if (val) {
								idx = idx + 1;
							}
						});
						return idx;
					},
					maxSize: 5,
					currentPage: 1,
					numPerPage: 10,
					dbList: [],
					paginate: function (value) {
						var _this=this;
						var begin, end, index;
						begin = (_this.currentPage - 1) * _this.numPerPage;
						end = begin + _this.numPerPage;
						index = _this.dbList.indexOf(value);
						return (begin <= index && index < end);
					},
					setPage: function (pageNo) {
						this.currentPage = pageNo;
					}
				}
			}
			return serviceFn;
		})();
		angular.module("IVRY-App").factory("utilitiesServices", [serviceFn]);
	})(services = app.services || (services = {}));
})(app || (app = {}));
