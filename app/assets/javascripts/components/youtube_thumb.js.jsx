class YoutubeThumb extends React.Component {
  
  render() {
    return (
      <img className={'youtube_thumb'+(this.props.dimmed ? ' dimmed' : '')} src={`http://img.youtube.com/vi/${this.props.videoId}/0.jpg`}></img>
    )
  }
}