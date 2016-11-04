class MobileTaleNew extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {}
  }
    
  nameChange(event) {
    this.setState({name: event.target.value})
  }
  
  createTale() {
    $.ajax({
      type: "POST",
      url: "/tales.json",
      data: {tale: { name: this.state.name} },
      dataType: "JSON",
      success: function(resp) {
        window.location = `/tales/${resp.id}/edit`
      }
    });    

  }
  
  
  render() {
    return (
      <div>
        <div className="bar bar-header bar-positive">
          <a href="/tales" className="button button-positive button-big">
            <i className="fa fa-arrow-left"></i>
          </a>
          <div className="title title-bold">tale</div>
        </div>
        
        <div className="content has-header">
          <div className="list">
            <label className="item item-input item-stacked-label">
              <span className="input-label">Title</span>
              <input type="text" value={this.state.name || ''} onChange={this.nameChange.bind(this)} autoFocus="true"/>
            </label>
          </div>  


        </div>

        <div className="bar bar-footer bar-positive item-button-left">
          <div className="title click-sound" onClick={this.createTale.bind(this)}>Create Tale</div>
        </div>
        
      </div>
    )
  }
}