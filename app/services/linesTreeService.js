var app;
(function (app) {
	var services;
	(function (services) {
		var serviceFn = (function ($rootScope, $http, store, API_BASE_URL) {
			function serviceFn($rootScope, $http, store, API_BASE_URL) {
				return {
					linesTreeObj: [
						{
							title: 'Case Number 1',
							checked: true,
							childs: [
								{
									title: 'Identity Number 11',
									checked: true,
									childs: [
										{
											title: "Line Number 111",
											checked: true,
											id: 1206,
											status: {
												text: 'OnLine',
												state: 1
											},
											isRecordCalls: true,
											isVIP: true
								},
										{
											title: "Line Number 112",
											checked: true,
											id: 1205,
											status: {
												text: 'OffLine',
												state: 0
											}
								},
										{
											title: "Line Number 113",
											checked: true,
											id: 1204,
											status: {
												text: 'Scheduled',
												state: 2
											}
								}
							]
						},
								{
									title: 'Identity Number 12',
									checked: true,
									childs: [
										{
											title: "Line Number 121",
											number: "01009383977",
											checked: true,
											id: 1201,
											status: {
												text: 'Scheduled',
												state: 2
											}
								},
										{
											title: "Line Number 122",
											checked: true,
											id: 1202,
											status: {
												text: 'Scheduled',
												state: 2
											}
								},
										{
											title: "Line Number 123",
											checked: true,
											id: 1203
								}
							]
						}
					]
				},
						{
							title: 'Case Number 2',
							checked: false,
							childs: [
								{
									title: 'Identity Number 21',
									checked: false,
									childs: [
										{
											title: "Line Number 211",
											checked: false,
											id: 1207
								},
										{
											title: "Line Number 212",
											checked: false,
											id: 1208
								},
										{
											title: "Line Number 213",
											checked: false,
											id: 1209
								}
							]
						}
					]
				},
						{
							title: "Case 3",
							checked: false
				},
						{
							title: "Case 4",
							checked: false,
							childs: [
								{
									title: "Identity 41",
									checked: false
						}
					]
				},
						{
							title: "Case 5",
							checked: false,
							childs: [
								{
									title: "Identity 51",
									checked: false,
									childs: [
										{
											title: "Line 511",
											checked: false,
											id: 1210
								}
							]
						}
					]
				}
            ],
					get: function () {
						return $http.get(API_BASE_URL + "/target-case/tree", {
							headers: {
								'X-Access-Token': store.get("token")
							}
						}).then(function (response) {
							console.info(response);
							return response.data.data;
						});
					}
				};
			}
			return serviceFn;
		})();
		angular.module("IVRY-App").factory("linesTreeService", serviceFn);
	})(services = app.services || (services = {}));
})(app || (app = {}));
