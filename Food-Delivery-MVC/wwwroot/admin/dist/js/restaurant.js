$(function () {
    $.validator.addMethod('filesize', function (value, element, param) {
        return this.optional(element) || (element.files[0].size <= param)
    }, 'File size must be less than {0}');

    let tableBody = $("#table-area .table-tbody")
    let pagination = $("#table-area .pagination-area .pagination")

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
                extension: "jpeg|img|svg|webp|avif|jpg|png",
                filesize: 512000
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
                extension: "File must be image type",
                filesize: "Image size cannot exceed 500Kb"
            }
        },

        submitHandler: function (form) {

            let formData = new FormData();
            formData.append('name', $('#table-area #name').val());
            formData.append('description', $('#table-area #desc').val());
            formData.append('phone', $('#table-area #phone').val());
            formData.append('address', $('#table-area #address').val());
            formData.append('deliveryFee', $('#table-area #delfee').val());
            formData.append('minimumOrder', $('#table-area #minorder').val());
            formData.append('minDeliveryTime', $('#table-area #mintime').val());
            formData.append('maxDeliveryTime', $('#table-area #maxtime').val());
            formData.append('website', $('#table-area #website').val());
            formData.append('isActive', $('#table-area #active').val());
            formData.append('email', $('#table-area #email').val());
            formData.append('rating', $('#table-area #rating').val());

            let files = $('#table-area #images')[0].files;
            for (var i = 0; i < files.length; i++) {
                formData.append('images', files[i]);
            }

            $(".page-loader").removeClass("d-none")
            $('#modal-report').modal('hide');

            $.ajax({
                url: 'https://localhost:7247/api/admin/restaurant/create',
                method: 'POST',
                processData: false,
                contentType: false,
                data: formData,
                success: function (response) {
                    $('#modal-report').modal('hide');
                    $(".page-loader").addClass("d-none")

                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Data successfully created",
                        showConfirmButton: false,
                        timer: 1500
                    });

                    getPaginatedDatas(1)
                        .then(function (datas) {
                            updateTable(datas)
                            updatePagination(datas)
                        })
                },
                error: function (xhr, status, error) {
                    $('#modal-report').modal('hide');
                    $(".page-loader").addClass("d-none")
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Something went wrong!",
                    });
                }
            });
            return false; // Prevent normal form submission
        }
    });

    $(document).on('click', '.page-item .page-num', function (e) {
        e.preventDefault()
        let currentPage = $(this).html()
        let pageItem = $(this).closest(".page-item")

        getPaginatedDatas(currentPage)
            .then(function (datas) {
                $("#table-area .active").removeClass("active")
                pageItem.addClass("active")
                if (currentPage == datas.totalPage) {
                    $("#table-area .page-item").last().addClass("disabled")
                } else {
                    $("#table-area .page-item").last().removeClass("disabled")
                }

                if (currentPage == 1) {
                    $("#table-area .page-item").first().addClass("disabled")
                } else {
                    $("#table-area .page-item").first().removeClass("disabled")
                }

                updateTable(datas)
            })


    })

    $(document).on('click', '.page-item .page-link:first', function (e) {
        e.preventDefault()

        let activePageItem = $('#table-area .active')
        let previousPageItem = activePageItem.prev()


        let previousPage = (parseInt($('#table-area .active .page-link').html())) - 1

        getPaginatedDatas(previousPage)
            .then(function (datas) {
                activePageItem.removeClass("active")
                previousPageItem.addClass("active")

                $("#table-area .page-item").last().removeClass("disabled")

                if (previousPage == 1) {
                    $("#table-area .page-item").first().addClass("disabled")
                } else {
                    $("#table-area .page-item").first().removeClass("disabled")
                }

                updateTable(datas)
            })
    })

    $(document).on('click', '.page-item .page-link:last', function (e) {
        e.preventDefault()

        let activePageItem = $('#table-area .active')

        let nextPageItem = activePageItem.next()

        let nextPage = (parseInt($('#table-area .active .page-link').html())) + 1


        getPaginatedDatas(nextPage)
            .then(function (datas) {
                activePageItem.removeClass("active")
                nextPageItem.addClass("active")

                $("#table-area .page-item").first().removeClass("disabled")


                if (nextPage == datas.totalPage) {
                    $("#table-area .page-item").last().addClass("disabled")
                } else {
                    $("#table-area .page-item").last().removeClass("disabled")
                }

                updateTable(datas)
            })
    })

    $(document).on('click', '#table-area .btn-warning', function (e) {
        e.preventDefault()
        let id = $(this).attr('data-id')
        $('#table-area #form-edit').attr('data-id', id)

        $.ajax({
            type: "GET",
            url: `https://localhost:7247/api/admin/restaurant/getbyid/${id}`,
            dataType: 'json',
            success: function (response) {
                $('#table-area #modal-edit #name').val(response.name)
                $('#table-area #modal-edit #desc').val(response.description)
                $('#table-area #modal-edit #phone').val(response.phone)
                $('#table-area #modal-edit #email').val(response.email)
                $('#table-area #modal-edit #address').val(response.address)
                $('#table-area #modal-edit #delfee').val(response.deliveryFee)
                $('#table-area #modal-edit #minorder').val(response.minimumOrder)
                $('#table-area #modal-edit #mintime').val(response.minDeliveryTime)
                $('#table-area #modal-edit #maxtime').val(response.maxDeliveryTime)
                $('#table-area #modal-edit #website').val(response.website)
                $(`#table-area #modal-edit #rating option[value="${response.rating}"]`).attr("selected", "selected")
                $(`#table-area #modal-edit #active option[value="${response.isActive}"]`).attr("selected", "selected")
            }
        });
    })

    $("#form-edit").validate({
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
                extension: "jpeg|img|svg|webp|avif|jpg|png",
                filesize: 512000
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
                extension: "File must be image type",
                filesize: "Image size cannot exceed 500Kb"
            }
        },

        submitHandler: function (form) {
            let id = $('#table-area #form-edit').attr('data-id')

            let formData = new FormData();
            formData.append('name', $('#table-area #modal-edit #name').val());
            formData.append('description', $('#table-area #modal-edit #desc').val());
            formData.append('phone', $('#table-area #modal-edit #phone').val());
            formData.append('address', $('#table-area #modal-edit #address').val());
            formData.append('deliveryFee', $('#table-area #modal-edit #delfee').val());
            formData.append('minimumOrder', $('#table-area #modal-edit #minorder').val());
            formData.append('minDeliveryTime', $('#table-area #modal-edit #mintime').val());
            formData.append('maxDeliveryTime', $('#table-area #modal-edit #maxtime').val());
            formData.append('website', $('#table-area #modal-edit #website').val());
            formData.append('isActive', $('#table-area #modal-edit #active').val());
            formData.append('email', $('#table-area #modal-edit #email').val());
            formData.append('rating', $('#table-area #modal-edit #rating').val());

            let files = $('#table-area #modal-edit #images')[0].files;
            for (var i = 0; i < files.length; i++) {
                formData.append('images', files[i]);
            }

            $(".page-loader").removeClass("d-none")
            $('#modal-edit').modal('hide');

            $.ajax({
                url: `https://localhost:7247/api/admin/restaurant/edit/${id}`,
                method: 'PUT',
                processData: false,
                contentType: false,
                data: formData,
                success: function (response) {
                    let row = $(`#table-area tr[data-id="${id}"]`)
                    let imageUrl = $(`#table-area tr[data-id="${id}"] td img`).attr('src')
                    let name = formData.get('name')
                    let phone = formData.get('phone')
                    let email = formData.get('email')
                    let address = formData.get('address')
                    row.empty()
                    row.html(`    <td class="sort-name">
                                        <img data-id="${id}" src="${imageUrl}" style="width:90px;height:54px" alt="" />
                                    </td>
                                    <td class="sort-name">${name}</td>
                                    <td class="sort-name">${phone}</td>
                                    <td class="sort-name">${email}</td>
                                    <td class="sort-name">${address}</td>
                                    <td>
                                        <a class="btn btn-info btn-icon detail" data-id="${id}" data-bs-toggle="modal" data-bs-target="#modal-detail">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-info-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 9h.01" /><path d="M11 12h1v4h1" /></svg>
                                        </a>
                                        <a class="btn btn-warning btn-icon" data-id="${id}" data-bs-toggle="modal" data-bs-target="#modal-edit">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-pencil"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" /><path d="M13.5 6.5l4 4" /></svg>
                                        </a>
                                        <a class="btn btn-danger btn-icon delete-btn" data-id="${id}" data-bs-toggle="modal" data-bs-target="#modal-small">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                                        </a>
                                         <a class="btn btn-outline-primary image-edit " data-id="${id}" data-bs-toggle="modal" data-bs-target="#modal-images">
                                        Edit images
                                        </a>
                                    </td>`)
                    $('#modal-edit').modal('hide');
                    $(".page-loader").addClass("d-none")

                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Operation is successfull",
                        showConfirmButton: false,
                        timer: 1500
                    });
                },
                error: function (xhr, status, error) {
                    $('#modal-edit').modal('hide');
                    $(".page-loader").addClass("d-none")
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Something went wrong!",
                    });
                }
            });
            return false; // Prevent normal form submission
        }
    });

    $(document).on('click', '#table-area .image-edit', function (e) {
        e.preventDefault()
        let id = $(this).attr('data-id')
        $('#table-area #form-images').attr('data-id', id)
        $('#table-area #modal-images .images-area').empty()

        $.ajax({
            type: "GET",
            url: `https://localhost:7247/api/admin/restaurantimage/getallbyrestaurantid/${id}`,
            dataType: 'json',
            success: function (response) {
                let html = "";
                $.each(response, function (index, item) {

                    if (item.isMain == true) {
                        html += `<div class="col-4 pr-1 position-relative show-btn mt-5 hide-btn">
                        <img src="${item.url}"
                             class="mb-2 mw-100 w-100 rounded image-main"
                             alt="image"
                             style="width:228px;height:163px;" />
                        <div class="operations">
                            <a class="btn btn-info btn-icon set-main position-absolute"
                               data-id="${item.id}"
                               data-restaurantId="${id}"
                               title="Set as main image"
                               style="left:41%;top:5%;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-photo"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M15 8h.01" /><path d="M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12z" /><path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5" /><path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l3 3" /></svg>
                            </a>
                            <a class="btn btn-danger btn-icon img-delete position-absolute"
                               data-id="${item.id}"
                               data-restaurantId="${id}"
                               title="Delete image"
                               style="left:41%;top:37%;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                            </a>
                        </div>
                    </div>`
                    } else {
                        html += `<div class="col-4 pr-1 position-relative show-btn mt-5 show-btn">
                        <img src="${item.url}"
                             class="mb-2 mw-100 w-100 rounded"
                             alt="image"
                             style="width:228px;height:163px;" />
                        <div class="operations">
                            <a class="btn btn-info btn-icon set-main position-absolute"
                               data-id="${item.id}"
                               data-restaurantId="${id}"
                               title="Set as main image"
                               style="left:41%;top:5%;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-photo"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M15 8h.01" /><path d="M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12z" /><path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5" /><path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l3 3" /></svg>
                            </a>
                            <a class="btn btn-danger btn-icon img-delete position-absolute"
                               data-id="${item.id}"
                               data-restaurantId="${id}"
                               title="Delete image"
                               style="left:41%;top:37%;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                            </a>
                        </div>
                    </div>`
                    }
                })

                $('#table-area #modal-images .images-area').append(html);
            }
        });
    })

    $(document).on('click', '#table-area .set-main', function (e) {
        e.preventDefault()

        let imageId = parseInt($(this).attr("data-id"));
        let restaurantId = parseInt($(this).attr("data-restaurantId"));

        let data = JSON.stringify({ restaurantId, imageId })

        $.ajax({
            type: "POST",
            url: `https://localhost:7247/api/admin/restaurant/SetMainImage`,
            data: data,
            contentType: 'application/json',
            success: function () {
                $(".image-main").removeClass("image-main");
                $(`[data-id=${imageId}]`).closest(".col-4").find("img").addClass("image-main");
                let newMainImageUrl = $(`[data-id=${imageId}]`).closest(".col-4").find("img").attr('src')
                $(`img[data-id="${restaurantId}"]`).attr('src', newMainImageUrl)
                $(".hide-btn")
                    .addClass("show-btn")
                    .removeClass("hide-btn");
                $(`[data-id=${imageId}]`).closest(".col-4")
                    .addClass("hide-btn")
                    .removeClass("show-btn");
            }
        });

    })

    $(document).on('click', '#table-area .img-delete', function (e) {
        e.preventDefault()

        let imageId = parseInt($(this).attr("data-id"));
        let restaurantId = parseInt($(this).attr("data-restaurantId"));

        let data = JSON.stringify({ restaurantId, imageId })

        $.ajax({
            type: "POST",
            url: `https://localhost:7247/api/admin/restaurant/DeleteImage`,
            data: data,
            contentType: 'application/json',
            success: function () {
                $(`[data-id=${imageId}]`).closest(".col-4").remove();
            }
        });
    })

    $(document).on("click", "#table-area .delete-btn", function (e) {
        e.preventDefault()
        let id = parseInt($(this).attr("data-id"));
        $("#table-area .yes-btn").attr("data-id", id)


    })

    $(document).on("click", "#table-area .yes-btn", function () {
        let id = parseInt($(this).attr("data-id"));
        $(".page-loader").removeClass("d-none")

        $.ajax({
            type: "DELETE",
            url: `https://localhost:7247/api/admin/Restaurant/Delete?id=${id}`,
            success: function (response) {
                $('#modal-small').modal('hide');
                $(".page-loader").addClass("d-none")

                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Data successfully deleted",
                    showConfirmButton: false,
                    timer: 1500
                });

                getPaginatedDatas(1)
                    .then(function (datas) {
                        updateTable(datas)
                        updatePagination(datas)
                    })
            },
            error: function (xhr, status, error) {
                $('#modal-small').modal('hide');
                $(".page-loader").addClass("d-none")
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                });
            }
        });
    })

    $(document).on('click', '#table-area .detail', function (e) {
        e.preventDefault()
        let id = $(this).attr('data-id')

        $('#table-area #modal-detail .images-area').empty()
        $('#table-area #modal-detail .data-area').empty()
        $('#table-area #modal-detail ul').empty();

        $.ajax({
            type: "GET",
            url: `https://localhost:7247/api/admin/restaurant/getbyid/${id}`,
            dataType: 'json',
            success: function (response) {
                let imgHtml = "";
                $.each(response.restaurantImages, function (index, item) {

                    if (item.isMain == true) {
                        imgHtml += `<div class="col-4 pr-1 position-relative mt-5">
                        <img src="${item.url}"
                             class="mb-2 mw-100 w-100 rounded image-main"
                             alt="image"
                             style="width:228px;height:163px;" />
                    </div>`
                    } else {
                        imgHtml += `<div class="col-4 pr-1 position-relative mt-5">
                        <img src="${item.url}"
                             class="mb-2 mw-100 w-100 rounded"
                             alt="image"
                             style="width:228px;height:163px;" />
                    </div>`
                    }
                })

                $('#table-area #modal-detail .images-area').append(imgHtml);

                let dataHtml = `  <div class="mb-0 mt-3 flex-grow d-flex">
                    <p class="mb-0 font-weight-light"><strong>Name: </strong>${response.name}</p>
                </div>
                <div class="mb-0 mt-3 flex-grow d-flex">
                    <p class="mb-0 font-weight-light"><strong>Description: </strong>${response.description}</p>
                </div>
                 <div class="mb-0 mt-3 flex-grow d-flex">
                    <p class="mb-0 font-weight-light"><strong>Phone: </strong>${response.phone}</p>
                </div>
                 <div class="mb-0 mt-3 flex-grow d-flex">
                    <p class="mb-0 font-weight-light"><strong>Email: </strong>${response.email}</p>
                </div>
                 <div class="mb-0 mt-3 flex-grow d-flex">
                    <p class="mb-0 font-weight-light"><strong>Delivery fee: </strong>${response.deliveryFee}</p>
                </div>
                 <div class="mb-0 mt-3 flex-grow d-flex">
                    <p class="mb-0 font-weight-light"><strong>Minimum order: </strong>${response.minimumOrder}</p>
                </div>
                 <div class="mb-0 mt-3 flex-grow d-flex">
                    <p class="mb-0 font-weight-light"><strong>Minimum delivery time: </strong>${response.minDeliveryTime}</p>
                </div>
                 <div class="mb-0 mt-3 flex-grow d-flex">
                    <p class="mb-0 font-weight-light"><strong>Maximum delivery time: </strong>${response.maxDeliveryTime}</p>
                </div>
                <div class="mb-0 mt-3 flex-grow d-flex">
                    <p class="mb-0 font-weight-light"><strong>Rating: </strong>${response.rating}</p>
                </div>
                <div class="mb-0 mt-3 flex-grow d-flex">
                    <p class="mb-0 font-weight-light"><strong>Create date: </strong>${response.createdDate}</p>
                </div>
                <div class="mb-0 mt-3 flex-grow d-flex">
                    <p class="mb-0 font-weight-light"><strong>Update date: </strong>${response.updatedDate}</p>
                </div>`

                $('#table-area #modal-detail .data-area').append(dataHtml);

                let categoryHtml = "";

                $.each(response.categories, function (index, item) {

                    categoryHtml += `<li class="list-group-item">${item}</li>`
                })
                $('#table-area #modal-detail ul').append(categoryHtml);
            }
        });
    })

    function getPaginatedDatas(page) {
        return Promise.resolve($.ajax({
            type: "GET",
            url: `https://localhost:7247/api/admin/restaurant/GetPaginateDatas?page=${page}&take=5`,
            dataType: 'json'
        }));
    }

    function updatePagination(response) {
        pagination.empty()

        let paginationHtml = `<li class="page-item disabled prev">
                        <a class="page-link" href="#" tabindex="-1">Previous</a>
                    </li>`


        for (let i = 1; i <= response.totalPage; i++) {
            if (i == 1) {
                paginationHtml += ` <li class="page-item active"><a class="page-link page-num" href="#">${i}</a></li>`
            } else {
                paginationHtml += ` <li class="page-item"><a class="page-link page-num" href="#">${i}</a></li>`
            }
        }

        paginationHtml += `<li class="page-item">
                        <a class="page-link" href="#">Next</a>
                    </li>`

        pagination.html(paginationHtml)
    }

    function updateTable(response) {

        tableBody.empty()
        $.each(response.datas, function (index, item) {

            tableBody.append(`<tr data-id="${item.id}">
                                    <td class="sort-name">
                                        <img data-id="${item.id}" src="${item.mainImage}" style="width:90px;height:54px" alt="" />
                                    </td>
                                    <td class="sort-name">${item.name}</td>
                                    <td class="sort-name">${item.phone}</td>
                                    <td class="sort-name">${item.email}</td>
                                    <td class="sort-name">${item.address}</td>
                                    <td>
                                        <a class="btn btn-info btn-icon detail" data-id="${item.id}" data-bs-toggle="modal" data-bs-target="#modal-detail">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-info-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 9h.01" /><path d="M11 12h1v4h1" /></svg>
                                        </a>
                                        <a class="btn btn-warning btn-icon" data-id="${item.id}" data-bs-toggle="modal" data-bs-target="#modal-edit">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-pencil"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" /><path d="M13.5 6.5l4 4" /></svg>
                                        </a>
                                        <a class="btn btn-danger btn-icon delete-btn" data-id="${item.id}" data-bs-toggle="modal" data-bs-target="#modal-small">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                                        </a>
                                         <a class="btn btn-outline-primary image-edit " data-id="${item.id}" data-bs-toggle="modal" data-bs-target="#modal-images">
                                        Edit images
                                        </a>
                                    </td>
                                </tr>`);
        })
    }
})