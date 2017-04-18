if(!window.YARNTALE_HELPER_LOADED) {
  console.log("loading YARNTALE_HELPER")
  window.addEventListener("message", receiveMessage, false);
  function receiveMessage(event)  {
    console.log(event.data)
    var sender = document.querySelector('iframe[src="'+event.data.sender_iframe_src+'"]');
    console.log(sender)
    if(event.data.message=="YARNTALE_GO_FULLSCREEN") {
      sender.style.cssText =  "width:100%;height:100%;position:fixed;left:0;top:0"
    }
    if(event.data.message=="YARNTALE_EXIT_FULLSCREEN") {
      sender.style.cssText = ""
    }
  }
  window.YARNTALE_HELPER_LOADED = true
}
