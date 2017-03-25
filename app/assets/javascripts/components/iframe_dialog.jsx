//add class .iframe-href to any <a> tag
//define data-on-iframe-close (js string, will be evaled)
//data-iframe-header

$(function() {
  $(document).on("click",".iframe-href",function(e) {
    e.preventDefault()
    IFRAME_DIALOG($(this).attr("data-iframe-header"),$(this).attr("href"),()=>{
      var on_iframe_close=$(this).attr("data-on-iframe-close")
      console.log("iframe dialog close", on_iframe_close)
      if(on_iframe_close) {
        eval(on_iframe_close)
      }
    })
  })
})

class IFrameDialog extends React.Component {
    constructor(props) {
      super(props)
      this.state = {}
    }

    componentDidMount() {
      var self = this
      window.IFRAME_DIALOG = (header,url,onclose) => {
        self.onClose = onclose;
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

    close() {
      $("#iframe_dialog").modal("hide")
      setTimeout(() => {
        this.onClose && this.onClose()
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
                          <button type="button" className="close" onClick={this.close.bind(this)}>×</button>
                          <h4 className="modal-title">{this.state.header}</h4>
                        </div>
                        <div className="modal-body">
                          <iframe src={this.state.url} style={{width:"100%",height:"200px", border: "0"}}></iframe>
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-default" onClick={this.close.bind(this)}>Close</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>        )

    }

}
