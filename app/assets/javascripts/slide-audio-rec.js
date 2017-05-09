// navigator.getUserMedia shim
navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

// URL shim
window.URL = window.URL || window.webkitURL;

// encoding selector + encoding options
var OGG_QUALITY = [-0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    OGG_KBPS = [45, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 500],
    MP3_BIT_RATE = [64, 80, 96, 112, 128, 160, 192, 224, 256, 320],
    ENCODING_OPTION = {
      wav: {
        label: '',
        hidden: true,
        max: 1,
        text: function(val) { return ''; }
      },
      ogg: {
        label: 'Quality',
        hidden: false,
        max: OGG_QUALITY.length - 1,
        text: function(val) {
          return OGG_QUALITY[val].toFixed(1) +
                 " (~" + OGG_KBPS[val] + "kbps)";
        }
      },
      mp3: {
        label: 'Bit rate',
        hidden: false,
        max: MP3_BIT_RATE.length - 1,
        text: function(val) { return "" + MP3_BIT_RATE[val] + "kbps"; }
      }
    },
    optionValue = {
      wav: null,
      ogg: 6,
      mp3: 5
    };

// audio context + .createScriptProcessor shim
var audioContext = new AudioContext;
if (audioContext.createScriptProcessor == null)
  audioContext.createScriptProcessor = audioContext.createJavaScriptNode;


var microphone = undefined,     // obtained by user click
    microphoneLevel = audioContext.createGain(),
    mixer = audioContext.createGain();
microphoneLevel.gain.value = 0;
microphoneLevel.connect(mixer);
mixer.connect(audioContext.destination);

// audio recorder object
var audioRecorder = new WebAudioRecorder(mixer, {
  workerDir: '/audio-rec-lib/',
  onEncoderLoading: function(recorder, encoding) {
    console.log("Loading " + encoding.toUpperCase() + " encoder ...")
  },
  onEncoderLoaded: function() {
    console.log("Encoder loaded")
  }
});


// obtaining microphone input
microphone_connect = function() {
  if (microphone == null)
    navigator.getUserMedia({ audio: true },
      function(stream) {
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(microphoneLevel);
      },
      function(error) {
        $microphone[0].checked = false;
        audioRecorder.onError(audioRecorder, "Could not get audio input.");
      });
};

microphone_connect()

function startRecording() {
  console.log("startRecording")
  audioRecorder.setOptions({
    encodeAfterRecord: true,
    progressInterval: 1000,
    ogg: { quality: 1 },
    mp3: { bitRate: 192 }
  });
  audioRecorder.startRecording();
}


audioRecorder.onEncodingProgress = function(recorder, progress) {
  console.log("encoding progress", progress)
}

audioRecorder.onComplete = function(recorder, blob) {
  console.log("complete")
  saveRecording(blob, recorder.encoding);
}

audioRecorder.onError = function(recorder, message) {
  alert("audioRecorder error: "+message)
}


// save/delete recording
function saveRecording(blob, encoding) {
  var time = new Date(),
      url = URL.createObjectURL(blob),
      html = "<p recording='" + url + "'>" +
             "<audio controls src='" + url + "'></audio> " +
             " (" + encoding.toUpperCase() + ") " +
             time +
             " <a class='btn btn-default' href='" + url +
             "' download='recording." +
             encoding +
             "'>Save...</a> " +
             "<button class='btn btn-danger' recording='" +
             url +
             "'>Delete</button>" +
             "</p>";
  $("#rec_list").prepend($(html));
}


function updateDateTime() {
  var sec = audioRecorder.recordingTime() | 0;
  console.log("recording: "+sec)
};

//window.setInterval(updateDateTime, 200);



function stopRecording() {
  audioRecorder.finishRecording()
}
