window.YARNTALE = {
    el: null, //hosting DOM element
    playng: false,
    cur_slide_index: 0,
    audio: null,
    slides: [], //array of objects {image,audio,captions}
}

YARNTALE.log = function(s) {
    console.log("YARNTALE: "+s)
}

YARNTALE.attach_to = function(selector) {
    this.el = $(selector)

    this.el.append(
      '<div class="nav prev"><i class="fa fa-chevron-left" aria-hidden="true"></i></div>'+
      '<div class="nav next"><i class="fa fa-chevron-right" aria-hidden="true"></i></div>'+
      '<img class="slide"><div class="caption"></div><div class="timeline">'+
      '<img class="slide"><div class="caption"></div><div class="timeline">'+
      '<div class="control">'+
      '<div class="pause"><i class="fa fa-pause" aria-hidden="true"></i></div>'+
      '<div class="play"><i class="fa fa-play" aria-hidden="true"></i></div>'+
      '</div>'+
      '<div class="slides"></div>'+
      '</div><audio class="audio"></audio>'
    )

    var self = this;
    var timeline = this.el.find(".timeline")

    console.log("building timeline")
    $.each(this.slides,function(i,slide) {
      console.log(slide)
      timeline.find(".slides").append("<img class='slide' data-index="+i+" src="+slide.image.thumb+">")
    })


    $(document).on("click",".yarntale .timeline .slide",function() {
        YARNTALE.setSlideIndex($(this).data("index"))
    })


    $(document).on("click",".yarntale .nav.next",function() {
        YARNTALE.next()
    })

    $(document).on("click",".yarntale .nav.prev",function() {
        YARNTALE.prev()
    })


    $(document).on("click",".yarntale .control .play",function() {
        YARNTALE.play()
    })

    $(document).on("click",".yarntale .control .pause",function() {
        YARNTALE.pause()
    })

    $(".yarntale .audio")[0].onended = function() {
        YARNTALE.log('audio ended')
        YARNTALE.next()
    }
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

    this.el.find("> .slide").attr('src',this.slides[i].image.original)

    if(this.playing) {
        this.play()
    }
    this.el.find(".caption").html(this.slides[i].caption)
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




})