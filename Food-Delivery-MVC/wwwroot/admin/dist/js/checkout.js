$(function () {

    let tableBody = $("#table-area .table-tbody")
    let pagination = $("#table-area .pagination-area .pagination")
    const header = "Bearer " + $.cookie("JWTToken");

    $('#modal-edit').modal({
        backdrop: true,
        keyboard: true
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

    $(document).on('click', '#table-area .table-tbody .btn-outline-warning', function (e) {
        e.preventDefault()
        let id = $(this).attr('data-id')
        $('#table-area #form-edit').attr('data-id', id)
    })

    $(document).on('submit', '#form-edit', function (e) {
        e.preventDefault()
        let modal = bootstrap.Modal.getInstance(document.getElementById('modal-edit'));
        modal._config.backdrop = 'static';
        modal._config.keyboard = false;
        $('#modal-edit .modal-header .btn-close').prop('disabled', true);
        $('#form-edit :input').prop('disabled', true);

        let id = $('#table-area #form-edit').attr('data-id')
        let status = $('#table-area #form-edit #status').val();

        const data = JSON.stringify({ status })

        axios.put(`https://localhost:7247/api/admin/checkout/edit/${id}`, data, {
            headers: {
                'Authorization': header,
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                modal._config.backdrop = true;
                modal._config.keyboard = true;
                $('#form-edit :input').prop('disabled', false);
                $('#modal-edit .modal-header .btn-close').prop('disabled', false);
                $(`tr[data-id=${id}]`).find('.status-row').html(status)
                $('#modal-edit').modal('hide')

                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Operation is successfull",
                    showConfirmButton: false,
                    timer: 1500
                });
            })
            .catch(function (error) {
                modal._config.backdrop = true;
                modal._config.keyboard = true;
                $('#form-edit :input').prop('disabled', false);
                $('#modal-edit .modal-header .btn-close').prop('disabled', false);
                $('#modal-edit').modal('hide')
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                });
            })
    })

    function getPaginatedDatas(page) {
        return Promise.resolve($.ajax({
            type: "GET",
            headers: {
                'Authorization': header
            },
            url: `https://localhost:7247/api/admin/checkout/GetPaginateDatas?page=${page}&take=5`,
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
                                    <td class="sort-name">${item.userName}</td>
                                    <td class="sort-name create-date">${item.createdDate}</td>
                                    <td class="sort-name">${item.status}</td>
                                    <td class="sort-name">${parseFloat(item.totalPrice).toFixed(2)}</td>
                                    <td>
                                        <a class="btn btn-outline-warning" data-id="${item.id}" data-bs-toggle="modal" data-bs-target="#modal-edit">
                                        Change status
                                        </a>
                                    </td>
                                </tr>`;
        })
        tableBody.append(html)
    }
})