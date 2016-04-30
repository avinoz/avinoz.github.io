


function runSite() {
  $(document).ready (function(e) {

  var window = $(document)
  var winWidth = window.width()
  var winHeight = window.height()

  var magenta = "#d6006c"
  var cyan = "#009dd8"

// if ($(".cover").is(':hidden')) { console.log("hello")}

  window.mousemove(function(e){
    $('.openSite').fadeIn(2000);
    var mouseX = e.pageX/winWidth*100
    var mouseY = e.pageY/winHeight*100
    // console.log("X " + mouseX + " , Y " + mouseY);

    // planes animate
    var planeX = e.pageX/winWidth*100
    var planeY = e.pageY/winHeight*100

    // moves planes on X axis
    $(".A").css("left", 21 - planeX/15 + "vw");
    $(".B").css("right", 15 - planeX/8 + "vw");
    $(".C").css("left", 36 - planeX/60 + "vw");
    $(".D").css("transform", "rotate(" + -15 + "deg)");

    // moves planes on Y axis
    $(".A").css("top", 13 - planeY/20 + "vh");
    $(".B").css("top", planeY/40 + 10 + "vh");
    $(".C").css("top", planeY/60 + 15 + "vh");
    $(".D").css("top", winHeight/51 + planeY/100 + "vh");


    // make 3D ball
    // ball with X axis movement
    if (mouseX < 50) {
      $(".grow-right").css("width", "0px");
      $(".grow-left").css("width", 100 - mouseX*2 + "px");
    } else if (mouseX > 50) {
      $(".grow-left").css("width", "0px");
      $(".grow-right").css("width", (mouseX-50)*2 + "px");
    }
    // ball with Y axis movement
    if (mouseY < 50) {
      $(".text-cont").css("transform", "rotate(" + (50 - mouseY) + "deg)")
    } else if (mouseY > 50) {
      $(".text-cont").css("transform", "rotate(" + (50 - mouseY) + "deg)")
    }
    });


    // hovering hover half animation
    $('.half-left').hover( function(){
      $('.half-left, .grow-left').css("-webkit-filter", "brightness(110%)");
      $('.title-left').fadeToggle('fast');
    }, function() {
      $('.title-left').toggle();
      $('.half-left, .grow-left').css("-webkit-filter", "brightness(100%)");
    });

   $('.half-right').hover( function(){
      $('.half-right, .grow-right').css("-webkit-filter", "brightness(110%)");
      $('.title-right').fadeToggle('fast');
    }, function() {
      $('.title-right').toggle();
      $('.half-right, .grow-right').css("-webkit-filter", "brightness(100%)");
    });


    // clicking a half transition
    $('.half-left').click(function(){
      clickHalf(magenta)});
    $('.half-right').click(function(){
      clickHalf(cyan)});

    function clickHalf(color) {
      $('body').css({background: color, transition: 'ease .5s all'})
      $('.plane').toggle();
      $('.text-cont').css({
        transform: 'scale(11)',
        transition: 'ease .5s all',
        opacity: 0
      })
    };

  });
};

runSite();

// adjusts JS with window size change
$(window).resize(function() {
  runSite();
});
