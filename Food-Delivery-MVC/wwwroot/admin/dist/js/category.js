$(function () {
    $.validator.addMethod('filesize', function (value, element, param) {
        return this.optional(element) || (element.files[0].size <= param)
    }, 'File size must be less than {0}');

    let tableBody = $("#table-area .table-tbody")
    let pagination = $("#table-area .pagination-area .pagination")
    const header = "Bearer " + $.cookie("JWTToken");

    $("#form-create").validate({
        errorClass: "my-error-class",
        rules: {
            name: {
                required: true,
                maxlength: 50
            },
            image: {
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
            image: {
                required: "Image is required",
                extension: "File must be image type",
                filesize: "Image size cannot exceed 500Kb"
            }
        },

        submitHandler: function (form) {

            let formData = new FormData();
            formData.append('name', $('#table-area #name').val());

            let files = $('#table-area #image')[0].files;
            for (var i = 0; i < files.length; i++) {
                formData.append('image', files[i]);
            }

            $("#form-create #create-btn").addClass("d-none")
            $("#form-create #loading-create-btn").removeClass("d-none")

            $.ajax({
                url: 'https://localhost:7247/api/admin/category/create',
                method: 'POST',
                headers: {
                    'Authorization': header
                },
                processData: false,
                contentType: false,
                data: formData,
                success: function (response) {
                    $('#modal-report').modal('hide');
                    $("#form-create #create-btn").removeClass("d-none")
                    $("#form-create #loading-create-btn").addClass("d-none")

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
                    if (xhr.status == 409) {
                        $("#form-create #create-btn").removeClass("d-none")
                        $("#form-create #loading-create-btn").addClass("d-none")
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Category with this name already exists",
                        });
                    } else {
                        $("#form-create #create-btn").removeClass("d-none")
                        $("#form-create #loading-create-btn").addClass("d-none")
                        $('#modal-report').modal('hide');
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Something went wrong!",
                        });
                    }
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

    $(document).on('click', '#table-area .table-tbody .btn-warning', function (e) {
        e.preventDefault()
        let id = $(this).attr('data-id')
        $('#table-area #form-edit').attr('data-id', id)
        $('#table-area #form-edit #image').val("")

        $.ajax({
            type: "GET",
            url: `https://localhost:7247/api/admin/category/getbyid/${id}`,
            headers: {
                'Authorization': header
            },
            dataType: 'json',
            success: function (response) {
                $('#table-area #modal-edit #name').val(response.name)
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
    })

    $("#form-edit").validate({
        errorClass: "my-error-class",
        rules: {
            name: {
                required: true,
                maxlength: 50
            },
            image: {
                extension: "jpeg|img|svg|webp|avif|jpg|png",
                filesize: 512000
            }
        },
        messages: {
            name: {
                required: "Name is required",
                maxlength: "Maximum 50 characters are allowed for name"
            },
            image: {
                extension: "File must be image type",
                filesize: "Image size cannot exceed 500Kb"
            }
        },

        submitHandler: function (form) {
            let id = $('#table-area #form-edit').attr('data-id')
            let formData = new FormData();
            formData.append('name', $('#table-area #modal-edit #name').val());

            let files = $('#table-area #modal-edit #image')[0].files;
            for (var i = 0; i < files.length; i++) {
                formData.append('image', files[i]);
            }

            $("#form-edit #edit-btn").addClass("d-none")
            $("#form-edit #loading-edit-btn").removeClass("d-none")

            $.ajax({
                url: `https://localhost:7247/api/admin/category/edit/${id}`,
                method: 'PUT',
                headers: {
                    'Authorization': header
                },
                processData: false,
                contentType: false,
                data: formData,
                error: function (xhr, status, error) {
                    if (xhr.status == 409) {
                        $("#form-edit #edit-btn").removeClass("d-none")
                        $("#form-edit #loading-edit-btn").addClass("d-none")
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Category with this name already exists",
                        });
                    } else {
                        $("#form-edit #edit-btn").removeClass("d-none")
                        $("#form-edit #loading-edit-btn").addClass("d-none")
                        $('#modal-edit').modal('hide');
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Something went wrong!",
                        });
                    }
                },
                success: function () {
                    $.ajax({
                        url: `https://localhost:7247/api/admin/categoryimage/getbycategoryid/${id}`,
                        headers: {
                            'Authorization': header
                        },
                        method: 'GET',
                        dataType: 'json',
                        success: function (response) {

                            let row = $(`#table-area tr[data-id="${id}"]`)
                            let imageUrl = response.url
                            let createdDate = $(`#table-area tr[data-id="${id}"] .create-date`).html()
                            let updatedDate = moment().format('MM/DD/yyyy')
                            let name = formData.get('name')
                            row.empty()
                            row.html(`    <td class="sort-name">
                                        <img data-id="${id}" src="${imageUrl}" style="width:90px;height:54px" alt="" />
                                    </td>
                                    <td class="sort-name">${name}</td>
                                    <td class="sort-name create-date">${createdDate}</td>
                                    <td class="sort-name">${updatedDate}</td>
                                    <td>
                                        <a class="btn btn-warning btn-icon" data-id="${id}" data-bs-toggle="modal" data-bs-target="#modal-edit">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-pencil"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" /><path d="M13.5 6.5l4 4" /></svg>
                                        </a>
                                        <a class="btn btn-danger btn-icon delete-btn" data-id="${id}" data-bs-toggle="modal" data-bs-target="#modal-small">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                                        </a>
                                    </td>`)

                            $('#modal-edit').modal('hide');
                            $("#form-edit #edit-btn").removeClass("d-none")
                            $("#form-edit #loading-edit-btn").addClass("d-none")

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
                            $("#form-edit #edit-btn").removeClass("d-none")
                            $("#form-edit #loading-edit-btn").addClass("d-none")
                            Swal.fire({
                                icon: "error",
                                title: "Oops...",
                                text: "Something went wrong!",
                            });
                        }
                    });
                }
            });
            return false; // Prevent normal form submission
        }
    });

    $(document).on("click", "#table-area .delete-btn", function (e) {
        let id = parseInt($(this).attr("data-id"));
        $("#table-area .yes-btn").attr("data-id", id)
    })

    $(document).on("click", "#table-area .yes-btn", function () {
        let id = parseInt($(this).attr("data-id"));
        $("#table-area .yes-btn").addClass("d-none")
        $("#table-area #loading-delete-btn").removeClass("d-none")

        $.ajax({
            type: "DELETE",
            url: `https://localhost:7247/api/admin/category/Delete?id=${id}`,
            headers: {
                'Authorization': header
            },
            success: function (response) {
                $('#modal-small').modal('hide');
                $("#table-area .yes-btn").removeClass("d-none")
                $("#table-area #loading-delete-btn").addClass("d-none")

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
                $("#table-area .yes-btn").removeClass("d-none")
                $("#table-area #loading-delete-btn").addClass("d-none")
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

    function getPaginatedDatas(page) {
        return Promise.resolve($.ajax({
            type: "GET",
            headers: {
                'Authorization': header
            },
            url: `https://localhost:7247/api/admin/category/GetPaginateDatas?page=${page}&take=5`,
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
        let html = "";
        $.each(response.datas, function (index, item) {

            html += `<tr data-id="${item.id}">
                                    <td class="sort-name">
                                        <img data-id="${item.id}" src="${item.image}" style="width:90px;height:54px" alt="" />
                                    </td>
                                    <td class="sort-name">${item.name}</td>
                                    <td class="sort-name create-date">${item.createdDate}</td>
                                    <td class="sort-name">${item.updatedDate}</td>
                                    <td>
                                        <a class="btn btn-warning btn-icon" data-id="${item.id}" data-bs-toggle="modal" data-bs-target="#modal-edit">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-pencil"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" /><path d="M13.5 6.5l4 4" /></svg>
                                        </a>
                                        <a class="btn btn-danger btn-icon delete-btn" data-id="${item.id}" data-bs-toggle="modal" data-bs-target="#modal-small">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                                        </a>
                                    </td>
                                </tr>`;
        })
        tableBody.append(html)
    }
})