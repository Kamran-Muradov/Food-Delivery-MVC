$(function () {

    const connection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7247/checkoutHub", {
            transport: signalR.HttpTransportType.WebSockets,
            withCredentials: true
        })
        .configureLogging(signalR.LogLevel.Information)
        .build();
    connection.on("ReceiveOrderStatusUpdate", function (checkoutId, status) {
        if (status === "Delivered") {
            showReviewForm(checkoutId);
        }
    });

    connection.start()
        .then(() => {
            return connection.invoke("JoinUserGroup", userId);
        })
        .catch(err => console.error("SignalR connection error:", err));

    function showReviewForm(checkoutId) {
        $('#review-create-modal').modal('show')
        $("#review-create").attr('data-checkoutId', checkoutId)
    }


    $('#slider-area .owl-carousel').owlCarousel({
        loop: true,
        autoplay: false,
        autoplayTimeout: 5000,
        margin: 0,
        nav: false,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 1
            },
            1000: {
                items: 1
            }
        }
    })

    $('#brand-area .owl-carousel').owlCarousel({
        center: true,
        loop: true,
        autoplay: true,
        autoplayTimeout: 5000,
        margin: 30,
        stageContainer: true,
        nav: false,  // Enable navigation
        responsive: {
            0: {
                items: 5
            },
            600: {
                items: 5
            },
            1000: {
                items: 5
            }
        }
    })

    $('#coupon-area .owl-carousel').owlCarousel({
        center: true,
        loop: true,
        autoplay: true,
        autoplayTimeout: 5000,
        margin: 30,
        mouseDrag: false,
        stageContainer: true,
        nav: false,  // Enable navigation
        navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"],
        items: 2
    })

    function debounce(func, delay) {
        let debounceTimer;
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        };
    }

    $('#input-search').on('input', debounce(function () {
        const searchText = $(this).val().trim();
        if (searchText) {
            $('#search-area').css('min-height', '321px')
            axios.get(`/home/searchRestaurants`, {
                params: { searchText }
            })
                .then(async function (response) {
                    $('#search-area').html(response.data)
                })
                .catch(function (error) {
                    $("#search-area").html("")
                    $('#search-area').css('min-height', '')
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Something went wrong!",
                    });
                })
        } else {
            $("#search-area").html("")
            $('#search-area').css('min-height', '')
        }
    }, 100));

    $('#menu-search').on('input', debounce(function () {
        const searchText = $(this).val().trim();
        const restaurantId = $(this).attr('data-restaurantId')
        axios.get(`/menu/search`, {
            params: { searchText, restaurantId }
        })
            .then(async function (response) {
                $('#menu-area').html(response.data)
                $('#tab-header .active').removeClass('active')
                $('#tab-header .nav-link').first().addClass('active')
            })
            .catch(function (error) {
                $("#menu-area").html("")
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                });
            })

    }, 100));

    $(document).on('click', '#see-all', function (e) {
        let searchText = $("#input-search").val()

        $.ajax({
            type: 'GET',
            url: '/restaurant/search',
            data: { searchText: searchText },
            success: function (result) {
                $("#results-menu").after(result)
            }
        });
    })
})