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
    if(this.props.wrapper) {
      var target =  $(this.refs.component).parents(this.props.wrapper).find(this.props.target)[0]
      var field = $(this.refs.component).parents(this.props.wrapper).find(this.props.field)
    } else {
      var target =  $(this.props.target)[0]
      var field = $(this.props.field)
    }
    if(target)
      target.volume = volume_in_percent/100
    field.val(volume_in_percent/100)
  }

  componentDidMount() {
    if(this.props.wrapper) {
      var field = $(this.refs.component).parents(this.props.wrapper).find(this.props.field)
    } else {
      var field = $(this.props.field)
    }

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
        <div ref="component" id="audio-volume" className="audio-volume" style={{marginTop: "2px"}}>
          <i className="fa fa-2x fa-volume-off" style={{marginLeft:"10px"}}></i>
          <input type="range" ref="volume" min="-70" max="0"
            onChange={this.volume_change.bind(this)}
            style={{marginLeft:"10px", width:this.props.width,display:"inline-block"}} />
        </div>
      )

  }
}
