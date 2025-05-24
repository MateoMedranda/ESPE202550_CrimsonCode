<?php
require 'connection_db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input = json_decode(file_get_contents("php://input"), true);
    $reminder_id = $input['reminder_id'] ?? null;
    $project_id = $input['project_id'] ?? null;
    $reminder_tittle = $input['reminder_title'] ?? null;
    $reminder_description = $input['reminder_content'] ?? null;
    $reminder_date = $input['reminder_date'] ?? null;

$stmt = $connection->prepare("UPDATE reminder 
    SET REMINDER_TOREMEMBERDATE = ?, 
        REMINDER_TITLE = ?, 
        REMINDER_CONTENT = ? 
    WHERE REMINDER_ID = ? AND PROJECT_ID = ?"); 

    mysqli_stmt_bind_param($stmt, "sssii", $reminder_date, $reminder_tittle, $reminder_description ,$reminder_id, $project_id);

    if ($stmt->execute()) {
        $stmt->close();
        $connection->close();
        echo json_encode("Recordatorio actualizado exitosamente");  
    } else {
        echo "Error";
    }
} else {
    echo "Acceso no permitido";
}

?>