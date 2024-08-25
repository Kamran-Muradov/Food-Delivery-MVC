$(function () {
    let tableBody = $("#table-area .table-tbody")

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

    $("#form-create").validate({
        errorClass: "my-error-class",
        rules: {
            platform: {
                required: true,
                maxlength: 100
            },
            url: {
                required: true,
                maxlength: 200
            },
        },
        messages: {
            platform: {
                required: "Platform is required",
                maxlength: "Maximum 100 characters are allowed for platform"
            },
            url: {
                required: "Url is required",
                maxlength: "Maximum 200 characters are allowed for url"
            },
        },

        submitHandler: function (form) {
            let modal = bootstrap.Modal.getInstance(document.getElementById('modal-report'));
            modal._config.backdrop = 'static';
            modal._config.keyboard = false;
            $('#form-create :input').prop('disabled', true);
            $('#modal-report .modal-header .btn-close').prop('disabled', true);

            let data = JSON.stringify(
                {
                    platform: $('#table-area #form-create #platform').val(),
                    url: $('#table-area #form-create #url').val()
                })
            $("#form-create #create-btn").addClass("d-none")
            $("#form-create #loading-create-btn").removeClass("d-none")

            $.ajax({
                url: '/admin/socialMedia/create',
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

                    getAllDatas()
                        .then(function (datas) {
                            updateTable(datas)
                        })
                },
                error: function (xhr, status, error) {
                    modal._config.backdrop = true;
                    modal._config.keyboard = true;
                    $('#form-create :input').prop('disabled', false);
                    $('#modal-report .modal-header .btn-close').prop('disabled', false);
                    $("#form-create #create-btn").removeClass("d-none")
                    $("#form-create #loading-create-btn").addClass("d-none")

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

    $(document).on('click', '#table-area .table-tbody .btn-warning', function (e) {
        e.preventDefault()
        let id = $(this).attr('data-id')
        $('#table-area #form-edit').attr('data-id', id)
        $('#table-area #form-edit #image').val("")

        $.ajax({
            type: "GET",
            url: `/admin/socialMedia/getbyid/${id}`,
            dataType: 'json',
            success: function (response) {
                $('#table-area #modal-edit #platform').val(response.platform)
                $('#table-area #modal-edit #url').val(response.url)
                $('#modal-edit').modal('show')
            },
            error: function (xhr, status, error) {
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
            platform: {
                required: true,
                maxlength: 100
            },
            url: {
                required: true,
                maxlength: 200
            },
        },
        messages: {
            platform: {
                required: "Platform is required",
                maxlength: "Maximum 100 characters are allowed for platform"
            },
            url: {
                required: "Url is required",
                maxlength: "Maximum 200 characters are allowed for url"
            },
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
                    platform: $('#table-area #modal-edit #platform').val(),
                    url: $('#table-area #modal-edit #url').val()
                })

            $("#form-edit #edit-btn").addClass("d-none")
            $("#form-edit #loading-edit-btn").removeClass("d-none")

            $.ajax({
                url: `/admin/socialMedia/edit/${id}`,
                method: 'PUT',
                data: data,
                contentType: 'application/json',
                error: function (xhr, status, error) {
                    modal._config.backdrop = true;
                    modal._config.keyboard = true;
                    $('#form-edit :input').prop('disabled', false);
                    $('#modal-edit .modal-header .btn-close').prop('disabled', false);

                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Something went wrong!",
                    });
                },
                success: function () {
                    modal._config.backdrop = true;
                    modal._config.keyboard = true;
                    $('#form-edit :input').prop('disabled', false);
                    $('#modal-edit .modal-header .btn-close').prop('disabled', false);

                    let row = $(`#table-area tr[data-id="${id}"]`)
                    let createdDate = $(`#table-area tr[data-id="${id}"] .create-date`).html()
                    let updatedDate = moment().format('MM/DD/yyyy')
                    let platform = $('#table-area #modal-edit #platform').val()
                    let url = $('#table-area #modal-edit #url').val()
                    row.empty()
                    row.html(`<td class="sort-name">${platform}</td>
                                    <td class="sort-name">${url}</td>
                                    <td class="sort-name create-date">${createdDate}</td>
                                    <td class="sort-name">${updatedDate}</td>
                                    <td>
                                        <a class="btn btn-warning btn-icon" data-id="${id}">
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
            url: `/admin/socialMedia/Delete?id=${id}`,
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

                getAllDatas()
                    .then(function (datas) {
                        updateTable(datas)
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

    function getAllDatas() {
        return Promise.resolve($.ajax({
            type: "GET",
            url: `/admin/socialMedia/getAll`,
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

    function updateTable(response) {

        tableBody.empty()
        let html = "";
        $.each(response, function (index, item) {

            html += `<tr data-id="${item.id}">
                                    <td class="sort-name">${item.platform}</td>
                                    <td class="sort-name">${item.url}</td>
                                    <td class="sort-name create-date">${item.createdDate}</td>
                                    <td class="sort-name">${item.updatedDate}</td>
                                    <td>
                                        <a class="btn btn-warning btn-icon" data-id="${item.id}">
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