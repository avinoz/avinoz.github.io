
var opened = false;

$(document).ready (function(e) {

  function open(item) {
    $(item).addClass("topic-expanded");
    $(item).children(".close-btn").toggle('slow');
  }

  function close() {
    $('article').removeClass("topic-expanded");
    $('article').children(".close-btn").css('display', 'none');
  }

  $('article').click(function(){
    if (opened) {
      close();
      open(this);
    } else {
      open(this);
      opened = true;
    }
  });

  $('.close-btn').click(function(e){
    e.stopPropagation();
    close();
    opened = false;
  });
});


