$(function () {
    $(document).on('click', '.increment, .decrement', function () {
        let $countArea = $(this).closest('.count-area');
        let $basketCount = $countArea.find('.basket-count');
        let currentCount = parseInt($basketCount.val());
        let menuId = $basketCount.attr('data-menuId');
        let $itemPrice = $(this).closest('.basket-item').find('.price');
        let $oldPrice = $(this).closest('.basket-item').find('.old-price');
        let isIncrement = $(this).hasClass('increment');

        if (isIncrement) {
            currentCount++;
        } else if (currentCount > 1) {
            currentCount--;
        } else {
            return;
        }

        $basketCount.val(currentCount);

        axios.post(`/cart/changemenucount`, null, {
            params: { menuId, count: currentCount }
        })
            .then(function (response) {
                console.log(response.data)
                if (response.data.discountAmount == null || response.data.discountAmount == 0) {
                    $('#total-price span').html(`${response.data.oldPrice.toFixed(2)}`);
                    $('#total-amount span').html(`${response.data.oldAmount.toFixed(2)}`);
                    $itemPrice.text(`${response.data.newItemPrice.toFixed(2)}`)
                } else {
                    $('#total-price span').html(`${response.data.discountPrice.toFixed(2)}`);
                    $('#total-amount span').html(`${response.data.discountAmount.toFixed(2)}`);
                    $('#old-price span').html(`${response.data.oldPrice.toFixed(2)}`);
                    $('#old-amount span').html(`${response.data.oldAmount.toFixed(2)}`);
                    $itemPrice.text(`${response.data.newItemDiscountPrice.toFixed(2)}`)
                    $oldPrice.text(`${response.data.newItemPrice.toFixed(2)}`)
                }

                $('#menu-count').html(response.data.basketCount)
            })
            .catch(function (error) {
                console.log(error)
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                });
            });
    });

    $(document).on('click', '.basket-delete', function () {
        let menuId = $(this).attr('data-menuId')
        let $basketItem = $(this).closest('.basket-item')

        axios.post(`/cart/deletemenufrombasket`, null, {
            params: { menuId }
        })
            .then(function (response) {
                $basketItem.remove()
                if (response.data.basketCount == 0) {
                    $('#menu-count').addClass('d-none')
                    $('#basket-area').html(` <div id="empty-basket" class="container py-5 mb-lg-3">
            <div class="row justify-content-center pt-lg-4 text-center">
                <div class="col-lg-5 col-md-7 col-sm-9">
                    <img class="d-block mx-auto mb-5" src="https://res.cloudinary.com/duta72kmn/image/upload/v1723994092/404_yqjznn.png" width="340" alt="404 Error">
                    <h1 class="h3">Your cart is empty</h1>
                </div>
            </div>
            <div class="row justify-content-center mt-3">
                <div class="col-xl-8 col-lg-10">
                    <div class="row justify-content-center">
                        <div class="col-sm-4 mb-3">
                            <a class="card h-100 border-0 shadow-sm" href="/home/index">
                                <div class="card-body">
                                    <div class="d-flex align-items-center">
                                        <i class="ci-home text-primary h4 mb-0"></i>
                                        <div class="ps-3">
                                            <h5 class="fs-sm mb-0">Homepage</h5><span class="text-muted fs-ms">Return to homepage</span>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>`)
                } else if (response.data.discountAmount == null || response.data.discountAmount == 0) {
                    $('#total-price span').html(`${response.data.oldPrice.toFixed(2)}`);
                    $('#total-amount span').html(`${response.data.oldAmount.toFixed(2)}`);
                    $('#menu-count').html(response.data.basketCount)
                } else {
                    $('#total-price span').html(`${response.data.discountPrice.toFixed(2)}`);
                    $('#total-amount span').html(`${response.data.discountAmount.toFixed(2)}`);
                    $('#old-price span').html(`${response.data.oldPrice.toFixed(2)}`);
                    $('#old-amount span').html(`${response.data.oldAmount.toFixed(2)}`);
                    $('#menu-count').html(response.data.basketCount)
                }

            })
            .catch(function (error) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                });
            });
    })


    $("#form-code").validate({
        ignore: [],

        errorClass: "invalid-feedback",
        rules: {
            promoCode: {
                required: true,
            },
        },
        messages: {
            promoCode: {
                required: "Please provide a promo code",
            },
        },


        submitHandler: function (form) {
            const code = $('#promoCode').val()

            axios.post(`/cart/applyPromoCode`, null, {
                params: { code }
            })
                .then(function (response) {
                    $('#total-price span').html(`${response.data.discountPrice.toFixed(2)}`);
                    $('#total-amount span').html(`${response.data.discountAmount.toFixed(2)}`);

                    $('#subtotal-area').append(`<p id="old-amount" style="color:lightslategray;text-decoration:line-through" class="fw-normal mb-0 d-inline-block">$<span>${response.data.oldAmount.toFixed(2)}</span></p>`)
                    $('#total-price-area').append(`<h4 id="old-price" style="color:lightslategray;text-decoration:line-through" class="fw-normal d-inline-block">$<span>${response.data.oldPrice.toFixed(2)}</span></h4>`)
                    $('.basket-item').each(function () {
                        // Get the current price text and convert it to a number
                        var $price = $(this).find('.price');
                        var currentPrice = parseFloat($price.text());

                        if (!isNaN(currentPrice)) {
                            // Calculate the discounted price
                            var discountAmount = (currentPrice * response.data.discount) / 100;
                            var discountedPrice = currentPrice - discountAmount;

                            // Update the price element with the discounted price
                            $price.text(discountedPrice.toFixed(2));
                            $(this).find('.price-area').append(`<div style="color:lightslategray;text-decoration:line-through" class="fs-lg pt-2 d-inline-block">$<span class="old-price">${currentPrice.toFixed(2)}</span></div>`)
                        }

                        $('#promoCode').prop('disabled', true)
                        $('#btn-area').html(`<button id="remove-code-btn" class="btn btn-outline-warning d-block w-100" type="button">Remove promo code</button>`)
                    });
                })
                .catch(function (error) {
                    if (error.response.status == 400) {
                        $('#validate-code').addClass('d-block')
                        $('#validate-code').html(error.response.data.error)


                    } else {
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

    $(document).on('click', '#remove-code-btn', function (e) {
        e.preventDefault()

        axios.delete(`/cart/DeleteUserPromoCode`, null, {
        })
            .then(function (response) {
                var $oldTotalAmount = $('#old-amount span')
                var $oldTotalPrice = $('#old-price span')

                $('#total-amount span').html(`${parseFloat($oldTotalAmount.text()).toFixed(2)}`);
                $('#total-price span').html(`${parseFloat($oldTotalPrice.text()).toFixed(2)}`);

                $oldTotalAmount.closest('p').remove()
                $oldTotalPrice.closest('h4').remove()

                $('.basket-item').each(function () {
                    var $oldPrice = $(this).find('.old-price');
                    var $price = $(this).find('.price');

                    var currentPrice = parseFloat($oldPrice.text());

                    if (!isNaN(currentPrice)) {
                        $price.text(currentPrice.toFixed(2));
                        $oldPrice.closest('div').remove()
                    }

                    $('#promoCode').prop('disabled', false)
                    $('#promoCode').val('')
                    $('#btn-area').html(`<button id="promo-code-btn" class="btn btn-outline-primary d-block w-100" type="submit">Apply promo code</button>`)
                });
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