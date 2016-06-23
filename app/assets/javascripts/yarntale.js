//= require jquery
//= require jquery-ui


window.YARNTALE = {
    el: null, //hosting DOM element
    playng: false,
    cur_slide_index: 0,
    cur_slide_line_offset: 0,
    audio: null,
    slides: [], //array of objects {image,audio,captions}
}

YARNTALE.volume = function(value,update_control, update_indicator) {
  if(typeof(value)=='undefined') {
    return localStorage['YARN_VOL']
  }
  if(typeof(update_control)=='undefined') {
    update_control = true;
  }
  if(typeof(update_indicator)=='undefined') {
    update_indicator = true;
  }

  if(value<0) {
    value = 0;
  }
  if(value>1) {
    value = 1;
  }
  console.log('set volume', value)
  localStorage['YARN_VOL'] = value;
  media = this.el.find(".audio")[0]
  media.volume = localStorage['YARN_VOL'];

  vol = value

  if(update_control) {

    var button = this.el.find(".volume_slider .button")
    var slider = this.el.find(".volume_slider")

    console.log("changing volume button position")
    console.log(vol)

    button.css("top",(1-vol)*(slider.height()- button.height()))


  }

  if(update_indicator) {
    var i = this.el.find(".volume i")
    i.removeClass("fa-volume-up fa-volume-down fa-volume-off")
    if(vol==1) {
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
      return false;
  }
  if(v>this.slides.length) {
      console.log(">total slides")
      return false;
  }
  this.cur_slide_line_offset = v;
  var new_margin_left = -$(".slide").first().width()*v;
  console.log("new margin left", new_margin_left)
  $(".slides .platform").animate({ "margin-left": new_margin_left },50)
  return true;
}

YARNTALE.slides_in_slide_line = function() {
  return Math.ceil($(".slides").width() / $(".slide").first().width())
}

YARNTALE.log = function(s) {
    console.log("YARNTALE: "+s)
}

YARNTALE.attach_to = function(selector) {
    this.el = $(selector)

    this.el.append( ""
    )

    var self = this;
    var timeline = this.el.find(".timeline")

    console.log("building timeline")
    $.each(this.slides,function(i,slide) {
      console.log(slide)
      timeline.find(".slides .platform").append("<img class='slide' data-index="+i+" src="+slide.image.thumb+">")
    })


    $(document).on("click",".yarntale .timeline .slide",function() {
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



/*    $(document).on('dragstart', '.yarntale *', function(event) { 
      if(!$(this).hasClass('ui-draggable'))
        event.preventDefault(); 
    });*/

    $(".yarntale .audio")[0].onended = function() {
        YARNTALE.log('audio ended')
        YARNTALE.next()
    }

    $('.yarntale .volume_slider .button').draggable({
      containment: '.volume_slider',
      drag: function() {
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

    this.volume(localStorage['YARN_VOL'])

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
    } else {
        this.setSlideIndex(this.cur_slide_index+1)
    }
}

YARNTALE.setSlideIndex = function(i) {
    this.log("set slide index")
    this.cur_slide_index = i;

    this.el.find(".timeline img.slide").removeClass("current")
    this.el.find(".timeline img.slide[data-index="+i+"]").addClass("current")

    this.el.find("> .cur_slide").attr('src',this.slides[i].image.original)

    if(this.playing) {
        this.play()
    }
    this.el.find(".caption").html(this.slides[i].caption)
    $(".nav").attr("style","")
    if(i==0) {
        $(".top .nav.prev").attr("style","display:none");
    }
    if(i==this.slides.length-1) {
        $(".top .nav.next").attr("style","display:none");
    }
    return this;
}

YARNTALE.start = function() {
  this.setSlideIndex(0)
  this.play()
  return this;
}


YARNTALE.play = function() {
    this.playing = true
    this.el.find(".audio").attr("src",this.slides[this.cur_slide_index].audio)
    media = this.el.find(".audio")[0]
    media.volume = localStorage['YARN_VOL'] || 1;
    media.play()
    this.el.find(".control .play").hide()
    this.el.find(".control .pause").show()
    return this;
}

YARNTALE.pause = function() {
  this.playing = false
  this.el.find(".audio")[0].pause()
  this.el.find(".control .play").show()
  this.el.find(".control .pause").hide()
  return this;
}


$(function() {

    if (localStorage['TIMELINE_FORCE']=='true') {
      $(".timeline").css("display", "inline-block");
    }

})