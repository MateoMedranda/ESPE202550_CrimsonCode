<?php
include("../connection_db.php");

$project_id = $_POST["update_project_id_permission"];
$folder_name = $_POST["update_project_folder"];
$permission_id = $_POST["update_permission_id"];
$name = $_POST["update_project_permission_name"];
$description = $_POST["update_project_permission_Description"];

if (!$permission_id || !$project_id) {
    die("ID de permiso o proyecto faltante.");
}

$verify_query = "
    SELECT p.PERMIT_ID 
    FROM permit p
    INNER JOIN project o ON p.PROJECT_ID = o.PROJECT_ID 
    WHERE p.PERMIT_ID = ? AND p.PROJECT_ID = ?
";

$verify_stmt = $connection->prepare($verify_query);
$verify_stmt->bind_param("ii", $permission_id, $project_id);
$verify_stmt->execute();
$verify_result = $verify_stmt->get_result();

if ($verify_result->num_rows === 0) {
    die("Permiso no encontrado o no pertenece al proyecto.");
}
$verify_stmt->close();

$archivo_nombre = null;
if (isset($_FILES["update_project_permission_file"]) && $_FILES["update_project_permission_file"]["error"] === UPLOAD_ERR_OK) {
    $nombre_archivo = basename($_FILES["update_project_permission_file"]["name"]);
    $ruta_guardado = "../../PROJECTS/$folder_name/PERMITS/" . $nombre_archivo;

    if (!move_uploaded_file($_FILES["update_project_permission_file"]["tmp_name"], $ruta_guardado)) {
        die("Error al subir el archivo.");
    }

    $archivo_nombre = $nombre_archivo;
}

if ($archivo_nombre) {
    $update_query = "UPDATE permit SET PERMIT_NAME = ?, PERMIT_DESCRIPTION = ?, PERMIT_ARCHIVE = ? WHERE PERMIT_ID = ?";
    $stmt = $connection->prepare($update_query);
    $stmt->bind_param("sssi", $name, $description, $archivo_nombre, $permission_id);
} else {
    $update_query = "UPDATE permit SET PERMIT_NAME = ?, PERMIT_DESCRIPTION = ? WHERE PERMIT_ID = ?";
    $stmt = $connection->prepare($update_query);
    $stmt->bind_param("ssi", $name, $description, $permission_id);
}

if ($stmt->execute()) {
    header("Location: ../../HTML/project_page.php?project_id=" . $project_id);
    exit();
} else {
    die("Error al actualizar: " . $stmt->error);
}

$stmt->close();
?>
