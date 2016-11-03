class MobileEditor extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {tales: []}
  }
  
  componentWillMount() {
    $.get("/tales.json",(resp)=> {
      console.log(resp)
      this.setState({tales:resp})
    })
    
  }
  
  render() {
    return (
      <div>
        <div className="bar bar-header bar-positive item-button-right">
          <div className="title">YarnTale</div>
          <button className="button">
            <i className="fa fa-plus"></i>
          </button>
        </div>
        <div className="bar bar-subheader bar-secondary bar-positive">
              <div className="h2 title">TALES</div>
        </div>        
        <div className="content has-header has-subheader">
          <ul className="list">
            {
              this.state.tales.map((tale) => {
                return <li className="item item-button-right" key={tale.id}>
                  {tale.name}
                  <div className="buttons">
                    <button className="button button-positive">
                      <i className="fa fa-pencil-square-o"></i>
                    </button>

                    <button className="button button-positive">
                      <i className="fa fa-eye"></i>
                    </button>
                                      
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