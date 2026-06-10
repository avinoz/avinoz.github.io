

$(document).ready(function() {
  var user = "none";
  $(".user").click(function() {
      user = $(this).attr("data-name");
      // console.log(user);

      if (user == "left") {
       $(".content-area").css("flex-direction", "row");
        $(".menu-bar").removeClass("menu-bar-bottom");
        $(".menu-bar").css("width", "200");
        $(".menu-bar").css("order", "1");
        $("textarea").css("order", "2");
        // $(".content-area").css("justify-content", "flex-start");
      } else if (user == "right") {
       $(".content-area").css("flex-direction", "row");
        $(".menu-bar").removeClass("menu-bar-bottom");
        $(".menu-bar").css("width", "200");
         $(".menu-bar").css("order", "2");
         $("textarea").css("order", "1");
        // $(".content-area").css("justify-content", "flex-end");
      } else {
       $(".menu-bar").css("order", "2");
        $("textarea").css("order", "1");
        $(".menu-bar").toggleClass("menu-bar-bottom");
        $(".menu-bar").css("width", "100%");
        $(".content-area").css("flex-direction", "column");

      }

  });

  $('.menu-bar').resizable({
      maxWidth: 380,
      minWidth: 50
  });
});
