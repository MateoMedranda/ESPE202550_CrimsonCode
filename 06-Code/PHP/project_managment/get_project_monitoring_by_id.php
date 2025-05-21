<?php
include("../connection_db.php");

$project_id = $_POST["project_id"] ?? null;
$monitoring_id = $_POST["monitoring_id"] ?? null;

if (!$project_id || !$monitoring_id) {
    echo json_encode(["error" => "Faltan datos del proyecto o monitoreo."]);
    exit();
}

$query = "SELECT * FROM monitoring WHERE PROJECT_ID = ? AND MONITORING_ID = ?";
$stmt = $connection->prepare($query);
$stmt->bind_param("ii", $project_id, $monitoring_id);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode($row);
} else {
    echo json_encode(["error" => "No se encontró el monitoreo."]);
}

$stmt->close();
$connection->close();
?>
