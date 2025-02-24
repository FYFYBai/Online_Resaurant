$(document).ready(function() {
    // simple array to track what's in the cart(toppings)
    let cartItems = [];
    
    // Click the image so the modal popup
    $('.pizza-item').click(function() {
        const selectedPizza = {
            name: $(this).data('name'),
            basePrice: parseFloat($(this).data('price')),
            toppings: [],
            quantity: 1,
            id: Date.now() // Unique ID for each selection (database): https://stackoverflow.com/questions/8012002/create-a-unique-number-with-javascript-time
        };
        
        showModalWindow(selectedPizza);
    });

    // display the modal popup
    function showModalWindow(pizza) {
        $('#selectionsModal').data('currentPizza', pizza);
        
        // Reset the modal: https://stackoverflow.com/questions/26863003/how-to-reset-the-bootstrap-modal-when-it-gets-closed-and-open-it-fresh-again
        $('.modal-title').text(`Customize Your ${pizza.name}`);
        $('#selectionsModal input').prop('checked', false);
        $('#quantity').val(1);
        updatePricing(pizza);
        $('#selectionsModal').modal('show');
    }

    // Update the pricing whenever we add one more components (Needs to be checked)
    function updatePricing(pizza) {
        let toppingsCost = 0;

        $('input:checked', '#selectionsModal').each(function() {
            toppingsCost += parseFloat($(this).val()) || 0;
        });
    
        let quantity = parseInt($('#quantity').val()) || 1;
        // Equation for the total price
        let totalPrice = (pizza.basePrice + toppingsCost) * quantity;
        $('#total-cost').text(totalPrice.toFixed(2));
    }

    // Update the price when I change the input: https://stackoverflow.com/questions/17047497/difference-between-change-and-input-event-for-an-input-element
    $('#selectionsModal').on('change input', function() {
        let currentPizza = $('#selectionsModal').data('currentPizza');
        updatePricing(currentPizza);
    });

    // Click to add an order in the cart
    $('#add-to-order').click(function() {
        let pizza = $('#selectionsModal').data('currentPizza');
        let quantity = parseInt($('#quantity').val()) || 1;
        
        //Toppings
        let selectedToppings = [];
        let toppingsTotal = 0

        // Loop through each checked box: https://stackoverflow.com/questions/1965075/loop-through-checkboxes-and-count-each-one-checked-or-unchecked
        $('input:checked', '#selectionsModal').each(function() {
            let $input = $(this);
            let labelText= $input.parent().text();
            let price = parseFloat($input.val());
            let [toppingName] = labelText.split('($');

            selectedToppings.push({
                name: toppingName.trim(),
                price: price
            })

            toppingsTotal += price;
        });

        // Calculate the final total price
        let totalPrice = (pizza.basePrice + toppingsTotal) * quantity;

        // Create the new order item
        let orderItem = {
            name: pizza.name,
            basePrice: pizza.basePrice,
            toppings: selectedToppings,
            quantity: quantity, 
            total: totalPrice,
            id: Date.now()
        };

        cartItems.push(orderItem);
        updateOrderDisplay();
        $('#selectionsModal').modal('hide');
    });

    // Display the order summary
    function updateOrderDisplay() {
        // Empty ul for now, but we will put text with append later on
        const $allOrdersList = $('#order-list').empty();
        let finalCartPrice = 0;
        
        //Loops all the array that has all the pizzas: https://stackoverflow.com/questions/72708123/using-foreach-to-find-price-of-items-in-cat-in-the-backend
        cartItems.forEach((item, index) => {
            finalCartPrice += item.total;

            // Build toppings text if any
            let toppingsText = ''; 

            if (item.toppings.length > 0) {
                // Loop through each topping in the array
                for (let i = 0; i < item.toppings.length; i++) {
                    let topping = item.toppings[i];
                    
                    toppingsText += topping.name + ' ($' + topping.price.toFixed(2) + ')';
                    
                    // If this is not the last topping skip a line
                    if (i < item.toppings.length - 1) {
                    toppingsText += '<br>';
                    }
                }
            }
            // From previous class notes on javascript (inserting and formatting text in js)
            $allOrdersList.append(
                `
                <li class="order-item" data-index="${index}">
                    <div class="summary">
                        <div>
                            <strong>${item.quantity}x ${item.name}</strong>
                            ${toppingsText ? `<div class="toppingText">${toppingsText}</div>` : ''}
                        </div>
                        <div class="d-flex align-items-center">
                            <span class="me-3">$${item.total.toFixed(2)}</span>
                            <button class="btn btn-danger remove-item">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </li>
                `
            );
        });
        
        // Display the final cart price (currency)
        $('#total-price').text(finalCartPrice.toFixed(2));
    }    

    // Remove an item (garbage icon) from the order summary: https://stackoverflow.com/questions/29605929/remove-first-item-of-the-array-like-popping-from-stack
    $('#order-list').on('click', '.remove-item', function() {
        const index = $(this).closest('.order-item').data('index');
        cartItems.splice(index, 1);
        updateOrderDisplay();
    });
});