<?php
include("../connection_db.php");

$project_id = $_POST["project_id"] ?? null;

if ($project_id === null) {
    echo json_encode(["error" => "No project ID received"]);
    exit;
}

$request = "SELECT * FROM project WHERE PROJECT_ID = $project_id";
$result = mysqli_query($connection, $request);

if ($result) {
    $data = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($data);
} else {
    echo json_encode(["error" => "There is an error in the request for project list"]);
}
?>
