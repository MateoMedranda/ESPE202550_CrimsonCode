<?php
require 'connection_db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["profile"]) && isset($_POST["state"])) {
    $profile = $_POST["profile"]; 
    $new_state = $_POST["state"];

    if ($new_state === "INACTIVE") {
        $query_inner = "SELECT COUNT(*) FROM users WHERE PROFILES_ID = '$profile'";
        $result = $connection->query($query_inner);
        if ($result) {
            $num = $result->fetch_assoc();
            if ($num["COUNT(*)"] > 0) {
                echo $num["COUNT(*)"] ;
                $connection->close();
                return;
            }
        }
    }

    $query = "UPDATE profiles SET PROFILES_STATE = ? WHERE PROFILES_ID = ?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("si", $new_state, $profile);

    if ($stmt->execute()) {
        echo "success";
    } else {
        echo "error";
    }

    $stmt->close();
    $connection->close();
}

?>