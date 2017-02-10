class ImageText extends React.Component {
  constructor(props) {
    super(props)
    this.state = {slide_id:null}
  }

  params() {
    var slide = $(`.slide[data-slide-id=${this.state.slide_id}]`)
    var textarea = $(this.refs.textarea)

    var image_width = slide.find("img.thumb").data("width")
    var image_height = slide.find("img.thumb").data("height")

    var left = textarea.position().left
    var top = textarea.position().top

    //convert pixels to percents

    top = 100*top/200
    left = 100*left/(200*image_width/image_height)

    var params = {
      color: this.refs.color.value,
      stroke_color: this.refs.stroke_color.value,
      font: this.refs.font.value,
      font_size: this.refs.font_size.value,
      left: left,
      top: top,
      text: encodeURIComponent(this.refs.textarea.value),
      bold: $(this.refs.bold).prop("checked")+""
    }
    return params
  }

  text_edit() {

    $(this.refs.edit_btn).hide()
    $(this.refs.render_btn).show()
    $(this.refs.hint).show()
    this.setState({image_url: this.state.orig_image_url})
    $(this.refs.textarea).css({opacity: 1, zIndex: 10})
    $(this.refs.textarea).focus()
  }

  text_render() {
    $(this.refs.render_btn).hide()
    $(this.refs.edit_btn).show()
    $(this.refs.hint).hide()

    $(this.refs.textarea).css({opacity: 0, zIndex: -1})

    var image_url = `/slides/${this.state.slide_id}/text?`+$.param(this.params())
    console.log(image_url)
    this.setState({image_url: image_url})

  }

  componentDidMount() {
    window.ImageTextRef = this
    var self = this
    var textarea = $(self.refs.textarea)
    var resizer = $(self.refs.resizer)

    $(this.refs.font).change(this.apply.bind(this))

    $(textarea).draggable({
       cursor      : "move",
       scroll      : false,
       cancel: "text"
    })

     resizer.draggable({
       cursor: "se-resize",
       containment: "parent",
       drag: function() {
         textarea.css({
           width: resizer.position().left + resizer.width() - textarea.position().left,
           height: resizer.position().top + resizer.height() - textarea.position().top
         })
       }
     })

  }


  //load data to component
  popup(slide_id, image_url) {
    this.setState({slide_id: slide_id, image_url: image_url, orig_image_url: image_url})

    $("#text-overlay-modal").modal({keyboard: true})

    var slide = $(`.slide[data-slide-id=${this.state.slide_id}]`)
    var textarea = $(this.refs.textarea)

    var image_width = slide.find("img.thumb").data("width")
    var image_height = slide.find("img.thumb").data("height")



    var left = (slide.find("input[name$='[text_overlay][left]']").val() || 0)
    var top = (slide.find("input[name$='[text_overlay][top]']").val() || 0)

    //convert percents to pixels
    left = 200*image_width/image_height*left/100
    top = 200*top/100

    textarea.val(decodeURIComponent(slide.find("input[name$='[text_overlay][text]']").val()))
    textarea.css({left: left + "px"})
    textarea.css({top: top + "px"})
    textarea.css({width: 200 * image_width/image_height + "px"})
    textarea.css({height: "200px"})

    $(this.refs.font_size).val( slide.find("input[name$='[text_overlay][font_size]']").val() || 10 )
    $(this.refs.font).val( slide.find("input[name$='[text_overlay][font]']").val() || "Helvetica" )
    $(this.refs.color).val(slide.find("input[name$='[text_overlay][color]']").val()  )
    $(this.refs.stroke_color).val(slide.find("input[name$='[text_overlay][stroke_color]']").val() || "#ffffff"  )
    $(this.refs.bold).prop("checked", (slide.find("input[name$='[text_overlay][bold]']").val() || "true")=="true"  )

    console.log({left: slide.find("input[name$='[text_overlay][left]']").val() || 0 })
    console.log({top: slide.find("input[name$='[text_overlay][top]']").val() || 0 })

    this.apply()
    this.text_render()
  }

  //save data from component
  submit() {
    var params = this.params()
    var slide = $(`.slide[data-slide-id=${this.state.slide_id}]`)


    slide.find("input[name$='[text_overlay][text]']").val(params.text)
    slide.find("input[name$='[text_overlay][left]']").val(params.left)
    slide.find("input[name$='[text_overlay][top]']").val(params.top)

    slide.find("input[name$='[text_overlay][font]']").val(params.font)
    slide.find("input[name$='[text_overlay][font_size]']").val(params.font_size)
    slide.find("input[name$='[text_overlay][color]']").val(params.color)
    slide.find("input[name$='[text_overlay][stroke_color]']").val(params.stroke_color)
    slide.find("input[name$='[text_overlay][font_weight]']").val(params.font_weight)
    slide.find("input[name$='[text_overlay][bold]']").val(params.bold)

    $("#text-overlay-modal").modal("hide")
    $(".tale-save").click()
  }

  apply() {
    params = this.params()
    console.log("apply", this.refs.font.value)
    $(this.refs.textarea).css({"font-family": "'"+this.refs.font.value.replace("+",' ')+"'" })
    var font_size = this.refs.font_size.value*200/100+"px"
    $(this.refs.textarea).css({"font-size": font_size, "line-height": font_size })
    if(params.bold=="true") {
      $(this.refs.textarea).css({"font-weight":"bold"})
    } else {
      $(this.refs.textarea).css({"font-weight":"normal"})
    }

    $(this.refs.textarea).css({"color": this.refs.color.value})
    $(this.refs.textarea).css({"-webkit-text-stroke-width": 1, "-webkit-text-stroke-color": this.refs.stroke_color.value})

    //in render mode
    if($(this.refs.edit_btn).is(":visible")) {
      clearTimeout(this.render_delay)
      this.render_delay = setTimeout(()=> {
          this.text_render()
      }, 500)


    }

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
                <div className="row">
                    <div className="row">
                      <div className="form-group col-sm-3">
                        <label className="col-sm-4 col-form-label">
                          font
                        </label>
                        <div className="col-sm-6">
                          <select id="image_text_font" ref="font">
                            <option value="Courier">Courier</option>
                            <option value="Helvetica">Helvetica</option>
                          </select>
                        </div>
                      </div>


                      <div className="form-group col-sm-2">
                        <label className="col-sm-4 col-form-label" htmlFor="font_bold">
                          bold
                        </label>
                        <div className="col-sm-6">
                          <input id="font_bold" type="checkbox" ref="bold" onChange={this.apply.bind(this)} value="true" />
                        </div>
                      </div>

                      <div className="form-group col-sm-2">
                        <label className="col-sm-4 col-form-label">
                          size
                        </label>
                        <div className="col-sm-6">
                          <input type="number" ref="font_size" min="1" max="200" onChange={this.apply.bind(this)} />
                        </div>
                      </div>

                      <div className="form-group col-sm-2">
                        <label className="col-sm-6 col-form-label">
                          color
                        </label>
                        <div className="col-sm-6">
                          <input type="color" ref="color" onChange={this.apply.bind(this)} />
                        </div>
                      </div>

                      <div className="form-group col-sm-2 ">
                        <div className="row">
                          <label className="col-sm-6 col-form-label" style={{textAlign:"right"}}>
                            stroke
                          </label>
                          <div className="col-sm-6">
                            <input type="color" ref="stroke_color" onChange={this.apply.bind(this)} />
                          </div>
                        </div>
                      </div>

                    </div>

                </div>


                  <div className="row">
                    <div className="col-sm-12" style={{marginBottom: 10}}>
                      <button ref="edit_btn" className="btn btn-default" onClick={this.text_edit.bind(this)}>edit text</button>
                      <button ref="render_btn" className="btn btn-danger" onClick={this.text_render.bind(this)}>apply</button>
                      <span ref="hint" style={{fontSize: 10,marginLeft: 20}}>* - now edit text and change position by dragging</span>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-sm-12">
                      <div className="img_wrapper" style={{position:"relative", height: "200px"}}>
                        <textarea ref="textarea" id="text" style={{position: 'absolute', background: 'transparent', border: "1px dotted black", resize: "none" }}></textarea>
                        <img ref="image" className="target" src={this.state.image_url} style={{maxWidth:"100%",height:"200px"}} />
                      </div>
                    </div>
                  </div>


              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" onClick={this.submit.bind(this)}>Ok</button>
                <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )

  }
}
