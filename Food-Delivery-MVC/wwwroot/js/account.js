$(function () {


    $.validator.addMethod("hasNumber", function (value, element) {
        return /[0-9]/.test(value);
    }, "Password must contain at least one number");
    $.validator.addMethod("hasUpperCase", function (value, element) {
        return /[A-Z]/.test(value);
    }, "Password must contain at least one uppercase letter");
    $.validator.addMethod("hasLowerCase", function (value, element) {
        return /[a-z]/.test(value);
    }, "Password must contain at least one lowercase letter");
    $.validator.addMethod("hasSpecialChar", function (value, element) {
        // Use regex to define which characters are considered special
        return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
    }, "Password must contain at least one special character");

    $("#signin-tab").validate({
        errorClass: "my-error-class",
        rules: {
            emailorusername: {
                required: true,
                maxlength: 50
            },
            password: {
                required: true,
            },
        },
        messages: {
            emailorusername: {
                required: "Email or username is required",
                maxlength: "Maximum 50 characters are allowed for full name"
            },
            password: {
                required: "Password is required",
            },
        },

        submitHandler: function (form) {

            let emailorusername = $("#signin-tab #emailorusername").val()
            let password = $("#signin-tab #password").val()
            let rememberMe = $("#signin-tab #remember").is(":checked")

            let data = {
                emailorusername,
                password,
                rememberMe
            }
            $("#signin-tab #signin-btn").addClass("d-none")
            $("#signin-tab #loading-btn").removeClass("d-none")

            $.ajax({
                type: "POST",
                url: `/account/signin`,
                data: data,
                success: function (response) {
                    $("#signin-tab #signin-btn").removeClass("d-none")
                    $("#signin-tab #loading-btn").addClass("d-none")
                    if (response.success == true) {
                        $('#signin-modal').modal('hide');
                        window.location.reload()
                    } else {
                        $(".signin-error").html("Signin failed")
                    }
                },
                error: function (xhr, status, error) {
                    $('#signin-modal').modal('hide');
                    $("#signin-tab #signin-btn").removeClass("d-none")
                    $("#signin-tab #loading-btn").addClass("d-none")
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

    ///
    $(document).on("click", "#signup-tab #signup-btn", function () {
        $("#signup-tab .exist-email").empty()
        $("#signup-tab .exist-username").empty()
    })

    $("#signup-tab").validate({
        errorClass: "my-error-class",
        rules: {
            ignore: [],
            fullname: {
                required: true,
                maxlength: 50
            },
            username: {
                required: true,
                maxlength: 50
            },
            email: {
                required: true,
                maxlength: 50
            },
            password: {
                required: true,
                minlength: 6,
                hasNumber: true,
                hasUpperCase: true,
                hasLowerCase: true,
                hasSpecialChar: true
            },
            confirmpassword: {
                equalTo: "#signup-tab #password"
            }
        },
        messages: {
            fullname: {
                required: "",
                maxlength: "Maximum 50 characters are allowed for full name"
            },
            username: {
                required: "",
                maxlength: "Maximum 50 characters are allowed for username"
            },
            email: {
                required: "",
                maxlength: "Maximum 50 characters are allowed for email"
            },
            password: {
                required: "Password is required",
            },
            confirmpassword: {
                equalTo: "Passwords do not match"
            }
        },

        submitHandler: function (form) {
            $("#signup-tab .exist-email").empty()
            $("#signup-tab .exist-username").empty()
            $("#signup-tab #signup-btn").addClass("d-none")
            $("#signup-tab #loading-btn").removeClass("d-none")

            let fullName = $("#signup-tab #fullname").val()
            let userName = $("#signup-tab #username").val()
            let email = $("#signup-tab #email").val()
            let password = $("#signup-tab #password").val()

            let data = {
                fullName,
                userName,
                email,
                password
            }

            $.ajax({
                type: "POST",
                url: `/account/signup`,
                data: data,
                //contentType: 'application/json',
                success: function (response) {
                    $("#signup-tab #signup-btn").removeClass("d-none")
                    $("#signup-tab #loading-btn").addClass("d-none")
                    if (response.errors == null) {
                        $('#signin-modal').modal('hide');
                        Swal.fire({
                            title: "Register is successfull!",
                            text: "Please confirm your email",
                            icon: "success"
                        });
                    } else if (response.isEmailTaken == true && response.isUsernameTaken == true) {
                        $("#signup-tab .exist-email").html(`Email '${data.email}' is already taken.`)
                        $("#signup-tab .exist-username").html(`Username '${data.userName}' is already taken.`)
                    } else if (response.isUsernameTaken == true) {
                        $("#signup-tab .exist-username").html(`Username '${data.userName}' is already taken.`)
                    } else if (response.isEmailTaken == true) {
                        $("#signup-tab .exist-email").html(`Email '${data.email}' is already taken.`)
                    }
                },
                error: function (xhr, status, error) {
                    $("#signup-tab #signup-btn").removeClass("d-none")
                    $("#signup-tab #loading-btn").addClass("d-none")
                    $('#signin-modal').modal('hide');
                    $('#modal-small').modal('hide');
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

    $("#forgot-password-tab").validate({
        errorClass: "my-error-class",
        rules: {
            emailorusername: {
                required: true,
                maxlength: 50
            },
        },
        messages: {
            emailorusername: {
                required: "Email or username is required",
                maxlength: "Maximum 50 characters are allowed for full name"
            },
        },
    });

    $("#reset-password-tab").validate({
        errorClass: "my-error-class",
        rules: {
            newpassword: {
                required: true,
                minlength: 6,
                hasNumber: true,
                hasUpperCase: true,
                hasLowerCase: true,
                hasSpecialChar: true
            },
            confirmpassword: {
                equalTo: "#reset-password-tab #newpassword"
            }
        },
        messages: {
            password: {
                required: "Password is required",
            },
            confirmpassword: {
                equalTo: "Passwords do not match"
            }
        },
    });

    $(document).on('click', '#profile-tabs a', function (e) {
        e.preventDefault()
        const $targetTab = $(this)
        const url = $targetTab.data('url')
        axios.get(url)
            .then(function (response) {
                $('#profile-section').html(response.data)
                $('.active').removeClass('active')
                $targetTab.addClass('active')
            })
            .catch(function (error) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                });
            });
    })
})


