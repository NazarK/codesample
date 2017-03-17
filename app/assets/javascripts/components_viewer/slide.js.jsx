class Slide extends React.Component {

  render() {

    const {slide,i} = this.props;


    if(slide.video) {
      return (
        <div className='slide' data-index={i} ><video className={"object-fit-"+YARNTALE.media_fit_mode} data-src={slide.video}></video></div>
      )
    }

    if(slide.youtube) {
      var youtube_src=`//www.youtube.com/embed/${slide.youtube.video_id}?enablejsapi=1&origin=http://${window.location.host}&showinfo=0&controls=0`

      if(slide.youtube.video_end) {
        youtube_src += `&end=${slide.youtube.video_end}`
      }
      return (
        <div className='slide youtube' data-index={i} >
          <YoutubeThumb objectFit={YARNTALE.media_fit_mode} videoId={slide.youtube.video_id} />
          <iframe className={'youtube play_toggle youtube-player'+" object-fit-"+YARNTALE.media_fit_mode} data-index={i} id={`youtube-slide-${i}`} type='text/html'
            src={youtube_src}
          frameBorder='0'></iframe>
        </div>
      )
    }

    if(slide.image) {

          return (
            <div className='slide' data-index={i}><img className={"object-fit-"+YARNTALE.media_fit_mode} data-src={slide.image.url} style={{filter: slide.css_filters}}/></div>
        )

    }
  }

}
