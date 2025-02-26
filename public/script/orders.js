$(document).ready(function() {
    // simple array to track what's in the cart (toppings)
    let cartItems = [];

    // Function to show a modal from bootstrap instead of using alert since we are not allowed to use it due to security risk (this will insert the message)
    // https://stackoverflow.com/questions/11404711/how-can-i-trigger-a-bootstrap-modal-programmatically
    function showModal(message) {
        $('#myModalBody').html(message);
        
        // display the modal
        let myModal = new bootstrap.Modal(document.getElementById('myModal'));
        myModal.show();
    }

    // Function to load the pizzas from the database with the API
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

    // Function to laad the components (meat and cheese)
    function loadComponents() {
        // meat components
        $.ajax({
            url: '/api/components/meat',
            method: 'GET',
            success: function(meatComponents) {
                let meatContainer = $('#extra-meat');
                meatContainer.empty();
                meatComponents.forEach(component => {
                    let componentHtml = `
                        <label><input type="checkbox" value="${component.price}"> Extra ${component.name} ($${parseFloat(component.price).toFixed(2)})</label><br>
                    `;
                    meatContainer.append(componentHtml);
                });
            },
            error: function(err) {
                console.error("Error loading meat components: ", err);
            }
        });
        
        // cheese components
        $.ajax({
            url: '/api/components/cheese',
            method: 'GET',
            success: function(cheeseComponents) {
                let cheeseContainer = $('#extra-fromage');
                cheeseContainer.empty();
                cheeseComponents.forEach(component => {
                    let componentHtml = `
                        <label><input type="checkbox" value="${component.price}"> Extra ${component.name} ($${parseFloat(component.price).toFixed(2)})</label><br>
                    `;
                    cheeseContainer.append(componentHtml);
                });
            },
            error: function(err) {
                console.error("Error loading cheese components: ", err);
            }
        });
    }

    // Load pizzas
    loadPizzas();
    // Load components
    loadComponents();

    // Pop up the modal when clicking on the pizza
    $(document).on('click', '.pizza-item', function() {
        const selectedPizza = {
            name: $(this).data('name'),
            basePrice: parseFloat($(this).data('price')),
            toppings: [],
            quantity: 1,
            id: Date.now() // Unique ID: https://stackoverflow.com/questions/33184096/date-new-date-date-valueof-vs-date-now#:~:text=current%20date%2Ftime-,Date.,midnight%2001%20January%2C%201970%20UTC
        };
        showModalWindow(selectedPizza);
    });

    // Display the modal popup
    function showModalWindow(pizza) {
        $('#selectionsModal').data('currentPizza', pizza);

        // Reset the modal: https://stackoverflow.com/questions/63107285/how-to-reset-and-close-the-modal-on-button-click
        $('.modal-title').text(`Customize Your ${pizza.name}`);
        $('#selectionsModal input').prop('checked', false);
        $('#quantity').val(1);
        updatePricing(pizza);
        $('#selectionsModal').modal('show');
    }

    // Update pricing for the quantity and the components
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

    // VALIDATION FRONT-END: integer and maximum quantity (so it's reasonable), add 10 if it's more than 10.
    $('#quantity').on('change', function() {
        let val = parseInt($(this).val());

        if (isNaN(val) || val < 1) {
            $(this).val(1);
            showModal('Quantity must be at least 1');

        } else if (val > 10) {
            $(this).val(10);
            showModal('You can maximum order 10 pizzas at a time');
        }
    });

    // Add an order item to the cart
    $('#add-to-order').click(function() {
        let pizza = $('#selectionsModal').data('currentPizza');
        let quantity = parseInt($('#quantity').val()) || 1;
        
        // Calculate current total in cart
        let currentTotal = 0;
        cartItems.forEach(item => {
            currentTotal += item.quantity;
        });
        
        // VALIDATION FOR MAXIMUM PIZZAS IN CART: 20
        if (currentTotal + quantity > 20) {
            showModal(`You can only have a maximum of 20 pizzas in your cart. You currently have ${currentTotal} pizzas.`);
            return;
        }
        
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

        // Calculate all the items in the cart
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

    // Update the order summary display (list all the items and price, technically a cart)
    function updateOrderDisplay() {
        const $allOrdersList = $('#order-list').empty();
        let finalCartPrice = 0;
        
        cartItems.forEach((item, index) => {
            finalCartPrice += item.total;
            let toppingsText = ''; 

            // taken from previous class code notes
            if (item.toppings.length > 0) {
                for (let i = 0; i < item.toppings.length; i++) {
                    let topping = item.toppings[i];
                    toppingsText += topping.name + ' ($' + topping.price.toFixed(2) + ')';
                    if (i < item.toppings.length - 1) {
                        toppingsText += '<br>';
                    }
                }
            }

            // taken from previous class code notes (structures with js)
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

    // Remove item from the order summary: https://stackoverflow.com/questions/29605929/remove-first-item-of-the-array-like-popping-from-stack
    $('#order-list').on('click', '.remove-item', function() {
        const index = $(this).closest('.order-item').data('index');
        cartItems.splice(index, 1);
        updateOrderDisplay();
    });

    // POST
    // click the button to confirm the order 
    $('#confirm-order').click(function() {
        // validation for when the cart has nothing
        if (cartItems.length === 0) {
            showModal('Your cart is empty. Please add items before confirming.');
            return;
        }
        
        // Get credentials from sessionStorage
        const authEmail = sessionStorage.getItem('x-auth-email');
        const authPassword = sessionStorage.getItem('x-auth-password');
        
        // Check if credentials exist
        if (!authEmail || !authPassword) {
            showModal('Please log into your account before placing an order.');
            setTimeout(function() {
                window.location.href = '/auth.html';
            }, 2000);
            return;
        }
        
        // Check if the user is logged in
        $.ajax({
            url: '/api/users/me',
            method: 'GET',
            headers: {
                'x-auth-email': authEmail,
                'x-auth-password': authPassword
            },
            success: function(userData) {
                submitOrder(userData.id);
            },
            error: function() {
                // Session might be expired
                showModal('Your session has expired. Please log in again.');
                sessionStorage.removeItem('x-auth-email');
                sessionStorage.removeItem('x-auth-password');
                setTimeout(function() {
                    window.location.href = '/auth.html';
                }, 2000);
            }
        });
    });

    function submitOrder(userId) {
        // POST structures based on the database
        const order = {
            userId: userId,
            items: cartItems.map(item => ({
                name: item.name,
                price: item.total,
                quantity: item.quantity,
                extraComponents: item.toppings.map(topping => ({
                    name: topping.name,
                    price: topping.price
                }))
            })),
            totalAmount: parseFloat($('#total-price').text())
        };
        
        // Get credentials from sessionStorage
        const authEmail = sessionStorage.getItem('x-auth-email');
        const authPassword = sessionStorage.getItem('x-auth-password');
        
        // POST orders
        $.ajax({
            url: '/api/orders/',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(order),
            headers: {
                'x-auth-email': authEmail,
                'x-auth-password': authPassword
            },
            success: function(response) {
                console.log('Your order has been submitted:', response);
                showModal('Your order has been placed successfully!');
                
                cartItems = [];
                updateOrderDisplay();
            },
            error: function(err) {
                console.error('ERROR submitting the order:', err);
                showModal('There was an error when you were trying to submit your order. Please try again.');
            }
        });
    }
});
