$(function () {
    $.validator.addMethod('filesize', function (value, element, param) {
        return this.optional(element) || (element.files[0].size <= param)
    }, 'File size must be less than {0}');

    let tableBody = $("#restaurant-area .table-tbody")
    let pagination = $("#restaurant-area .pagination-area .pagination")

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

                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Data successfully created",
                        showConfirmButton: false,
                        timer: 1500
                    });

                   getPaginatedDatas()
                        .then(function (datas) {
                            updateTable(datas)
                            updatePagination(datas)
                        })
                },
                error: function (xhr, status, error) {
                    $('#modal-repostt').modal('hide');
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

    $(document).on('click', '.page-item .page-link', function (e) {
        e.preventDefault()
        let currentPage = $(this).html()
        let pageItem = $(this).closest(".page-item")

        $.ajax({
            type: "GET",
            url: `https://localhost:7247/api/admin/restaurant/GetPaginateDatas?page=${currentPage}&take=5`,
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

                    tableBody.append(`<tr data-id="${item.id}">
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
                                    <a class="btn btn-warning btn-icon" data-id=${item.id} data-bs-toggle="modal" data-bs-target="#modal-edit">
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

    $(document).on('click', '.page-item .page-link:first', function (e) {
        e.preventDefault()

        let activePageItem = $('#restaurant-area .active')
        let previousPageItem = activePageItem.prev()


        let previousPage = (parseInt($('#restaurant-area .active .page-link').html())) - 1

        $.ajax({
            type: "GET",
            url: `https://localhost:7247/api/admin/restaurant/GetPaginateDatas?page=${previousPage}&take=5`,
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

                    tableBody.append(`<tr data-id="${item.id}">
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
                                    <a class="btn btn-warning btn-icon" data-id=${item.id} data-bs-toggle="modal" data-bs-target="#modal-edit">
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

    $(document).on('click', '.page-item .page-link:last', function (e) {
        e.preventDefault()

        let activePageItem = $('#restaurant-area .active')
        let nextPageItem = activePageItem.next()

        let nextPage = (parseInt($('#restaurant-area .active .page-link').html())) + 1

        $.ajax({
            type: "GET",
            url: `https://localhost:7247/api/admin/restaurant/GetPaginateDatas?page=${nextPage}&take=5`,
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

                    tableBody.append(`<tr data-id="${item.id}">
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
                                    <a class="btn btn-warning btn-icon" data-id=${item.id} data-bs-toggle="modal" data-bs-target="#modal-edit">
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

    $(document).on('click', '#restaurant-area .btn-warning', function (e) {
        e.preventDefault()
        let id = $(this).attr('data-id')
        $('#restaurant-area #form-edit').attr('data-id', id)

        $.ajax({
            type: "GET",
            url: `https://localhost:7247/api/admin/restaurant/getbyid/${id}`,
            dataType: 'json',
            success: function (response) {
                $('#restaurant-area #modal-edit #name').val(response.name)
                $('#restaurant-area #modal-edit #desc').val(response.description)
                $('#restaurant-area #modal-edit #phone').val(response.phone)
                $('#restaurant-area #modal-edit #email').val(response.email)
                $('#restaurant-area #modal-edit #address').val(response.address)
                $('#restaurant-area #modal-edit #delfee').val(response.deliveryFee)
                $('#restaurant-area #modal-edit #minorder').val(response.minimumOrder)
                $('#restaurant-area #modal-edit #mintime').val(response.minDeliveryTime)
                $('#restaurant-area #modal-edit #maxtime').val(response.maxDeliveryTime)
                $('#restaurant-area #modal-edit #website').val(response.website)
                $(`#restaurant-area #modal-edit #rating option[value="${response.rating}"]`).attr("selected", "selected")
                $(`#restaurant-area #modal-edit #active option[value="${response.isActive}"]`).attr("selected", "selected")
            }
        });

        //edit here
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
            let id = $('#restaurant-area #form-edit').attr('data-id')

            let formData = new FormData();
            formData.append('name', $('#restaurant-area #modal-edit #name').val());
            formData.append('description', $('#restaurant-area #modal-edit #desc').val());
            formData.append('phone', $('#restaurant-area #modal-edit #phone').val());
            formData.append('address', $('#restaurant-area #modal-edit #address').val());
            formData.append('deliveryFee', $('#restaurant-area #modal-edit #delfee').val());
            formData.append('minimumOrder', $('#restaurant-area #modal-edit #minorder').val());
            formData.append('minDeliveryTime', $('#restaurant-area #modal-edit #mintime').val());
            formData.append('maxDeliveryTime', $('#restaurant-area #modal-edit #maxtime').val());
            formData.append('website', $('#restaurant-area #modal-edit #website').val());
            formData.append('isActive', $('#restaurant-area #modal-edit #active').val());
            formData.append('email', $('#restaurant-area #modal-edit #email').val());
            formData.append('rating', $('#restaurant-area #modal-edit #rating').val());

            let files = $('#restaurant-area #modal-edit #images')[0].files;
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
                    let row = $(`#restaurant-area tr[data-id="${id}"]`)
                    let imageUrl=$(`#restaurant-area tr[data-id="${id}"] td img`).attr('src')
                    let name = formData.get('name')
                    let phone = formData.get('phone')
                    let email = formData.get('email')
                    let address = formData.get('address')
                    row.empty()
                    row.html(`    <td class="sort-name">
                                        <img src="${imageUrl}" style="width:90px;height:54px" alt="" />
                                    </td>
                                    <td class="sort-name">${name}</td>
                                    <td class="sort-name">${phone}</td>
                                    <td class="sort-name">${email}</td>
                                    <td class="sort-name">${address}</td>
                                    <td>
                                        <a class="btn btn-info btn-icon" asp-action="Detail" asp-route-id="@item.Id">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-info-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 9h.01" /><path d="M11 12h1v4h1" /></svg>
                                        </a>
                                        <a class="btn btn-warning btn-icon" data-id="${id}" data-bs-toggle="modal" data-bs-target="#modal-edit">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-pencil"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" /><path d="M13.5 6.5l4 4" /></svg>
                                        </a>
                                        <a class="btn btn-danger btn-icon delete-btn" data-id="${id}" data-bs-toggle="modal" data-bs-target="#modal-small">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
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

    function getPaginatedDatas() {
        return Promise.resolve($.ajax({
            type: "GET",
            url: `https://localhost:7247/api/admin/restaurant/GetPaginateDatas?page=1&take=5`,
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
                paginationHtml += ` <li class="page-item active"><a class="page-link" href="#">${i}</a></li>`
            } else {
                paginationHtml += ` <li class="page-item"><a class="page-link" href="#">${i}</a></li>`
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
                                        <a class="btn btn-warning btn-icon" data-id="${item.id}" data-bs-toggle="modal" data-bs-target="#modal-edit">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-pencil"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" /><path d="M13.5 6.5l4 4" /></svg>
                                        </a>
                                        <a class="btn btn-danger btn-icon delete-btn" data-id="${item.id}" data-bs-toggle="modal" data-bs-target="#modal-small">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                                        </a>
                                    </td>
                                </tr>`);
        })
    }
})