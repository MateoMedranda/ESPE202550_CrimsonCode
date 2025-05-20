<?php
include("../connection_db.php");

$project_id = $_POST["project_id"] ?? null;
$permission_id = $_POST["permission_id"] ?? null;

if ($project_id === null) {
    echo json_encode(["error" => "No project ID received"]);
    exit;
}

if ($permission_id === null) {
    echo json_encode(["error" => "No permission ID received"]);
    exit;
}

$request = "SELECT * FROM permit WHERE PERMIT_ID = $permission_id AND PROJECT_ID = $project_id LIMIT 1";
$result = mysqli_query($connection, $request);

if ($result) {
    $data = $result->fetch_assoc();
    echo json_encode($data);
} else {
    echo json_encode(["error" => "There is an error in the request for project list"]);
}
?>
