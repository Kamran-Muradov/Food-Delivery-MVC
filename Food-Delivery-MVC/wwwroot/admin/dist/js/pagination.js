$(function () {
    $("#form-create").validate({
        errorClass: "my-error-class",
        rules: {
            name: {
                required: true,
                maxlength: 50
            },
            desc: {
                required: true,
                maxlength: 200
            },
            phone: {
                required: true,
                maxlength: 50
            },
            address: {
                required: true,
                maxlength: 50
            },
            delfee: {
                required: true,
                min: 1
            },
            mintime: {
                required: true,
                min: 1,
                max: 55
            },
            minorder: {
                required: true,
                min: 1
            },
            maxtime: {
                required: true,
                min: 1,
                max: 55
            },
            website: {
                url: true
            },
            email: {
                required: true,
                email: true,
                maxlength: 50
            },
            images: {
                required: true,
                extension: "jpeg|img|svg|webp|avif|jpg|png"
            }
        },
        messages: {
            name: {
                required: "Name is required",
                maxlength: "Maximum 50 characters are allowed for name"
            },
            desc: {
                required: "Description is required",
                maxlength: "Maximum 200 characters are allowed for name"
            },
            phone: {
                required: "Phone is required",
                maxlength: "Maximum 50 characters are allowed for phone"
            },
            address: {
                required: "Address is required",
                maxlength: "Maximum 50 characters are allowed for address"
            },
            delfee: {
                required: "Delivery fee is required",
                min: "Delivery fee must be minimum 1"
            },
            minorder: {
                required: "Minimum order is required",
                min: "Delivery fee must be minimum 1"
            },
            mintime: {
                required: "Minimum delivery time is required",
                min: "Minimum delivery time must be minimum 1",
                max: "Minimum delivery time must be maximum 55"
            },
            maxtime: {
                required: "Maximum delivery time is required",
                min: "Maximum delivery time must be minimum 1",
                max: "Maximum delivery time must be maximum 55"
            },
            images: {
                required: "At least one image is required",
                extension: "File must be image type"
            }
        },

        submitHandler: function (form) {

            let formData = new FormData();
            formData.append('name', $('#restaurant-area #name').val());
            formData.append('description', $('#restaurant-area #desc').val());
            formData.append('phone', $('#restaurant-area #phone').val());
            formData.append('address', $('#restaurant-area #address').val());
            formData.append('deliveryFee', $('#restaurant-area #delfee').val());
            formData.append('minimumOrder', $('#restaurant-area #minorder').val());
            formData.append('minDeliveryTime', $('#restaurant-area #mintime').val());
            formData.append('maxDeliveryTime', $('#restaurant-area #maxtime').val());
            formData.append('website', $('#restaurant-area #website').val());
            formData.append('isActive', $('#restaurant-area #active').val());
            formData.append('email', $('#restaurant-area #email').val());
            formData.append('rating', $('#restaurant-area #rating').val());

            let files = $('#restaurant-area #images')[0].files;
            for (var i = 0; i < files.length; i++) {
                formData.append('images', files[i]);
            }

            $(".page-loader").removeClass("d-none")
            $('#modal-report').modal('hide');

            // Use AJAX to submit form data
            $.ajax({
                url: 'https://localhost:7247/api/admin/restaurant/create',
                method: 'POST',
                processData: false,
                contentType: false,
                data: formData,
                success: function (response) {
                    $('#modal-report').modal('hide');
                    $(".page-loader").addClass("d-none")
                    window.location.reload()

                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Your work has been saved",
                        showConfirmButton: false,
                        timer: 1500
                    });

                    //$.ajax({
                    //    type: "GET",
                    //    url: `https://localhost:7247/api/admin/restaurant/GetPaginateDatas?page=1&take=3`,
                    //    dataType: 'json',
                    //    success: function (response) {
                    //        tableBody.empty()
                    //        pagination.empty()

                    //        let paginationHtml = `<li class="page-item disabled prev">
                    //    <a class="page-link" href="#" tabindex="-1">Previous</a>
                    //</li>`


                    //        for (let i = 1; i <= response.totalPage; i++) {
                    //            if (i == 1) {
                    //                paginationHtml += ` <li class="page-item active"><a class="page-link" href="#">${i}</a></li>`
                    //            } else {
                    //                paginationHtml += ` <li class="page-item"><a class="page-link" href="#">${i}</a></li>`
                    //            }
                    //        }

                    //        paginationHtml += `<li class="page-item">
                    //    <a class="page-link" href="#">Next</a>
                    //</li>`

                    //        pagination.html(paginationHtml)

                    //        $.each(response.datas, function (index, item) {

                    //            tableBody.append(`<tr>
                    //                <td class="sort-name">
                    //                    <img src="${item.mainImage}" style="width:90px;height:54px" alt="" />
                    //                </td>
                    //                <td class="sort-name">${item.name}</td>
                    //                <td class="sort-name">${item.phone}</td>
                    //                <td class="sort-name">${item.email}</td>
                    //                <td class="sort-name">${item.address}</td>
                    //                <td>
                    //                    <a class="btn btn-info btn-icon" asp-action="Detail" asp-route-id="@item.Id">
                    //                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-info-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 9h.01" /><path d="M11 12h1v4h1" /></svg>
                    //                    </a>
                    //                    <a class="btn btn-warning btn-icon" asp-action="Edit" asp-route-id="@item.Id">
                    //                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-pencil"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" /><path d="M13.5 6.5l4 4" /></svg>
                    //                    </a>
                    //                    <a class="btn btn-danger btn-icon delete-btn" data-id="${item.id}" data-bs-toggle="modal" data-bs-target="#modal-small">
                    //                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                    //                    </a>
                    //                </td>
                    //            </tr>`);
                    //        })
                    //    }
                    //});

                },
                error: function (xhr, status, error) {
                    alert('Error uploading files: ' + error);
                }
            });
            return false; // Prevent normal form submission
        }
    });
    let tableBody = $("#restaurant-area .table-tbody")
    //let pagination = $("#restaurant-area .pagination-area .pagination")
    $('#restaurant-area .page-item .page-link').not(':first').not(':last').on('click', function (e) {
        e.preventDefault()
        let currentPage = $(this).html()
        let pageItem = $(this).closest(".page-item")

        $.ajax({
            type: "GET",
            url: `https://localhost:7247/api/admin/restaurant/GetPaginateDatas?page=${currentPage}&take=3`,
            dataType: 'json',
            success: function (response) {
                tableBody.empty()
                $("#restaurant-area .active").removeClass("active")
                pageItem.addClass("active")

                if (currentPage == response.totalPage) {
                    $("#restaurant-area .page-item").last().addClass("disabled")
                } else {
                    $("#restaurant-area .page-item").last().removeClass("disabled")
                }

                if (currentPage == 1) {
                    $("#restaurant-area .page-item").first().addClass("disabled")
                } else {
                    $("#restaurant-area .page-item").first().removeClass("disabled")
                }

                $.each(response.datas, function (index, item) {

                    tableBody.append(`<tr>
                                <td class="sort-name">
                                    <img src="${item.mainImage}" style="width:90px;height:54px" alt="" />
                                </td>
                                <td class="sort-name">${item.name}</td>
                                <td class="sort-name">${item.phone}</td>
                                <td class="sort-name">${item.email}</td>
                                <td class="sort-name">${item.address}</td>
                                <td>
                                    <a class="btn btn-info btn-icon" asp-action="Detail" asp-route-id="@item.Id">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-info-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 9h.01" /><path d="M11 12h1v4h1" /></svg>
                                    </a>
                                    <a class="btn btn-warning btn-icon" asp-action="Edit" asp-route-id="@item.Id">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-pencil"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" /><path d="M13.5 6.5l4 4" /></svg>
                                    </a>
                                    <a class="btn btn-danger btn-icon delete-btn" data-id="${item.id}" data-bs-toggle="modal" data-bs-target="#modal-small">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                                    </a>
                                </td>
                            </tr>`);
                })
            }
        });
    })

    $('#restaurant-area .page-item .page-link').first().on('click', function (e) {
        e.preventDefault()

        let activePageItem = $('#restaurant-area .active')
        let previousPageItem = activePageItem.prev()


        let previousPage = (parseInt($('#restaurant-area .active .page-link').html())) - 1

        $.ajax({
            type: "GET",
            url: `https://localhost:7247/api/admin/restaurant/GetPaginateDatas?page=${previousPage}&take=3`,
            dataType: 'json',
            success: function (response) {
                tableBody.html("")
                activePageItem.removeClass("active")
                previousPageItem.addClass("active")

                $("#restaurant-area .page-item").last().removeClass("disabled")

                if (previousPage == 1) {
                    $("#restaurant-area .page-item").first().addClass("disabled")
                } else {
                    $("#restaurant-area .page-item").first().removeClass("disabled")
                }

                $.each(response.datas, function (index, item) {

                    tableBody.append(`<tr>
                                <td class="sort-name">
                                    <img src="${item.mainImage}" style="width:90px;height:54px" alt="" />
                                </td>
                                <td class="sort-name">${item.name}</td>
                                <td class="sort-name">${item.phone}</td>
                                <td class="sort-name">${item.email}</td>
                                <td class="sort-name">${item.address}</td>
                                <td>
                                    <a class="btn btn-info btn-icon" asp-action="Detail" asp-route-id="@item.Id">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-info-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 9h.01" /><path d="M11 12h1v4h1" /></svg>
                                    </a>
                                    <a class="btn btn-warning btn-icon" asp-action="Edit" asp-route-id="@item.Id">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-pencil"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" /><path d="M13.5 6.5l4 4" /></svg>
                                    </a>
                                    <a class="btn btn-danger btn-icon delete-btn" data-id="${item.id}" data-bs-toggle="modal" data-bs-target="#modal-small">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                                    </a>
                                </td>
                            </tr>`);
                })
            }
        });
    })

    $('#restaurant-area .page-item .page-link').last().on('click', function (e) {
        e.preventDefault()

        let activePageItem = $('#restaurant-area .active')
        let nextPageItem = activePageItem.next()

        let nextPage = (parseInt($('#restaurant-area .active .page-link').html())) + 1

        $.ajax({
            type: "GET",
            url: `https://localhost:7247/api/admin/restaurant/GetPaginateDatas?page=${nextPage}&take=3`,
            dataType: 'json',
            success: function (response) {
                tableBody.html("")
                activePageItem.removeClass("active")
                nextPageItem.addClass("active")

                $("#restaurant-area .page-item").first().removeClass("disabled")


                if (nextPage == response.totalPage) {
                    $("#restaurant-area .page-item").last().addClass("disabled")
                } else {
                    $("#restaurant-area .page-item").last().removeClass("disabled")
                }

                $.each(response.datas, function (index, item) {

                    tableBody.append(`<tr>
                                <td class="sort-name">
                                    <img src="${item.mainImage}" style="width:90px;height:54px" alt="" />
                                </td>
                                <td class="sort-name">${item.name}</td>
                                <td class="sort-name">${item.phone}</td>
                                <td class="sort-name">${item.email}</td>
                                <td class="sort-name">${item.address}</td>
                                <td>
                                    <a class="btn btn-info btn-icon" asp-action="Detail" asp-route-id="@item.Id">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-info-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 9h.01" /><path d="M11 12h1v4h1" /></svg>
                                    </a>
                                    <a class="btn btn-warning btn-icon" asp-action="Edit" asp-route-id="@item.Id">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-pencil"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" /><path d="M13.5 6.5l4 4" /></svg>
                                    </a>
                                    <a class="btn btn-danger btn-icon delete-btn" data-id="${item.id}" data-bs-toggle="modal" data-bs-target="#modal-small">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                                    </a>
                                </td>
                            </tr>`);
                })
            }
        });
    })

    //let files = $('#restaurant-area #images')[0].files;
    //$("#restaurant-area .data-create").on("submit", function (event) {
    //    event.preventDefault()
    //    var formData = new FormData();
    //    formData.append('name', $('#restaurant-area #name').val());
    //    formData.append('description', $('#restaurant-area #desc').val());
    //    formData.append('phone', $('#restaurant-area #phone').val());
    //    formData.append('address', $('#restaurant-area #address').val());
    //    formData.append('deliveryFee', $('#restaurant-area #delfee').val());
    //    formData.append('minimumOrder', $('#restaurant-area #minorder').val());
    //    formData.append('minimumOrder', $('#restaurant-area #minorder').val());
    //    formData.append('minDeliveryTime', $('#restaurant-area #mintime').val());
    //    formData.append('maxDeliveryTime', $('#restaurant-area #maxtime').val());
    //    formData.append('website', $('#restaurant-area #website').val());
    //    formData.append('isActive', $('#restaurant-area #active').val());
    //    formData.append('email', $('#restaurant-area #email').val());
    //    formData.append('rating', $('#restaurant-area #rating').val());

    //    let files = $('#restaurant-area #images')[0].files;
    //    for (var i = 0; i < files.length; i++) {
    //        formData.append('images', files[i]);
    //    }

    //    $(".page-loader").removeClass("d-none")

    //    $.ajax({
    //        url: 'https://localhost:7247/api/admin/restaurant/create',
    //        method: 'POST',
    //        processData: false,
    //        contentType: false,
    //        data: formData,
    //        success: function (response) {
    //            $(".page-loader").addClass("d-none")

    //            Swal.fire({
    //                position: "top-end",
    //                icon: "success",
    //                title: "Your work has been saved",
    //                showConfirmButton: false,
    //                timer: 1500
    //            });

    //            window.location.reload()
    //            //$.ajax({
    //            //    type: "GET",
    //            //    url: `https://localhost:7247/api/admin/restaurant/GetPaginateDatas?page=1&take=3`,
    //            //    dataType: 'json',
    //            //    success: function (response) {
    //            //        tableBody.empty()
    //            //        pagination.empty()

    //            //        let paginationHtml = `<li class="page-item disabled prev">
    //            //    <a class="page-link" href="#" tabindex="-1">Previous</a>
    //            //</li>`


    //            //        for (let i = 1; i <= response.totalPage; i++) {
    //            //            if (i == 1) {
    //            //                paginationHtml += ` <li class="page-item active"><a class="page-link" href="#">${i}</a></li>`
    //            //            } else {
    //            //                paginationHtml += ` <li class="page-item"><a class="page-link" href="#">${i}</a></li>`
    //            //            }
    //            //        }

    //            //        paginationHtml += `<li class="page-item">
    //            //    <a class="page-link" href="#">Next</a>
    //            //</li>`

    //            //        pagination.html(paginationHtml)

    //            //        $.each(response.datas, function (index, item) {

    //            //            tableBody.append(`<tr>
    //            //                <td class="sort-name">
    //            //                    <img src="${item.mainImage}" style="width:90px;height:54px" alt="" />
    //            //                </td>
    //            //                <td class="sort-name">${item.name}</td>
    //            //                <td class="sort-name">${item.phone}</td>
    //            //                <td class="sort-name">${item.email}</td>
    //            //                <td class="sort-name">${item.address}</td>
    //            //                <td>
    //            //                    <a class="btn btn-info btn-icon" asp-action="Detail" asp-route-id="@item.Id">
    //            //                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-info-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 9h.01" /><path d="M11 12h1v4h1" /></svg>
    //            //                    </a>
    //            //                    <a class="btn btn-warning btn-icon" asp-action="Edit" asp-route-id="@item.Id">
    //            //                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-pencil"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" /><path d="M13.5 6.5l4 4" /></svg>
    //            //                    </a>
    //            //                    <a class="btn btn-danger btn-icon delete-btn" data-id="${item.id}" data-bs-toggle="modal" data-bs-target="#modal-small">
    //            //                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
    //            //                    </a>
    //            //                </td>
    //            //            </tr>`);
    //            //        })
    //            //    }
    //            //});

    //        },
    //        error: function (xhr, status, error) {
    //            alert('Error uploading files: ' + error);
    //        }
    //    });
    //})

})