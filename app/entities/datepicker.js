var app;
(function (app) {
	var DatePicker = (function () {
		function DatePicker(isDisabled, format, minDate, maxDate) {
			format = format == undefined ? "dd/MM/yyyy" : format;
			maxDate = maxDate == undefined ? new Date(2020, 5, 22) : maxDate;
			minDate = minDate == undefined ? null : minDate;
			return {
				dateFormat: format,
				dateOptions: {
					dateDisabled: isDisabled,
					formatYear: 'yy',
					maxDate: maxDate,
					minDate: minDate,
					startingDay: 1
				},
				popup: {
					opened: false
				},
				open: function () {
					this.popup.opened = true;
				},
				updateDatePicker: function (target, val) {
					console.log("datepicker :: updateDatePicker",target,val);
					target.dateOptions.minDate = val;
				}
			}
		}
		return DatePicker;
	})();
	app.DatePicker = DatePicker;
})(app || (app = {}));
