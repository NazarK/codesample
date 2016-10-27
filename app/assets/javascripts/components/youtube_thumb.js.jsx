class YoutubeThumb extends React.Component {
  
  render() {
    return (
      <img src={`http://img.youtube.com/vi/${this.props.videoId}/0.jpg`}></img>
    )
  }
}