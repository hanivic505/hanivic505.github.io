var app;
(function (app) {
	var TimePicker = (function () {
		function TimePicker(isDisabled, format, min, max) {
			format = format == undefined ? "dd/MM/yyyy" : format;
			maxDate = maxDate == undefined ? new Date(2020, 5, 22) : max;
			minDate = minDate == undefined ? null : min;
			return {
				dateFormat: format,
				dateOptions: {
					dateDisabled: isDisabled,
					formatYear: 'yy',
					maxDate: max,
					minDate: min,
					startingDay: 1
				}
			}
		}
		return TimePicker;
	})();
	app.TimePicker = TimePicker;
})(app || (app = {}));
