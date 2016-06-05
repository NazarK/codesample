window.YARNTALE = {
    el: null, //hosting DOM element
    cur_slide_index: 0,
    slides: [], //array of objects {image,audio,captions}
}



YARNTALE.attach_to = function(selector) {
    this.el = $(selector)

    this.el.append(
      '<img class="slide"><div class="caption"></div><div class="timeline"></div>'
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
    return this;

}


YARNTALE.setSlideIndex = function(i) {
    this.cur_slide_index = i;

    this.el.find("> .slide").attr('src',this.slides[i].image)

}

YARNTALE.start = function() {
    this.setSlideIndex(0)
    return this;
}



$(function() {




})