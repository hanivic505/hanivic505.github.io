var app;
(function (app) {
	var mainApp = angular.module("IVRY-App");

	mainApp.filter("lines", function () {
		return function (value, selected) {
			var filtered = [];
			angular.forEach(selected, function (val, key) {
				angular.forEach(value, function (iVal, iKey) {
					if (iVal.lineId == key)
						if (val) {
							filtered.push(iVal);
						}
				});
			});
			return filtered;
		};
	});
	mainApp.filter("columnsFilter", function ($rootScope, $timeout) {
		return function (value, filterBy) {
			//			console.log("columnsFilter")
			angular.forEach(value, function (val, key) {
				if (!angular.isUndefined(filterBy)) {
					if (filterBy.toLowerCase() !== "" && val.title.toLowerCase().indexOf(filterBy.toLowerCase()) !== -1) {
						val["picked"] = true;
						$rootScope.$broadcast("columnsFiltered");
					} else
						val["picked"] = false;
				}
			});
			//			var promise = $timeout(function () {
			//			}, 2000);
			return value;
		};
	});
	mainApp.filter('wavesurferTimeFormat', function () {
		return function (input) {
			if (!input) {
				return "00:00";
			}

			var minutes = Math.floor(input / 60);
			var seconds = Math.ceil(input) % 60;

			return (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
		};
	});
})(app || (app == {}));
