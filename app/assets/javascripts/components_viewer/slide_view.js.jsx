class SlideView extends React.Component {

  render() {

    const {cover, slides} = this.props;

    return (
      <div className="slide_view play_toggle">
        <div className="state_icon play" style={{display:"block"}}>
          <i className="fa fa-play-circle-o" aria-hidden="true"></i>
        </div>

        <div className="state_icon pause">
          <i className="fa fa-pause-circle-o" aria-hidden="true"></i>
        </div>

        <Cover cover={cover} firstSlide={slides[0]} />

        { slides.map((slide, i) => {
              return <Slide slide={slide} i={i} key={i}/>;
         })
        }
      </div>
    );
  }

}
