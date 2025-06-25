<?php
header('Content-Type: application/json');
require '../connection_db.php';

if (!isset($connection) || mysqli_connect_errno()) {
    echo json_encode(['success' => false, 'error' => 'Error de conexión.']);
    exit;
}

if (isset($_POST['project_id'])) {
    $project_id = intval($_POST['project_id']);

    $queries = [
        "DELETE FROM ambientalplan WHERE PROJECT_ID = ?",
        "DELETE FROM monitoring WHERE PROJECT_ID = ?",
        "DELETE FROM permit WHERE PROJECT_ID = ?",
        "DELETE FROM project_customer WHERE PROJECT_ID = ?",
        "DELETE FROM project WHERE PROJECT_ID = ?"
    ];

    foreach ($queries as $query) {
        $stmt = mysqli_prepare($connection, $query);
        if (!$stmt) {
            echo json_encode(['success' => false, 'error' => 'Error preparando consulta: ' . $query]);
            exit;
        }

        mysqli_stmt_bind_param($stmt, "i", $project_id);
        if (!mysqli_stmt_execute($stmt)) {
            echo json_encode([
                'success' => false,
                'error' => 'Error ejecutando: ' . $query . ' - ' . mysqli_error($connection)
            ]);
            mysqli_stmt_close($stmt);
            exit;
        }

        mysqli_stmt_close($stmt);
    }

    mysqli_close($connection);
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'ID no recibido.']);
}
