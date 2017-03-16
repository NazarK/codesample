class Cover extends React.Component {

  video_set_position(event) {
    console.log("cover video loaded")
    event.currentTarget.currentTime=$(event.currentTarget).attr("data-video-thumb-pos")
    YARNTALE.process_data_src()
  }

  componentDidMount(event) {
    if(this.props.cover && this.props.firstSlide.youtube) {
      window.fitie.apply()
    }

    $(".slide_view").find("img.slide.cover, .slide.cover img").load(function() {
      console.log("cover loaded")
      YARNTALE.process_data_src()
    })

  }

  render() {

    const {cover,firstSlide} = this.props;

    if(this.props.cover) {
      return (
        <div className='slide cover'><img src={this.props.cover} /></div>
      )
    } else {
      if(firstSlide.youtube) {
        return (
          <div className='slide cover'>
            <YoutubeThumb videoId={firstSlide.youtube.video_id} />
          </div>
        )
      } else if(firstSlide.video) {
        return (
          <div className='slide cover'>
            <video data-video-thumb-pos={firstSlide.video_thumb_pos}
              onLoadedMetadata={this.video_set_position}
              src={firstSlide.video} />
          </div>
        )
      } else {
        return (
          <div className='slide cover'><img src={firstSlide.image.url} /></div>
        )
      }
    }

  }

}
