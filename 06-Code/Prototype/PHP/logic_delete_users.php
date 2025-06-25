<?php
require 'connection_db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["id"]) && isset($_POST["state"])) {
    $id_user = intval($_POST["id"]);
    $new_state= $_POST["state"];
    $query = "UPDATE users SET USERS_STATE = ? WHERE USERS_ID  = ?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("si", $new_state, $id_user);

    if ($stmt->execute()) {
        echo "success";
    } else {
        echo "error";
    }

    $stmt->close();
    $connection->close();
}
?>