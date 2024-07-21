$(function () {
    $(document).on("click", "#slider-area .delete-btn", function () {
        let id = parseInt($(this).attr("data-id"));

        $(document).on("click", "#slider-area .yes-btn", function () {
            $.ajax({
                type: "POST",
                url: `/admin/slider/delete?id=${id}`,
                success: function () {
                    window.location.reload();
                }
            });
        })
    })

    $(document).on("click", "#information-area .delete-btn", function () {
        let id = parseInt($(this).attr("data-id"));
        $(document).on("click", "#information-area .yes-btn", function () {
            $.ajax({
                type: "POST",
                url: `/admin/information/delete?id=${id}`,
                success: function () {
                    window.location.reload();
                }
            });
        })
    })

    $(document).on("click", "#about-area .delete-btn", function () {
        let id = parseInt($(this).attr("data-id"));

        $(document).on("click", "#about-area .yes-btn", function () {
            $.ajax({
                type: "POST",
                url: `/admin/about/delete?id=${id}`,
                success: function () {
                    window.location.reload();
                }
            });
        })
    })

    $(document).on("click", "#category-area .delete-btn", function () {
        let id = parseInt($(this).attr("data-id"));

        $(document).on("click", "#category-area .yes-btn", function () {
            $.ajax({
                type: "POST",
                url: `/admin/category/delete?id=${id}`,
                success: function () {
                    window.location.reload();
                }
            });
        })
    })

    $(document).on("click", "#instructor-edit-area .delete-social", function () {
        let instructorId = parseInt($(this).attr("data-instructorId"));
        let socialId = parseInt($(this).attr("data-socialId"));
        let link = $(this).attr("data-link");

        let data = { instructorId, socialId, link };

        let li = $(this).closest("li")

        $.ajax({
            type: "POST",
            url: `/admin/instructor/deleteinstructorsocial`,
            data: data,
            success: function () {
                li.remove();
            }
        });
    })

    $(document).on("click", "#instructor-area .delete-btn", function () {
        let id = parseInt($(this).attr("data-id"));

        $(document).on("click", "#instructor-area .yes-btn", function () {
            $.ajax({
                type: "POST",
                url: `/admin/instructor/delete?id=${id}`,
                success: function () {
                    window.location.reload();
                }
            });
        })
    })

    $(document).on("click", "#course-area .delete-btn", function () {
        let id = parseInt($(this).attr("data-id"));

        $(document).on("click", "#course-area .yes-btn", function () {
            $.ajax({
                type: "POST",
                url: `/admin/course/delete?id=${id}`,
                success: function () {
                    window.location.reload();
                }
            });
        })
    })

    $(document).on("click", "#student-area .delete-btn", function () {
        let id = parseInt($(this).attr("data-id"));

        $(document).on("click", "#student-area .yes-btn", function () {
            $.ajax({
                type: "POST",
                url: `/admin/student/delete?id=${id}`,
                success: function () {
                    window.location.reload();
                }
            });
        })
    })

    $(document).on("click", "#student-edit-area .delete-course", function () {
        let courseId = parseInt($(this).attr("data-courseId"));
        let studentId = parseInt($(this).attr("data-studentId"));

        let data = { courseId, studentId };

        let li = $(this).closest("li")

        $.ajax({
            type: "POST",
            url: `/admin/student/deletecoursestudent`,
            data: data,
            success: function () {
                li.remove();
            }
        });
    })

    $(document).on("click", "#social-area .delete-btn", function () {
        let id = parseInt($(this).attr("data-id"));

        $(document).on("click", "#social-area .yes-btn", function () {
            $.ajax({
                type: "POST",
                url: `/admin/social/delete?id=${id}`,
                success: function () {
                    window.location.reload();
                }
            });
        })
    })

     $(document).on("click", "#contact-area .delete-btn", function () {
        let id = parseInt($(this).attr("data-id"));

        $(document).on("click", "#contact-area .yes-btn", function () {
            $.ajax({
                type: "POST",
                url: `/admin/contact/delete?id=${id}`,
                success: function () {
                    window.location.reload();
                }
            });
        })
    })
})