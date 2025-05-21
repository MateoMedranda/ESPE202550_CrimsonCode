<?php
include("../connection_db.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $project_id = $_POST['update_project_id'];
    $name = $_POST['update_project_name'];
    $begin_date = $_POST['update_project_begin_date'];
    $ubication = $_POST['update_project_ubication'];
    $description = $_POST['update_project_description'];

    // Obtener datos actuales del proyecto
    $stmt_select = $connection->prepare("SELECT PROJECT_IMAGE, PROJECT_NAME FROM project WHERE PROJECT_ID = ?");
    $stmt_select->bind_param("i", $project_id);
    $stmt_select->execute();
    $stmt_select->bind_result($old_image, $old_project_name);
    $stmt_select->fetch();
    $stmt_select->close();

    $old_safe_name = preg_replace('/[^A-Za-z0-9\-]/', '_', $old_project_name);
    $new_safe_name = preg_replace('/[^A-Za-z0-9\-]/', '_', $name);

    $old_base_dir = "../../PROJECTS/" . $old_safe_name;
    $new_base_dir = "../../PROJECTS/" . $new_safe_name;
    $image_dir = $new_base_dir . "/imagen_proyecto/";

    // Si el nombre cambió, renombrar la carpeta
    if ($old_safe_name !== $new_safe_name) {
        if (is_dir($old_base_dir)) {
            rename($old_base_dir, $new_base_dir);
        } else {
            mkdir($image_dir, 0755, true); // Crear ruta si no existía
        }
    }

    // Procesamiento de nueva imagen
    if (isset($_FILES['update_project_image']) && $_FILES['update_project_image']['error'] === UPLOAD_ERR_OK) {
        // Eliminar imagen anterior si existe
        $old_image_path = $new_base_dir . "/imagen_proyecto/" . $old_image;
        if (!empty($old_image) && file_exists($old_image_path)) {
            unlink($old_image_path);
        }

        // Asegurar que la carpeta exista
        if (!is_dir($image_dir)) {
            mkdir($image_dir, 0755, true);
        }

        // Guardar nueva imagen
        $image_extension = pathinfo($_FILES['update_project_image']['name'], PATHINFO_EXTENSION);
        $new_image_name = uniqid() . '.' . $image_extension;
        $new_image_path = $image_dir . $new_image_name;

        if (!move_uploaded_file($_FILES['update_project_image']['tmp_name'], $new_image_path)) {
            echo json_encode(["error" => "Cannot upload the image"]);
            exit;
        }

        // Actualizar también la imagen en base de datos
        $query = "UPDATE project 
                  SET PROJECT_NAME = ?, PROJECT_STARTDATE = ?, PROJECT_LOCATION = ?, PROJECT_DESCRIPTION = ?, PROJECT_IMAGE = ?
                  WHERE PROJECT_ID = ?";

        $stmt = $connection->prepare($query);
        $stmt->bind_param("sssssi", $name, $begin_date, $ubication, $description, $new_image_name, $project_id);
    } else {
        // Solo actualizar datos sin imagen
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
        echo json_encode(["error" => "There was an error updating the project"]);
    }

    $stmt->close();
    $connection->close();
} else {
    echo json_encode(["error" => "Illegal Method"]);
}
?>