//= require jquery
//= require jquery-ui


window.YARNTALE = {
    el: null, //hosting DOM element
    playng: false, //triggered by play/pause button
    cur_slide_index: 0,
    cur_slide_line_offset: 0,
    audio: null,
    audio_vol: 1,
    TIMELINE_HEIGHT: null,
    TIMELINE_SLIDE_WIDTH: null,
    TIMELINE_SLIDES_WIDTH: null,
    slides: [], //array of objects {image,audio,captions}
}

YARNTALE.cc_enabled = function(value, update_controls) {
    if(typeof(value) == 'undefined')
      return localStorage['YARN_CC_ENABLED'] || true;


    localStorage['YARN_CC_ENABLED'] = value;

    this.el.find(".cc, .caption").removeClass("disabled")

    if(!value) {
        this.el.find(".cc, .caption").addClass("disabled")
    }
}

YARNTALE.volume = function(value,update_control, update_indicator) {
  if(typeof(value)=='undefined')
    return localStorage['YARN_VOL']

  if(typeof(update_control)=='undefined')
    update_control = true;

  if(typeof(update_indicator)=='undefined')
    update_indicator = true;


  if(value<0)
    value = 0;

  if(value>1)
    value = 1;

  localStorage['YARN_VOL'] = value;
  var media;

  if(YARNTALE.cur_slide().video) {
    media = YARNTALE.cur_slide_el()
  } else {
    media = this.el.find(".slide_audio")[0]
  }
  if(media) {
    media.volume = YARNTALE.cur_slide().audio_vol * localStorage['YARN_VOL'];
  }  

  tale_background = this.el.find(".audio")[0]
  tale_background.volume = localStorage['YARN_VOL']*this.audio_vol;

  vol = value

  if(update_control) {

    var button = this.el.find(".volume_slider .button")
    var slider = this.el.find(".volume_slider")

    console.log("changing volume button position")
    console.log(vol)

    var new_top = (1-vol)*(slider.height()- button.height())
    console.log("new top",new_top)
    button.css("top",new_top)

  }

  if(update_indicator) {
    var i = this.el.find(".volume i")
    i.removeClass("fa-volume-up fa-volume-down fa-volume-off")
    if(vol>=0.9) {
      i.addClass("fa-volume-up")
    } else if(vol==0) {
      i.addClass("fa-volume-off")
    } else {
      i.addClass("fa-volume-down")
    }
  }


}

YARNTALE.set_cur_slide_line_offset = function(v) {
  console.log("set cur slide line offset",v)
  if(v<0) {
      console.log("<0")
      v = 0;
      //return false;
  } else if(v>(this.slides.length-this.slides_in_slide_line()+1)) {
      console.log(">total slides")
      v = this.slides.length-this.slides_in_slide_line()+1
      //return false;
  }
  this.cur_slide_line_offset = v;
  var new_margin_left = -this.TIMELINE_SLIDE_WIDTH*v;
  console.log("new margin left", new_margin_left)
  $(".slides .platform").css({ "margin-left": new_margin_left })
  return true;
}

YARNTALE.slides_in_slide_line = function() {
  ret = Math.ceil(this.TIMELINE_SLIDES_WIDTH / this.TIMELINE_SLIDE_WIDTH)
  this.log("slides_in_slide_line",ret)
  return ret;
}

YARNTALE.log = function() {
    console.log("YARNTALE: ", arguments)
}

YARNTALE.attach_to = function(selector) {
    if(this.slides.length==0) {
      alert("No slides in this tale.")
      return
    }
    this.el = $(selector)


    var yarntale_width = $(selector).width()
    console.log("yarntale width: ", yarntale_width);
    $(selector).css("height",$(selector).width()*640/960)

    console.log("YARNTALE.attach_to")
    this.el.append( "" )

    var self = this;
    var timeline = this.el.find(".timeline")

    console.log("building timeline")
    if(this.cover) {
      self.el.find(".slides_wrapper").append("<img class='slide cover' src="+this.cover.original+">")
    } else {
      self.el.find(".slides_wrapper").append("<img class='slide cover' src="+this.slides[0].image.original+">")
    }

    var slides_wrapper = self.el.find(".slides_wrapper")
    var timeline = self.el.find(".timeline .slides .platform")
    $.each(this.slides,function(i,slide) {
      //console.log(slide)
      if(slide.video) {
        slides_wrapper.append("<video class='slide' data-index="+i+" data-src="+slide.video +">")
        timeline.append("<div class='slide' data-index="+i+"><video onloadedmetadata='this.currentTime="+slide.video_thumb_pos+"' data-src="+slide.video+"></div>")
      } else {
        slides_wrapper.append("<img class='slide' data-index="+i+" data-src="+slide.image.original+">")
        timeline.append("<img class='slide' data-index="+i+" data-src="+slide.image.thumb+">")
      }
    })

    this.TIMELINE_HEIGHT = this.el.find("img.slide").outerHeight()
    this.TIMELINE_SLIDE_WIDTH = Math.floor(this.TIMELINE_HEIGHT * 960/640);
    this.TIMELINE_SLIDES_WIDTH = this.el.find(".slides .platform").width();


    this.el.find(".timeline-height").css({
        height: this.TIMELINE_HEIGHT + "px",
        "line-height": this.TIMELINE_HEIGHT+"px",
        "font-size":this.TIMELINE_HEIGHT+"px"})

    var images_loaded = 0;
    YARNTALE.showCover()
    self.el.find(".slide.cover").load(function() {
      YARNTALE.start_loading_media()
    })

    self.el.find(".slides_wrapper .slide").load(function() {
      images_loaded ++
      YARNTALE.log("slide loaded",$(this),images_loaded)
      if(images_loaded == YARNTALE.slides.length) {
        console.log("all loadeded")
        YARNTALE.setSlideIndex(0)
      }
    })

    $('video').on('ended',function(e) {
      YARNTALE.log("video ended, video duration: ",this.duration)
      if(this.duration>YARNTALE.slide_duration) {
        YARNTALE.next()
      }
    })

    $(document).on("click",".yarntale .timeline .slide",function() {
        YARNTALE.pause()
        YARNTALE.setSlideIndex($(this).data("index"))
    })


    $(document).on("click",".yarntale .sensor.right",function() {
        YARNTALE.next()
    })

    $(document).on("click",".yarntale .sensor.left",function() {
        YARNTALE.prev()
    })


    $(document).on("click",".yarntale .control .play",function() {
        YARNTALE.play()
    })

    $(document).on("click",".yarntale .control .pause",function() {
        YARNTALE.pause()
    })

    $(document).on("click",".yarntale .slides_line_nav.prev",function() {
        YARNTALE.set_cur_slide_line_offset(YARNTALE.cur_slide_line_offset - YARNTALE.slides_in_slide_line())
    })

    $(document).on("click",".yarntale .slides_line_nav.next",function() {
        YARNTALE.set_cur_slide_line_offset(YARNTALE.cur_slide_line_offset + YARNTALE.slides_in_slide_line())
    })


   $(document).on('dragstart', '.yarntale *', function(event) {
      if(!$(this).hasClass("drag-enabled"))
        event.preventDefault();
    });

    $(".yarntale .slide_audio")[0].onended = function() {
        YARNTALE.log('audio ended, this audio duration: ', this.duration)
        //only trigger if audio duration is longer
        //otherwise it will be triggered by timer
        if(this.duration>YARNTALE.slide_duration) {
          YARNTALE.next()
        }
    }

    $('.yarntale .volume_slider .button').draggable({
      containment: '.volume_slider',
      axis: "y",
      drag: function(e,ui) {
        if(ui.position.top < 0)
            ui.position.top = 0;

        var top = $(this).position().top
        var total = $(this).parent(".volume_slider").height() - $(this).height()

        var volume = (total-top)/total;

        YARNTALE.volume(volume,false)
      }
    })

    $(".volume").click(function() {
      if(YARNTALE.volume()>0) {
        localStorage['YARN_VOL_SAVE'] = YARNTALE.volume()
        YARNTALE.volume(0)
      } else
      if(YARNTALE.volume()==0) {
        YARNTALE.volume(localStorage['YARN_VOL_SAVE'])
      }

    })

    $('.cc').click(function() {
        YARNTALE.cc_enabled(!(YARNTALE.cc_enabled()=='true'))
    })

    if(this.audio) {
      this.el.find(".audio").attr("src",this.audio);
    }

    this.volume(localStorage['YARN_VOL'])

    this.cc_enabled(this.cc_enabled()=='true')

    return this;
}


YARNTALE.prev = function() {
    if(this.cur_slide_index>0) {
        this.setSlideIndex(this.cur_slide_index-1)
    }
}

YARNTALE.next = function() {
    this.log("next")
    if(this.cur_slide_index+1>=this.slides.length) {
        this.log("tale ended")
        YARNTALE.pause()
    } else {
        this.setSlideIndex(this.cur_slide_index+1)
    }
}

YARNTALE.setSlideIndex = function(i) {
    this.log("set slide index",i)
    this.cur_slide_index = i;

    this.el.find(".timeline .slide.current").removeClass("current")
    this.el.find(".timeline .slide[data-index="+i+"]").addClass("current")

    if(this.cur_slide().video) {
      var video = this.el.find(".slides_wrapper .slide[data-index="+this.cur_slide_index+"]")[0]
      video.currentTime = 0;
    }


    this.el.find(".slides_wrapper .slide.active").removeClass("active")
    this.el.find(".slides_wrapper .slide[data-index="+i+"]").addClass("active")

    if(this.playing) {
        this.play()
    }

    this.el.find(".caption .text").html(this.slides[i].caption)
    $(".nav").attr("style","")
    if(i==0) {
        $(".top .nav.prev").attr("style","display:none");
    }
    if(i==this.slides.length-1) {
        $(".top .nav.next").attr("style","display:none");
    }

    this.set_cur_slide_line_offset(this.cur_slide_index-Math.floor(this.slides_in_slide_line()/2-1))

    return this;
}

YARNTALE.start = function() {
  console.log("YARNTALE.start")
  this.setSlideIndex(0)
  this.play()
  return this;
}


YARNTALE.cur_slide = function() {
  return this.slides[this.cur_slide_index]
}

YARNTALE.cur_slide_el = function() {
  return this.el.find(".slides_wrapper .slide[data-index="+this.cur_slide_index+"]")[0]
}

YARNTALE.play = function() {
    this.playing = true

    //if there is audio
    if(this.cur_slide().audio) {
      this.el.find(".slide_audio").attr("src",this.slides[this.cur_slide_index].audio)
      var media = this.el.find(".slide_audio")[0]
      media.volume = localStorage['YARN_VOL'] || 1;
      media.volume *= this.cur_slide().audio_vol
      media.play() //this will trigger next on media end
    } else {
      this.el.find(".slide_audio").attr("src","")
    }

    //if there is video
    if(this.cur_slide().video) {
      console.log("playing video")
      var media = this.cur_slide_el()
      media.volume = localStorage['YARN_VOL'] || 1;
      media.volume *= this.cur_slide().audio_vol
      media.play()
    }

    //setup trigger
    //should work automatically if no audio, or audio is shorter
    //no action if audio is longer
    this.trigger_next_timer = setTimeout(function() {
      if(YARNTALE.playing) {
        //if current slide audio is shorter (it should be stopped at this moment)
        //or if slide audio is empty
        var cur_slide_duration = 0
        if(YARNTALE.cur_slide().video) {
          cur_slide_duration = YARNTALE.cur_slide_el().duration || 0
        } else {
          cur_slide_duration = YARNTALE.el.find(".slide_audio")[0].duration || 0
        }

        YARNTALE.log('trigger next timer, cur slide media duration: ', cur_slide_duration)
        if(cur_slide_duration<YARNTALE.slide_duration) {
          YARNTALE.next()
        }
      }
    },YARNTALE.slide_duration*1000)


    if(this.audio) {
      tale_background = this.el.find(".audio")[0]
      tale_background.loop = true
      vol = (localStorage['YARN_VOL'] || 1)*this.audio_vol
      YARNTALE.log("playing background, volume: ", vol)
      tale_background.volume = vol
      tale_background.currentTime = (this.slides[this.cur_slide_index].position % tale_background.duration)
      tale_background.play()
    }



    this.el.find(".control .play").hide()
    this.el.find(".control .pause").show()

    return this;
}

YARNTALE.pause = function() {
  this.playing = false
  clearTimeout(this.trigger_next_timer)
  this.el.find(".slide_audio")[0].pause()
  this.el.find(".audio")[0].pause()
  this.el.find(".control .play").show()
  this.el.find(".control .pause").hide()
  if(this.cur_slide().video) {
    video = this.el.find(".slides_wrapper .slide[data-index=" + this.cur_slide_index+"]")[0]
    video.pause()
  }
  return this;
}

YARNTALE.showCover = function() {
  this.el.find(".timeline img.slide.current").removeClass("current")
  this.el.find(".slides_wrapper .slide.active").removeClass("active")

  this.el.find(".slides_wrapper img.slide.cover").addClass("active")
}

YARNTALE.start_loading_media = function() {
  this.el.find(".slide[data-src], .slide video[data-src]").each(function() {
    $(this).attr('src',$(this).attr("data-src"))
  })
}

$(function() {

    if (localStorage['TIMELINE_FORCE']=='true') {
      $(".timeline").css("height", "96px");
    }
})
