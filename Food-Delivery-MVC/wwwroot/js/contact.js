$(function () {

    $("#contact-create").validate({
        errorClass: "invalid-feedback",

        rules: {
            ignore: [],

            fullName: {
                required: true,
                maxlength: 100
            },
            subject: {
                required: true,
                maxlength: 100
            },
            email: {
                required: true,
                maxlength: 100,
                email: true
            },
            message: {
                required: true
            },
        },

        messages: {
            fullName: {
                required: "Please fill in your name!",
                maxlength: "Maximum 100 characters are allowed for full name"
            },
            subject: {
                required: "Please fill in your subject!",
                maxlength: "Maximum 100 characters are allowed for username"
            },
            email: {
                required: "Please fill in your email!",
                email: "Please provide valid email address!",
                maxlength: "Maximum 100 characters are allowed for email"
            },
            message: {
                required: "Please fill in your message!",
            },
        },

        submitHandler: function (form) {
            $("#contact-create #submit-btn").addClass("d-none")
            $("#contact-create #loading-btn").removeClass("d-none")

            const data = {
                fullName: $('#cf-fullName').val(),
                email: $('#cf-email').val(),
                subject: $('#cf-subject').val(),
                message: $('#cf-message').val()
            }

            axios.post('/contact/create', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(function (response) {
                    $("#contact-create #submit-btn").removeClass("d-none")
                    $("#contact-create #loading-btn").addClass("d-none")

                    Swal.fire({
                        title: "Your contact is submitted successfully",
                        text: "We will get back to you very soon!",
                        icon: "success",
                        showCancelButton: true,
                        cancelButtonColor: "#d33",
                        confirmButtonText: '<a href="/home/index" class="text-white">Go to home page</a>'
                    })
                })
                .catch(function (error) {
                    $("#contact-create #submit-btn").removeClass("d-none")
                    $("#contact-create #loading-btn").addClass("d-none")

                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Something went wrong!",
                    });
                });
            return false; // Prevent normal form submission
        }
    });
})