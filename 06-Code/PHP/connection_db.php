<?php
$database_host = 'localhost';
$database_name = 'biosigma_db';
$database_user = 'root';
$database_password = 'rootroot';
$connection = mysqli_connect($database_host, $database_user, $database_password, $database_name);
if (!$connection) {
    die("Connection failed: " . mysqli_connect_error());
}

?>