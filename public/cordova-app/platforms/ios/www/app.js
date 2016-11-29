var initUIEvents = function () {
    $("#startCapture").click(startCapture);
    $("#stopCapture").click(stopCapture);
};


function onAudioInputError(error) {
    alert("audioinputerror event recieved: " + JSON.stringify(error));
}


var startRecording = function () {
  console.log("starting")
    try {
        if (window.audioinput) {

            if (!audioinput.isCapturing()) {
                // Start with default values and let the plugin handle conversion from raw data to web audio
                
                audioinput.start({
                    streamToWebAudio: true
                });

                window.audioRecorder = new WebAudioRecorder(audioinput,{workerDir: "./js/"})

                audioRecorder.onComplete = onFinishRecord
                audioRecorder.startRecording()
                consoleMessage("Capturing audio!");
            }
            else {
                alert("Already capturing!");
            }
        }
    }
    catch (ex) {
        alert("startCapture exception: " + ex);
    }
};


/**
 * Stop Audio capture
 */
var stopRecording = function () {

    if (window.audioinput && audioinput.isCapturing()) {
        audioRecorder.finishRecording()
        audioinput.stop();
    }

    consoleMessage("Stopped!");
};


/**
 * When cordova fires the deviceready event, we initialize everything needed for audio input.
 */
var onDeviceReady = function () {
    console.log("onDeviceReady")
    if (window.cordova && window.audioinput) {
        initUIEvents();

        window.addEventListener('audioinputerror', onAudioInputError, false);

        consoleMessage("Use 'Start Capture' to begin...");
    }
    else {
        consoleMessage("cordova-plugin-audioinput not found!");
        disableAllButtons();
    }
};


onFinishRecord = function(recorder, blob) {
  var enc = recorder.encoding
  console.log("saving recording")
  var html, time, url;
  time = new Date();
  url = URL.createObjectURL(blob);
  console.log(url)
  html = ("<p recording='" + url + "'>") + 
  ("<audio controls src='" + url + "'></audio> ") + 
  ("(" + enc + ") " + (time.toString()) + " ") + 
  ("<a class='btn btn-default' href='" + url + "' download='recording." + enc + "'>") + "Save..." + "</a> " 
  + ("<button class='btn btn-danger' recording='" + url + "'>Delete</button>");
  "</p>";
  $("#res").append($(html));
}

// Make it possible to run the demo on desktop
if (!window.cordova) {
    console.log("Running on desktop!");

    navigator.getUserMedia({audio:true},function(stream) {
      console.log("got audio stream",stream)
      var audio_context = new AudioContext;
      var mic_node = audio_context.createMediaStreamSource(stream)
      console.log(mic_node)
      
      window.audioRecorder = new WebAudioRecorder(mic_node,{workerDir: "./js/"})

      audioRecorder.onComplete = onFinishRecord

    },function() {
      console.log("ERRROR get user media")
    })
} else {
    // For Cordova apps
    document.addEventListener('deviceready', onDeviceReady, false);
}