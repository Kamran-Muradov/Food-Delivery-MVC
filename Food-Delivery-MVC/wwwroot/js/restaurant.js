
$(function () {
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
    let totalPriceChange = 0;
    let basePriceChange = 0;
    let counter = 1;

    const updateTotalPrice = () => {
        $('#menu-detail .cart-btn span').html(` ($${totalPrice.toFixed(2)})`);
    };

    $('#menu-detail').on('click', '#increment', function () {
        counter++;
        $('#menu-detail #basket-count').val(counter);
        totalPrice += totalPriceChange;
        basePrice += basePriceChange;
        updateTotalPrice();
    });

    $('#menu-detail').on('click', '#decrement', function () {
        if (counter > 1) {
            counter--;
            $('#menu-detail #basket-count').val(counter);
            totalPrice -= totalPriceChange;
            basePrice -= basePriceChange;
            updateTotalPrice();
        }
    });

    $(document).on('click', '.menu-detail', function (e) {
        counter = 1;
        e.preventDefault();
        const id = $(this).attr('data-id');
        $('#menu-detail').empty();
        axios.get(`/menu/detail/${id}`)
            .then(function (response) {
                $('#menu-detail').append(response.data);
                $('#quick-view').modal('show')
                basePrice = parseFloat($('#menu-detail input[type="hidden"]').val());
                totalPrice = basePrice;
                totalPriceChange = totalPrice;
                basePriceChange = basePrice;

                $('#menu-detail input:checked').each(function () {
                    totalPrice += parseFloat($(this).val());
                    totalPriceChange = totalPrice;
                    basePriceChange = basePrice;
                });

                updateTotalPrice();
            })
            .catch(function () {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                });
            });
    });

    $('#menu-detail').on('change', 'input', function () {
        let inputPrice = parseFloat($(this).val());
        let isChecked = $(this).prop('checked');
        let isRadio = $(this).attr('type') === 'radio';
        let addPrice = $(this).attr('data-addPrice') === 'true';

        if (isRadio && addPrice) {
            totalPrice = isChecked ? basePrice + (inputPrice * counter) : basePrice - (inputPrice * counter);
        } else if (!isRadio) {
            let temp = totalPrice - basePrice;
            basePrice = isChecked ? basePrice + (inputPrice * counter) : basePrice - (inputPrice * counter);
            totalPrice = basePrice + temp;
            basePriceChange = basePrice / counter;
        }

        totalPriceChange = totalPrice / counter;
        updateTotalPrice();
    });


    $('#menu-detail').on('click', '.cart-btn', function () {
        let menuId = $(this).attr('data-id')
        let restaurantId = $(this).attr('data-restaurantId')
        let count = $('#menu-detail #basket-count').val();
        let basketVariants = {}
        $('#menu-detail input:checked').each(function () {
            let value = $(this).next('label').html().trim()
            let key = $(this).attr('name');

            if (!basketVariants[key]) {
                basketVariants[key] = [];
            }

            basketVariants[key].push(value)
        })
        const data = JSON.stringify({
            menuId,
            restaurantId,
            count,
            price: totalPrice.toFixed(2),
            basketVariants
        })

        axios.post(`/restaurant/addmenutobasket`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                $('#menu-count').removeClass("d-none")
                $('#menu-count').html(response.data.basketCount)
            })
            .catch(function (error) {
                if (error.response.status == 409) {
                    Swal.fire({
                        title: "This will remove your previous order.",
                        showCancelButton: true,
                        confirmButtonText: "Proceed",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            axios.post(`/cart/reset`, data, {
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            })
                                .then(function (response) {
                                    $('#menu-count').removeClass("d-none")
                                    $('#menu-count').html(response.data.basketCount)
                                })
                                .catch(function (error) {
                                    Swal.fire({
                                        icon: "error",
                                        title: "Oops...",
                                        text: "Something went wrong!",
                                    });
                                })
                        }
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Something went wrong!",
                    });
                }
            })
    })

    $(document).on('click', '#favourites #add-favourite', function (e) {
        e.preventDefault()
        const restaurantId = $('#favourites').attr('data-restaurantId')
        $(this).prop('disabled', true)

        axios.post(`/favourite/create`, null, {
            params: {
                restaurantId
            }
        })
            .then(function (response) {
                $('#favourites div').html(`<button id="delete-favourite" style="all:unset;padding:0;cursor:pointer" class="btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#ff0000" class="icon icon-tabler icons-tabler-filled icon-tabler-heart"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z" /></svg>
                </button>`)
            })
            .catch(function (error) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                });
            })
    })

    $(document).on('click', '#favourites #delete-favourite', function (e) {
        e.preventDefault()
        const restaurantId = $('#favourites').attr('data-restaurantId')
        $(this).prop('disabled', true)

        axios.post(`/favourite/delete`, null, {
            params: {
                restaurantId
            }
        })
            .then(function (response) {
                $('#favourites div').html(`<button class="btn" style="all:unset;padding:0;cursor:pointer" id="add-favourite">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff0000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-heart"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" /></svg>
                </button>`)
            })
            .catch(function (error) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                });
            })
    })
});






