class YoutubeThumb extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    var objectFit = this.props.objectFit || "contain"
    return (
       <img className={'object-fit-'+objectFit+' youtube_thumb'+(this.props.dimmed ? ' dimmed' : '')} src={`http://img.youtube.com/vi/${this.props.videoId}/0.jpg`}></img>
    )
  }
}
