<?php
include("../connection_db.php");

$project_id = $_POST["project_id_permission"];
$permit_name = $_POST["project_permission_name"];
$permit_description = $_POST["project_permission_Description"];
$project_folder = $_POST["project_folder"];

$file = $_FILES["project_permission_file"];
if ($file["error"] !== UPLOAD_ERR_OK || $file["type"] !== "application/pdf") {
    echo json_encode(["error" => "The file failed, maybe is not PDF"]);
    exit;
}

$upload_dir = "../../PROJECTS/" . $project_folder . "/PERMITS/";
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

$unique_name = uniqid() . ".pdf";
$target_path = $upload_dir . $unique_name;

if (!move_uploaded_file($file["tmp_name"], $target_path)) {
    echo json_encode(["error" => "Failed to move the file"]);
    exit;
}

$stmt = $connection->prepare("INSERT INTO permit (PROJECT_ID, PERMIT_NAME, PERMIT_DESCRIPTION, PERMIT_ARCHIVE) VALUES (?, ?, ?, ?)");
$stmt->bind_param("isss", $project_id, $permit_name, $permit_description, $unique_name);

if ($stmt->execute()) {
    header("Location: ../../HTML/project_page.php?project_id=".$project_id); 
    exit();
} else {
    echo json_encode(["error" => "Failed to register in DBB"]);
}

$stmt->close();
$connection->close();
?>
