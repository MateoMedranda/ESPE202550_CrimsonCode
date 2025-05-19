<?php
include("../connection_db.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $project_id = $_POST['update_project_id'];
    $name = $_POST['update_project_name'];
    $begin_date = $_POST['update_project_begin_date'];
    $ubication = $_POST['update_project_ubication'];
    $description = $_POST['update_project_description'];

    if (isset($_FILES['update_project_image']) && $_FILES['update_project_image']['error'] === UPLOAD_ERR_OK) {
        $image_tmp = $_FILES['update_project_image']['tmp_name'];
        $image_name = basename($_FILES['update_project_image']['name']);
        $destination = "../../PROJECTS/" . $image_name;

        if (move_uploaded_file($image_tmp, $destination)) {
            $image_to_save = $image_name;

            $query = "UPDATE project 
                      SET PROJECT_NAME = ?, PROJECT_STARTDATE = ?, PROJECT_LOCATION = ?, PROJECT_DESCRIPTION = ?, PROJECT_IMAGE = ?
                      WHERE PROJECT_ID = ?";

            $stmt = $connection->prepare($query);
            $stmt->bind_param("sssssi", $name, $begin_date, $ubication, $description, $image_to_save, $project_id);
        } else {
            echo json_encode(["error" => "Can not upload the image"]);
            exit;
        }
    } else {
        $query = "UPDATE project 
                  SET PROJECT_NAME = ?, PROJECT_STARTDATE = ?, PROJECT_LOCATION = ?, PROJECT_DESCRIPTION = ?
                  WHERE PROJECT_ID = ?";

        $stmt = $connection->prepare($query);
        $stmt->bind_param("ssssi", $name, $begin_date, $ubication, $description, $project_id);
    }

    if ($stmt->execute()) {
        header("Location: ../../HTML/project_managment.html"); 
        exit();
    } else {
        echo json_encode(["error" => "ther was an error updating the project"]);
    }

    $stmt->close();
    $connection->close();
} else {
    echo json_encode(["error" => "Ilegal Method"]);
}
?>
