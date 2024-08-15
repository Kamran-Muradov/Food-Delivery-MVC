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
        return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
    }, "Password must contain at least one special character");
    $.validator.addMethod("notEqualTo", function (value, element, param) {
        return value !== $(param).val();
    }, "New password must be different from the current password.");

    $('#signin-modal').modal({
        backdrop: true,
        keyboard: true
    });

    $('#review-create-modal').modal({
        backdrop: true,
        keyboard: true
    });

    $('#cropperModal').modal({
        backdrop: true,
        keyboard: true
    });

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
            let modal = bootstrap.Modal.getInstance(document.getElementById('signin-modal'));
            modal._config.backdrop = 'static';
            modal._config.keyboard = false;
            $('#signin-tab :input').prop('disabled', true);
            $('#signin-modal .modal-header .btn-close').prop('disabled', true);

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
                    modal._config.backdrop = true;
                    modal._config.keyboard = true;
                    $('#signin-tab :input').prop('disabled', false);
                    $('#signin-modal .modal-header .btn-close').prop('disabled', false);

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
                    modal._config.backdrop = true;
                    modal._config.keyboard = true;
                    $('#signin-tab :input').prop('disabled', false);
                    $('#signin-modal .modal-header .btn-close').prop('disabled', false);

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
                required: "Full name is required",
                maxlength: "Maximum 50 characters are allowed for full name"
            },
            username: {
                required: "Username is required",
                maxlength: "Maximum 50 characters are allowed for username"
            },
            email: {
                required: "Email is required",
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
            let modal = bootstrap.Modal.getInstance(document.getElementById('signin-modal'));
            modal._config.backdrop = 'static';
            modal._config.keyboard = false;
            $('#signup-tab :input').prop('disabled', true);
            $('#signin-modal .modal-header .btn-close').prop('disabled', true);

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
                success: function (response) {
                    modal._config.backdrop = true;
                    modal._config.keyboard = true;
                    $('#signup-tab :input').prop('disabled', false);
                    $('#signin-modal .modal-header .btn-close').prop('disabled', false);

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
                    modal._config.backdrop = true;
                    modal._config.keyboard = true;
                    $('#signup-tab :input').prop('disabled', false);
                    $('#signin-modal .modal-header .btn-close').prop('disabled', false);

                    $("#signup-tab #signup-btn").removeClass("d-none")
                    $("#signup-tab #loading-btn").addClass("d-none")
                    $('#signin-modal').modal('hide');
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

    $("#from-update").validate({
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
            }
        },
    });

    $('#password-modal').modal({
        backdrop: true,
        keyboard: true
    });

    $("#password-tab").validate({
        errorClass: "my-error-class",
        rules: {
            ignore: [],
            currentPassword: {
                notEqualTo: "#password-tab #newPassword"
            },
            newPassword: {
                required: true,
                minlength: 6,
                hasNumber: true,
                hasUpperCase: true,
                hasLowerCase: true,
                hasSpecialChar: true
            },
            confirmPassword: {
                equalTo: "#password-tab #newPassword"
            }
        },
        messages: {
            newPassword: {
                required: "Password is required",
            },
            confirmPassword: {
                equalTo: "Passwords do not match"
            }
        },

        submitHandler: function (form) {
            let modal = bootstrap.Modal.getInstance(document.getElementById('password-modal'));
            modal._config.backdrop = 'static';
            modal._config.keyboard = false;

            $("#password-tab #password-btn").removeClass("d-none")
            $("#password-tab #loading-btn").addClass("d-none")

            const currentPassword = $('#password-tab #currentPassword').val()
            const newPassword = $('#password-tab #newPassword').val()

            const data = {
                currentPassword,
                newPassword
            }

            axios.post('/userprofile/editpassword', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(function (response) {
                    if (response.data.success == true) {
                        window.location.reload()
                    } else if (response.data.errors.includes('Incorrect password.')) {
                        $("#password-tab #password-btn").removeClass("d-none")
                        $("#password-tab #loading-btn").addClass("d-none")
                        let modal = bootstrap.Modal.getInstance(document.getElementById('password-modal'));
                        modal._config.backdrop = true;
                        modal._config.keyboard = true;
                        $('#incorrect-password').html('Incorrect password')
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Something went wrong!",
                        });
                    }
                })
                .catch(function (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Something went wrong!",
                    });
                });

            return false; // Prevent normal form submission
        }

    });

    $(document).on('click', '.toggle-create', function (e) {
        e.preventDefault()
        $('#review-create')[0].reset();
        let checkoutId = $(this).attr('data-checkoutId')
        $('#review-create').attr('data-checkoutId', checkoutId)
    })

    $(document).on('submit', '#review-create', function (e) {
        e.preventDefault()

        let modal = bootstrap.Modal.getInstance(document.getElementById('review-create-modal'));
        modal._config.backdrop = 'static';
        modal._config.keyboard = false;
        $('#review-create :input').prop('disabled', true);
        $('#review-create-modal .modal-header .btn-close').prop('disabled', true);
        $("#review-create #create-btn").addClass("d-none")
        $("#review-create #loading-btn").removeClass("d-none")

        const checkoutId = $(this).attr('data-checkoutId')
        const rating = $('input[name="rating"]:checked').val();
        const comment = $('#comment').val()

        const data = JSON.stringify({
            rating,
            comment,
            checkoutId
        })

        axios.post(`/review/create`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                $('#review-create-modal').modal('hide')
                modal._config.backdrop = true;
                modal._config.keyboard = true;
                $('#review-create :input').prop('disabled', false);
                $('#review-create-modal .modal-header .btn-close').prop('disabled', false);

                $("#review-create #create-btn").removeClass("d-none")
                $("#review-create #loading-btn").addClass("d-none")
                $(`.toggle-create[data-checkoutId=${checkoutId}]`).addClass('d-none')
                $('#review-create')[0].reset();

                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Your review submitted successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
            })
            .catch(function (error) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                });

                $('#review-create-modal').modal('hide')
                modal._config.backdrop = true;
                modal._config.keyboard = true;
                $('#review-create :input').prop('disabled', false);
                $('#review-create-modal .modal-header .btn-close').prop('disabled', false);

                $("#review-create #create-btn").removeClass("d-none")
                $("#review-create #loading-btn").addClass("d-none")
            })
    })


    let cropper;

    $(document).on('change', '#inputImage', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const image = $('#cropperImage');
                image.attr('src', event.target.result);

                $('#cropperModal').modal('show');

                $(document).on('shown.bs.modal', '#cropperModal', function () {
                    if (cropper) {
                        cropper.destroy();
                    }
                    cropper = new Cropper(image[0], {
                        aspectRatio: 1,
                        viewMode: 1,
                        autoCropArea: 0.75
                    });
                })
            };
            reader.readAsDataURL(file);
        }
    });


    $(document).on('click', '#cropButton', function () {
        let modal = bootstrap.Modal.getInstance(document.getElementById('cropperModal'));
        modal._config.backdrop = 'static';
        modal._config.keyboard = false;
        $("#cropperModal #cropButton").addClass("d-none")
        $("#cropperModal #loading-btn").removeClass("d-none")
        $('#cropperModal .btn-secondary').prop('disabled', true)

        const canvas = cropper.getCroppedCanvas();
        const userId = $(this).attr('data-id')

        if (canvas != null) {
            canvas.toBlob(function (blob) {
                const formData = new FormData();
                formData.append('profilePicture', blob, 'profile-picture.jpg');

                axios.post('/UserProfile/UploadProfilePicture', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    params: { userId }
                })
                    .then(response => {
                        $('#profile-pic').attr('src', response.data.url)
                        $('#header-pic').attr('src', response.data.url)
                        modal._config.backdrop = true;
                        modal._config.keyboard = true
                        $("#cropperModal #cropButton").removeClass("d-none")
                        $("#cropperModal #loading-btn").addClass("d-none")
                        $('#cropperModal .btn-secondary').prop('disabled', false)
                        $('#cropperModal').modal('hide')

                        Swal.fire({
                            position: "top-end",
                            icon: "success",
                            title: "Your profile picture is updated",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    })
                    .catch(error => {
                        modal._config.backdrop = true;
                        modal._config.keyboard = true
                        $("#cropperModal #cropButton").removeClass("d-none")
                        $("#cropperModal #loading-btn").addClass("d-none")
                        $('#cropperModal .btn-secondary').prop('disabled', false)

                        if (error.response.status == 409) {
                            Swal.fire({
                                icon: "error",
                                title: "Oops...",
                                text: error.response.data.message,
                            });
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "Oops...",
                                text: "Something went wrong!"
                            });
                        }
                    });
            });
        }
    });

    $(document).on('click', '#cropperModal .btn-secondary', function () {
        $('#cropperModal').modal('hide')
    })
})


