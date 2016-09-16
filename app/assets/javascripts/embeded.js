$(function() {
  $(document).on("change, keyup, input",".tales.embed #width",function() {
    //$("#height").val(Math.floor($("#width").val()*640/960))
    embed_generate()
  })

  $(document).on("change, keyup, input",".tales.embed #height",function() {
    //$("#width").val(Math.floor($("#height").val()*960/640))
    embed_generate()
  })
})