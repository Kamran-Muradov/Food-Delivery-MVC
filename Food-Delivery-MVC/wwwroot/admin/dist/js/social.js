$(function () {
    $(document).on("input", "#social-create-area .class-input", function () {
        let val = $(this).val();
        $("#social-create-area .social-icon").addClass(val)
    })
})