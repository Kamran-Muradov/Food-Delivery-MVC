﻿$(function () {
    let currentpage = 1;
    const take = 6;
    let tagIds = null;
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
            tagIds
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
        tagIds = $('#categories input:checked').map(function () {
            return this.value;
        }).get();

        sorting = $('#sorting').val();

        let page = 1;
        let data = {
            page,
            take,
            sorting,
            tagIds
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

    $('#tab-header li a').on('click', function (e) {
        e.preventDefault()
        $('.active').removeClass('active');
        $(this).addClass('active');
        const dataId = $(this).data('id');
        if (dataId == 0) {
            $('.content').removeClass('d-none');
        } else {
            $('.content').each(function () {
                if ($(this).data('id') == dataId) {
                    $(this).removeClass('d-none');
                } else {
                    $(this).addClass('d-none');
                }
            });
        }
    });
    let basePrice = 0;
    let totalPrice = 0;
    $('.menu-detail').on('click', function (e) {
        e.preventDefault()
        const id = $(this).attr('data-id')
        $('#menu-detail').empty()
        axios.get(`/menu/detail/${id}`)
            .then(function (response) {
                $('#menu-detail').append(response.data)

                basePrice = parseFloat($('#menu-detail input[type="hidden"]').val())
                totalPrice = basePrice

                $('#menu-detail input').each(function () {
                    if ($(this).prop('checked')) {
                        totalPrice += parseFloat($(this).val())
                    }
                })

                $('#menu-detail .cart-btn span').html(`(${totalPrice})`)
            })
            .catch(function (error) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                });
            })
    });
    $('#menu-detail').on('change', 'input', function (e) {
        e.preventDefault()
        if ($(this).attr('type') == 'radio' && $(this).attr('data-addPrice') == 'true') {
            if ($(this).prop('checked')) {
                totalPrice = basePrice + parseFloat($(this).val())
                $('#menu-detail .cart-btn span').html(`(${totalPrice})`)
            } else {
                totalPrice = basePrice - parseFloat($(this).val())
                $('#menu-detail .cart-btn span').html(`(${totalPrice})`)
            }
        } else if ($(this).attr('type') == 'checkbox') {
            let temp = totalPrice - basePrice
            if ($(this).prop('checked')) {
                totalPrice = (basePrice += parseFloat($(this).val())) + temp
                $('#menu-detail .cart-btn span').html(`(${totalPrice})`)
            } else {
                totalPrice = (basePrice -= parseFloat($(this).val())) + temp
                $('#menu-detail .cart-btn span').html(`(${totalPrice})`)
            }
        }
    })

    $('#menu-detail').on('click', '.cart-btn', function () {
        let id = $(this).attr('data-id')
        let count = $('#menu-detail #basket-count').val();
        let menuvariants = {}
        $('#menu-detail input:checked').each(function () {
            let value = $(this).next('label').html().trim()
            let key = $(this).attr('name');

            if (!menuvariants[key]) {
                menuvariants[key] = [];
            }

            menuvariants[key].push(value)
        })
        const data = JSON.stringify({
            id,
            count,
            price: totalPrice,
            menuvariants
        })

        //axios.post(`/restaurant/addmenutobasket`, data, {
        //    headers: {
        //        'Content-Type': 'application/json'
        //    }
        //})
        //    .then(function (response) {
        //        $('#menu-detail').append(response.data)
        //    })
        //    .catch(function (error) {
        //        Swal.fire({
        //            icon: "error",
        //            title: "Oops...",
        //            text: "Something went wrong!",
        //        });
        //    })

        $.ajax({
            type: "POST",
            url: `/restaurant/addmenutobasket`,
            data: data,
            contentType: 'application/json',
            success: function (response) {
                $('#menu-count').removeClass("d-none")
                $('#menu-count').html(response.basketCount)
            },
            error: function (xhr, status, error) {
                $('#modal-edit').modal('hide');
                $(".page-loader").addClass("d-none")
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                });
            },
        });

    })

    let counter = 1
    $('#menu-detail').on('click', '#increment', function () {
        counter = $('#menu-detail #basket-count').val()
        counter++;
        $('#menu-detail #basket-count').val(counter)
    })

    $('#menu-detail').on('click', '#decrement', function () {
        if ($('#menu-detail #basket-count').val() > 1) {
            counter--;
        }
        $('#menu-detail #basket-count').val(counter)
    })
});





