$(document).ready(function () {
    $("#registerButton").click(function () {
        var newUsername = $("input[name=newUsername]").val();
        var newPass1 = $("input[name=newPass1]").val();
        var newPass2 = $("input[name=newPass2]").val();
        if (newPass1 != newPass2) {
            alert("Both passwords must be the same");
            return;
        }

<<<<<<< Updated upstream
        var userObj = { username: newUsername, password: newPass1 };
        $("#waitForIt").show();
        //Notes: if currId = 0 then adding, otherwise updating
        $.ajax({
            url: "api/users",
            type: "POST",
            dataType: "json",
            data: userObj,
            error: function (jqxhr, status, errorThrown) {
                alert("AJAX error: " + jqxhr.responseText);
=======
        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (!response.ok) {
                // Display error message returned from the server.
                $('#loginError').html(data.message || "Login failed.").show();
            } else {
                // On successful login, show a success message.
                $('#loginError').removeClass('alert-danger').addClass('alert-success')
                    .html("Login successful. Redirecting...").show();
                // Store credentials in sessionStorage
                sessionStorage.setItem('x-auth-email', email);
                sessionStorage.setItem('x-auth-password', password);
                // Optionally, redirect after a brief delay.
                setTimeout(() => {
                    window.location.href = "./orders.html";
                }, 1500);
>>>>>>> Stashed changes
            }
        }).done(function () {
            // TODO: alerts are obsolete, instead use HTML z-layer popup that shows up for 2-3 seconds
            alert("User registered successfully. You may now login.")
        })
    }
}