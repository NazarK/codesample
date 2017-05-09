// navigator.getUserMedia shim
navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

// URL shim
window.URL = window.URL || window.webkitURL;

if (!navigator.requestAnimationFrame)
    navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;

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


var microphone = undefined,
    record_node = audioContext.createGain();

//play to speakers
//mixer.connect(audioContext.destination);

// obtaining microphone input
navigator.getUserMedia(
  { audio: true },
  function(stream) {
    microphone = audioContext.createMediaStreamSource(stream);
    microphone.connect(record_node);
  },
  function(error) {
    $microphone[0].checked = false;
    audioRecorder.onError(audioRecorder, "Could not get audio input.");
  }
)

// audio recorder object
var audioRecorder = new WebAudioRecorder(record_node, {
  workerDir: '/audio-rec-lib/',
  onEncoderLoading: function(recorder, encoding) {
    console.log("Loading " + encoding.toUpperCase() + " encoder ...")
  },
  onEncoderLoaded: function() {
    console.log("Encoder loaded")
  }
});



audioRecorder.onEncodingProgress = function(recorder, progress) {
  console.log("encoding progress", progress)
}

var RECORDED_BLOB;
audioRecorder.onComplete = function(recorder, blob) {
  RECORDED_BLOB = blob;
  console.log("complete")
  buildAudioControl(blob, recorder.encoding);
}

audioRecorder.onError = function(recorder, message) {
  alert("audioRecorder error: "+message)
}

function buildAudioControl(blob, encoding) {
  var url = URL.createObjectURL(blob),
      html = "<audio controls src='" + url + "'></audio> "
  $("#rec_list").html($(html));
}

$(function() {

  var peak_canvas = document.getElementById("audio_peak");
  peak_context = peak_canvas.getContext('2d')
  peak_context.fillStyle = "red"

  audioRecorder.onAudioPeak = function(peak) {
    peak_context.clearRect(0,0,100,10)
    peak_context.fillRect(0,0,peak*100,10)
  }

})


///RECORDER
var INFO_UPDATE;

function updateInfo() {
  var sec = audioRecorder.recordingTime() | 0;
  $("#info").html(sec+" sec")
}

//PUBLIC FUNCTIONS
function startRecording() {
  console.log("startRecording")
  INFO_UPDATE = window.setInterval(updateInfo,200)
  audioRecorder.setOptions({
    encodeAfterRecord: true,
    progressInterval: 1000,
    ogg: { quality: 1 },
    mp3: { bitRate: 192 }
  });
  audioRecorder.startRecording();
  $("#stop").show()
  $("#rec").hide()
}

function stopRecording() {
  $("#rec").show()
  $("#stop").hide()
  $("#done").show()
  clearInterval(INFO_UPDATE)
  audioRecorder.finishRecording()
}



function save() {
  event.preventDefault()
  if(audioRecorder.isRecording()) {
    stopRecording()
  }

  form = $("form")
  var formData = new FormData(form[0])

  formData.append("slide[audio]",RECORDED_BLOB,"audio.mp3")

  $.ajax({
      url: form.attr("action"),
      data: formData,
      type: 'POST',
      contentType: false,
      processData: false,
  }).done( (resp)=>{
      console.log("submitted",resp)
  })
}
