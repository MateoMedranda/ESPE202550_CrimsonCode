<?php
require 'conenction_db.php';

if (isset($_POST['username'])) {

    $username= mysqli_real_escape_string($conn, $_POST['username']);
    $query = "SELECT * FROM users WHERE USERS_USERS='$usuario'";
    $result = mysqli_query($connection, $query);
    
    if ($result&& mysqli_num_rows($result) > 0) {
        echo true;
    } else {
        echo false;
    }
} else {
    echo "error, datos invalidos";
}
?>