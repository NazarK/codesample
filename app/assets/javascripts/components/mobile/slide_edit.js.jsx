class MobileSlideEdit extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {}
  }
  
  componentWillMount() {
    if(this.props.id) {
      $.get(`/slides/${this.props.id}.json`,(resp)=> {
        console.log(resp)
        this.setState(resp)
      })
    } else {
      $.get(`/tales/${this.props.tale_id}/slides/new.json`,(resp)=> {
        console.log(resp)
        this.setState(resp)
      })
    }
  }
  
  captionChange(event) {
    this.setState({caption: event.target.value})
  }
  
  post() {
    if(this.props.id) {
      $.ajax({
        type: "POST",
        url: `/slides.json`,
        data: { slide: this.state },
        error: function(resp) {
          console.log("error",resp)
        },
        success: function(resp) {
          console.log("success",resp)
        }
      });    
    } else {
      $.ajax({
        type: "POST",
        url: `/tales/${this.props.tale_id}/slides.json`,
        data: { slide: this.state },
        error: function(resp) {
          console.log("error",resp.responseJSON)
        },
        success: function(resp) {
          console.log("success",resp)
        }  
      });
    }
    
    
  }
  
  render() {
    
    url = `/slides/${this.props.id}`
    if(this.props.new_record) {
      var url = `/tales/${this.props.tale_id}/slides`
    }
    
    return (
      <form noValidate="novalidate" encType="multipart/form-data" action={url} acceptCharset="UTF-8" method="post" className="slide-edit">
        { !this.props.new_record && (
          <input type="hidden" name="_method" value="patch" />
        )}

        <div className="bar bar-header bar-positive">
          <a href={"/tales/"+this.state.tale_id+"/edit"} className="button button-positive button-big">
            <i className="fa fa-arrow-left"></i>
          </a>
          <div className="title title-bold">slide</div>
          { !this.props.new_record && (
            <a href={url} data-method="delete"  data-confirm="Delete slide?" className="button button-assertive button-big">
              delete
            </a>          
          )}
        </div>

          <div className="content has-header">
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
                <input type="file" accept="image/*;capture=camera" name="slide[image]"/>
              </label>
              <label className="item item-input item-stacked-label">
                <span className="input-label">Audio</span>
                <input type="file" name="slide[audio]"/>
              </label>
              <label className="item item-input item-stacked-label">
                <span className="input-label">Video</span>

                <input type="file"  accept="video/*;capture=camera" name="slide[video]"/>
              </label>
            </div>  
          </div>
          
          
          <button type="submit" className="bar bar-footer bar-positive item-button-left">
            <div className="title click-sound">Save Slide</div>
          </button>  
          
      </form>  
    )
  }
}
