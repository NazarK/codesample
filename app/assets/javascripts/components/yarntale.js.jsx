
class YarnTale extends React.Component {

    constructor(props) {
      super(props)
      this.state = {}
    }
    
    render() {
      return(
        <div className="yarntale">

          <div className="sensor top left">
            <div className="nav prev" onClick={YARNTALE.prev_keep_playing}><i className="fa fa-angle-left" aria-hidden="true"></i></div>
          </div>

          <div className="sensor top right">
            <div className="nav next" onClick={YARNTALE.next_keep_playing}>
              <i className="fa fa-angle-right" aria-hidden="true"></i>
              
            </div>
          </div>

          <div className="sensor bottom drag-enabled">

            <div className="volume_sensor drag-enabled">
              <div className="volume_slider drag-enabled">
                <div className="button drag-enabled"></div>
                <div className="line"></div>
              </div>
              <div className="volume"><i className="fa fa-volume-down" aria-hidden="true"></i></div>
            </div>

            <div className="caption">
              <div className="text"></div>
            </div>

            <Timeline height={this.props.timeline_height} slides={this.props.slides} />
            
          </div>

          <SlideView cover={this.props.cover} slides={this.props.slides} />
              
          <audio className="audio" loop></audio>
          <audio className="slide_audio"></audio>
        </div>
    )}
}