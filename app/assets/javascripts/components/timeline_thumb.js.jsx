class TimelineThumb extends React.Component {

  on_thumb_click(e) {
    //YARNTALE.pause()
    YARNTALE.do_while_keeping_play_state(() => {
      YARNTALE.setSlideIndex($(e.currentTarget).data("index"))
    })
  }
  
  video_set_position(event) {
    event.currentTarget.currentTime=$(event.currentTarget).attr("data-video-thumb-pos")
  }
  
  render() {

    const {slide,i} = this.props;
    
    return (
      <div className='slide' data-index={i} onClick={this.on_thumb_click}>
        
        { slide.video && (
          <video data-video-thumb-pos={slide.video_thumb_pos} 
            onLoadedMetadata={this.video_set_position}
            data-src={slide.video} />
        )}
        
        { slide.youtube && (         
          <YoutubeThumb videoId={slide.youtube.video_id} slideIndex={i} dimmed={true} /> 
        )}
        
        { slide.image && (
          <img data-src={slide.image.thumb} />
        )}
        
      </div>      
    );
  }
}
