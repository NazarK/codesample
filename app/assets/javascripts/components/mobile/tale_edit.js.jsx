class MobileTaleEdit extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {slides: []}
  }
  
  componentWillMount() {
    $.get(`/tales/${this.props.id}.json`,(resp)=> {
      console.log(resp)
      this.setState(resp)
    })
  }
  
  nameChange(event) {
    this.setState({name: event.target.value})
  }
  
  addSlide(event) {
    $.ajax({
      type: "POST",
      url: `/tales/${this.props.id}/slides`,
      data: { slide: {} },
      dataType: "JSON",
      error: function(resp) {
        console.log("error",resp)
      },
      success: function(resp) {
        console.log("success",resp)
      }
    });    
    
  }
  
  render() {
    
    var url = `/tales/${this.props.id}`
    
    return (
      <form noValidate="novalidate" encType="multipart/form-data" action={url} acceptCharset="UTF-8" method="post" className="tale-edit">
        { !this.props.new_record && (
          <input type="hidden" name="_method" value="patch" />
        )}
        
        <div className="bar bar-header bar-positive">
          <a href="/tales" className="button button-positive button-big">
            <i className="fa fa-arrow-left"></i>
          </a>
          <div className="title title-bold">tale</div>
            { !this.props.new_record && (
              <a href={url} data-method="delete" data-confirm="Delete tale?" className="button button-assertive button-big">
                delete
              </a>                
            )}          
        </div>
        
        <div className="content has-header">
          <div className="list">
            <label className="item item-input item-stacked-label">
              <span className="input-label">Title</span>
              <input type="text" name="tale[name]" value={this.state.name || ''} onChange={this.nameChange.bind(this)}/>
            </label>
            <label className="item item-input item-stacked-label">
              <span className="input-label">Background Audio</span>
              { this.state.bg_audio_url && (
                <div>
                  <audio controls src={this.state.bg_audio_url} />
                </div>  
              )}
              <input type="file" name="tale[audio]" />
            </label>
            
            <div className="padding">
              <button type="submit" className="button button-block button-positive">
                Save Tale Properties
              </button>              
            </div>

            <li className="item item-button-right">
              Slides
              <a href={"/tales/"+this.props.id+"/slides/new"} className="button button-balanced button-big" onClick={this.addSlide.bind(this)}>
                Add Slide
              </a>              
            </li>
            
            {
              this.state.slides.map((slide,i) => {
                return <a href={"/slides/"+slide.id+"/edit"} className="item item-thumbnail-left" key={slide.id}>
                    { slide.image_thumb && (
                        <img className="slide-thumb" src={slide.image_thumb} />
                    )}
                    
                    { slide.video_url && (
                        <video className="slide-thumb" src={slide.video_url} />
                    )}
                  {i+1}.&nbsp;
                  {slide.caption}
                </a>            
              })
            }

          </div>  


        </div>

        
      </form>
    )
  }
}