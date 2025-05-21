<?php
include("../connection_db.php");

$project_id = $_POST["update_project_id_permission"];
$permit_name = $_POST["update_project_permission_name"];
$permit_description = $_POST["update_project_permission_Description"];
$project_folder = $_POST["update_project_folder"];
$file = $_FILES["update_project_permission_file"];

$query = $connection->prepare("SELECT PERMIT_ARCHIVE FROM permit WHERE PROJECT_ID = ?");
$query->bind_param("i", $project_id);
$query->execute();
$query->bind_result($previous_file);
$query->fetch();
$query->close();

$upload_dir = "../../PROJECTS/" . $project_folder . "/PERMITS/";
$new_filename = $previous_file; 

if ($file["error"] === UPLOAD_ERR_OK) {
    if ($file["type"] !== "application/pdf") {
        echo json_encode(["error" => "El archivo no es un PDF"]);
        exit;
    }

    $previous_path = $upload_dir . $previous_file;
    if (file_exists($previous_path)) {
        unlink($previous_path);
    }

    $new_filename = uniqid() . ".pdf";
    $new_path = $upload_dir . $new_filename;

    if (!move_uploaded_file($file["tmp_name"], $new_path)) {
        echo json_encode(["error" => "No se pudo guardar el nuevo archivo"]);
        exit;
    }
}

$stmt = $connection->prepare("UPDATE permit SET PERMIT_NAME = ?, PERMIT_DESCRIPTION = ?, PERMIT_ARCHIVE = ? WHERE PROJECT_ID = ?");
$stmt->bind_param("sssi", $permit_name, $permit_description, $new_filename, $project_id);

if ($stmt->execute()) {
    header("Location: ../../HTML/project_page.php?project_id=" . $project_id);
    exit();
} else {
    echo json_encode(["error" => "No se pudo actualizar el permiso"]);
}

$stmt->close();
$connection->close();
?>
