<?php
include("../connection_db.php");

$sql = "SELECT 
            MONITORING_ID AS 'id',
            PROJECT_ID,
            MONITORING_NAME AS 'name',
            MONITORING_DESCRIPTION AS 'description',
            MONITORING_EVIDENCE,
            MONITORING_OBSERVATIONS,
            MONITORING_IMAGE AS 'image',
            MONITORING_FOLDER
        FROM monitoring";

$result = $connection->query($sql);

if (!$result) {
    echo json_encode(["error" => "Error en la consulta: " . $connection->error]);
    exit;
}

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
?>
