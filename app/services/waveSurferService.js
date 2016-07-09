var app;
(function (app) {
	var services;
	(function (services, User) {
		var serviceFn = (function () {
			/**
			 * @ngdoc service
			 * @name $mdWavesurferUtils
			 *
			 * @description
			 *
			 * Utility service for this directive, exposes method:
			 *  - getLength(url), which returns a promise for the length of the audio specified by URL
			 *
			 * ```js
			 * app.directive('myFancyDirective', function(mdWavesurferUtils) {
			 *   return {
			 *     restrict: 'e',
			 *     link: function(scope, el, attrs) {
			 *       mdWavesurferUtils(attrs.url)
			 *       .then(function(l){
			 *        scope.length = l;
			 *       }, function(){
			 *          someErrorhandler()
			 *       })
			 *       ;
			 *     }
			 *   };
			 * });
			 * ```
			 */
			function serviceFn($q, $document, $timeout) {
				return {
					getLength: function (object) {
						var deferred = $q.defer();
						var estimateLength = function (url) {
							var audio = $document[0].createElement('audio');
							audio.src = url;
							audio.addEventListener('loadeddata', function listener() {
								deferred.resolve(this.duration);
								audio.removeEventListener('loadeddata', listener);
								audio.src = 'data:audio/mpeg,0'; //destroy loading.
							});

							audio.addEventListener('error', function (e) {
								deferred.resolve(e.target.error);
							});
						};

						if (typeof object === 'string') {
							//this is a URL
							estimateLength(object);
						} else {
							$timeout(function () {
								deferred.reject(new DOMError("NotSupportedError", "Specified argument is not supported"));
							});
						}

						return deferred.promise;
					}
				};
			}
			return serviceFn;
		})();
		angular.module("IVRY-App").factory("waveSurferService", ['$q', '$document', '$timeout', serviceFn]);
	})(services = app.services || (services = {}), User = app.User || (User = {}));
})(app || (app = {}));
/**
 * @ngdoc filter
 * @name mdWavesurferTimeFormat
 *
 * Simple filter to convert value in seconds to MM:SS format
 *
 * @param Number duration in seconds
 */
angular.module("IVRY-App").filter('mdWavesurferTimeFormat', function () {
	return function (input) {
		if (!input) {
			return "00:00";
		}

		var minutes = Math.floor(input / 60);
		var seconds = Math.ceil(input) % 60;

		return (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
	};
});
