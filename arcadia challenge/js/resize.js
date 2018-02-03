

$(document).ready(function() {
  var user = "none";
  $(".user").click(function() {
      user = $(this).attr("data-name");
      // console.log(user);

      if (user == "left") {
        $(".menu-bar").removeClass("menu-bar-bottom");
        $(".menu-bar").css("width", "200");
        $(".content-area").css("justify-content", "flex-start");
      } else if (user == "right") {
        $(".menu-bar").removeClass("menu-bar-bottom");
        $(".menu-bar").css("width", "200");
        $(".content-area").css("justify-content", "flex-end");
      } else {
        $(".menu-bar").toggleClass("menu-bar-bottom");
        $(".menu-bar").css("width", "100%");

      }
  });

  $('.menu-bar').resizable({
      maxWidth: 380,
      minWidth: 50
  });
});
