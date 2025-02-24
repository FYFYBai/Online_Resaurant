$(document).ready(function() {
    // stores all the choices of components
    let cartItems = [];
    
    // Click the image so it popup
    $('.pizza-item').click(function() {
        const pizza = {
            name: $(this).data('name'),
            basePrice: parseFloat($(this).data('price')),
            extras: [],
            quantity: 1,
            id: Date.now() // Unique ID for each selection (database)
        };
        
        showCustomizationModal(pizza);
    });

    // display the modal popup
    function showCustomizationModal(pizza) {
        // Store current pizza in modal data
        $('#selectionsModal').data('currentPizza', pizza);
        
        // Reset modal: https://stackoverflow.com/questions/26863003/how-to-reset-the-bootstrap-modal-when-it-gets-closed-and-open-it-fresh-again
        $('.modal-title').text(`Customize Your ${pizza.name}`);
        $('input[type="checkbox"]').prop('checked', false);
        $('#quantity').val(1);
        updatePricing(pizza);
        $('#selectionsModal').modal('show');
    }

    // Update the pricing whenever we add one more components (Needs to be checked)
    function updatePricing(pizza) {
        let extrasCost = 0;
        $('#selectionsModal input:checked').each(function() {
            extrasCost += parseFloat($(this).val());
        });
        
        // default 1 and always valid
        const quantity = parseInt($('#quantity').val()) || 1;
        // Equation for the total price
        const totalPrice = (pizza.basePrice + extrasCost) * quantity;
        // currency with 2 decimals
        $('#total-cost').text(totalPrice.toFixed(2));
    }

    // Update the price when I just need to change the input: https://stackoverflow.com/questions/17047497/difference-between-change-and-input-event-for-an-input-element
    $('#selectionsModal').on('change input', function() {
        const pizza = $('#selectionsModal').data('currentPizza');
        updatePricing(pizza);
    });

    // Click to add an order
    $('#add-to-order').click(function() {
        const pizza = $('#selectionsModal').data('currentPizza');
        const quantity = parseInt($('#quantity').val()) || 1;
        
        pizza.extras = [];

        // Loop through each checked box
        $('#selectionsModal input:checked').each(function() {
            // Get the text of the component name and price
            const componentText = $(this).parent().text();

            // Remove the price part (everything after '($')
            const componentName = componentText.split('($')[0].trim();

            // Add the name in the array
            pizza.extras.push(componentName);
        });

        // Calculate the total price of the extra components (starts at 0) 
        let extrasTotal = 0; 

        // Loop through each checked box to calculate the total of all the checked box price
        $('#selectionsModal input:checked').each(function() {
            extrasTotal += parseFloat($(this).val());
        });
            
        // Calculate the final total price
        const totalPrice = (pizza.basePrice * quantity) + (extrasTotal * quantity);

        // Create the new order item
        const orderItem = {
            name: pizza.name,
            basePrice: pizza.basePrice,
            extras: pizza.extras,
            quantity: quantity, 
            total: totalPrice,
            id: Date.now()
        };

        // Add the new order item to the bill
        cartItems.push(orderItem);

        // Update the order summarty
        updateOrderDisplay();

        // close the modal
        $('#selectionsModal').modal('hide');
    });

    // TODO: Display the order summary

    // Remove an item from the order summary: https://stackoverflow.com/questions/29605929/remove-first-item-of-the-array-like-popping-from-stack
    $('#order-list').on('click', '.remove-item', function() {
        const index = $(this).closest('.order-item').data('index');
        cartItems.splice(index, 1);
        updateOrderDisplay();
    });
});