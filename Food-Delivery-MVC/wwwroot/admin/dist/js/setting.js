$(function () {

    $('#modal-edit').modal({
        backdrop: true,
        keyboard: true
    });

    $(document).on('click', '#table-area .table-tbody .btn-warning', function (e) {
        e.preventDefault()
        let id = $(this).attr('data-id')
        $('#table-area #form-edit').attr('data-id', id)
        $('#table-area #form-edit #image').val("")

        $.ajax({
            type: "GET",
            url: `/admin/setting/getbyid/${id}`,
            dataType: 'json',
            success: function (response) {
                $('#table-area #modal-edit #value').val(response.value)
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
            value: {
                required: true,
                maxlength: 200
            },
        },
        messages: {
            value: {
                required: "Value is required",
                maxlength: "Maximum 200 characters are allowed for value"
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
                    value: $('#table-area #modal-edit #value').val()
                })

            $("#form-edit #edit-btn").addClass("d-none")
            $("#form-edit #loading-edit-btn").removeClass("d-none")

            $.ajax({
                url: `/admin/setting/edit/${id}`,
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
                    let updatedDate = moment().format('MM/DD/yyyy')
                    let value = $('#table-area #modal-edit #value').val()

                    row.find('#value').html(value)
                    row.find('#updateDate').html(updatedDate)

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
                }
            });
            return false; // Prevent normal form submission
        }
    });
})