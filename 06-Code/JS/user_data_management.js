var add_button = document.getElementById("add_user");
if (add_button&& !add_button.dataset.addedevent) {
    add_button.addEventListener("click", function () {
        var modal = new bootstrap.Modal(document.getElementById("user_register"));
        modal.show();
    
    });

    add_button.dataset.addedevent = "true";
}