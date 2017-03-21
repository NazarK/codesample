class IFrameDialog extends React.Component {
    constructor(props) {
      super(props)
      this.state = {}
    }

    componentDidMount() {
      window.IFRAME_DIALOG = (header,url) => {
        this.show(header,url)
      }
    }


    show(header,url) {
      //don't show previous dialog content
      if(this.state.url!=url) {
        this.setState({url:""})
      }
      setTimeout(()=> {
        this.setState({header:header,url:url})
        $("#iframe_dialog").modal()
      },0)
    }


    render() {
          return (
                <div>
                  <div id="iframe_dialog" className="modal modal-wide" role="dialog">
                    <div className="modal-dialog">
                      {/* Modal content*/}
                      <div className="modal-content">
                        <div className="modal-header">
                          <button type="button" className="close" data-dismiss="modal">×</button>
                          <h4 className="modal-title">{this.state.header}</h4>
                        </div>
                        <div className="modal-body">
                          <iframe src={this.state.url} style={{width:"100%",height:"200px", border: "0"}}></iframe>
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>        )

    }

}
