﻿$(function () {
    let tableBody = $("#table-area .table-tbody")
    let pagination = $("#table-area .pagination-area .pagination")

    $('#modal-edit').modal({
        backdrop: true,
        keyboard: true
    });

    $(document).on('click', '.page-item .page-num', function (e) {
        e.preventDefault()
        let currentPage = $(this).html()
        let pageItem = $(this).closest(".page-item")
        const searchText = $('#search').val()

        getPaginatedDatas(currentPage, searchText)
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
        const searchText = $('#search').val()

        getPaginatedDatas(previousPage, searchText)
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
        const searchText = $('#search').val()


        getPaginatedDatas(nextPage, searchText)
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
            url: `/admin/account/getroles?userId=${id}`,
            dataType: 'json',
            success: function (response) {
                let html = ""

                $.each(response, function (index, item) {

                    if (item.roleName == "Member") {
                        html += `<label class="form-check">
                                <input class="form-check-input" type="checkbox" name="role" value="${item.roleName}" disabled checked="">
                                <span class="form-check-label">${item.roleName}</span>
                            </label>`
                    } else if (item.isInUser == true) {
                        html += `<label class="form-check">
                                <input class="form-check-input" type="checkbox" name="role" value="${item.roleName}" checked="">
                                <span class="form-check-label">${item.roleName}</span>
                            </label>`
                    } else {
                        html += `<label class="form-check">
                                <input class="form-check-input" type="checkbox" name="role" value="${item.roleName}">
                                <span class="form-check-label">${item.roleName}</span>
                            </label>`
                    }
                })

                $("#form-edit .roles").html(html)
                $('#modal-edit').modal('show')
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
    })

    $("#form-edit").validate({
        submitHandler: function (form) {
            let modal = bootstrap.Modal.getInstance(document.getElementById('modal-edit'));
            modal._config.backdrop = 'static';
            modal._config.keyboard = false;
            $('#modal-edit .modal-header .btn-close').prop('disabled', true);
            $('#form-edit :input').prop('disabled', true);

            var roles = [];
            $('#form-edit input[name="role"]:checked').each(function () {
                roles.push($(this).val());
            });

            let id = $('#table-area #form-edit').attr('data-id')

            $.ajax({
                url: `/admin/account/AddRoleToUser?userId=${id}`,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ roles: roles }),
                error: function (xhr, status, error) {
                    modal._config.backdrop = true;
                    modal._config.keyboard = true;
                    $('#form-edit :input').prop('disabled', false);
                    $('#modal-edit .modal-header .btn-close').prop('disabled', false);

                    $("#form-edit #edit-btn").removeClass("d-none")
                    $("#form-edit #loading-edit-btn").addClass("d-none")
                    $('#modal-edit').modal('hide');
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Something went wrong!",
                    });
                },
                success: function () {
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Operation is successfull",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    modal._config.backdrop = true;
                    modal._config.keyboard = true;
                    $('#form-edit :input').prop('disabled', false);
                    $('#modal-edit .modal-header .btn-close').prop('disabled', false);

                    $("#form-edit #edit-btn").removeClass("d-none")
                    $("#form-edit #loading-edit-btn").addClass("d-none")
                    $('#modal-edit').modal('hide');
                }
            });
            return false; // Prevent normal form submission
        }
    });

    $(document).on('click', '#table-area .detail', function (e) {
        e.preventDefault()
        let id = $(this).attr('data-id')

        $('#table-area #modal-detail .images-area').empty()
        $('#table-area #modal-detail .data-area').empty()
        $('#table-area #modal-detail ul').empty();

        $.ajax({
            type: "GET",
            url: `/admin/account/getUserDetail?userId=${id}`,
            dataType: 'json',
            success: function (response) {
                let html = "";
                html += `<div class="col-4 pr-1 position-relative mt-5">
                        <img src="${response.profilePicture}"
                             class="mb-2 mw-100 w-100 rounded"
                             alt="image"
                             style="width:228px;height:163px;" />
                    </div>`
                $('#table-area #modal-detail .images-area').html(html);
                html = "";

                html += `<div class="mb-0 mt-3 flex-grow d-flex">
                    <p class="mb-0 font-weight-light"><strong>Full name: </strong>${response.fullName}</p>
                </div>
                 <div class="mb-0 mt-3 flex-grow d-flex">
                    <p class="mb-0 font-weight-light"><strong>Username: </strong>${response.userName}</p>
                </div>
                 <div class="mb-0 mt-3 flex-grow d-flex">
                    <p class="mb-0 font-weight-light"><strong>Email: </strong>${response.email}</p>
                </div>
                 <div class="mb-0 mt-3 flex-grow d-flex">
                    <p class="mb-0 font-weight-light"><strong>Roles: </strong>${response.roles.join(", ")}</p>
                </div>`

                $('#table-area #modal-detail .data-area').html(html);

                html = "";

                $.each(response.categories, function (index, item) {

                    html += `<li class="list-group-item">${item}</li>`
                })
                $('#table-area #modal-detail #categories').append(html);
                html = "";

                $.each(response.ingredients, function (index, item) {

                    html += `<li class="list-group-item">${item}</li>`
                })
                $('#table-area #modal-detail #ingredients').append(html);
                html = "";
                $('#modal-detail').modal('show')
            }
        });
    })

    $(document).on('input', '#search', function (e) {
        const searchText = $(this).val()

        if (searchText.length > 0) {
            getPaginatedDatas(1, searchText)
                .then(function (datas) {
                    updateTable(datas)
                    updatePagination(datas)
                })
        } else {
            getPaginatedDatas(1)
                .then(function (datas) {
                    updateTable(datas)
                    updatePagination(datas)
                })
        }
    })

    function getPaginatedDatas(page, searchText = null) {
        return Promise.resolve($.ajax({
            type: "GET",
            url: `/admin/account/GetUsersPaginate?page=${page}&take=5&searchText=${searchText != null ? searchText : ""}`,
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

            if (response.totalPage <= 1) {
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

        let html = "";
        $.each(response.datas, function (index, item) {

            html += `<tr data-id="${item.id}">
                                    <td class="sort-name">
                                        <img data-id="${item.id}" src="${item.profilePicture}" style="width:90px;height:54px" alt="" />
                                    </td>
                                    <td class="sort-name">${item.fullName}</td>
                                    <td class="sort-name">${item.userName}</td>
                                    <td class="sort-name create-date">${item.email}</td>
                                    <td>
                                     <a class="btn btn-info btn-icon detail" data-id="${item.id}">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-info-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 9h.01" /><path d="M11 12h1v4h1" /></svg>
                                    </a>
                                        <a class="btn btn-warning" data-id="${item.id}">
                                        Edit roles
                                        </a>
                                    </td>
                                </tr>`;
        })
        tableBody.html(html)
    }
})