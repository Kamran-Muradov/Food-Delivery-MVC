$(function () {
    let currentpage = 1;
    const take = 6;
    let categoryIds = null;
    let sorting = $('#sorting').val();

    let initialCheckboxState = [];
    let initialSelectValue;

    $('#filter-modal').on('show.bs.modal', function (e) {
        initialCheckboxState = [];
        $('.category-checkbox').each(function () {
            initialCheckboxState.push($(this).prop('checked'));
        });
        initialSelectValue = $('#sorting').val();
    });

    $('#filter-modal').on('hide.bs.modal', function (e) {

        if (!$('#filter-btn').data('clicked')) {
            $('.category-checkbox').each(function (index) {
                $(this).prop('checked', initialCheckboxState[index]);
            });
            $('#sorting').val(initialSelectValue);
        }
    });

    $('#loadMore').on('click', async function () {
        let page = currentpage + 1;

        let data = {
            page,
            take,
            sorting,
            categoryIds
        }

        axios.post('/Restaurant/LoadMore', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                $('#filterResults').append(response.data);
                currentpage++;
                let totalPage = parseInt($('#filterResults').find(".totalPage").last().val())
                console.log(totalPage)
                console.log(currentpage)

                if (currentpage == totalPage) {
                    $("#loadMore").addClass("d-none")
                }
            })
            .catch(function (error) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                });
            });
    });

    $('#filter-btn').on('click', async function () {
        $(this).data('clicked', true);
        categoryIds = $('#categories input:checked').map(function () {
            return this.value;
        }).get();

        sorting = $('#sorting').val();

        let page = 1;
        let data = {
            page,
            take,
            sorting,
            categoryIds
        }


        axios.post('/Restaurant/LoadMore', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                $('#filterResults').empty()
                $('#filterResults').append(response.data);
                $('#filter-modal').modal('hide');

                currentpage = 1;

                let totalPage = parseInt($('#filterResults').find(".totalPage").last().val())
                if (totalPage == 1) {
                    $("#loadMore").addClass("d-none")
                } else {
                    $("#loadMore").removeClass("d-none")
                }
            })
            .catch(function (error) {
                $('#filter-modal').modal('hide');
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                });
            });

        $('#filter-modal').on('hidden.bs.modal', function (e) {
            $('#filter-btn').data('clicked', false);
        });
    });
});






