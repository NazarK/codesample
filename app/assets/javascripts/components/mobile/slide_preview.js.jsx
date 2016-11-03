class MobileSlidePreview extends React.Component {

    render() {
      if(!this.props.slide) {
        return (
          <div className="slide-preview"></div>
        )
      }
      return (
        <div className="slide-preview">
          { this.props.slide.image_thumb && (
            <div>
              <img src={this.props.slide.image_thumb} className="slide-thumb" />
            </div>
          )}
          
          { this.props.slide.audio_url && (
            <div>
              <audio controls src={this.props.slide.audio_url} />
            </div>
          )}
          
          { this.props.slide.video_url && (
            <div>
              <video className="slide-thumb" controls src={this.props.slide.video_url} />
            </div>
          )}      
        </div>
      )            
    }

}