<?php
header('Content-Type: application/json');
require '../connection_db.php';

if (!isset($connection) || mysqli_connect_errno()) {
    echo json_encode(['success' => false, 'error' => 'Error de conexión.']);
    exit;
}

if (isset($_POST['emp_id'])) {
    $emp_id = intval($_POST['emp_id']);

    $query = "DELETE FROM ambientalplan WHERE AMBIENTALPLAN_ID = ?";
    $stmt = mysqli_prepare($connection, $query);

    if ($stmt) {
        mysqli_stmt_bind_param($stmt, "i", $emp_id);
        if (mysqli_stmt_execute($stmt)) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => 'No se pudo eliminar el EMP.']);
        }
        mysqli_stmt_close($stmt);
    } else {
        echo json_encode(['success' => false, 'error' => 'Error preparando consulta.']);
    }

    mysqli_close($connection);
} else {
    echo json_encode(['success' => false, 'error' => 'ID del EMP no recibido.']);
}
?>
