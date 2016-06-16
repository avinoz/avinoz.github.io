
$(document).ready (function(e) {
  // adjusts JS with window size change
  // $(window).resize(function() {
    prepSite();
  // });
});


// prep site
function prepSite() {

  var window = $(document)
  var winWidth = window.width()
  var winHeight = window.height()

  // defines mouse location
  window.mousemove (function(e) {
    $('.openSite').fadeIn(2000);
    var mouseX = e.pageX/winWidth*100
    var mouseY = e.pageY/winHeight*100

    planeAnimate( mouseX, mouseY , winHeight );

  });
};
