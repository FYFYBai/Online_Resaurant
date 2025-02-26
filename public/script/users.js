$(document).ready(function () {
    // Read credentials from sessionStorage
    var authEmail = sessionStorage.getItem('x-auth-email');
    var authPassword = sessionStorage.getItem('x-auth-password');

    if (!authEmail || !authPassword) {
        alert("Please login first.");
        window.location.href = "./auth.html";
        return;
    }

    // Fetch the logged-in user's details using GET /api/users/me
    $.ajax({
        url: "/api/users/me",
        method: "GET",
        headers: {
            "x-auth-email": authEmail,
            "x-auth-password": authPassword
        },
        success: function (user) {
            // Build the user profile table dynamically
            var tableHtml = "";
            var fields = [
                { key: "email", label: "Email" },
                { key: "first_name", label: "First Name" },
                { key: "last_name", label: "Last Name" },
                { key: "street", label: "Street Address" },
                { key: "city", label: "City" },
                { key: "state", label: "State" },
                { key: "postal_code", label: "Postal Code" },
                { key: "country", label: "Country" }
            ];
            fields.forEach(function (field) {
                tableHtml += "<tr>" +
                    "<td>" + field.label + "</td>" +
                    "<td><input type='text' id='" + field.key + "' class='form-control' value='" + (user[field.key] || "") + "' /></td>" +
                    "<td><button class='btn btn-secondary update-btn' data-field='" + field.key + "'>Update</button></td>" +
                    "</tr>";
            });
            $("#userProfileTable tbody").html(tableHtml);

            // Save the user id for updates
            window.currentUserId = user.id;
        },
        error: function (xhr) {
            alert("Error fetching user profile: " + (xhr.responseJSON && xhr.responseJSON.message));
        }
    });

    // Handler: When an update button is clicked, send a PUT request to update that field
    $("#userProfileTable").on("click", ".update-btn", function () {
        var field = $(this).data("field");
        var newValue = $("#" + field).val();
        var data = {};
        data[field] = newValue;
        $.ajax({
            url: "/api/users/" + window.currentUserId,
            method: "PUT",
            headers: {
                "x-auth-email": authEmail,
                "x-auth-password": authPassword
            },
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (updatedUser) {
                alert("Updated " + field + " successfully.");
            },
            error: function (xhr) {
                alert("Error updating " + field + ": " + (xhr.responseJSON && xhr.responseJSON.message));
            }
        });
    });

    // Fetch order history using GET /api/orders/user/email/{email}
    $.ajax({
        url: "/api/orders/user/email/" + encodeURIComponent(authEmail),
        method: "GET",
        success: function (data) {
            var orders = data.orders;
            var orderHtml = "";
            orders.forEach(function (order) {
                orderHtml += "<tr>" +
                    "<td>" + new Date(order.order_date).toLocaleString() + "</td>" +
                    "<td>" + order.total_price + "</td>" +
                    "<td>" + order.status + "</td>" +
                    "<td><button class='btn btn-info details-btn' data-order-id='" + order.id + "'>View Details</button></td>" +
                    "</tr>";
                // Hidden row for order items details
                orderHtml += "<tr class='order-details' id='order-details-" + order.id + "' style='display: none;'><td colspan='4'>";
                if (order.OrderItems && order.OrderItems.length > 0) {
                    orderHtml += "<table class='table table-sm'><thead><tr><th>Pizza ID</th><th>Price</th><th>Extra Components</th></tr></thead><tbody>";
                    order.OrderItems.forEach(function (item) {
                        orderHtml += "<tr>" +
                            "<td>" + item.pizza_id + "</td>" +
                            "<td>" + item.price + "</td>" +
                            "<td>" + (item.extra_components ? JSON.stringify(item.extra_components) : "None") + "</td>" +
                            "</tr>";
                    });
                    orderHtml += "</tbody></table>";
                } else {
                    orderHtml += "No order items.";
                }
                orderHtml += "</td></tr>";
            });
            $("#orderHistoryTable tbody").html(orderHtml);
        },
        error: function (xhr) {
            alert("Error fetching order history: " + (xhr.responseJSON && xhr.responseJSON.message));
        }
    });

    // Toggle display of order details when clicking the "View Details" button
    $("#orderHistoryTable").on("click", ".details-btn", function () {
        var orderId = $(this).data("order-id");
        $("#order-details-" + orderId).toggle();
    });
});

function navbarLinkChange() {
    const authEmail = sessionStorage.getItem('x-auth-email');

    if (authEmail) {
        // When logged in, include Menu, User Profile, and Logout links.
        $('.navbar-nav').html(`
            <li class="nav-item"><a class="nav-link" href="./orders.html">Menu</a></li>
            <li class="nav-item"><a class="nav-link" href="./users.html">User Profile</a></li>
            <li class="nav-item"><a class="nav-link" href="#" id="logout">Logout (${authEmail})</a></li>
        `);
    } else {
        // When not logged in, show Menu and Login.
        $('.navbar-nav').html(`
            <li class="nav-item"><a class="nav-link" href="./orders.html">Menu</a></li>
            <li class="nav-item"><a class="nav-link" href="./auth.html">Login</a></li>
        `);
    }
}

// Call this function on page load
navbarLinkChange();

// Add a logout handler (same as in orders.js)
$(document).on('click', '#logout', function () {
    sessionStorage.removeItem('x-auth-email');
    sessionStorage.removeItem('x-auth-password');
    navbarLinkChange();
    alert('You have been logged out.');
    window.location.href = "./auth.html";
});