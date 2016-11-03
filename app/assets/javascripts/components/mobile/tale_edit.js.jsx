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
  
  render() {
    return (
      <div>
        <div className="bar bar-header bar-positive">
          <a href="/tales" className="button button-positive button-big">
            <i className="fa fa-arrow-left"></i>
          </a>
          <div className="title title-bold">tale</div>
          <button className="button button-balanced button-big">
            Add Slide
          </button>
        </div>
        
        <div className="content has-header">
          <div className="list">
            <label className="item item-input item-stacked-label">
              <span className="input-label">Name</span>
              <input type="text" value={this.state.name || ''} onChange={this.nameChange.bind(this)}/>
            </label>
            <label className="item item-input item-stacked-label">
              <span className="input-label">Captions Font</span>
              <input type="text" value={this.state.name || ''} onChange={this.nameChange.bind(this)}/>
            </label>
            <label className="item item-input item-stacked-label">
              <span className="input-label">Background Audio</span>
              <input type="file"/>
            </label>
            <label className="item item-input item-stacked-label">
              <span className="input-label">Cover Image</span>
              <input type="file" />
            </label>

            <li className="item">
              Slides
            </li>
            {
              this.state.slides.map((slide,i) => {
                return <li className="item item-button-right" key={slide.id}>
                  {i+1}.&nbsp;
                  {slide.caption}
                  <div className="buttons">
                    <a href={"/slides/"+slide.id+"/edit"} className="button button-positive">
                      <i className="fa fa-pencil-square-o"></i>
                    </a>
                    <button className="button button-assertive">
                      <i className="fa fa-bars"></i>
                    </button>
                  </div>                
                </li>            
              })
            }

          </div>  


        </div>



        <div className="bar bar-footer bar-positive item-button-left">
          <div className="title">Save Changes</div>
        </div>
        
      </div>
    )
  }
}