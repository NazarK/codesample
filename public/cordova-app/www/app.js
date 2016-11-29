var initUIEvents = function () {
    $("#startCapture").click(startCapture);
    $("#stopCapture").click(stopCapture);
};


function onAudioInputError(error) {
    alert("audioinputerror event recieved: " + JSON.stringify(error));
}


var startCapture = function () {
    try {
        if (window.audioinput) {

            if (!audioinput.isCapturing()) {
                // Start with default values and let the plugin handle conversion from raw data to web audio
                audioinput.start({
                    streamToWebAudio: true
                });

                // Connect the audioinput to the speaker(s) in order to hear the captured sound
                audioinput.connect(audioinput.getAudioContext().destination);

                consoleMessage("Capturing audio!");

                disableStartButton();
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
var stopCapture = function () {

    if (window.audioinput && audioinput.isCapturing()) {
        audioinput.stop();
        disableStopButton();
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


// Make it possible to run the demo on desktop
if (!window.cordova) {
    console.log("Running on desktop!");
    navigator.mediaDevices.enumerateDevices()
    .then(function(devices) {
      devices.forEach(function(device) {
        console.log(device.kind + ": " + device.label +
                    " id = " + device.deviceId);
      });
    })
    
    navigator.getUserMedia({audio:true},function(stream) {
      console.log("got mic stream",stream)
      var audio_context = new AudioContext;
      var mic_node = audio_context.createMediaStreamSource(stream)
      console.log(mic_node)
      
      window.audioRecorder = new WebAudioRecorder(mic_node,{workerDir: "./js/"})

      saveRecording = function(blob, enc) {
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
      };

      audioRecorder.onComplete = function(recorder, blob) {
        saveRecording(blob, recorder.encoding);
      };

    },function() {
      console.log("ERRROR get user media")
    })
    onDeviceReady();
}
else {
    // For Cordova apps
    document.addEventListener('deviceready', onDeviceReady, false);
}