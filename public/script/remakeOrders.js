$(document).ready(function() {
    // simple array to track what's in the cart (toppings)
    let cartItems = [];

    // Function to load pizzas from the database via the API
    function loadPizzas() {
        $.ajax({
            url: '/api/menu',
            method: 'GET',
            success: function(pizzas) {
                let gridContainer = $('.pizza-grid-container');
                gridContainer.empty();
                pizzas.forEach(pizza => {
                    // create the image file
                    let imageName = pizza.name.replace(/\s+/g, '') + '.png';
                    let pizzaHtml = `
                        <div class="pizza-item" data-name="${pizza.name}" data-price="${pizza.base_price}">
                            <img src="./images/${imageName}" alt="${pizza.name}" width="250" height="200">
                            <p>${pizza.name} - $${pizza.base_price}</p>
                        </div>
                    `;
                    gridContainer.append(pizzaHtml);
                });
            },
            error: function(err) {
                console.error("Error loading pizzas: ", err);
            }
        });
    }

    // Load pizzas when the document is ready
    loadPizzas();

    // Delegated event handler for dynamically created .pizza-item elements
    $(document).on('click', '.pizza-item', function() {
        const selectedPizza = {
            name: $(this).data('name'),
            basePrice: parseFloat($(this).data('price')),
            toppings: [],
            quantity: 1,
            id: Date.now() // Unique ID for each selection
        };
        showModalWindow(selectedPizza);
    });

    // Display the modal popup
    function showModalWindow(pizza) {
        $('#selectionsModal').data('currentPizza', pizza);
        // Reset modal fields
        $('.modal-title').text(`Customize Your ${pizza.name}`);
        $('#selectionsModal input').prop('checked', false);
        $('#quantity').val(1);
        updatePricing(pizza);
        $('#selectionsModal').modal('show');
    }

    // Update pricing based on selected toppings and quantity
    function updatePricing(pizza) {
        let toppingsCost = 0;
        $('input:checked', '#selectionsModal').each(function() {
            toppingsCost += parseFloat($(this).val()) || 0;
        });
    
        let quantity = parseInt($('#quantity').val()) || 1;
        let totalPrice = (pizza.basePrice + toppingsCost) * quantity;
        $('#total-cost').text(totalPrice.toFixed(2));
    }

    // Update price when inputs change (checkboxes or quantity)
    $('#selectionsModal').on('change input', function() {
        let currentPizza = $('#selectionsModal').data('currentPizza');
        updatePricing(currentPizza);
    });

    // Add an order item to the cart
    $('#add-to-order').click(function() {
        let pizza = $('#selectionsModal').data('currentPizza');
        let quantity = parseInt($('#quantity').val()) || 1;
        
        let selectedToppings = [];
        let toppingsTotal = 0;

        // Loop through each checked topping checkbox
        $('input:checked', '#selectionsModal').each(function() {
            let $input = $(this);
            let labelText = $input.parent().text();
            let price = parseFloat($input.val());
            let [toppingName] = labelText.split('($');
            selectedToppings.push({
                name: toppingName.trim(),
                price: price
            });
            toppingsTotal += price;
        });

        // Calculate the final total price for the item
        let totalPrice = (pizza.basePrice + toppingsTotal) * quantity;

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

    // Update the order summary display
    function updateOrderDisplay() {
        const $allOrdersList = $('#order-list').empty();
        let finalCartPrice = 0;
        
        cartItems.forEach((item, index) => {
            finalCartPrice += item.total;
            let toppingsText = ''; 
            if (item.toppings.length > 0) {
                for (let i = 0; i < item.toppings.length; i++) {
                    let topping = item.toppings[i];
                    toppingsText += topping.name + ' ($' + topping.price.toFixed(2) + ')';
                    if (i < item.toppings.length - 1) {
                        toppingsText += '<br>';
                    }
                }
            }
            $allOrdersList.append(
                `
                <li class="order-item" data-index="${index}">
                    <div class="summary d-flex justify-content-between">
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
        $('#total-price').text(finalCartPrice.toFixed(2));
    }    

    // Remove an order item from the summary
    $('#order-list').on('click', '.remove-item', function() {
        const index = $(this).closest('.order-item').data('index');
        cartItems.splice(index, 1);
        updateOrderDisplay();
    });
});
