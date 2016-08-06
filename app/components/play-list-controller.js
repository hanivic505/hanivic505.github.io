angular.module("IVRY-App").controller('PlaylistController', function ($scope) {

	var activeUrl = null;

	$scope.paused = true;

	$scope.$on('wavesurferInit', function (e, wavesurfer) {
		console.info("wavesurferInit");
		$scope.wavesurfer = wavesurfer;

		$scope.wavesurfer.on('play', function () {
			$scope.paused = false;
		});

		$scope.wavesurfer.on('pause', function () {
			$scope.paused = true;
		});

		$scope.wavesurfer.on('finish', function () {
			$scope.paused = true;
			$scope.wavesurfer.seekTo(0);
			$scope.$apply();
		});

		$scope.wavesurfer.on('ready', function () {
			$scope.duration = $scope.wavesurfer.getDuration();
			$scope.$apply();
		});

		$scope.wavesurfer.on("audioprocess", function () {
			$scope.currentTime = $scope.wavesurfer.getCurrentTime();
			$scope.$apply();
		});
	});

	$scope.play = function (url) {
		if (!$scope.wavesurfer) {
			return;
		}

		activeUrl = url;

		$scope.wavesurfer.once('ready', function () {
			$scope.wavesurfer.play();
			$scope.$apply();
		});

		$scope.wavesurfer.load(activeUrl);
	};

	$scope.isPlaying = function (url) {
		return url == activeUrl;
	};
});
