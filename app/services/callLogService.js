var app;
(function (app) {
	var services;
	var CallsLogItem;
	(function (services,CallsLogItem) {
		var serviceFn = (function () {
			function serviceFn() {
				this.callsLog = [];
				//Dummy database creation
				var i, j, k,idx=0;
				for (i = 0; i < 3; i = i + 1) {
					for (j = 0; j < 3; j = j + 1) {
						for (k = 0; k < 3; k = k + 1) {
							this.callsLog.push(new CallsLogItem("New Case Name" + (i + 1), "New Identity Name" + (((i + 1) * (j + 1))), "New Line Name" + idx, 1200 + i + j + k, new Date("5/28/2016 12:09"), new Date("5/28/2016 12:41"), 23, 13, false, "", "/assets/libs/wavesurfer.js-master/example/split-channels/stereo.mp3"));
							idx = idx + 1;
						}
					}
				}
				return this.callsLog;
			}
			return serviceFn;
		})();
		angular.module("IVRY-App").factory("callLogService", serviceFn);
	})(services = app.services || (services = {}),CallsLogItem=app.CallsLogItem||(CallsLogItem={}));
})(app || (app = {}));
