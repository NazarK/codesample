import React from 'react'
import MobileSlidePreview from './slide_preview.js.jsx'


export default class MobileSlideEdit extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  delete(event) {
    event.preventDefault()
    if(!confirm("Delete slide?"))
      return;
    $.ajax({
       url: `${DATA_HOST}/slides/${this.props.params.id}`,
       type: 'DELETE',
       success: function(response) {
         console.log('deleted')
         window.history.back();
       }
    })

  }

  componentDidMount() {
    console.log("slide component did mount")
    this.refs.audio.value=''
    this.refs.video.value=''
    this.refs.image.value=''
  }

  componentWillMount() {
    console.log("slide component will mount")
    if(!this.state.id && this.props.params.tale_id) {
      $.get(`${DATA_HOST}/tales/${this.props.params.tale_id}/slides/new.json`,(resp)=> {
        //console.log("new slide resp", resp)
        this.setState(resp)
      })
    } else {
      $.get(`${DATA_HOST}/slides/${this.props.params.id || this.state.id}.json`,(resp)=> {
        //console.log("edit slide resp", resp)
        this.setState(resp)
      })
    }
  }

  captionChange(event) {
    this.setState({caption: event.target.value})
  }

  form_submit(event) {
    event.preventDefault()
    var new_record = !this.state.id

    form = $(event.currentTarget)    
    var formData = new FormData(form[0])
    formData.append("user_email", localStorage['user_email'])
    formData.append("user_token", localStorage['user_token'])

    if(this.state.recorded_audio_blob) {
      console.log("got recorded audio blob, adding to form data")
      formData.append("slide[audio]",this.state.recorded_audio_blob,"audio.wav")
    }
        
    $.ajax({
        url: form.attr("action"),
        data: formData,
        type: 'POST',
        contentType: false,
        processData: false,
    }).done( (resp)=>{
        console.log("submitted",resp)
        this.setState({recorded_audio_blob: null})
        this.setState(resp)        
        //WAS NEW RECORD
        if(new_record)
          window.history.replaceState('','',`/m/slides/${resp.id}/edit`)
    })
    
    return false;
  }

  back() {
    this.props.router.goBack()
  }
  
  record(e) {
    console.log("record")
    e.preventDefault()      
    try {
        if (window.audioinput) {
            if (!audioinput.isCapturing()) {
                // Start with default values and let the plugin handle conversion from raw data to web audio                
                audioinput.start({ streamToWebAudio: true });                
                window.audioRecorder = new WebAudioRecorder(audioinput,{workerDir: "/"})
                console.log("created window.audioRecorder", window.audioRecorder)

                window.audioRecorder.onComplete = (recorder, blob) => {
                  console.log("onFinishRecord", recorder, blob)
                  this.setState({recorded_audio_blob: blob})
                  var url = URL.createObjectURL(blob);
                  this.setState({recorded_audio_url: url})
                }

                window.audioRecorder.startRecording()
                console.log("Capturing audio!");
            }  else {
                alert("Already capturing!");
            }
        }
    } catch (ex) {
        alert("startCapture exception: " + ex);
    }  
  }
  
  stop(e) {
    e.preventDefault()
    console.log("stop")

    //desktop env
    if(!window.cordova) {
      var debug = {hello: "world"};
      var blob = new Blob([JSON.stringify(debug, null, 2)], {type : 'application/wav'});
      console.log("blob recorded")
      this.setState({recorded_audio_blob: blob})
      var url = URL.createObjectURL(blob);
      this.setState({recorded_audio_url: url})
    //device env  
    } else {
      if (window.audioinput && audioinput.isCapturing()) {
          audioRecorder.finishRecording()
          audioinput.stop();
      }      
    }
  }
  
  render() {

    console.log("slide component render", this.state)

    var new_record = (this.state.id === null)
    console.log("new record: ", new_record)

    url = `${DATA_HOST}/slides/${this.state.id}.json`

    if(new_record) {
      var url = `${DATA_HOST}/tales/${this.props.params.tale_id}/slides.json`
    }


    return (
      <form noValidate="novalidate"  onSubmit={this.form_submit.bind(this)} encType="multipart/form-data" action={url} acceptCharset="UTF-8" method="post" className="slide-edit">
        { !new_record && (
          <input type="hidden" name="_method" value="patch" />
        )}

        <div className="bar bar-header bar-positive">
          <div onClick={this.back.bind(this)} className="button button-positive button-big click-sound">
            <i className="fa fa-arrow-left"></i>
          </div>
          <div className="title title-bold">slide</div>
          { !new_record && (
            <div onClick={this.delete.bind(this)} className="delete button button-clear button-big">
              <i className="fa-2x ion-android-delete"></i>
            </div>
          )}
        </div>

          <div className="content has-header has-footer">
            <div className="list">
              {  this.props.flash && (
                  <div className="button button-full button-assertive flash_messages">
                    {this.props.flash}
                  </div>
              )}
              <label className="item item-input item-stacked-label">
                <span className="input-label">Caption</span>
                <textarea name="slide[caption]" rows="5" onChange={this.captionChange.bind(this)} value={this.state.caption || ''}></textarea>
              </label>
              <label className="item">
                <MobileSlidePreview slide={this.state} />
              </label>
              <label className="item item-input item-stacked-label">
                <span className="input-label">Image</span>
                <input type="file" ref="image" accept="image/*;capture=camera" name="slide[image]"/>
              </label>
              <label className="item item-input item-stacked-label">
                <span className="input-label">Audio</span>
                <input type="file" ref="audio" name="slide[audio]" accept="audio/*;capture=microphone" />
                <button ref="record" onClick={this.record.bind(this)}>Record</button>
                <button ref="stop" onClick={this.stop.bind(this)}>Stop</button>
              
              </label>
              <label className="item item-input item-stacked-label">
                <span className="input-label">Video</span>

                <input type="file"  ref="video" accept="video/*;capture=camera" name="slide[video]"/>
              </label>
              <div className="item" style={{opacity:0}}></div>
              <div className="item" style={{opacity:0}}></div>
              <div className="item" style={{opacity:0}}></div>
              <div className="item" style={{opacity:0}}></div>

            </div>

          </div>


          <button type="submit" className="bar bar-footer bar-positive item-button-left">
            <div className="title click-sound">Save Slide</div>
          </button>

      </form>
    )
  }
}
