class CropEdit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {image_id:null}
  }

  componentDidMount() {
    window.CropEditEl = this

  }
  
  popup(image_id, image_url) {
    this.setState({image_id: image_id, img:image_url})
    var slide = $(`.slide[data-slide-id=${this.state.image_id}]`)
    var data = {rotate:0,scaleX:1,scaleY:1}
    
    data.width = parseInt(slide.find("input[name$='[crop][w]']").val())
    data.height = parseInt(slide.find("input[name$='[crop][h]']").val())
    data.x = parseInt(slide.find("input[name$='[crop][x]']").val())
    data.y = parseInt(slide.find("input[name$='[crop][y]']").val())
    console.log("initializing cropper with: ", data)
        
    $("#crop-edit-modal").modal({keyboard: true})
    
    $('#crop-edit-modal img.original').cropper({
      data: data,
      crop: (e)=> {
        this.crop = e;
      }
    })
    
        
  }
  
  submit() {
    var slide = $(`.slide[data-slide-id=${this.state.image_id}]`)
    slide.find("input[name$='[crop][w]']").val(this.crop.width)
    slide.find("input[name$='[crop][h]']").val(this.crop.height)
    slide.find("input[name$='[crop][x]']").val(this.crop.x)
    slide.find("input[name$='[crop][y]']").val(this.crop.y)
  }
  
  render() {
    return (
        <div id="crop-edit-modal" className="modal" role="dialog" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">×</button>
                <h4 className="modal-title">Image Crop/Adjust</h4>
              </div>
              <div className="modal-body">
                <div>
                  <img className="original" style={{maxWidth:"50vw",maxHeight:"50vh"}} src={this.state.img} />
                </div>  
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal" onClick={this.submit.bind(this)}>Ok</button>
                <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )

  }
}
