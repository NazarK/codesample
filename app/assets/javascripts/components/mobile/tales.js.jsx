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
  
  render() {
    return (
      <div>
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
          <ul className="list">
            {
              this.state.tales.map((tale) => {
                return <a href={"/tales/"+tale.id+"/edit"} className="item item-button-right" key={tale.id}>
                  <h2>{tale.name}</h2>
                  <p> slides: {tale.slides_count}</p>
                  <p> duration: {tale.duration_h}</p>
                  {
                    tale.slides_count>0 && (
                      <div className="buttons">
                        <a href={"/t"+tale.id} className="button button-positive">
                          <i className="fa fa-eye"></i>
                        </a>
                      </div>                
                  )}
                </a>            
              })
            }
          </ul>
        </div>
      </div>
    )
  }
}