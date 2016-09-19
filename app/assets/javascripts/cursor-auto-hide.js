$(function() {
  var timeout;
  var isHidden = false;

  $(document).on("mousemove",magicMouse)

  function magicMouse() {
      if (timeout) {
          clearTimeout(timeout);
      }
      
      timeout = setTimeout(function() {
          if (!isHidden) {
              $("body").addClass("no-cursor")
              isHidden = true;
          }
      }, 1500);
      
      if (isHidden) {
          $("body").removeClass("no-cursor")
          isHidden = false;
      }
  };
})
