class AudioGraph extends React.Component {
    componentDidMount() {
        window.audiograph = this

        window.wavesurfer = WaveSurfer.create({
            container: "#waveform",
            waveColor: "black",
            height: 140,
            //barWidth: 2,
            progressColor: "black"
        })


        self = this
        wavesurfer.on('ready', () => {
            wavesurfer.enableDragSelection({});
            var timeline = Object.create(WaveSurfer.Timeline);

            timeline.init({
                wavesurfer: wavesurfer,
                container: '#waveform-timeline'
            });

            this.full_zoom = $("#waveform").width()/wavesurfer.getDuration()
            self.full()

        });

        wavesurfer.on("pause", function() {
            console.log("pause")
            wavesurfer.seekTo(self.region().start/wavesurfer.getDuration())
        })

        wavesurfer.on('region-created', function() {
            console.log("region created")
            wavesurfer.clearRegions()
        })
        wavesurfer.on("region-update-end",function(e,ee) {
          console.log("region update end")
          setTimeout(() => {
            wavesurfer.seekTo(self.region().start/wavesurfer.getDuration())
          },50)

        })


        wavesurfer.load(this.props.audio)

    }

    play() {
        wavesurfer.play(this.region().start,this.region().end)
    }

    stop() {
        wavesurfer.stop()
    }

    zoom() {
        this.zoom *= 1.1;
        wavesurfer.zoom(this.zoom)
        console.log(this.zoom)
        $(this.refs.out).removeClass("disabled")
        $(this.refs.full).removeClass("disabled")
    }

    zoomOut() {
        this.zoom /= 1.1
        if(this.zoom<this.full_zoom) {
            this.full()
            return
        }
        wavesurfer.zoom(this.zoom)
    }

    full() {
        this.zoom = this.full_zoom;
        console.log("full: ", this.zoom)
        wavesurfer.zoom(this.zoom)
        $(this.refs.out).addClass("disabled")
        $(this.refs.full).addClass("disabled")
    }

    region() {
        return wavesurfer.regions.list[Object.keys(wavesurfer.regions.list)[0]] || {start:0, end:wavesurfer.getDuration()}
    }

    trim() {
        if(Object.keys(wavesurfer.regions.list).length==0) {
            return alert("Please select region")
        }
        if(!confirm("Trim audio?"))
          return;
        console.log("trimming", this.region().start, this.region().end - this.region().start)
        $("form.trim input[name='trim[start]']").val(this.region().start)
        $("form.trim input[name='trim[duration]']").val(this.region().end - this.region().start)
        $("form.trim").submit()

    }

    cut() {
        if(Object.keys(wavesurfer.regions.list).length==0) {
            return alert("Please select region")
        }
        if(!confirm("Cut audio?"))
            return;
        console.log("trimming", this.region().start, this.region().end - this.region().start)
        $("form.cut input[name='cut[start]']").val(this.region().start)
        $("form.cut input[name='cut[duration]']").val(this.region().end - this.region().start)
        $("form.cut").submit()
    }

    render() {
        return (
            <div>
                <div id="waveform"></div>
                <div id="waveform-timeline"></div>
                <div style={{marginTop:"5px"}}>
                  <div className="btn btn-default" onClick={this.play.bind(this)} title='play'>
                    <i className='fa fa-play'></i>
                  </div>
                  <div className="btn btn-default" onClick={this.stop.bind(this)} title="stop">
                    <i className='fa fa-stop'></i>
                  </div>
                  <div className="btn btn-default" ref="in" style={{marginLeft: "10px"}} onClick={this.zoom.bind(this)} title="zoom in">
                    <i className='fa fa-search-plus'></i>
                  </div>
                  <div className="btn btn-default" ref="out" onClick={this.zoomOut.bind(this)} title="zoom out">
                    <i className='fa fa-search-minus'></i>
                  </div>
                  <div className="btn btn-default" ref="full" onClick={this.full.bind(this)}>Full</div>
                  <div className="btn btn-default" style={{marginLeft: "10px"}} onClick={this.trim.bind(this)} title="trim">
                    <i className='fa fa-crop'></i> Trim
                  </div>
                  <div className="btn btn-default" onClick={this.cut.bind(this)} title="cut selected region">
                    <i className='fa fa-cut'></i> Cut
                  </div>
                </div>
            </div>
        )

    }

}
