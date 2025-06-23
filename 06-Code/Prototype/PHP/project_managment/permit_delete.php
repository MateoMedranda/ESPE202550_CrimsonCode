<?php
header('Content-Type: application/json');
require '../connection_db.php';

if (!isset($connection) || mysqli_connect_errno()) {
    echo json_encode(['success' => false, 'error' => 'Error de conexión a la base de datos.']);
    exit;
}

if (isset($_POST['permit_id'])) {
    $permit_id = intval($_POST['permit_id']);

    $query = "DELETE FROM permit WHERE PERMIT_ID = ?";
    $stmt = mysqli_prepare($connection, $query);

    if ($stmt) {
        mysqli_stmt_bind_param($stmt, "i", $permit_id);
        if (mysqli_stmt_execute($stmt)) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => 'No se pudo eliminar el permiso.']);
        }
        mysqli_stmt_close($stmt);
    } else {
        echo json_encode(['success' => false, 'error' => 'Error preparando la consulta.']);
    }

    mysqli_close($connection);
} else {
    echo json_encode(['success' => false, 'error' => 'ID del permiso no recibido.']);
}
