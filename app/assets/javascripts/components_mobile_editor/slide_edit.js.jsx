class MobileSlideEdit extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  delete(event) {
    event.preventDefault()
    if(!confirm("Delete slide?"))
      return;
    $.ajax({
       url: `/slides/${this.props.params.id}`,
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
      $.get(`/tales/${this.props.params.tale_id}/slides/new.json`,(resp)=> {
        //console.log("new slide resp", resp)
        this.setState(resp)
      })
    } else {
      $.get(`/slides/${this.props.params.id || this.state.id}.json`,(resp)=> {
        //console.log("edit slide resp", resp)
        this.setState(resp)
      })
    }
  }

  captionChange(event) {
    this.setState({caption: event.target.value})
  }

  submit(event) {
    event.preventDefault()

    if(!this.state.id) {
      console.log("new record")
      $(event.target).ajaxSubmit({
          success: (resp)=>{
            console.log("response from ajax new record", resp);
            window.history.replaceState('','',`/slides/${resp.id}/edit`)
            console.log("setting state")
            this.setState(resp)
            this.componentWillMount()
            this.componentDidMount()
          },
          error: (resp)=>{
            console.log("new record error response:", resp)
            alert(resp.responseJSON.error)
          }

      })
    } else {
      $(event.target).ajaxSubmit({
          success: ()=>{
            console.log('form submitted');
            this.componentWillMount()
            this.componentDidMount()
          }
      })
    }
    return false;
  }

  back() {
    this.props.router.goBack()
  }
  render() {

    console.log("slide component render", this.state)

    var new_record = (this.state.id === null)
    console.log("new record: ", new_record)

    url = `/slides/${this.state.id}`

    if(new_record) {
      var url = `/tales/${this.props.params.tale_id}/slides`
    }


    return (
      <form noValidate="novalidate"  onSubmit={this.submit.bind(this)} encType="multipart/form-data" action={url} acceptCharset="UTF-8" method="post" className="slide-edit">
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
