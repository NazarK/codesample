class AudioGraph extends React.Component {
    componentDidMount() {
        window.audiograph = this

        window.wavesurfer = WaveSurfer.create({
            container: "#waveform",
            waveColor: "black",
            //barWidth: 2,
            progressColor: "black"
        })


        self = this
        wavesurfer.on('ready', function () {
            wavesurfer.enableDragSelection({});
            var timeline = Object.create(WaveSurfer.Timeline);

            timeline.init({
                wavesurfer: wavesurfer,
                container: '#waveform-timeline'
            });
            self.full()

        });

        wavesurfer.on("pause", function() {
            console.log("pause")
            wavesurfer.seekTo(self.region().start/wavesurfer.getDuration())
        })

        wavesurfer.on('region-created', function() {
            wavesurfer.clearRegions()

        })


        wavesurfer.load(this.props.audio)


    }

    play() {
        wavesurfer.play(this.region().start, this.region().end)
    }

    stop() {
        wavesurfer.stop()
    }

    zoom() {
        this.zoom *= 1.1;
        wavesurfer.zoom(this.zoom)
        console.log(this.zoom)
    }

    zoomOut() {
        this.zoom /= 1.1
        wavesurfer.zoom(this.zoom)
    }

    full() {
        this.zoom = 360
        wavesurfer.zoom(this.zoom)
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

    render() {
        return (
            <div>
                <div id="waveform"></div>
                <div id="waveform-timeline"></div>
                <div className="btn btn-default" onClick={this.play.bind(this)}>Play</div>
                <div className="btn btn-default" onClick={this.stop.bind(this)}>Stop</div>
                <div className="btn btn-default" onClick={this.zoom.bind(this)}>Zoom In</div>
                <div className="btn btn-default" onClick={this.zoomOut.bind(this)}>Zoom Out</div>
                <div className="btn btn-default" onClick={this.full.bind(this)}>Full</div>
                <div className="btn btn-default" onClick={this.trim.bind(this)}>Trim</div>
            </div>
        )

    }

}
