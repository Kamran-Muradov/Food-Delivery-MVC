$(function () {
    let tableBody = $("#table-area .table-tbody")
    let pagination = $("#table-area .pagination-area .pagination")

    $('#modal-report').modal({
        backdrop: true,
        keyboard: true
    });

    $('#modal-edit').modal({
        backdrop: true,
        keyboard: true
    });

    $('#modal-small').modal({
        backdrop: true,
        keyboard: true
    });

    $(document).on('click', '#toggle-create', function (e) {
        e.preventDefault()

        getMenusSelected()
            .then(function (datas) {
                $("#form-create #menus").empty()
                let html = "";
                $.each(datas, function (index, item) {

                    html += `<option value="${item.id}">${item.name}</option>`;
                })
                $("#form-create #menus").append(html)
            })


        getTypesSelected()
            .then(function (datas) {
                $("#form-create #types").empty()
                let html = "";
                $.each(datas, function (index, item) {

                    html += `<option value="${item.id}">${item.name}</option>`;
                })
                $("#form-create #types").append(html)
            })
        $('#modal-report').modal('show')
    })

    $("#form-create").validate({
        errorClass: "my-error-class",
        rules: {
            option: {
                required: true,
                maxlength: 50
            },
            addprice: {
                required: true,
            }
        },
        messages: {
            option: {
                required: "Option is required",
                maxlength: "Maximum 50 characters are allowed for Option"
            },
            addprice: {
                required: "Price is required",
            }
        },

        submitHandler: function (form) {
            let modal = bootstrap.Modal.getInstance(document.getElementById('modal-report'));
            modal._config.backdrop = 'static';
            modal._config.keyboard = false;
            $('#form-create :input').prop('disabled', true);
            $('#modal-report .modal-header .btn-close').prop('disabled', true);

            let data = JSON.stringify(
                {
                    option: $('#table-area #form-create #option').val(),
                    additionalPrice: $('#table-area #form-create #addprice').val(),
                    menuId: $('#table-area #form-create #menus').val(),
                    variantTypeId: $('#table-area #form-create #types').val(),
                    isSingleChoice: $('#table-area #form-create #choice').val() == 'true' ? true : false
                })

            $("#form-create #create-btn").addClass("d-none")
            $("#form-create #loading-create-btn").removeClass("d-none")

            $.ajax({
                url: '/admin/menuvariant/create',
                method: 'POST',
                contentType: 'application/json',
                data: data,
                success: function (response) {
                    modal._config.backdrop = true;
                    modal._config.keyboard = true;
                    $('#form-create :input').prop('disabled', false);
                    $('#modal-report .modal-header .btn-close').prop('disabled', false);

                    $('#modal-report').modal('hide');
                    $("#form-create #create-btn").removeClass("d-none")
                    $("#form-create #loading-create-btn").addClass("d-none")
                    $("#form-create")[0].reset()

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
                    modal._config.backdrop = true;
                    modal._config.keyboard = true;
                    $('#form-create :input').prop('disabled', false);
                    $('#modal-report .modal-header .btn-close').prop('disabled', false);

                    if (xhr.status == 409) {
                        $("#form-create #create-btn").removeClass("d-none")
                        $("#form-create #loading-create-btn").addClass("d-none")
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Ingredient with this name already exists",
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
            url: `/admin/menuvariant/getbyid/${id}`,
            dataType: 'json',
            success: function (response) {
                $('#table-area #modal-edit #option').val(response.option)
                $('#table-area #modal-edit #addprice').val(response.additionalPrice)

                if (response.isSingleChoice == 'true') {
                    $('#table-area #modal-edit #choice').val('true')
                } else {
                    $('#table-area #modal-edit #choice').val('false')
                }

                let html = "";
                getMenusSelected()
                    .then(function (datas) {
                        $("#form-edit #menus").empty()
                        $.each(datas, function (index, item) {
                            if (item.name == response.menu) {
                                html += `<option selected value="${item.id}">${item.name}</option>`;
                            } else {
                                html += `<option value="${item.id}">${item.name}</option>`;
                            }

                        })
                        $("#form-edit #menus").append(html)
                        html = "";
                    })
                getTypesSelected()
                    .then(function (datas) {
                        $("#form-edit #types").empty()
                        $.each(datas, function (index, item) {
                            if (item.name == response.variantType) {
                                html += `<option selected value="${item.id}">${item.name}</option>`;
                            } else {
                                html += `<option value="${item.id}">${item.name}</option>`;
                            }

                        })
                        $("#form-edit #types").append(html)
                        html = "";
                    })
                $('#modal-edit').modal('show')

            },
            error: function (xhr, status, error) {
                $('#modal-edit').modal('hide');
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
            option: {
                required: true,
                maxlength: 50
            },
            addprice: {
                required: true,
            }
        },
        messages: {
            option: {
                required: "Option is required",
                maxlength: "Maximum 50 characters are allowed for Option"
            },
            addprice: {
                required: "Price is required",
            }
        },

        submitHandler: function (form) {
            let modal = bootstrap.Modal.getInstance(document.getElementById('modal-edit'));
            modal._config.backdrop = 'static';
            modal._config.keyboard = false;
            $('#modal-edit .modal-header .btn-close').prop('disabled', true);
            $('#form-edit :input').prop('disabled', true);

            let id = $('#table-area #form-edit').attr('data-id')
            let data = JSON.stringify(
                {
                    option: $('#table-area #form-edit #option').val(),
                    additionalPrice: $('#table-area #form-edit #addprice').val(),
                    menuId: $('#table-area #form-edit #menus').val(),
                    variantTypeId: $('#table-area #form-edit #types').val(),
                    isSingleChoice: $('#table-area #form-edit #choice').val() == 'true' ? true : false
                })

            $("#form-edit #edit-btn").addClass("d-none")
            $("#form-edit #loading-edit-btn").removeClass("d-none")

            $.ajax({
                url: `/admin/menuvariant/edit/${id}`,
                method: 'PUT',
                data: data,
                contentType: 'application/json',
                error: function (xhr, status, error) {
                    modal._config.backdrop = true;
                    modal._config.keyboard = true;
                    $('#form-edit :input').prop('disabled', false);
                    $('#modal-edit .modal-header .btn-close').prop('disabled', false);

                    if (xhr.status == 409) {
                        $("#form-edit #edit-btn").removeClass("d-none")
                        $("#form-edit #loading-edit-btn").addClass("d-none")
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Ingredient with this name already exists",
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
                    modal._config.backdrop = true;
                    modal._config.keyboard = true;
                    $('#form-edit :input').prop('disabled', false);
                    $('#modal-edit .modal-header .btn-close').prop('disabled', false);

                    let row = $(`#table-area tr[data-id="${id}"]`)
                    let createdDate = $(`#table-area tr[data-id="${id}"] .create-date`).html()
                    let updatedDate = moment().format('MM/DD/yyyy')
                    let option = $('#table-area #modal-edit #option').val()
                    row.empty()
                    row.html(`<td class="sort-name">${option}</td>
                                    <td class="sort-name create-date">${createdDate}</td>
                                    <td class="sort-name">${updatedDate}</td>
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
            return false; // Prevent normal form submission
        }
    });

    $(document).on("click", "#table-area .delete-btn", function (e) {
        let id = parseInt($(this).attr("data-id"));
        $("#table-area .yes-btn").attr("data-id", id)
    })

    $(document).on("click", "#table-area .yes-btn", function () {
        let modal = bootstrap.Modal.getInstance(document.getElementById('modal-small'));
        modal._config.backdrop = 'static';
        modal._config.keyboard = false;

        let id = parseInt($(this).attr("data-id"));
        $("#table-area .yes-btn").addClass("d-none")
        $("#table-area #loading-delete-btn").removeClass("d-none")

        $.ajax({
            type: "DELETE",
            url: `/admin/menuvariant/Delete?id=${id}`,
            success: function (response) {
                modal._config.backdrop = true;
                modal._config.keyboard = true;

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
                modal._config.backdrop = true;
                modal._config.keyboard = true;

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

    $(document).on('click', '#table-area .detail', function (e) {
        e.preventDefault()
        let id = $(this).attr('data-id')

        $('#table-area #modal-detail .data-area').empty()

        $.ajax({
            type: "GET",
            url: `/admin/menuVariant/getbyid/${id}`,
            dataType: 'json',
            success: function (response) {
                let html = "";

                html += `  <div class="mb-0 mt-3 flex-grow d-flex">
                    <p class="mb-0 font-weight-light"><strong>Name: </strong>${response.option}</p>
                </div>
                 <div class="mb-0 mt-3 flex-grow d-flex">
                    <p class="mb-0 font-weight-light"><strong>Price: </strong>$${response.additionalPrice.toFixed(2)}</p>
                </div>
                 <div class="mb-0 mt-3 flex-grow d-flex">
                    <p class="mb-0 font-weight-light"><strong>Menu: </strong>${response.menu}</p>
                </div>
                 <div class="mb-0 mt-3 flex-grow d-flex">
                    <p class="mb-0 font-weight-light"><strong>Choice type: </strong>${response.isSingleChoice ? "Single" : "Multiple"}</p>
                </div>
                <div class="mb-0 mt-3 flex-grow d-flex">
                    <p class="mb-0 font-weight-light"><strong>Create date: </strong>${response.createdDate}</p>
                </div>
                  <div class="mb-0 mt-3 flex-grow d-flex">
                    <p class="mb-0 font-weight-light"><strong>Create by: </strong>${response.createdBy}</p>
                </div>
                <div class="mb-0 mt-3 flex-grow d-flex">
                    <p class="mb-0 font-weight-light"><strong>Update date: </strong>${response.updatedDate}</p>
                </div>
                  <div class="mb-0 mt-3 flex-grow d-flex">
                    <p class="mb-0 font-weight-light"><strong>Update by: </strong>${response.updatedBy}</p>
                </div>`

                $('#table-area #modal-detail .data-area').html(html);
                $('#modal-detail').modal('show')
            }
        });
    })

    function getPaginatedDatas(page) {
        return Promise.resolve($.ajax({
            type: "GET",
            url: `/admin/menuvariant/GetPaginatedData?page=${page}&take=5`,
            dataType: 'json',
            error: function (xhr, status, error) {
                $('#modal-small').modal('hide');
                $(".page-loader").addClass("d-none")
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                });
            }
        }));
    }

    function getMenusSelected(exludeid = null) {
        return Promise.resolve($.ajax({
            type: "GET",
            url: `/admin/menu/getallforselect?exludeId=${exludeid}`,
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
    function getTypesSelected(exludeid = null) {
        return Promise.resolve($.ajax({
            type: "GET",
            url: `/admin/varianttype/getallforselect?exludeId=${exludeid}`,
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

        if (response.totalPage > 1) {
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

            if (response.totalPage == 1) {
                paginationHtml += `<li class="page-item disabled">
                        <a class="page-link" href="#">Next</a>
                    </li>`
            } else {
                paginationHtml += `<li class="page-item">
                        <a class="page-link" href="#">Next</a>
                    </li>`
            }

            pagination.html(paginationHtml)
        }
    }

    function updateTable(response) {

        tableBody.empty()
        let html = "";
        $.each(response.datas, function (index, item) {

            html += `<tr data-id="${item.id}">
                                    <td class="sort-name">${item.option}</td>
                                    <td class="sort-name create-date">${item.createdDate}</td>
                                    <td class="sort-name">${item.updatedDate}</td>
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
                                    </td>
                                </tr>`;
        })
        tableBody.append(html)
    }
})