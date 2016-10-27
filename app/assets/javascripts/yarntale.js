//= require jquery
//= require jquery-ui
//= require fitie
//= require fitie.apply
//= require jquery.fullscreen
//= require cursor-auto-hide
//= require react
//= require react_ujs
//= require components


window.YARNTALE = {
    el: null, //hosting DOM element
    playing: false, //triggered by play/pause button
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
    if(typeof(value) == 'undefined') {
      return (localStorage['YARN_CC_ENABLED']!='false')
    }

    this.log("setting cc enabled",value)

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
  if(media && YARNTALE.cur_slide_index>0) {
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

YARNTALE.set_cur_slide_line_offset = function(slides_platform_ofs) {
  this.log("set cur slide line offset",slides_platform_ofs)

  var max_ofs = this.slides.length-this.slides_in_slide_line()+2
  if(max_ofs<0) {
    max_ofs = 0
  }
  console.log("max_ofs", max_ofs)

  if(slides_platform_ofs<0) {
      this.log("<0")
      slides_platform_ofs = 0;
  } else if(slides_platform_ofs>max_ofs) {
      this.log("too big, setting to max value", max_ofs)
      slides_platform_ofs = max_ofs
  }
  this.cur_slide_line_offset = slides_platform_ofs;
  var new_margin_left = -this.TIMELINE_SLIDE_WIDTH*slides_platform_ofs;
  console.log("new margin left", new_margin_left)
  $(".slides .platform").css({ "margin-left": new_margin_left })
  return true;
}

YARNTALE.slides_in_slide_line = function() {
  ret = Math.floor(this.TIMELINE_SLIDES_WIDTH / this.TIMELINE_SLIDE_WIDTH)
  this.log("slides_in_slide_line",ret)
  return ret;
}

YARNTALE.log = function() {
    console.log("YARNTALE: ", arguments)
}


YARNTALE.youtube_library_load = function(callback) {
  window.onYouTubeIframeAPIReady = callback
  var tag = document.createElement('script');

  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}



YARNTALE.render_to = function(selector) {
    console.log("YARNTALE.prepare")
    if(this.slides.length==0) {
      alert("No slides in this tale.")
      return
    }
        
    
    this.el = $(selector)
    

    this.el.append( "" )

    var timeline_height = 50
    if(window.is_mobile_browser) {
      timeline_height = Math.min(this.el.width(),this.el.height())/9;
    }
    
    console.log("timeline height: ", timeline_height)
    
    ReactDOM.render(React.createElement(Timeline,{height:timeline_height, slides:this.slides}),this.el.find(".timeline_container")[0])
    ReactDOM.render(React.createElement(SlideView,{cover:this.cover, slides:this.slides}),this.el.find(".slide_view_container")[0])



    var self = this;
    
    YARNTALE.youtube_library_load(function() {
      console.log("youtube library loaded")
      $(".slide.youtube").each(function() {
        var slide_i = $(this).data("index")
        YARNTALE.youtube_player_create(slide_i)        
      })
    })


    this.TIMELINE_HEIGHT = this.el.find(".timeline .slide").outerHeight()
    this.TIMELINE_SLIDE_WIDTH = Math.floor(this.TIMELINE_HEIGHT * 960/640);
    this.TIMELINE_SLIDES_WIDTH = this.el.find(".slides .platform").width();

    var images_loaded = 0;
    YARNTALE.showCover()
    
    self.el.find(".slide_view .slide").load(function() {
      images_loaded ++
      YARNTALE.log("slide loaded",$(this),images_loaded)
      if(images_loaded == YARNTALE.slides.length) {
        console.log("all loadeded")
      }
    })
    
    
    YARNTALE.ui_event_handlers_attach()


    if(this.audio) {
      this.el.find(".audio").attr("src",this.audio);
      this.el.find(".audio")[0].loop = true
    }

    this.volume(localStorage['YARN_VOL'])


    this.cc_enabled(this.cc_enabled())

    return this;
}


YARNTALE.ui_event_handlers_attach = function() {

  $('.slide_view video').on('ended',function(e) {
    YARNTALE.log("video ended, video duration: ",this.duration)
    if(this.duration>YARNTALE.slide_duration) {
      YARNTALE.next({on_auto_next:true})
    }
  })
  
  $(document).on("click",".yarntale .play_toggle", function() {
    console.log(".play_toggle clicked")
    if(YARNTALE.playing) {
      $(".state_icon.pause").show().fadeOut(1000)
      YARNTALE.pause()
    } else {
      $(".state_icon.play").show().fadeOut(1000)
      YARNTALE.play()
    }
  })

  $(document).on("click",".yarntale .nav.next",function() {
      YARNTALE.do_while_keeping_play_state(function() {
          YARNTALE.next()
      })
  })

  $(document).on("click",".yarntale .nav.prev",function() {
    if(YARNTALE.cur_slide_index<=0) return;
    
    YARNTALE.do_while_keeping_play_state(function() {
      YARNTALE.prev()
    })

  })


  $(document).on("click",".yarntale .slides_line_nav.prev",function() {
      YARNTALE.set_cur_slide_line_offset(YARNTALE.cur_slide_line_offset - YARNTALE.slides_in_slide_line())
  })

  $(document).on("click",".yarntale .slides_line_nav.next",function() {
      YARNTALE.set_cur_slide_line_offset(YARNTALE.cur_slide_line_offset + YARNTALE.slides_in_slide_line())
  })
  
  $(document).on('fullscreenchange',function(e) {
    $(".fullscreen").toggleClass("disabled", !$(document).fullScreen())
  })
  
  $(document).on('click','.sensor.top, .slide_view', function() {
    //click on cover
    if(YARNTALE.cur_slide_index == -1 ) {
      console.log("autoplay on cover click")
      YARNTALE.play()
    }
  })


  $(document).on('keyup',function(e) {
    if(e.key=="ArrowLeft" || e.key=="PageUp") {
      YARNTALE.do_while_keeping_play_state(function() {
          YARNTALE.prev()
      })
    }

    if(e.key=="ArrowRight" || e.key=="PageDown") {
      YARNTALE.do_while_keeping_play_state(function() {
          YARNTALE.next()
      })
    }
    if(e.key=="Home") {
      YARNTALE.pause()
      YARNTALE.setSlideIndex(0)
    }
    if(e.key=="End") {
      YARNTALE.pause()
      YARNTALE.setSlideIndex(YARNTALE.slides.length-1)
    }

    if(e.key==" ") {
      if(YARNTALE.playing) {
        YARNTALE.pause()
      } else {
        YARNTALE.play()
      }  
    }
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
        YARNTALE.next({on_auto_next:true})
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

  $('.fullscreen').click(function() {
    $(YARNTALE.el).toggleFullScreen()
  })
  
  $('.cc').click(function() {
    YARNTALE.cc_enabled(!YARNTALE.cc_enabled())
  })
    
}


YARNTALE.prev = function() {
    if(this.cur_slide_index>0) {
        this.setSlideIndex(this.cur_slide_index-1)
    }
}

YARNTALE.next = function(opt) {
    opt = opt || {}
    this.log("next")
    if(this.cur_slide_index+1>=this.slides.length) {
        this.log("tale ended")
        YARNTALE.pause()
    } else {
        this.setSlideIndex(this.cur_slide_index+1,opt)
    }
}


YARNTALE.setSlideIndex = function(i,opt) {
    this.log("set slide index",i)
    if(i<0 || i>this.slides.length) {
      YARNTALE.log("slide index out of range",i)
      return;
    }
    opt = opt || {}
    this.cur_slide_index = i;

    this.el.find(".timeline .slide.current").removeClass("current")
    this.el.find(".timeline .slide[data-index="+i+"]").addClass("current")

    if(this.cur_slide().video) {
      this.cur_slide_el().currentTime = 0
    }


    this.el.find(".slide_view .slide.active").removeClass("active")
    this.el.find(".slide_view .slide[data-index="+i+"]").addClass("active")

    if(this.playing) {
        this.play(opt)
    }

    this.el.find(".caption .text").html(this.slides[i].caption)
    this.adjust_nav_buttons(i)

    this.set_cur_slide_line_offset(this.cur_slide_index-Math.floor(this.slides_in_slide_line()/2-1))

    $(this.el).removeClass("pending_next")

    return this;
}

YARNTALE.start = function() {
  console.log("YARNTALE.start")
  this.setSlideIndex(0)
  this.play()
  return this;
}


YARNTALE.cur_slide = function() {
  //showing cover case - index == -1
  if(this.cur_slide_index==-1)
    return { video: false, audio: false, image: false }
  return this.slides[this.cur_slide_index]
}

YARNTALE.cur_slide_el = function() {
  return this.el.find(".slide_view .slide[data-index="+this.cur_slide_index+"]").find("img,video")[0]
}

YARNTALE.play = function(opt) {
    opt = opt || {}
  
    if(this.cur_slide_index==-1) {
      this.setSlideIndex(0)
    }

    this.playing = true
    
    $(this.el).addClass("playing")

    //if there is audio
    if(this.cur_slide().audio) {
      console.log("playing audio")
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
    
    if(this.cur_slide().youtube) {
      console.log("playing youtube")      
      var slide = YARNTALE.cur_slide()
      var start = slide.youtube_video_start_i
      slide.youtube_player.seekTo(start).playVideo()
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
        } else if(YARNTALE.cur_slide().youtube) {
          cur_slide_duration = YARNTALE.cur_slide().duration
        } else {
          cur_slide_duration = YARNTALE.el.find(".slide_audio")[0].duration || 0
        }

        YARNTALE.log('trigger next timer, cur slide media duration: ', cur_slide_duration)
        if(cur_slide_duration<=YARNTALE.slide_duration) {
          YARNTALE.next({on_auto_next:true})
        }
      }
    },YARNTALE.slide_duration*1000)


    //background audio
    if(this.audio) {
      tale_background = this.el.find(".audio")[0]
      if(YARNTALE.cur_slide().mute_background_audio) {
        vol = 0;
      } else {
        vol = (localStorage['YARN_VOL'] || 1)*this.audio_vol
        YARNTALE.log("playing background, volume: ", vol)
      }
      if(tale_background.volume!=vol)
        tale_background.volume = vol      
      //don't adjust position and click play if it is auto next slide
      if(!opt.on_auto_next) {
        if(YARNTALE.audio_snap_to_slides) {
          var new_pos = (this.slides[this.cur_slide_index].position % tale_background.duration)
          YARNTALE.log("setting background audio position from to", tale_background.currentTime, new_pos )
          tale_background.currentTime = new_pos
          tale_background.play()
        } else {
          if(tale_background.paused) {
            tale_background.play()
          }
        }
        
      }
      
    }
    
    



    this.el.find(".control .play").hide()
    this.el.find(".control .pause").show()

    return this;
}

YARNTALE.pause = function() {
  this.playing = false
  $(this.el).removeClass("playing").removeClass("pending_next")  
  clearTimeout(this.trigger_next_timer)
  this.el.find(".slide_audio")[0].pause()
  this.el.find(".audio")[0].pause()
  this.el.find(".control .play").show()
  this.el.find(".control .pause").hide()
  if(this.cur_slide().video) {
    video = this.el.find(".slide_view .slide[data-index=" + this.cur_slide_index+"] video")[0]
    video.pause()
  }
  if(this.cur_slide().youtube) {
    this.cur_slide().youtube_player.pauseVideo()
  }
  this.setSlideIndex(this.cur_slide_index)
  return this;
}

YARNTALE.showCover = function() {
  this.el.find(".timeline img.slide.current").removeClass("current")
  this.el.find(".slide_view .slide.active").removeClass("active")

  this.el.find(".slide_view .slide.cover").addClass("active")
  this.adjust_nav_buttons(-1)
  this.cur_slide_index = -1;
}

YARNTALE.adjust_nav_buttons = function(i) {
  $(".nav").attr("style","")
  //-1 - is for cover, 0 - first slide
  if(i<=0) {
      $(".top .nav.prev").attr("style","display:none");
  }
  if(i==this.slides.length-1) {
      $(".top .nav.next").attr("style","display:none");
  }
}

YARNTALE.process_data_src = function() {
  this.el.find("*[data-src]").each(function() {
    $(this).attr('src',$(this).attr("data-src"))
  })
  window.fitie.apply()
}

YARNTALE.do_while_keeping_play_state = function(yield) {
  var was_playing = YARNTALE.playing;

  YARNTALE.pause()
  yield()
  if(was_playing) {
    console.log("was playing")
    if(YARNTALE.cur_slide().youtube) {
      setTimeout(YARNTALE.play.bind(YARNTALE),200)
    } else {
      YARNTALE.play()
    }
  }

}

YARNTALE.youtube_player_create = function(slide_index) {
  function on_youtube_ready(event) {
    console.log('youtube player ready',event)
    var slide_index = $(event.target.a).parent(".slide").data("index")
    console.log($(event.target.a).parent(".slide"))
    console.log('slide index', slide_index)
    var start = YARNTALE.slides[slide_index].youtube_video_start_i
    event.target.seekTo(start).pauseVideo() //trying to buffer
  }

  function on_youtube_state_change(event) {
    console.log(event)
    if(event.data==YT.PlayerState.PAUSED && YARNTALE.playing) {
      $(".state_icon.pause").show().fadeOut(1000)      
      YARNTALE.pause()
    }
    if(event.data==YT.PlayerState.ENDED) {
        YARNTALE.log("youtube video ended")
        //don't skip to next if this video is shorter than default slide duration
        if(YARNTALE.cur_slide().duration>YARNTALE.slide_duration) {
          YARNTALE.next({on_auto_next:true})
        } else {
          $(YARNTALE.el).addClass("pending_next")
        }
    }
  }
  YARNTALE.slides[slide_index].youtube_player = new YT.Player('youtube-slide-'+slide_index, {
    events: { onReady: on_youtube_ready, onStateChange: on_youtube_state_change }
  })
  
}

$(function() {

})
