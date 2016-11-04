class MobileTales extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {tales: []}
  }
  
  componentWillMount() {
    console.log("MobileTales will mount")
    $.get("/tales.json",(resp)=> {
      console.log(resp)
      this.setState({tales:resp})
    })
    
  }
    
  componentDidUpdate(event) {
    $(this.refs.list)[0].scrollTop = localStorage['tales-list-scrollTop']
  }
  
  tale_click() {
    localStorage['tales-list-scrollTop'] = this.refs.list.scrollTop
    localStorage['tale-edit-scrollTop'] = 0  
  }
  
  render() {
    return (
      <div className="tales">
        <div className="bar bar-header bar-positive item-button-right">
          <div className="title title-left title-bold">YarnTale</div>          
          <div className="buttons">
            <a href="/tales/new" className="button button-balanced button-big">
              New Tale
            </a>
            <a href="/users/sign_out" className="button button-balanced button-big">
              Logout
            </a>
          </div>
        </div>
        <div className="content has-header">
          <ul className="list" ref="list">
            {
              this.state.tales.map((tale) => {
                return <a href={"/tales/"+tale.id+"/edit"} onClick={this.tale_click.bind(this)} className="item item-thumbnail-left item-button-right" key={tale.id}>
                  <h2>{tale.name}</h2>
                  <p>
                    <span className="label-info"> slides: {tale.slides_count}</span>
                    <span className="label-info"> {tale.duration_h}</span>
                  <p>
                  </p>
                    <span className="label-info"> views: {tale.page_views}</span>
                  </p>
                  { tale.slides_count>0 && (

                    <a href={"/t"+tale.id} className="button button-positive">
                      <i className="fa fa-play"></i>
                    </a>                  
                  )}
                  
                  {
                    <img src={tale.cover_url} className="thumb"/>
                  }
                </a>            
              })
            }
          </ul>
        </div>
      </div>
    )
  }
}