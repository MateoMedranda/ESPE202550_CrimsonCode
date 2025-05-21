<?php
include("../connection_db.php");

$monitoring_id = intval($_POST['update_monitoring_id']);
$project_id = intval($_POST['update_project_id_monitoring']);
$project_folder = $_POST['update_project_folder_monitoring'];

$name = htmlspecialchars(trim($_POST['update_project_monitoring_name']));
$description = htmlspecialchars(trim($_POST['update_project_monitoring_description']));
$observation = htmlspecialchars(trim($_POST['update_project_monitoring_observation']));

if (empty($monitoring_id) || empty($project_id) || empty($name) || empty($description) || empty($observation)) {
    die("Todos los campos obligatorios deben estar llenos.");
}

$stmt = $connection->prepare("SELECT MONITORING_IMAGE, MONITORING_EVIDENCE, MONITORING_FOLDER FROM monitoring WHERE MONITORING_ID = ?");
$stmt->bind_param("i", $monitoring_id);
$stmt->execute();
$result = $stmt->get_result();
if (!$row = $result->fetch_assoc()) {
    die("No se encontró el monitoreo especificado.");
}

$old_image = $row['MONITORING_IMAGE'];
$old_file = $row['MONITORING_EVIDENCE'];
$folder = $row['MONITORING_FOLDER'];

$image_dir = "../../PROJECTS/$project_folder/MONITORINGS/$folder/imagen_monitoreo/";
$file_dir = "../../PROJECTS/$project_folder/MONITORINGS/$folder/archivo_monitoreo/";

$image_name = $old_image;
$file_name = $old_file;

if (isset($_FILES['update_project_monitoring_image']) && $_FILES['update_project_monitoring_image']['error'] === 0) {
    $allowed_image_types = ['image/jpeg', 'image/png', 'image/gif'];
    if (in_array($_FILES['update_project_monitoring_image']['type'], $allowed_image_types)) {
        if ($old_image && file_exists($image_dir . $old_image)) {
            unlink($image_dir . $old_image);
        }
        $ext = pathinfo($_FILES['update_project_monitoring_image']['name'], PATHINFO_EXTENSION);
        $image_name = uniqid('img_') . '.' . $ext;
        move_uploaded_file($_FILES['update_project_monitoring_image']['tmp_name'], $image_dir . $image_name);
    }
}

if (isset($_FILES['update_project_monitoring_file']) && $_FILES['update_project_monitoring_file']['error'] === 0) {
    $allowed_file_types = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (in_array($_FILES['update_project_monitoring_file']['type'], $allowed_file_types)) {
        if ($old_file && file_exists($file_dir . $old_file)) {
            unlink($file_dir . $old_file);
        }
        $ext = pathinfo($_FILES['update_project_monitoring_file']['name'], PATHINFO_EXTENSION);
        $file_name = $folder . '.' . $ext;
        move_uploaded_file($_FILES['update_project_monitoring_file']['tmp_name'], $file_dir . $file_name);
    }
}

$stmt = $connection->prepare("UPDATE monitoring SET MONITORING_NAME = ?, MONITORING_DESCRIPTION = ?, MONITORING_OBSERVATIONS = ?, MONITORING_IMAGE = ?, MONITORING_EVIDENCE = ? WHERE MONITORING_ID = ?");
$stmt->bind_param("sssssi", $name, $description, $observation, $image_name, $file_name, $monitoring_id);

if ($stmt->execute()) {
    header("Location: ../../HTML/project_page.php?project_id=" . $project_id);
    exit();
} else {
    die("Error al actualizar: " . $stmt->error);
}

$stmt->close();
$connection->close();
?>
