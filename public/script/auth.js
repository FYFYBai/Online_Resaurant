$(document).ready(function () {
    $("#registerButton").click(function () {
        var newUsername = $("input[name=newUsername]").val();
        var newPass1 = $("input[name=newPass1]").val();
        var newPass2 = $("input[name=newPass2]").val();
        if (newPass1 != newPass2) {
            alert("Both passwords must be the same");
            return;
        }

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
            }
        }).done(function () {
            // TODO: alerts are obsolete, instead use HTML z-layer popup that shows up for 2-3 seconds
            alert("User registered successfully. You may now login.")
        })
    }
}