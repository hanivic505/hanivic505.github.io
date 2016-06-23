var app;
(function (app) {
	var Target;
	(function (Target) {
		var Case = (function () {
			function Case(caseName, comment) {
				return {
					caseName: caseName,
					comment: comment
				}
			}
			return Case;
		})();
		var Identity = (function () {
			function Identity(identityName, comment) {
				return {
					identityName: identityName,
					comment: comment
				}
			}
			return Identity;
		})();
		var Line = (function () {
			function Line(lineNumber, lineType, isRecordCalls, recordingTime, recordingPeriod, isVip, comment) {
				return {
					lineNumber: lineNumber,
					lineType: lineType,
					isRecordCalls: isRecordCalls,
					recordingTime: recordingTime,
					recordingPeriod: recordingPeriod,
					isVip: isVip,
					comment: comment
				}
			}
			return Line;
		})();
		Target.Case = Case;
		Target.Identity = Identity;
		Target.Line = Line;
	})(Target = app.Target || (Target = {}));
	app.Target = Target;
})(app || (app = {}));
