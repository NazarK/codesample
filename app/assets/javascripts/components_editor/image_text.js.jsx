class ImageText extends React.Component {
  constructor(props) {
    super(props)
    this.state = {slide_id:null}
  }

  componentDidMount() {
    window.ImageTextRef = this
    $(this.refs.left_top).draggable()
    $(this.refs.right_bottom).draggable()
  }

  reset(e) {
    e && e.preventDefault()
    this.refs.brightness.value = 100
    this.refs.contrast.value = 100
    this.refs.grayscale.value = 0
    this.refs.blur.value = 0
    this.refs.saturate.value = 10
    this.preview()
  }

  popup(slide_id, image_url) {
    this.setState({slide_id: slide_id, image_url: image_url})

    $("#text-overlay-modal").modal({keyboard: true})

    this.reset()

    var slide = $(`.slide[data-slide-id=${this.state.slide_id}]`)
    console.log(this.refs)
    this.refs.grayscale.value = slide.find("input[name$='[filters][grayscale]']").val() || this.refs.grayscale.value
    this.refs.contrast.value = slide.find("input[name$='[filters][contrast]']").val() || this.refs.contrast.value
    this.refs.brightness.value = slide.find("input[name$='[filters][brightness]']").val() || this.refs.brightness.value
    this.refs.blur.value = slide.find("input[name$='[filters][blur]']").val() || this.refs.blur.value
    this.refs.saturate.value = slide.find("input[name$='[filters][saturate]']").val() || this.refs.saturate.value
    this.preview()
  }

  submit() {
    var slide = $(`.slide[data-slide-id=${this.state.slide_id}]`)
    var data = this.data()
    slide.find("input[name$='[filters][filters]']").val(this.filter())
    slide.find("input[name$='[filters][grayscale]']").val(data.grayscale)
    slide.find("input[name$='[filters][contrast]']").val(data.contrast)
    slide.find("input[name$='[filters][brightness]']").val(data.brightness)
    slide.find("input[name$='[filters][blur]']").val(data.blur)
    slide.find("input[name$='[filters][saturate]']").val(data.saturate)
    $("#image-filters-modal").modal("hide")
    $(".tale-save").click()
  }

  data() {
    return {
      brightness: this.refs.brightness.value,
      contrast: this.refs.contrast.value,
      grayscale: this.refs.grayscale.value,
      blur: this.refs.blur.value,
      saturate: this.refs.saturate.value,
    }
  }

  filter() {
    data = this.data()
    return `grayscale(${data.grayscale}%) brightness(${data.brightness}%) contrast(${data.contrast}%) blur(${data.blur}px) saturate(${data.saturate/10})`
  }

  preview() {
    var data = this.data()

    $("#image-filters-modal img.target").css({
      filter: this.filter()
    })

  }

  render() {
    return (
        <div id="text-overlay-modal" className="modal" role="dialog" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">×</button>
                <h4 className="modal-title">Text Overlay</h4>
              </div>
              <div className="modal-body">

                <div ref="left_top" style={{zIndex: "1", fontSize: "20px", color: "white", textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000", cursor: "move", width:"20px", height: "20px", position: "absolute"}}>
                  <i className="fa fa-arrows"></i>
                </div>
                <div ref="right_bottom" style={{zIndex: "1", fontSize: "20px", color: "white", textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000", cursor: "move", width:"20px", height: "20px", position: "absolute"}}>
                  <i className="fa fa-arrows"></i>
                </div>
                <textarea style={{position: 'absolute', background: 'transparent' }}>asdf</textarea>
                <img className="target" src={this.state.image_url} style={{maxWidth:"100%",maxHeight:"200px"}} />

                <div className="row margin-top-sm">

                    <div className="form-group col-sm-6 row">
                      <label className="col-sm-4 col-form-label">
                        font
                      </label>
                      <div className="col-sm-6">
                        <input type="range" ref="contrast" min="0" max="200" onChange={this.preview.bind(this)} />
                      </div>
                    </div>

                    <div className="form-group col-sm-6 row">
                      <label className="col-sm-4 col-form-label">
                        font size
                      </label>
                      <div className="col-sm-6">
                        <input type="range" ref="contrast" min="0" max="200" onChange={this.preview.bind(this)} />
                      </div>
                    </div>
                </div>

                <div className="row margin-top-sm">
                    <div className="form-group row col-sm-6">
                      <label className="col-sm-4 col-form-label">
                        color
                      </label>
                      <div className="col-sm-6">
                        <input type="range" ref="brightness" min="0" max="200" onChange={this.preview.bind(this)} />
                      </div>
                    </div>

                    <div className="form-group row col-sm-6">
                      <label className="col-sm-4 col-form-label">
                        outline
                      </label>
                      <div className="col-sm-6">
                        <input type="range" ref="contrast" min="0" max="200" onChange={this.preview.bind(this)} />
                      </div>
                    </div>

                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default pull-left" onClick={this.reset.bind(this)}>Reset</button>
                <button type="button" className="btn btn-default" onClick={this.submit.bind(this)}>Ok</button>
                <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )

  }
}
