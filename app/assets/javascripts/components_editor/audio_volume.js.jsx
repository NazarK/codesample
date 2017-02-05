class AudioVolume extends React.Component {
  constructor(props) {
    super(props)
  }

  volume_change(event) {
    console.log($(event.currentTarget))
    var value = $(event.currentTarget).val()
    console.log("volume: ", value, " dB")
    if(value==$(this.refs.volume).attr("min")) {
      var volume_in_percent = 0
    } else {
      var volume_in_percent = Math.pow(10, value / 20) * 100
    }
    console.log("volume in percent: ", volume_in_percent)
    $(this.props.target)[0].volume = volume_in_percent/100
    $(this.props.field).val(volume_in_percent/100)
  }

  componentDidMount() {
    var original_vol_in_percent = $(this.props.field).val()*100
    if(original_vol_in_percent==0) {
      var vol_in_db = $(this.refs.volume).attr('min')
    } else {
      var vol_in_db = 20 * Math.log10(original_vol_in_percent/100)
    }
    console.log("audio volume, initializing with: ",vol_in_db, " db")
    $(this.refs.volume).val(vol_in_db)

  }


  render() {
    return (
        <div id="audio-volume" className="audio-volume" style={{marginTop: "2px"}}>
          <i className="fa fa-2x fa-volume-off" style={{marginLeft:"10px"}}></i>
          <input type="range" ref="volume" min="-100" max="0"
            onChange={this.volume_change.bind(this)}
            style={{marginLeft:"10px", width:"100px",display:"inline-block"}} />
        </div>
      )

  }
}
