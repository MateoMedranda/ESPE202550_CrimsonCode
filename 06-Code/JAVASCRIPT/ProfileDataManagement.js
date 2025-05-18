var add_button = document.getElementById("add_profile");
if (add_button&& !add_button.dataset.addedevent) {
    add_button.addEventListener("click", function () {
        var modal = new bootstrap.Modal(document.getElementById("register_profile"));
        modal.show();
        document.getElementById("profile_name").value = "";
        $.ajax({
            url: '../PHP/get_permits.php',
            method: 'POST',
            data: { },
            success: function(response) {
                              try {
                    let permits = JSON.parse(response);
                    let container = $("#permits_container");
                    container.html("");  

                    let columns = [[], [], []];  
                    let index = 0;

                    $.each(permits, function (permit) {
                        columns[index % 3].push(`
                            <div class="form-check mb-2">
                                <input class="form-check-input" type="checkbox" name="permits[]" 
                                       value="${permit}" id="permit_${permit}">
                                <label class="form-check-label" for="permit_${permit}">${permit}</label>
                            </div>
                        `);
                        index++;
                    });

                    container.append(`
                        <div class="row">
                            <div class="col-md-4">${columns[0].join('')}</div>
                            <div class="col-md-4">${columns[1].join('')}</div>
                            <div class="col-md-4">${columns[2].join('')}</div>
                        </div>
                    `);

                } catch (e) {
                    alert("Error al procesar los permisos: " + e.message);
                }
            },
            error: function(xhr, status, error) {
                console.error("AJAX request failed: " + error);
                alert("Error obtaining the data.");
            }
        });
    });

    add_button.dataset.addedevent = "true";
}