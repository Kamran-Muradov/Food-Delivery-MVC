$(function () {
    $(document).on('input', '#input-search', function (e) {
        let searchText = $(this).val().trim()
        let html = "";
        $("#results-menu").nextAll().remove()

        if (searchText.length <= 0) {
            $("#results-menu").addClass("d-none")
        }



        if (searchText.length > 0) {
            //searchMenus(searchText)
            //    .then(function (datas) {
            //        if (datas.length > 0) {
            //            $("#results-menu").removeClass("d-none")

            //            $.each(datas.slice(0, 4), function (index, item) {

            //                html += `<div class="col-lg-3 col-md-4 col-sm-6 mb-grid-gutter">
            //                    <div class="card product-card border pb-2"><a class="d-block" href="#quick-view" data-bs-toggle="modal"><img class="card-img-top" src="${item.image}" alt="Pizza"></a>
            //                        <div class="card-body pt-1 pb-2">
            //                            <h3 class="product-title fs-md"><a href="#quick-view" data-bs-toggle="modal">${item.name}</a></h3>
            //                        </div>
            //                    </div>
            //                </div>`;
            //            })
            //            $("#results-menu").after(html)
            //            html = "";
            //        } else {
            //            $("#results-menu").addClass("d-none")
            //        }
            //    })

            axios.get(`https://localhost:7247/api/restaurant/search?searchText=${searchText}`)
                .then(function (response) {
                    if (response.data.length > 0) {
                        $("#results-menu").removeClass("d-none")

                        $.each(response.data.slice(0, 4), function (index, item) {
                            let categoryNames = item.categories.map(obj => obj.name).join(", ")

                            let mainImage = item.restaurantImages.filter(obj => obj.isMain == true)[0]

                            html += `<div class="col-lg-3 col-md-4 col-sm-6 mb-grid-gutter">
                                <div class="card product-card border pb-2"><a class="d-block" href="#quick-view" data-bs-toggle="modal"><img class="card-img-top" src="${mainImage.url}" alt="Pizza"></a>
                                    <div class="card-body pt-1 pb-2">
                                        <h3 class="product-title fs-md"><a href="#quick-view" data-bs-toggle="modal">${item.name}</a></h3>
                                        <p class="fs-ms text-muted">${categoryNames}</p>
                                    </div>
                                </div>
                            </div>`;
                        })
                        $("#results-menu").after(html)
                        html = "";
                    } else {
                        $("#results-menu").addClass("d-none")
                    }
                })
                .catch(function (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Something went wrong!",
                    });
                })

            //searchRestaurants(searchText)
            //    .then(function (datas) {
            //        if (datas.length > 0) {
            //            $("#results-menu").removeClass("d-none")

            //            $.each(datas.slice(0, 4), function (index, item) {
            //                let categoryNames = item.categories.map(obj => obj.name).join(", ")

            //                var returnedData = $.grep(data.items, function (element) {
            //                    return element.category.indexOf('cat1') >= 0;
            //                });

            //                html += `<div class="col-lg-3 col-md-4 col-sm-6 mb-grid-gutter">
            //                    <div class="card product-card border pb-2"><a class="d-block" href="#quick-view" data-bs-toggle="modal"><img class="card-img-top" src="${item.mainImage}" alt="Pizza"></a>
            //                        <div class="card-body pt-1 pb-2">
            //                            <h3 class="product-title fs-md"><a href="#quick-view" data-bs-toggle="modal">${item.name}</a></h3>
            //                            <p class="fs-ms text-muted">${categoryNames}</p>
            //                        </div>
            //                    </div>
            //                </div>`;
            //            })
            //            $("#results-menu").after(html)
            //            html = "";
            //        } else {
            //            $("#results-menu").addClass("d-none")
            //        }
            //    })
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