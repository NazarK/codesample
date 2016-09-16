// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require cocoon
//= require bootstrap
//= require_tree .


/* JQUERY SORTABLE CLASS SUPPORT */
/* just add class ".jquery-sortable" to elements that you plan to reorder */
/* supposed to work with cocoon gem */
function recompute_positions() {
    var position = 1;
    $(this).find(".nested-fields").each( function() {
        console.log(position)
        $(this).find("[name$='[position]']").val(position)
        position++
    })
}

function jquery_sortable_apply() {
    $(".jquery-sortable").each(function() {
        $(this).sortable({
            handle: '.sort-handle',
            stop: recompute_positions
        });
        recompute_positions.apply(this)
        $(this).on('cocoon:after-insert cocoon:after-remove',recompute_positions)

    })
}



/* used in tales/:id/embed */
var iframe_reload_timer;
var code;
function embed_generate() {
  console.log('embed generate')
  var w = $("#width").val()
  var h = $("#height").val()
  var id = $("#id").val()
  code = "<iframe width='"+w+"' height='"+h+"' src='"+APP_HOST+"/t"+id+"/embed' frameborder='0' scrolling='no'></iframe>"
  $("textarea#code").html(code)
  clearTimeout(iframe_reload_timer)
  iframe_reload_timer = setTimeout(function() {
    $("#preview").html(code)
    setTimeout(function() {
      //$("iframe")[0].contentDocument.location.reload(true)
    },200)
  },1000)
}

/* ready function to be called on each load (and page:load turbolinks event) */
var ready = function() {
  jquery_sortable_apply()

  if($("body").is(".tales.embed")) {
    embed_generate()
  }

};



$(function() {


    $(document).on("change, keyup, input",".tales.embed #width",function() {
   //   $("#height").val(Math.floor($("#width").val()*640/960))
      embed_generate()
    })

    $(document).on("change, keyup, input",".tales.embed #height",function() {
//      $("#width").val(Math.floor($("#height").val()*960/640))
      embed_generate()
    })


    ready();
    $(document).on('page:load', ready);
});


tale_audio_vol_change = function() {
  $("#tale_audio_vol").val(this.volume)
}

slide_video_pos_change = function() {
  $(this).parents(".slide").find(".video_thumb_pos").val(this.currentTime)

}

slide_vol_change = function() {
  $(this).parents(".slide").find(".audio_vol").val(this.volume)
}
