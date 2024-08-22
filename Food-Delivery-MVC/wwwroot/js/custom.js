$(function () {
    const connection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7247/checkoutHub", {
            transport: signalR.HttpTransportType.WebSockets,
            withCredentials: true
        })
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



    $(document).on('input', '#input-search', function (e) {
        let searchText = $(this).val().trim()
        let html = ` 
           <div id="results-menu" class="d-flex justify-content-between">
                        <h4>Restaurants</h4>
                        <a href="#" onclick="$(this).closest('form').submit()">See all</a>
                    </div> `;
        //$("#results-menu").nextAll().remove()

        if (searchText.length <= 0) {
            $("#search-area").html("")
            $('#search-area').css('height', '')
        }


        if (searchText.length > 0) {
            $('#search-area').css('height', '321px')
            axios.get(`https://localhost:7247/api/restaurant/search?searchText=${searchText}`)
                .then(function (response) {
                    if (response.data.length > 0) {
                        //$("#results-menu").removeClass("d-none")

                        $.each(response.data.slice(0, 4), function (index, item) {
                            let tagNames = item.tags.slice(0, 3).map(obj => obj.name).join(", ")

                            let mainImage = item.restaurantImages.filter(obj => obj.isMain == true)[0]


                            html += `<div class="col-lg-3 col-md-4 col-sm-6 mb-grid-gutter">
                             <a href="/restaurant/detail/${item.id}">
                                <div class="card product-card border pb-2"><img class="card-img-top" style="height:112px" src="${mainImage.url}" alt="Pizza">
                                    <div class="card-body pt-1 pb-2 px-2">
                                        <h3 class="product-title fs-md">${item.name}</h3>
                                        <p style="font-size:12px !important" class="text-muted">${tagNames}</p>
                                    </div>
                                </div>
                                 </a>
                            </div> `;
                        })
                        $("#search-area").html(html)
                        html = "";
                    } else {
                        //$("#results-menu").addClass("d-none")
                        //$('#search-area').css('height', '')
                        $("#search-area").html(` <div class="d-flex justify-content-center align-items-center">
                        <h1>No results found</h1>
                    </div>`)
                    }
                })
                .catch(function (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Something went wrong!",
                    });
                })
        }
    })

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
    function searchMenus(searchText) {
        //return Promise.resolve($.ajax({
        //    type: "GET",
        //    url: `https://localhost:7247/api/menu/search?searchText=${searchText}`,
        //    dataType: 'json',
        //    error: function (xhr, status, error) {
        //        Swal.fire({
        //            icon: "error",
        //            title: "Oops...",
        //            text: "Something went wrong!",
        //        });
        //    }
        //}));


    }

    function searchRestaurants(searchText) {
        return Promise.resolve($.ajax({
            type: "GET",
            url: `https://localhost:7247/api/restaurant/search?searchText=${searchText}`,
            dataType: 'json',
            error: function (xhr, status, error) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                });
            }
        }));
    }
})