$(document).ready (function(e) {

  var window = $(document)
  var winWidth = window.width()
  var winHeight = window.height()

  window.mousemove(function(e){
    var mouseX = e.pageX/winWidth*100
    var mouseY = e.pageY/winHeight*100
    // console.log("X " + mouseX + " , Y " + mouseY);

// make 3D ball
  if (mouseX < 50) {
    $(".grow-right").css("width", "0px");
    $(".grow-left").css("width", 100 - mouseX*2 + "px");
  } else if (mouseX > 50) {
    $(".grow-left").css("width", "0px");
    $(".grow-right").css("width", (mouseX-50)*2 + "px");
  }

  if (mouseY < 50) {
    $(".text-cont").css("transform", "rotate(" + (50 - mouseY) + "deg)")
  } else if (mouseY > 50) {
    $(".text-cont").css("transform", "rotate(" + (50 - mouseY) + "deg)")
  }
  });



// hover function
   $('.half-left').hover(function(){
    $('.half-left, .grow-left').css("-webkit-filter", "brightness(110%)")
    $('.title-left').fadeToggle('fast');
    $('.title-left img').css({
      transform: 'scale(1)',
      'margin-left': '-160px',
      transition: 'ease .2s all'
      });
  }, function(){
       $('.title-left img').css({
        'margin-left': '0px',
        transition: 'ease .0s all',
      transform: 'scale(.1)'
      });
    $('.title-left').toggle();
    $('.half-left, .grow-left').css("-webkit-filter", "brightness(100%)")
  });

 $('.half-right').hover(function(){
    $('.half-right, .grow-right').css("-webkit-filter", "brightness(110%)")
    $('.title-right').fadeToggle('fast');
    $('.title-right img').css({
      transform: 'scale(1)',
      'margin-right': '-12vw',
      'margin-top': '-18vw',
      transition: 'ease .2s all'
    });
    }, function(){
    $('.title-right img').css({
        'margin-right': '0',
        'margin-top': '-18vw',
        transition: 'ease 0 all',
        transform: 'scale(.1)'
      });
    $('.title-right').toggle();
    $('.half-right, .grow-right').css("-webkit-filter", "brightness(100%)")
  });




// engulf screen with ball when clicked
  $('.half-left').click(function(){
    $('body').css({background: '#d6006c', transition: 'ease .5s all'})
    // $('#ball-shadow').css('visibility', 'hidden')
    $('.text-cont').css({
      transform: 'scale(11)',
      transition: 'ease .5s all',
      opacity: 0
    })
  });

  $('.half-right').click(function(){
    $('body').css({background: '#009dd8', transition: 'ease .5s all'})
    // $('#ball-shadow').css('visibility', 'hidden')
    $('.text-cont').css({
      transform: 'scale(11)',
      transition: 'ease .5s all',
      opacity: 0
    })
  });

});



