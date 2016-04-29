$(document).ready (function(e) {

var window = $(document)

  var winWidth = window.width()
  var winHeight = window.height()


  window.mousemove(function(e){
    var mouseX = e.pageX/winWidth*100
    var mouseY = e.pageY/winHeight*100
    console.log("X " + mouseX + " , Y " + mouseY);

  if (mouseX < 50) {
    $(".grow-right").css("width", "0px");
    $(".grow-left").css("width", 100 - mouseX*2 + "px");
  } else if (mouseX > 50) {
    $(".grow-left").css("width", "0px");
    $(".grow-right").css("width", (mouseX-50)*2 + "px");
  }

  $(".ball-cont").css("transform", "rotate(" + mouseY + "deg)")

  });







});






//   // MOBILE JS
//   function isMobile() {
//     if(window.innerWidth <= 600) {
//      return true;
//     } else {
//      return false;
//     }
//   }


//   // HEADER HIDE
//   var headerHidden = $('.header-hidden');
//   var header = $('.header');
//   var whenToHide = (header.offset().top + header.height())/2;

//   $(window).scroll(function () {
//     var offset = headerHidden.offset();
//     if (isMobile() == false) {
//       if (offset.top <= whenToHide) {
//         headerHidden.slideUp();
//       } else {
//         headerHidden.slideDown();
//       };
//     };
//   });


//   // EXPANDER ANIMATE
//   $(window).scroll( function(){
//     $('.sheet').each( function(i){
//       bttm_of_object = $(this).offset().top + $(this).outerHeight();
//       if (isMobile() == false) {
//         bttm_of_window = $(window).scrollTop() + $(window).height() + 1000;
//       } else {
//         bttm_of_window = $(window).scrollTop() + $(window).height() + 800;
//       }
//       if( bttm_of_window > bttm_of_object ){
//         $(this).css({'opacity':'1','top':'10px'},800);
//       } else {
//         $(this).css({'opacity':'0','top':'220px'},800);
//       }
//     });
//   });

//   $(window).scroll(function() {
//      if($(window).scrollTop() > 500){
//        $('.backgrd').css({'transform': 'scale(1.2)'});
//      }else{
//          $('.backgrd').css({'transform': 'scale(1)'});
//      }
//   });


//   // JOIN US FADE
//   $(window).scroll(function(){
//     $('.darken').each( function(i){
//       if (isMobile() == false) {
//         bttm_of_object = $(this).offset().top + $(this).outerHeight();
//         bttm_of_window = $(window).scrollTop() + $(window).height() + 400;
//       } else {
//         bttm_of_object = $(this).offset().top + $(this).outerHeight();
//         bttm_of_window = $(window).scrollTop() + $(window).height() + 320;
//       }
//       if( bttm_of_window > bttm_of_object ){
//         $(this).css({'opacity':'1'},200);
//       }
//     });
//   });


//   // JOIN US BUTTON CLICK
//   $(".join, .close").click(function(){
//     $(".listings").slideToggle();
//     $(".secC-cont").css({'background':'rgba(0,0,0,0.9)'}, 300);
//     $(".close").fadeToggle();
//     $(".all-pos").fadeToggle();
//   });

//   $(window).scroll( function(){
//     $('.secC').each( function(i){
//       if($(window).scrollTop() < $(this).offset().top - 400) {
//         $(".listings").css({'display':'none'});
//         $(".secC-cont").css({'background':'rgba(0,0,0,0.7)'});
//         $(".close").css({'display':'none'});
//         $(".all-pos").css({'display':'none'});
//       }
//     });
//   });
// });


// // SMOOTH ANCHOR TAG
// $(function() {
//   $('a[href*="#"]:not([href="#"])').click(function() {
//     if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
//       var target = $(this.hash);
//       target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
//       if (target.length) {
//         $('html, body').animate({
//           scrollTop: target.offset().top
//         }, 1000);
//         return false;
//       }
//     }
//   });
// });


// // RECRUITER BOX AJAX CALL
// var postings

// $.ajax({
//   url: 'https://jsapi.recruiterbox.com/v1/openings?client_name=qadium',
//   contentType: 'application/json',
//   success: function(response) {
//       postings = response;
//       dataObject();
//     }
//   });

// function dataObject() {

//   var availStr = "<ul class='avail-pos'>";
//   for (i = 0; i < postings.objects.length; i++) {
//     availStr = availStr + "<li><a href='#pos" + i + "'>" + postings.objects[i].title + "</a></li>";
//   }
//   availStr = availStr + "</ul>";

//   $('.posting-cont').append(
//         "<div class='hide col span-1-t span-3-d empty debug'>kitty</div>" +
//         "<div class='posting-opening span-10-t span-6-d debug' id='all-jobs'><h2>" +
//         "Available Positions" +
//         "</h2><p>" +
//         "We are rapidly expanding to bring in new engineers to help us scale our global internet analysis platform, with an emphasis on full-stack developers, data engineers, UI/UX engineers, DevOps engineers, and anyone with deep professional experience in analyzing rare protocols and other kinds of device communications." +
//         "</p><p>" +
//         "At Qadium, you\'ll work with a talented team of software engineers and algorithms experts from research groups at Stanford, Caltech, and MIT. We also draw on a deep pool of experience at top Internet companies, algorithmic trading groups, and national security bureaucracies." +
//         "</p>" + availStr + "</div>" +
//         "<div class='col span-1-t span-3-d empty debug'>kitty</div>"
//     );



//   for (i = 0; i < postings.objects.length; i++) {

//   $('.posting-cont').append(
//     "<div class='job row' id='pos" + i + "'>" +
//     "<div class='col span-1-t span-3-d empty debug'>kitty</div>" +
//       "<div class='job-inner span-10-t span-6-d debug'>" +
//         "<div class='title'>" +
//             postings.objects[i].title +
//         "</div>" +
//         "<div class='location'>" +
//             postings.objects[i].location.city +
//         "</div>" +
//         "<div class='description'>" +
//             postings.objects[i].description +
//         "</div>" +
//         "<div class='btn-cont-apply'><a href='mailto:careers@qadium.com?Subject=Hire%20Me%20as%20a%20" +
//         postings.objects[i].title + "!' target='_top'><div class='gen-button apply'>" +
//             "Apply" +
//          "</div></div></a></div>" +
//          "<div class='col span-1-t span-3-d empty debug'>kitty</div>" +
//      "</div>"
//     );
//   }


//   // SMOOTH ANCHOR TAG
//   $(function() {
//     $('a[href*="#"]:not([href="#"])').click(function() {
//       if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
//         var target = $(this.hash);
//         target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
//         if (target.length) {
//           $('html, body').animate({
//             scrollTop: target.offset().top
//           }, 1000);
//           return false;
//         }
//       }
//     });
//   });


//   // PRIVACY POLICY & TERMS

//     function close() {
//       $('.grayed, .m-privacy, .m-terms').css('display', 'none');
//       $('body').css('overflow-y', 'auto');
//     };

//     function privacy() {
//       $('.grayed, .m-privacy').fadeToggle();
//       $('body').css('overflow-y', 'hidden');
//       $('.modal').trigger('click');
//     };

//     function terms() {
//       $('.grayed, .m-terms').fadeToggle();
//       $('body').css('overflow-y', 'hidden');
//       $('.modal').trigger('click');
//     };

//     $('.m-privacy, .m-terms').click(function(e){
//       e.stopPropagation();
//       $('.grayed, .m-close').click(function(){
//         close();
//       });
//     });
//     $('#privacy').click(function(e){
//       e.preventDefault();
//       privacy();
//     });
//     $('#terms').click(function(e){
//       e.preventDefault();
//       terms();
//     });

//     $('.jump-terms').click(function(e){
//       e.preventDefault();
//       close();
//       terms();
//     });

//     $('.jump-privacy').click(function(e){
//       e.preventDefault();
//       close();
//       privacy();
//     });
// }