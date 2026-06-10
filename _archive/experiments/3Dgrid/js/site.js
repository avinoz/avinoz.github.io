
$(document).ready (function(e) {
    prepSite();
    $('td').click(function(e) {
      if ($(this).parent().parent().parent().parent().attr('class') == "plane A") {
        bool = false;
      } else {
        bool = true;
      };
      console.log(bool);
    });
});

bool = true;


function prepSite() {

  var window = $(document)
  var winWidth = window.width()
  var winHeight = window.height()

  // defines mouse location
  window.mousemove (function(e) {
    var Xaxis = e.pageX/winWidth*100
    var Yaxis = e.pageY/winHeight*100/16.7

    var color = randomColor();
    clickability(color)

    var planeObj = planeVariable(Xaxis, Yaxis)
    planeAnimate( planeObj, bool);
  });
};


function planeVariable(Xaxis, Yaxis) {
  var cssPlane = "scale(1) rotateX(" + (Yaxis - 3) + "deg) rotateY(" + (Xaxis - 50) + "deg) translateZ(0em)"
  var cssPlaneB = "scale(1) rotateX(" + (Yaxis - 3) + "deg) rotateY(" + (Xaxis - 50) + "deg) translateZ(20em)"
  return [ cssPlane , cssPlaneB ]
}

function planeAnimate( planeObj, bool ) {
  if (bool == true) {
    console.log("animate " + bool)
    $(".plane.A").css("transform", planeObj[0] );
    $(".plane.B").css("transform", planeObj[1] );
  } else {
    $(".plane.A").css("transform", planeObj[1] );
    $(".plane.B").css("transform", planeObj[0] );
  }
};



function clickability(color) {
  $("td").mousedown(function() {
    $(this).css({
      "background" : color,
      "transform" : "scale(.95)"
    });
  });
   $("td").mouseup(function() {
    $(this).css("transform", "scale(1)");
  });
}


function randomColor() {
  return '#' + (function co(lor){   return (lor +=
  [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][Math.floor(Math.random()*16)])
  && (lor.length == 6) ?  lor : co(lor); })('');
}