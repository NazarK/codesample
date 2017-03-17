//handler for .object-fit-cover
//and .object-fit-contain
//should work for all browsers
//started making it because css object-fit doesn't work in Edge, and is supported in IE only with fitie.js

window.object_fit_classes_process = function() {
  console.log("processing .object-fit-*")


  object_fit_contain_apply = function() {
    console.log("object_fit_contain_apply: loaded")
    var parent_width = $(this).parent().width()
    var parent_height = $(this).parent().height()

    var width = $(this).attr("data-original-width") || $(this).width()
    var height = $(this).attr("data-original-height") || $(this).height()

    $(this).attr("data-original-width", width)
    $(this).attr("data-original-height", height)

    //catch youtube iframe case
    if($(this).hasClass("youtube-player")) {
      $(this).css({margin: "", position: "", top: "", left:"", bottom: "", right: "", height: "100%", width: "100%"})
      return;
    }

    if(width/height < parent_width/parent_height) {
      $(this).css({margin: "auto", position: "absolute", top: 0, left:0, bottom: 0, right: 0, height: "100%", width: ""})
    } else {
       $(this).css({margin: "auto", position: "absolute", top: 0, left:0, bottom: 0, right: 0, width: "100%", height: ""})
    }
  }

  object_fit_cover_apply = function() {
    console.log("loaded")
    var parent_width = $(this).parent().width()
    var parent_height = $(this).parent().height()

    var width = $(this).attr("data-original-width") || $(this).width()
    var height = $(this).attr("data-original-height") || $(this).height()

    $(this).attr("data-original-width", width)
    $(this).attr("data-original-height", height)


    //TODO: object fit cover for youtube iframe, it is showing as object fit contain always

    if($(this).hasClass("youtube-player")) {
      $(this).css({margin: "", position: "", top: "", left:"", bottom: "", right: "", height: "100%", width: "100%"})
      return;
    }

    //object width lower than parent width
    //object tall and view wide
    //increased height in this case
    if(width/height < parent_width/parent_height) {
      var res_height = height*parent_width/width;
      var res_offset = (res_height - parent_height) / 2
      $(this).css({width:"100%",position: "absolute", top: -res_offset, left: "", height: "", bottom: "", right: "", margin: ""})
    //object wide and view tall
    } else {
      var res_width = width*parent_height/height;
      var res_offset = (res_width - parent_width) / 2
      $(this).css({height:"100%",position: "absolute", left: -res_offset, top: "", width: "", bottom: "", right: "", margin: ""})
    }
  }


  $(".object-fit-contain").each( function() {
    $(this)[0].onload = object_fit_contain_apply
    $(this)[0].onloadedmetadata = object_fit_contain_apply
  })

  $(".object-fit-cover").each(function() {
    $(this)[0].onload = object_fit_cover_apply
    $(this)[0].onloadedmetadata = object_fit_cover_apply
  })

  var timeout = 0
  $(window).resize(function() {
    clearTimeout(timeout)
    timeout = setTimeout(function() {
      console.log("object-fit-classes reapply on resize")
      $(".object-fit-contain").each(object_fit_contain_apply)
      $(".object-fit-cover").each(object_fit_cover_apply)
    },200)

  })

}
