class Slide extends React.Component {
  
  render() {

    const {slide,i} = this.props;
    
    
    if(slide.video) {
      return (
        <div className='slide' data-index={i} ><video data-src={slide.video}></video></div>        
      )
    }
    
    if(slide.youtube) {
      var youtube_src=`https://www.youtube.com/embed/${slide.youtube.video_id}?enablejsapi=1&origin=http://${window.location.host}&showinfo=0&controls=0`
      
      console.log(youtube_src)
      
      if(slide.youtube.video_end) {
        youtube_src += `&end=${slide.youtube.video_end}`
      }
      return (
        <div className='slide youtube' data-index={i} >
          <YoutubeThumb videoId={slide.youtube.video_id} />
          <iframe className='youtube play_toggle' data-index={i} id={`youtube-slide-${i}`} type='text/html'
            src={youtube_src}
          frameBorder='0'></iframe>
        </div>        
      )
    }
    
    if(slide.image) {

        return (
          <img className='slide' data-index={i} data-src={slide.image.original} />        
        )
      
    }
  }
  
}