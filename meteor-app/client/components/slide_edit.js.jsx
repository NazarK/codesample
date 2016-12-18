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
    console.log("audio input events")
    window.addEventListener('audioinput', (evt) => {
      try {
          if (evt && evt.data) {
            let max = Math.max.apply(null,evt.data)
            max = Math.abs(max)
            console.log("data received: ", evt.data.length, " max:",max)
            this.totalReceivedData += evt.data.length;
            this.lastMax = max;

            this.audioDataBuffer = this.audioDataBuffer.concat(evt.data);
             
             
          }
      }
      catch (ex) {
          console.log("onAudioInputCapture ex: " + ex);
      }      
    }, false);
    
  }
  
  force_stop_rec() {
    if (window.audioinput && audioinput.isCapturing()) {
      this.stop()
    }    
  }
  
  componentWillUnmount() {
    this.force_stop_rec()
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
    this.force_stop_rec()
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
        $(".got-file").removeClass("got-file")
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
    $(this.refs.record_btn).addClass("got-file").hide()
    $(this.refs.stop_record_btn).addClass("got-file").show()    
    $(this.refs.progress).addClass("got-file")
    e.preventDefault()      
    try {
        if (window.audioinput) {
            if (!audioinput.isCapturing()) {
                // Start with default values and let the plugin handle conversion from raw data to web audio                
                this.captureCfg = {
                    sampleRate: 44100,
                    bufferSize: 4096,
                    channels: 1,
                    format: "PCM_16BIT",
                    audioSourceType: 0
                };
                                
                this.totalReceivedData = 0;
                this.audioDataBuffer = []
                audioinput.start(this.captureCfg);                

                console.log("Capturing audio!");
                
                this.progressUpdate = setInterval(() => {
                    $("#progress #time").html(Math.round(10*this.totalReceivedData/44100) / 10 + "s")
                    $("#progress #level").css({width: Math.round(100*this.lastMax)+"%"})
                }, 300);
                
            }  else {
                alert("Already capturing!");
            }
        }
    } catch (ex) {
        alert("startCapture exception: " + ex);
    }  
  }
  
  stop(e) {
    e && e.preventDefault()
    console.log("stop")
    $(this.refs.stop_record_btn).hide()
    $(this.refs.record_btn).show()

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
          audioinput.stop();
          clearInterval(this.progressUpdate)

          console.log("encoding WAV...");
          var encoder = new WavAudioEncoder(this.captureCfg.sampleRate,1)
          console.log("audionDataBuffer size: ",this.audioDataBuffer.length)
          encoder.encode([this.audioDataBuffer]);

          console.log("encoding WAV finished");

          var blob = encoder.finish("audio/wav");
          this.setState({recorded_audio_blob: blob})
          var url = URL.createObjectURL(blob);
          this.setState({recorded_audio_url: url})

      }      
    }
  }
  
  file_chosen(e) {
    $(e.currentTarget).parents(".btn").addClass("got-file")
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
                <span className="input-label short-label float-left vertical-middle-label">Image</span>
                <span className="btn btn-default btn-file float-left" style={{margin:"5px 10px 5px 0px"}}>                
                  Choose File <input type="file" onChange={this.file_chosen.bind(this)} ref="image" accept="image/*;capture=camera" name="slide[image]"/>
                </span>
              </label>
              <label className="item item-input item-stacked-label">
                <div className="input-label short-label float-left  vertical-middle-label">Audio</div>
                <span className="btn btn-default btn-file float-left" style={{margin:"5px 10px 5px 0px"}}>                
                  Choose File <input type="file" ref="audio" onChange={this.file_chosen.bind(this)}  name="slide[audio]" accept="audio/*;capture=microphone" style={{float:"left"}}/>
                </span>              
                <div ref="record_btn" className="btn btn-default float-left"  onClick={this.record.bind(this)} style={{width:"50px", textAlign: "center" }}>
                  <i  className='fa fa-microphone fa-2x' style={{color:"red" }}></i>
                </div>
                <div ref="stop_record_btn" className="btn btn-default float-left" onClick={this.stop.bind(this)} style={{width:"50px", textAlign: "center", display: "none"}}>
                  <i  className='fa fa-stop-circle-o fa-2x' style={{color:"red" }}></i>
                </div>
                <div className="float-left" ref="progress" id="progress" style={{marginLeft:"10px", height:"40px", position: "relative", textAlign: "center", display: "none"}}>
                  <div style={{width:"50px",height:"8px",position:"relative",border:"1px solid #aaa", marginTop: "10px"}}>
                    <div id="level" style={{backgroundColor:"red",width:"0%",position:"relative",height:"100%"}}></div>  
                  </div>                  
                  <div id="time"></div>
                </div>
              </label>
              <label className="item item-input item-stacked-label">
                <span className="input-label short-label float-left  vertical-middle-label" >Video</span>

                <span className="btn btn-default btn-file float-left" style={{margin:"5px 10px 5px 0px"}}>                
                  Choose File <input type="file"  ref="video" accept="video/*;capture=camera" onChange={this.file_chosen.bind(this)}  name="slide[video]"/>
                </span>
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
