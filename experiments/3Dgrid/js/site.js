
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
    // console.log("X " + mouseX + " , Y " + mouseY);

    planeAnimate( mouseX, mouseY , winHeight );
  });

};

// animate planes
function planeAnimate( mouseX, mouseY , winHeight ) {

  var Xaxis = mouseX;
  var Yaxis = mouseY / 16.7;

  var cssOriBg = "rgba(30,30,30,.8)"
  var cssAltBg = randomColor();



  var cssOriPlane = "scale(1) rotateX(" + (Yaxis - 3) + "deg) rotateY(" + (Xaxis - 50) + "deg)"

  var cssOriPlaneB = "scale(1) rotateX(" + (Yaxis - 3) + "deg) rotateY(" + (Xaxis - 50) + "deg) translateZ(20em)"

  var cssAltPlane = "scale(0.98) rotateX(" + (Yaxis - 3) + "deg) rotateY(" + (Xaxis - 3) + "deg)"

  $(".A").css("transform", cssOriPlane );
  $(".B").css("transform", cssOriPlaneB );


  // CLICKABILITY
  $("td").mousedown(function() {
   $(this).css("background", cssAltBg);
   $(this).css("transform", "scale(.95)");
  });
   $("td").mouseup(function() {
    $(this).css("transform", "scale(1)");
  });

};

function randomColor() {
  return '#' + (function co(lor){   return (lor +=
  [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][Math.floor(Math.random()*16)])
  && (lor.length == 6) ?  lor : co(lor); })('');
}