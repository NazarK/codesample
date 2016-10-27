class TimelineThumb extends React.Component {
  
  video_set_position(event) {
    event.currentTarget.currentTime=$(event.currentTarget).attr("data-video-thumb-pos")
  }
  
  render() {

    const {slide,i} = this.props;
    
    return (
      <div className='slide' data-index={i}>
        
        { slide.video && (
          <video data-video-thumb-pos={slide.video_thumb_pos} 
            onLoadedMetadata={this.video_set_position}
            data-src={slide.video} />
        )}
        
        { slide.youtube && (         
          <YoutubeThumb videoId={slide.youtube.video_id} /> 
        )}
        
        { slide.image && (
          <img data-src={slide.image.thumb} />
        )}
        
      </div>      
    );
  }
}
