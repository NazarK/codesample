window.YARNTALE = {
    el: null, //hosting DOM element
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
      '<img class="slide"><div class="caption"></div><div class="timeline"></div><audio class="audio"></audio>'
    )

    var self = this;
    var timeline = this.el.find(".timeline")

    console.log("building timeline")
    $.each(this.slides,function(i,slide) {
      console.log(slide)
      timeline.append("<img class='slide' data-index="+i+" src="+slide.image+">")
    })


    $(document).on("click",".yarntale .timeline .slide",function() {
        YARNTALE.setSlideIndex($(this).data("index"))
    })

    $(".yarntale .audio")[0].onended = function() {
        YARNTALE.log('audio ended')
        YARNTALE.next()
    }
    return this;

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

    this.el.find("> .slide").attr('src',this.slides[i].image)

    this.el.find(".audio").attr("src",this.slides[i].audio)
    this.el.find(".audio")[0].play()

    this.el.find(".caption").html(this.slides[i].caption)
}

YARNTALE.start = function() {
    this.setSlideIndex(0)
    return this;
}



$(function() {




})