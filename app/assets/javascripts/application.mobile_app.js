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
//= require ./jquery-1.12.4
//= require jquery-ui
//= require ./jquery.touch-punch
//= require jquery.fontselect
//= require jquery.form
//= require react
//= require ReactRouter
//= require_tree ./components_mobile_editor

//ReactRouter is just copied to assets folder
$(function() {
  console.log('application.mobile_app layout ready')
  $(document).on("click","a, button, .button, .click-sound, [type=submit]",function() {
    console.log("click!!!")
    $("#mobile-click")[0].play()
  })  
  ReactDOM.render(React.createElement(MobileRoutes), $("#root")[0])
});
