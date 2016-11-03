class MobileSlideEdit extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {}
  }
  
  componentWillMount() {
    $.get(`/slides/${this.props.id}.json`,(resp)=> {
      console.log(resp)
      this.setState(resp)
    })
  }
  
  captionChange(event) {
    this.setState({caption: event.target.value})
  }
  
  render() {
    return (
      <div>
        <div className="bar bar-header bar-positive">
          <a href={"/tales/"+this.state.tale_id+"/edit"} className="button button-positive button-big">
            <i className="fa fa-arrow-left"></i>
          </a>
          <div className="title title-bold">slide</div>
        </div>
        
        <div className="content has-header">
          <div className="list">
            <label className="item item-input item-stacked-label">
              <span className="input-label">Caption</span>
              <textarea rows="5" onChange={this.captionChange.bind(this)} value={this.state.caption || ''}></textarea>
            </label>
            <label className="item item-input item-stacked-label">
              <span className="input-label">Image</span>
              <input type="file" />
            </label>
            <label className="item item-input item-stacked-label">
              <span className="input-label">Audio</span>
              <input type="file" />
            </label>
            <label className="item item-input item-stacked-label">
              <span className="input-label">Video</span>
              <input type="file" />
            </label>
            <label className="item item-input item-stacked-label">
              <span className="input-label">Mute tale audio</span>
              <input type="checkbox" />
            </label>
          </div>  
        </div>
        
        
        <div className="bar bar-footer bar-positive item-button-left">
          <div className="title">Save Changes</div>
        </div>        
        
      </div>
    )
  }
}