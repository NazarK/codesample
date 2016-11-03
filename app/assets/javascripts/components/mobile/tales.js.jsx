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
        <div className="bar bar-subheader bar-secondary bar-positive">
              <div className="h2 title title-left">TALES</div>
        </div>        
        <div className="content has-header has-subheader">
          <ul className="list">
            {
              this.state.tales.map((tale) => {
                return <li className="item item-button-right" key={tale.id}>
                  {tale.name}
                  <div className="buttons">
                    <a href={"/tales/"+tale.id+"/edit"} className="button button-positive">
                      <i className="fa fa-pencil-square-o"></i>
                    </a>

                    <a href={"/t"+tale.id} className="button button-positive">
                      <i className="fa fa-eye"></i>
                    </a>
                                      
                  </div>                
                </li>            
              })
            }
          </ul>
        </div>
      </div>
    )
  }
}