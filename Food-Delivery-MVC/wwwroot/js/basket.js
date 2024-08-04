$(function () {
    const updateTotalPrice = () => {
        $('#menu-detail .cart-btn span').html(`(${totalPrice.toFixed(2)})`);
    };

    $(document).on('click', '.increment, .decrement', function () {
        let $countArea = $(this).closest('.count-area');
        let $basketCount = $countArea.find('.basket-count');
        let currentCount = parseInt($basketCount.val());
        let id = $basketCount.attr('data-id');
        let $itemPrice = $(this).closest('.basket-item').find('.price');
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
            params: { id, count: currentCount }
        })
            .then(function (response) {
                $itemPrice.html(`$${response.data.newPrice.toFixed(2)}`);
                $('#total-price').html(`$${response.data.totalPrice.toFixed(2)}`);
                $('#menu-count').html(response.data.basketCount)
            })
            .catch(function (error) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                });
            });
    });

    $(document).on('click', '.basket-delete', function () {
        let id = $(this).attr('data-id')
        let $basketItem = $(this).closest('.basket-item')

        axios.post(`/cart/deletemenufrombasket`, null, {
            params: { id }
        })
            .then(function (response) {
                $basketItem.remove()
                if (response.data.basketCount == 0) {
                    $('#menu-count').addClass('d-none')
                    $('#basket-area').addClass('d-none')
                    $('#empty-basket').removeClass('d-none')
                } else {
                    $('#total-price').html(`$${response.data.totalPrice.toFixed(2)}`);
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

})