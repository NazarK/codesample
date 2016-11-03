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
//= require jquery-ui
//= require turbolinks
//= require cocoon
//= require bootstrap
//= require jquery.fontselect
//= require react
//= require react_ujs
//= require components

/* ready function to be called on each load (and page:load turbolinks event) */
var ready = function() {
  console.log('ready')
};



$(function() {
    ready();
    $(document).on('page:load', ready);
    $(document).on("click","a, button, .click-sound, [type=submit]",function() {
      $("#mobile-click")[0].play()
    })
});

