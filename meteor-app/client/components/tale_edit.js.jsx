import React from 'react'
import { Link } from 'react-router'

export default class MobileTaleEdit extends React.Component {

  constructor(props) {
    super(props)
    this.state = {slides: []}
  }

  componentWillMount() {   
    console.log("mobile tale edit, getting tale")
    $.get(`${DATA_HOST}/tales/${this.props.params.id}.json`,(resp)=> {
      this.setState(resp)
      
      $(".slides.sortable").sortable({
        handle: ".sortable-handle",
        axis: 'y',
        stop: () => {
          this.slidePositionsUpdate()
        }
      })

    })
  }

  submit(event) {
    event.preventDefault()
    $(event.target).ajaxSubmit({
        data: AUTH_PARAMS(),
        success: ()=>{
          console.log('form submitted');
          this.refs.bg_audio.value=''
          this.componentWillMount()
          $(".got-file").removeClass("got-file")
        }
    });
    return false;
  }

  delete(event) {
    event.preventDefault()
    if(!confirm("Delete tale?"))
      return;
    $.ajax({
       url: `${DATA_HOST}/tales/${this.props.params.id}`,
       type: 'DELETE',
       success: function(response) {
         console.log('deleted')
         window.history.back();
       }
    })

  }

  nameChange(event) {
    this.setState({name: event.target.value})
  }

  back(event) {
    this.props.router.goBack()
  }

  slide_click() {
    localStorage['tale-edit-scrollTop'] = this.refs.list.scrollTop
  }

  componentDidUpdate(event) {
    this.refs.list.scrollTop = localStorage['tale-edit-scrollTop']
  }
  
  slidePositionsUpdate() {
    var ids_ordered = []
    $("form.tale-edit .slide").each(function() {
      ids_ordered.push($(this).data("id"))
    })
    console.log(ids_ordered)

    var slides = this.state.slides
    $.each(slides,function(index,slide) {
      slide.position = ids_ordered.indexOf(slide.id)+1
    })
    this.setState({slides:slides})
    
    $.ajax({
       data: {ids_ordered: ids_ordered},
       url: `/tales/${this.props.params.id}`,
       type: 'PATCH',
       success: (response) => {
       }
    })
  }

  file_chosen(e) {
    $(e.currentTarget).parents(".btn").addClass("got-file")
  }

  render() {

    var url = `${DATA_HOST}/tales/${this.props.params.id}`

    return (
      <form onSubmit={this.submit.bind(this)} noValidate="novalidate" encType="multipart/form-data" action={url} acceptCharset="UTF-8" method="post" className="tale-edit">
        { !this.props.new_record && (
          <input type="hidden" name="_method" value="patch" />
        )}

        <div className="bar bar-header bar-positive">

          <div onClick={this.back.bind(this)} className="button button-positive button-big click-sound">
            <i className="fa fa-arrow-left"></i>
          </div>

          <div className="title title-bold">tale</div>
            { !this.props.new_record && (
              <div onClick={this.delete.bind(this)} className="delete button button-clear button-big">
                <i className="fa-2x ion-android-delete"></i>
              </div>
            )}
        </div>

        <div className="content has-header">
          <div className="list" ref="list">
            <label className="item item-input item-stacked-label">
              <span className="input-label">Title</span>
              <input type="text" name="tale[name]" value={this.state.name || ''} onChange={this.nameChange.bind(this)}/>
            </label>
            <label className="item item-input item-stacked-label">
              <span className="input-label">Background Audio</span>
              { this.state.bg_audio_url && (
                <div>
                  <audio controls src={DATA_HOST + this.state.bg_audio_url} />
                </div>
              )}
              <div className="btn btn-default btn-file">
                Upload ...<input type="file" name="tale[audio]"  ref="bg_audio" onChange={this.file_chosen.bind(this)} />
              </div>
            </label>

            <div className="padding">
              <button type="submit" className="button button-block button-positive">
                Save Tale Properties
              </button>
            </div>

            <li className="item item-button-right">
              Slides
              <Link to={"/m/tales/"+this.props.params.id+"/slides/new"} className="button button-balanced button-big">
                Add Slide
              </Link>
            </li>
            
            <div className="slides sortable">
              {
                this.state.slides.map((slide,i) => {
                  return <Link to={"/m/slides/"+slide.id+"/edit"} onClick={this.slide_click.bind(this)} className="item item-thumbnail-left slide item-button-right" data-id={slide.id} key={slide.id}  >
                      { slide.image_thumb && (
                          <img className="slide-thumb" src={DATA_HOST + slide.image_thumb} />
                      )}

                      { slide.video_url && (
                          <video className="slide-thumb" src={DATA_HOST + slide.video_url} />
                      )}
                    {slide.position}.&nbsp;
                    {slide.caption}
                    <div className="button sortable-handle"><i className="fa fa-bars"></i></div>
                  </Link>
                })
              }
            </div>

          </div>


        </div>


      </form>
    )
  }
}
