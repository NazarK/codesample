class ImageText extends React.Component {
  constructor(props) {
    super(props)
    this.state = {slide_id:null}
  }


  move_resizer() {
    var textarea = $(this.refs.textarea)
    var resizer = $(this.refs.resizer)
    resizer.css({
       left: textarea.position().left + textarea.width() - 8,
       top: textarea.position().top + textarea.height() - 8
    })
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
       containment : "parent",
       cancel: "text",
       drag: function() {
         self.move_resizer()
       },
       stop: function() {
         self.move_resizer()
       }
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

     this.fontselect = $(this.refs.font).fontselect()


  }


  popup(slide_id, image_url) {
    this.setState({slide_id: slide_id, image_url: image_url})

    $("#text-overlay-modal").modal({keyboard: true})

    var slide = $(`.slide[data-slide-id=${this.state.slide_id}]`)
    var textarea = $(this.refs.textarea)

    textarea.val(slide.find("input[name$='[text_overlay][text]']").val())
    textarea.css({left: (slide.find("input[name$='[text_overlay][left]']").val() || 0) + "px"})
    textarea.css({top: (slide.find("input[name$='[text_overlay][top]']").val() || 0) + "px"})
    textarea.css({width: (slide.find("input[name$='[text_overlay][width]']").val() || 100) + "px"})
    textarea.css({height: (slide.find("input[name$='[text_overlay][height]']").val() || 50) + "px"})

    $(this.refs.font_size).val( slide.find("input[name$='[text_overlay][font_size]']").val() )
    $(this.refs.font).val( slide.find("input[name$='[text_overlay][font]']").val()  )
    $(this.refs.color).val(slide.find("input[name$='[text_overlay][color]']").val()  )
    window.fontselect_objects.image_text_font.updateSelected()

    console.log({left: slide.find("input[name$='[text_overlay][left]']").val() || 0 })
    console.log({top: slide.find("input[name$='[text_overlay][top]']").val() || 0 })

    this.move_resizer()
    this.apply()
  }

  submit() {
    var slide = $(`.slide[data-slide-id=${this.state.slide_id}]`)
    var textarea = $(this.refs.textarea)
    slide.find("input[name$='[text_overlay][text]']").val($(textarea).val())
    slide.find("input[name$='[text_overlay][left]']").val(textarea.position().left)
    slide.find("input[name$='[text_overlay][top]']").val(textarea.position().top)
    slide.find("input[name$='[text_overlay][width]']").val(textarea.outerWidth())
    slide.find("input[name$='[text_overlay][height]']").val(textarea.outerHeight())

    slide.find("input[name$='[text_overlay][font]']").val($(this.refs.font).val())
    slide.find("input[name$='[text_overlay][font_size]']").val($(this.refs.font_size).val())
    slide.find("input[name$='[text_overlay][color]']").val($(this.refs.color).val())

    $("#text-overlay-modal").modal("hide")
    $(".tale-save").click()
  }

  apply() {

    console.log("apply", this.refs.font.value)
    $(this.refs.textarea).css({"font-family": "'"+this.refs.font.value.replace("+",' ')+"'" })
    $(this.refs.textarea).css({"font-size": this.refs.font_size.value+"px" })
    $(this.refs.textarea).css({"color": this.refs.color.value})

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
                      <div className="form-group col-sm-8">
                        <label className="col-sm-4 col-form-label">
                          font
                        </label>
                        <div className="col-sm-6">
                          <input type="text" id="image_text_font" ref="font" />
                        </div>
                      </div>
                    </div>

                    <div className="row">

                      <div className="form-group col-sm-3 ">
                        <label className="col-sm-4 col-form-label">
                          size
                        </label>
                        <div className="col-sm-6">
                          <input type="number" ref="font_size" min="1" max="200" onChange={this.apply.bind(this)} />
                        </div>
                      </div>

                      <div className="form-group col-sm-3 ">
                        <label className="col-sm-4 col-form-label">
                          color
                        </label>
                        <div className="col-sm-6">
                          <input type="color" ref="color" onChange={this.apply.bind(this)} />
                        </div>
                      </div>
                    </div>

                </div>



                <div className="img_wrapper" style={{position:"relative", width: "100%", height: "200px"}}>
                  <textarea ref="textarea" id="text" style={{zIndex: '10', position: 'absolute', background: 'transparent', border: "1px dotted black", resize: "none" }}></textarea>
                  <div ref="resizer" className="ui-icon ui-icon-gripsmall-diagonal-se" style={{position:'absolute', zIndex: 90, cursor: "se-resize" }}></div>
                  <img className="target" src={this.state.image_url} style={{maxWidth:"100%",maxHeight:"200px"}} />
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
