<?php
require 'connection_db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input = json_decode(file_get_contents("php://input"), true);
    $project_id = $input['id_project'] ?? null;
    $reminder_name = $input['reminder_name'] ?? null;
    $reminder_description = $input['reminder_description'] ?? null;
    $reminder_date = $input['reminder_date'] ?? null;

    $stmt = $connection-> prepare( "INSERT INTO reminder (PROJECT_ID, REMINDER_TOREMEMBERDATE,
    REMINDER_TITLE, REMINDER_CONTENT) 
    VALUES (?, ?, ?, ?)");

    mysqli_stmt_bind_param($stmt, "isss", $project_id ,$reminder_date, $reminder_name, $reminder_description);

    if ($stmt->execute()) {
        $stmt->close();
        $connection->close();
    
        echo json_encode("Recordatorio ingresado exitosamente");  
    } else {
        echo "Error";
    }
} else {
    echo "Acceso no permitido";
}

?>