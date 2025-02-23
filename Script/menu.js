$(document).ready(function() {
    // Keep the current selections values
    let currentOrder = {
        name: '',
        basePrice: 0,
        extras: [],
        quantity: 1
    };

    // Create an array for all the selections
    let cartItems = [];
    
    // Click the image so it popup
    $('.pizza-item').click(function() {
        // Get pizza details from data attributes in the html
        currentOrder = {
            name: $(this).data('name'),
            basePrice: parseFloat($(this).data('price')),
            extras: [],
            quantity: 1
        };
        
        // Reset modal https://stackoverflow.com/questions/26863003/how-to-reset-the-bootstrap-modal-when-it-gets-closed-and-open-it-fresh-again
        resetModal();
        updatePricing();
        $('#selectionsModal').modal('show');
    });
});