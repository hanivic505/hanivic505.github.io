angular.module("IVRY-App").component("player", {
	templateUrl: "/app/components/player-full.html",
	controller: playerFullComponent,
	bindings: {
		data: "="
	}
});

function playerFullComponent($scope, $element, $attrs) {
	var ctrl = this;

	if (nVal !== undefined || nVal !== null) {
		try {
			_this.wavesurferMini.stop();
		} catch (ex) {}
		try {
			_this.wavesurfer.destroy();
		} catch (ex) {}
		if (nVal && nVal.audio) {
			_this.wavesurfer = WaveSurfer.create({
				container: '#waveform',
				waveColor: 'violet',
				progressColor: 'purple',
				splitChannels: true,
				height: 64
			});
			//this.wavesurfer.load('/app/audio/g711-ulaw-25s.wav');
			//                    _this.wavesurfer.load("/assets/libs/wavesurfer.js-master/example/split-channels/stereo.mp3");
			_this.wavesurfer.load(nVal.audio);
			_this.wavesurfer.on('ready', function () {
				// Enable creating regions by dragging
				_this.wavesurfer.enableDragSelection();
				var timeline = Object.create(WaveSurfer.Timeline);

				timeline.init({
					wavesurfer: _this.wavesurfer,
					container: '#waveform-timeline'
				});
				$scope.duration = _this.wavesurfer.getDuration();
				$scope.$apply();
			});
			_this.wavesurfer.on('play', function () {
				try {
					_this.wavesurferMini.stop();
				} catch (ex) {}
				$scope.paused = false;
			});

			_this.wavesurfer.on('pause', function () {
				$scope.paused = true;
			});

			_this.wavesurfer.on('finish', function () {
				$scope.paused = true;
				_this.wavesurfer.seekTo(0);
				$scope.$apply();
			});
			_this.wavesurfer.on("audioprocess", function () {
				$scope.currentTime = _this.wavesurfer.getCurrentTime();
				$scope.$apply();
			});
		}
	}

	$scope.play = function (obj) {
		if (!_this.wavesurferMini) {
			return;
		}
		try {
			_this.wavesurfer.stop();
		} catch (ex) {}
		//				try {
		//					_this.wavesurferMini.destroy();
		//				} catch (ex) {}

		_this.wavesurferMini = WaveSurfer.create({
			container: '#mini-player',
			waveColor: 'gray',
			progressColor: 'white',
			splitChannels: false,
			height: 32
		});
		_this.wavesurferMini.on('ready', function () {
			_this.wavesurferMini.play();
			$scope.$apply();
		});

		_this.wavesurferMini.on('play', function () {
			$scope.miniPaused = false;
			$scope.miniIsPlaying = obj.caseName + ", " + obj.identityName + ", " + obj.lineName + " : " + $filter("date")(obj.startDate, "dd/MM/yyyy HH:mm");
			$scope.$apply();
		});

		_this.wavesurferMini.on('pause', function () {
			$scope.miniPaused = true;
			$scope.$apply();
		});
		_this.wavesurferMini.load(obj.audio);
	};
}
