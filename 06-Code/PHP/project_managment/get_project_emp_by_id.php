<?php
include("../connection_db.php");

$project_id = $_POST["project_id"] ?? null;
$ambientalplan_id = $_POST["ambientalplan_id"] ?? null;

if (!$project_id || !$ambientalplan_id) {
    echo json_encode(["error" => "Faltan datos del proyecto o del plan ambiental"]);
    exit();
}

$query = "
    SELECT AMBIENTALPLAN_ID, AMBIENTALPLAN_NAME, AMBIENTALPLAN_DESCRIPTION
    FROM ambientalplan
    WHERE PROJECT_ID = ? AND AMBIENTALPLAN_ID = ?
";

$stmt = $connection->prepare($query);
$stmt->bind_param("ii", $project_id, $ambientalplan_id);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode($row);
} else {
    echo json_encode(["error" => "No se encontró el plan ambiental con los datos proporcionados"]);
}

$stmt->close();
$connection->close();
?>
