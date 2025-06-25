<?php
include("../connection_db.php");

$project_id = intval($_POST['project_id_monitoring']);
$project_folder = $_POST['project_folder_monitoring'];
$monitoring_name = htmlspecialchars(trim($_POST['project_monitoring_name']));
$description = htmlspecialchars(trim($_POST['project_monitoring_description']));
$observation = htmlspecialchars(trim($_POST['project_monitoring_observation']));

if (empty($project_id) || empty($monitoring_name) || empty($description) || empty($observation)) {
    die("Every input must be filled.");
}

$safe_monitoring_name = preg_replace('/[^A-Za-z0-9\-]/', '_', $monitoring_name);
$fecha_actual = date("Ymd_His"); 
$unique_folder_name = $safe_monitoring_name . '_' . $fecha_actual;

$base_dir = '../../PROJECTS/' . $project_folder . '/MONITORINGS/' . $unique_folder_name . '/';
$image_dir = $base_dir . 'imagen_monitoreo/';
$file_dir = $base_dir . 'archivo_monitoreo/';

if (!is_dir($image_dir)) {
    mkdir($image_dir, 0755, true);
}
if (!is_dir($file_dir)) {
    mkdir($file_dir, 0755, true);
}

$image_name = '';
if (isset($_FILES['project_monitoring_image']) && $_FILES['project_monitoring_image']['error'] == 0) {
    $allowed_image_types = ['image/jpeg', 'image/png', 'image/gif'];
    $max_size = 10 * 1024 * 1024;

    if (
        in_array($_FILES['project_monitoring_image']['type'], $allowed_image_types) &&
        $_FILES['project_monitoring_image']['size'] <= $max_size
    ) {
        $image_extension = pathinfo($_FILES['project_monitoring_image']['name'], PATHINFO_EXTENSION);
        $image_name = uniqid('img_') . '.' . $image_extension;

        if (!move_uploaded_file($_FILES['project_monitoring_image']['tmp_name'], $image_dir . $image_name)) {
            die("Fail to upload the image");
        }
    } else {
        die("there is something wrong with the image");
    }
} else {
    die("An image is required");
}

$file_name = '';
if (isset($_FILES['project_monitoring_file']) && $_FILES['project_monitoring_file']['error'] == 0) {
    $allowed_file_types = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    $max_size = 20 * 1024 * 1024;

    if (
        in_array($_FILES['project_monitoring_file']['type'], $allowed_file_types) &&
        $_FILES['project_monitoring_file']['size'] <= $max_size
    ) {
        $file_extension = pathinfo($_FILES['project_monitoring_file']['name'], PATHINFO_EXTENSION);
        $file_name = $unique_folder_name . '.' . $file_extension;

        if (!move_uploaded_file($_FILES['project_monitoring_file']['tmp_name'], $file_dir . $file_name)) {
            die("Fail to upload the file");
        }
    } else {
        die("The file is incorrect");
    }
} else {
    die("A file is required");
}

$stmt = $connection->prepare("INSERT INTO monitoring (
    PROJECT_ID,
    MONITORING_NAME,
    MONITORING_DESCRIPTION,
    MONITORING_EVIDENCE,
    MONITORING_OBSERVATIONS,
    MONITORING_IMAGE,
    MONITORING_FOLDER
) VALUES (?, ?, ?, ?, ?, ?, ?)");

if (!$stmt) {
    die("Failed in the preparation sql: " . $connection->error);
}

$stmt->bind_param("issssss", $project_id, $monitoring_name, $description, $file_name, $observation, $image_name, $unique_folder_name);

if ($stmt->execute()) {
    header("Location: ../../HTML/project_page.php?project_id=1");
    exit();
} else {
    die("Error al registrar: " . $stmt->error);
}

$stmt->close();
?>
