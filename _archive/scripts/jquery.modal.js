$(document).ready(function(){
  $('.two').click(function(){
    $('.ftwo').slideToggle('slow');
  });

  $('.three').click(function(){
    $('.fthree').slideToggle('slow');
  });

  $('.four').click(function(){
    $('.ffour').slideToggle('slow');
  });

  $('.close').click(function(){
    $('.float').slideUp();
  });


  var pages = $('.slidecont li'), current=0;
  var currentPage,nextPage;

  $('.slidecont .button').click(function(){
    currentPage= pages.eq(current);
    if($(this).hasClass('prevButton')){
      if (current <= 0)
        current=pages.length-1;
      else
        current=current-1;
    } else {
      if (current >= pages.length-1)
        current=0;
      else
        current=current+1;
    }
    nextPage = pages.eq(current);
    currentPage.fadeOut();
    nextPage.fadeIn();
  });
});

