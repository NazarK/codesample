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

    this.el.append( ""
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

    $(document).on('dragstart', '.yarntale *', function(event) { event.preventDefault(); });
    
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

    this.el.find("> .cur_slide").attr('src',this.slides[i].image.original)

    if(this.playing) {
        this.play()
    }
    this.el.find(".caption").html(this.slides[i].caption)
    $(".nav").attr("style","")
    if(i==0) {
        $(".nav.prev").attr("style","display:none");
    }
    if(i==this.slides.length-1) {
        $(".nav.next").attr("style","display:none");
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




})