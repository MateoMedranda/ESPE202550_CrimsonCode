<?php
include 'connection_db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id = $_POST['id'];
    $profile = $_POST['profile'];

    $sql = "UPDATE users SET PROFILES_ID=? WHERE USERS_ID=?";
    $stmt = $connection->prepare($sql);
    $stmt->bind_param("si", $profile, $id);

    if ($stmt->execute()) {
        echo "Usuario actualizado correctamente.";
    } else {
        echo "Error al actualizar usuario: " . $stmt->error;
    }

    $stmt->close();
    $connection->close();
} else {
    echo "Acceso no permitido.";
}
?>