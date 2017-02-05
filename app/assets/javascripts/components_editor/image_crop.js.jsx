class ImageCrop extends React.Component {
  constructor(props) {
    super(props)
    this.state = {slide_id:null}
  }

  componentDidMount() {
    window.ImageCropComp = this

  }

  popup(slide_id, image_url) {
    console.log("image url", image_url)
    this.setState({img:null})
    this.setState({slide_id: slide_id, img:image_url})
  }

  image_loaded() {
    var slide = $(`.slide[data-slide-id=${this.state.slide_id}]`)
    var data = {rotate:0,scaleX:1,scaleY:1}

    data.width = parseInt(slide.find("input[name$='[crop][w]']").val())
    data.height = parseInt(slide.find("input[name$='[crop][h]']").val())
    data.x = parseInt(slide.find("input[name$='[crop][x]']").val())
    data.y = parseInt(slide.find("input[name$='[crop][y]']").val())


    if(!data.width && !data.height && !data.x && !data.y) {
      console.log('no data')
      var img = $('#image-crop-modal img')[0]

      data.width = img.naturalWidth
      data.height = img.naturalHeight
      data.x = 0
      data.y = 0
    }



    console.log("initializing cropper with: ", data)


    $('#image-crop-modal img.original').cropper("destroy")
    $('#image-crop-modal img.original').cropper({
      data: data,
      crop: (e)=> {
        this.crop = e;
      },
      build:() => {
        $("#image-crop-modal").modal({keyboard: true})
      }
    })


  }

  reset() {
    var data = {rotate:0,scaleX:1,scaleY:1}
    var img = $('#image-crop-modal img')[0]

    data.width = img.naturalWidth
    data.height = img.naturalHeight
    data.x = 0
    data.y = 0
    console.log("reset to", data)
    $('#image-crop-modal img.original').cropper("reset")
    $('#image-crop-modal img.original').cropper("setData",data)
  }

  submit() {
    var slide = $(`.slide[data-slide-id=${this.state.slide_id}]`)

    var img = $('#image-crop-modal img')[0]

    if(this.crop.width == img.naturalWidth && this.crop.height == img.naturalHeight && this.crop.x ==0 && this.crop.y ==0) {
      this.crop = {}
    }

    slide.find("input[name$='[crop][w]']").val(this.crop.width)
    slide.find("input[name$='[crop][h]']").val(this.crop.height)
    slide.find("input[name$='[crop][x]']").val(this.crop.x)
    slide.find("input[name$='[crop][y]']").val(this.crop.y)
    $(".tale-save").click()
  }

  render() {
    return (
        <div id="image-crop-modal" className="modal" role="dialog" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">×</button>
                <h4 className="modal-title">Crop</h4>
              </div>
              <div className="modal-body">
                <div style={{"textAlign":"center"}}>
                  <img className="original" style={{maxWidth:"50vw",maxHeight:"50vh"}} src={this.state.img} onLoad={this.image_loaded.bind(this)}/>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default pull-left" onClick={this.reset.bind(this)}>Reset</button>
                <button type="button" className="btn btn-default" data-dismiss="modal" onClick={this.submit.bind(this)}>Ok</button>
                <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )

  }
}
