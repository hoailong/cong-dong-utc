$(document).ready(function() {
    //config moment locale
    moment.locale('vi');

    //config toastr
    toastr.options = {
        closeButton: true,
        progressBar: true,
        showMethod: 'slideDown',
        // positionClass: "toast-bottom-right",
        timeOut: 5000
    };

    $('.lazyload').lazy();

    $('.toggle-nav').click(function() {
        $(this).toggleClass('active');
        $('nav').toggleClass('active');
    });

    const href = window.location.pathname;
    if(href === '/') {
        $('nav li:first a').addClass('active');
    } else {
        $('nav li a').each(function(i, v) {
            if (href.includes($(v).attr('href')) && i!==0)
                $(v).addClass('active')
        });
    }

    $(window).scroll(function() {
        $(this).scrollTop() > 100 ? $(".scroll-to-top").fadeIn() : $(".scroll-to-top").fadeOut()
    });
    $(".scroll-to-top").click(function() {
        return $("html, body").animate({
            scrollTop: 0
        }, 800), !1
    });

    $.fn.select2.defaults.set( "theme", "bootstrap" );

    //contact form send
    $('#btn_send_contact').click(function(){
        const contact_name = $('#contact_name').val();
        const contact_email = $('#contact_email').val();
        const contact_phone = $('#contact_phone').val();
        const contact_content = $('#contact_content').val();

        const data = { contact_name, contact_email, contact_phone, contact_content };
        fetch('/contact/', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                swal("Cảm ơn bạn đã liên hệ!", "Chúng tôi đã ghi nhận và sẽ sớm phản hồi lại", "success")
                    .then(val => location.href = '/');
                setTimeout(function(){
                    location.href = '/'
                }, 3000)
            })
            .catch(error => console.log(error));
    });
});
function getSlug(str)
{
    str = str.toLowerCase();
    str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
    str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
    str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
    str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
    str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
    str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
    str = str.replace(/(đ)/g, 'd');
    str = str.replace(/([^0-9a-z-\s])/g, '');
    str = str.replace(/(\s+)/g, '-');
    str = str.replace(/^-+/g, '');
    str = str.replace(/-+$/g, '');
    return str;
}


// abbrNum(12 , 1)          => 12
// abbrNum(0 , 2)           => 0
// abbrNum(1234 , 0)        => 1k
// abbrNum(34567 , 2)       => 34.57k
// abbrNum(918395 , 1)      => 918.4k
// abbrNum(2134124 , 2)     => 2.13m
// abbrNum(47475782130 , 2) => 47.48b
function abbrNum(number, decPlaces) {
    // 2 decimal places => 100, 3 => 1000, etc
    decPlaces = Math.pow(10,decPlaces);

    // Enumerate number abbreviations
    var abbrev = [ "K", "M", "B", "T" ];

    // Go through the array backwards, so we do the largest first
    for (var i=abbrev.length-1; i>=0; i--) {

        // Convert array index to "1000", "1000000", etc
        var size = Math.pow(10,(i+1)*3);

        // If the number is bigger or equal do the abbreviation
        if(size <= number) {
            // Here, we multiply by decPlaces, round, and then divide by decPlaces.
            // This gives us nice rounding to a particular decimal place.
            number = Math.round(number*decPlaces/size)/decPlaces;

            // Handle special case where we round up to the next abbreviation
            if((number == 1000) && (i < abbrev.length - 1)) {
                number = 1;
                i++;
            }

            // Add the letter for the abbreviation
            number += abbrev[i];

            // We are done... stop
            break;
        }
    }

    return number;
}

function m(n,z){
    let x=(''+n).length,p=Math.pow,d=p(10,z);
    x -= x%3;
    return Math.round(n*d/p(10,x))/d+" kMGTPE"[x/3]
}

particlesJS("particles-js", {
    "particles": {
        "number": {
            "value": 100,
            "density": {
                "enable": true,
                "value_area": 800
            }
        },
        "color": {
            "value": "#ffffff"
        },
        "shape": {
            "type": "circle",
            "stroke": {
                "width": 0,
                "color": "#000000"
            },
            "polygon": {
                "nb_sides": 5
            },
            "image": {
                "src": "img/github.svg",
                "width": 100,
                "height": 100
            }
        },
        "opacity": {
            "value": 0.5,
            "random": false,
            "anim": {
                "enable": false,
                "speed": 1,
                "opacity_min": 0.1,
                "sync": false
            }
        },
        "size": {
            "value": 3,
            "random": true,
            "anim": {
                "enable": false,
                "speed": 40,
                "size_min": 0.1,
                "sync": false
            }
        },
        "line_linked": {
            "enable": true,
            "distance": 150,
            "color": "#ffffff",
            "opacity": 0.4,
            "width": 1
        },
        "move": {
            "enable": true,
            "speed": 6,
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
                "enable": false,
                "rotateX": 600,
                "rotateY": 1200
            }
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": true,
                "mode": "repulse"
            },
            "onclick": {
                "enable": true,
                "mode": "push"
            },
            "resize": true
        },
        "modes": {
            "grab": {
                "distance": 400,
                "line_linked": {
                    "opacity": 1
                }
            },
            "bubble": {
                "distance": 400,
                "size": 40,
                "duration": 2,
                "opacity": 8,
                "speed": 3
            },
            "repulse": {
                "distance": 200,
                "duration": 0.4
            },
            "push": {
                "particles_nb": 4
            },
            "remove": {
                "particles_nb": 2
            }
        }
    },
    "retina_detect": true
});