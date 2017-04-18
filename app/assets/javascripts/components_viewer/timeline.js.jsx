class Timeline extends React.Component {

  pause() {
    YARNTALE.pause()
  }

  play() {
    YARNTALE.play()
  }

  fullScreen() {
    console.log("toggling full screen")

    function is_IOS_Safari() {
      return (/iP(ad|hone|od)/i.test(navigator.userAgent) && /safari/i.test(navigator.userAgent))
    }
    console.log("(/iP(ad|hone|od)/i.test(navigator.userAgent) && /safari/i.test(navigator.userAgent))")
    console.log("navigator.userAgent", navigator.userAgent)

    if(is_IOS_Safari()) {
      console.log("ios safari detected")
      var sender_iframe_src=window.frameElement.getAttribute("src")
      if(window.YARNTALE_FULLSCREEN) {
        parent.postMessage({message: "YARNTALE_EXIT_FULLSCREEN", sender_iframe_src: sender_iframe_src },"*")
        window.YARNTALE_FULLSCREEN = false
        $(".fullscreen").addClass("disabled")
      } else {
        parent.postMessage({message: "YARNTALE_GO_FULLSCREEN", sender_iframe_src: sender_iframe_src },"*")
        window.YARNTALE_FULLSCREEN = true
        $(".fullscreen").removeClass("disabled")
      }
      return
    } else {
      console.log("not ios safari")
    }

    $(YARNTALE.el).toggleFullScreen()
  }

  render() {
    //timeline height
    const {height, slides} = this.props;

    const slides_style = {
      width: `calc(100% - ${(1.2+0.5+0.5+3)*height}px)`
    }
    console.log(slides_style)

    const style = `
      .yarntale .sensor.bottom:hover .caption {
        bottom: ${height}px;
        transition: bottom 0.15s ease-out;
      }
      .yarntale .sensor.bottom:hover .timeline {
        height: ${height}px !important;
        transition: height 0.15s ease-out;
      }
      .yarntale .sensor.bottom .timeline .slides .platform .slide {
        width:  ${height*3/2}px;
        height: ${height}px;
      }

      .yarntale .sensor.bottom .timeline .slides .platform .slide img {
        width:  ${height*3/2 - 8}px;
        height: ${height-8}px;
      }

      .yarntale .sensor.bottom .volume_sensor {
        width: ${height}px;
        right: ${height*2}px;
      }

      .yarntale .sensor.bottom .volume_sensor .volume_slider {
        height: calc( 100% - ${height}px - 5px);
      }

      .yarntale .sensor.bottom:hover .volume_sensor {
        height: ${height*3}px;
      }

      .yarntale .sensor.bottom .volume_sensor .volume {
        line-height: ${height}px;
        font-size: ${height/2}px;
      }

      .yarntale .sensor.bottom:hover .volume_sensor .volume {
        height: ${height}px;
      }

    `

    return (


      <div className="timeline" style={{height: height, fontSize: height}}>
        <style>
          {style}
        </style>
        <div className="control" style={{width: height*1.2+"px", paddingLeft: height/2 }}>
          <div className="pause" onClick={this.pause}><i className="fa fa-pause" aria-hidden="true"></i></div>
          <div className="play" onClick={this.play}><i className="fa fa-play" aria-hidden="true"></i></div>
        </div>

        <div className="slides_line_nav prev"  style={{width: height/2}}>
          <i className="fa fa-angle-left" aria-hidden="true"></i>
        </div>

        <div className="slides" style={slides_style}>
          <div className="platform">
              { slides.map((slide, i) => {
                    return <TimelineThumb slide={slide} i={i} key={i}/>;
               })
              }
          </div>
        </div>

        <div className="slides_line_nav next" style={{width: height/2}}>
          <i className="fa fa-angle-right" aria-hidden="true"></i>
        </div>

        <div className="fullscreen disabled" style={{width:height, right: height}} onClick={this.fullScreen.bind(this)}>
          <i className="fa fa-arrows-alt" aria-hidden="true"></i>
        </div>

        <div className="cc" style={{width: height}}>
          <i className="fa fa-cc" aria-hidden="true"></i>
        </div>
      </div>
    );
  }

}
