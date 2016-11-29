class MobileTales extends React.Component {

  constructor(props) {
    super(props)
    this.state = {tales: []}
  }

  componentWillMount() {
    console.log("MobileTales will mount")
    $.get("/tales.json",(resp)=> {
      console.log("got tales:",resp.length)
      if(this.state.tales.length==resp.length) {
        console.log("already got tales, not updating state")
        return
      }
      this.setState({tales:resp})
    }).fail((resp) => {
      if(resp.status==401)
        this.props.router.push("/m/sign_in")
    })

  }

  componentDidUpdate(event) {
    this.refs.list.scrollTop = localStorage['tales-list-scrollTop']
  }

  save_list_top() {
    localStorage['tales-list-scrollTop'] = this.refs.list.scrollTop
  }
  tale_click() {
    this.save_list_top()
    localStorage['tale-edit-scrollTop'] = 0
  }

  tale_view(event) {
    var tale_id = $(event.currentTarget).attr("data-id")
    window.open(`/t${tale_id}`, '_blank');
    event.preventDefault()
  }
  
  sign_out(event) {
    event.preventDefault()
    $.get("/users/sign_out",()=> {
      this.props.router.push("/m/sign_in")
    })
  }

  render() {
    return (
      <div className="tales">
        <div className="bar bar-header bar-positive item-button-right">
          <div className="title title-left title-bold">YarnTale</div>
          <div className="buttons">
            <Link to="/m/tales/new" onClick={this.save_list_top.bind(this)} className="button button-positive button-big">
              <i className="fa-2x ion-plus-circled" data-pack="default"></i>
            </Link>
            <a href="#" onClick={this.sign_out.bind(this)} className="button button-positive button-big">
              <i className="fa-2x ion-android-exit" data-pack="default"></i>
            </a>
          </div>
        </div>
        <div className="content has-header">
          <ul className="list" ref="list">
            {
              this.state.tales.map((tale) => {
                return <Link to={`/m/tales/${tale.id}/edit`} onClick={this.tale_click.bind(this)} className="item item-thumbnail-left item-button-right" key={tale.id}>
                  <h2>{tale.name}</h2>
                  <p>
                    <span className="label-info"> slides: {tale.slides_count}</span>
                    <span className="label-info"> {tale.duration_h}</span>
                  <p>
                  </p>
                    <span className="label-info"> views: {tale.page_views}</span>
                  </p>
                  { tale.slides_count>0 && (

                    <div data-id={tale.id} onClick={this.tale_view.bind(this)} className="button button-outline button-positive">
                      <i className="fa-2x ion-play" data-pack="default"></i>
                    </div>
                  )}

                  {
                    <img src={tale.cover_url} className="thumb"/>
                  }
                </Link>
              })
            }
          </ul>
        </div>
      </div>
    )
  }
}
