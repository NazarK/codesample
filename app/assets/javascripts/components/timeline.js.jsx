class Timeline extends React.Component {
  
  render() {
    //timeline height
    const {height, slides} = this.props;

    const slides_style = { 
      width: `calc(100% - ${(1.2+0.5+0.5+3)*height}px)`
    }
    console.log(slides_style)

    return (
      <div className="timeline" style={{height: height, fontSize: height}}>
        <div className="control" style={{width: height*1.2+"px", paddingLeft: height/2 }}>
          <div className="pause"><i className="fa fa-pause" aria-hidden="true"></i></div>
          <div className="play"><i className="fa fa-play" aria-hidden="true"></i></div>
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

        <div className="fullscreen disabled" style={{width:height, right: height}}>
          <i className="fa fa-arrows-alt" aria-hidden="true"></i>
        </div>

        <div className="cc" style={{width: height}}>
          <i className="fa fa-cc" aria-hidden="true"></i>
        </div>
      </div>
    );
  }

}
