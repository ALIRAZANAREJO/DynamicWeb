function countUp(id, duration = 10000) {
  const el = document.getElementById(id);
  if (!el) return;

  const target = parseInt(el.textContent) || 0;
  el.textContent = 0;

  let startTime = performance.now();

  function animate(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    el.textContent = Math.floor(progress * target);

    if (progress < 1) requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}


(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();



// Navbar background on scroll
$(window).scroll(function () {
    if ($(this).scrollTop() > 650) { // scroll threshold
        $('.navbar-nav').addClass('scrolled');
    } else {
        $('.navbar-nav').removeClass('scrolled');
    }
});

  
// Click → set activated
$(".navbar-nav .nav-link").on("click", function () {
    $(".navbar-nav .nav-link").removeClass("activated");
    $(this).addClass("activated");
});

// Scroll → update activated based on section in view
$(window).on("scroll", function () {

    let scrollPos = $(document).scrollTop() + 120; // offset for accuracy

    $(".nav-link").each(function () {
        let section = $(this).attr("href");

        if (section.startsWith("#") && $(section).length) {

            let top = $(section).offset().top;
            let bottom = top + $(section).outerHeight();

            if (scrollPos >= top && scrollPos < bottom) {
                $(".nav-link").removeClass("activated");
                $(this).addClass("activated");
            }
        }
    });
});
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });
    

    // Typed Initiate
    if ($('.typed-text-output').length == 1) {
        var typed_strings = $('.typed-text').text();
        var typed = new Typed('.typed-text-output', {
            strings: typed_strings.split(', '),
            typeSpeed: 100,
            backSpeed: 20,
            smartBackspace: false,
            loop: true
        });
    }


    // Modal Video
    var $videoSrc;
    $('.btn-play').click(function () {
        $videoSrc = $(this).data("src");
    });
    console.log($videoSrc);
    $('#videoModal').on('shown.bs.modal', function (e) {
        $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
    })
    $('#videoModal').on('hide.bs.modal', function (e) {
        $("#video").attr('src', $videoSrc);
    })


    

    // // Facts counter
    // $('[data-toggle="counter-up"]').counterUp({
    //     delay: 10,
    //     time: 2000
    // });


    // Skills
    $('.skill').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, {offset: '80%'});


    // Portfolio isotope and filter
    var portfolioIsotope = $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });
    $('#portfolio-flters li').on('click', function () {
        $("#portfolio-flters li").removeClass('activated');
        $(this).addClass('activated');

        portfolioIsotope.isotope({filter: $(this).data('filter')});
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        items: 1,
        dots: true,
        loop: true,
    });

    
})(jQuery);

