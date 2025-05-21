<?php
include("connection_db.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST["username"];
    $password = $_POST["password"];

    $query = "SELECT * FROM USERS WHERE USERS_USERS = ? AND USERS_PASSWORD = ?";
    $stmt = mysqli_prepare($connection, $query);
    mysqli_stmt_bind_param($stmt, "ss", $username, $password);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if (mysqli_num_rows($result) === 1) {
        session_start();
        $_SESSION["loggedin"] = true;
        $_SESSION["username"] = $username;
        header("Location: ../HTML/project_home.html");
        exit();
    } else {
        header("Location: ../HTML/project_login.html?error=1");
        exit();
    }
}
?>
