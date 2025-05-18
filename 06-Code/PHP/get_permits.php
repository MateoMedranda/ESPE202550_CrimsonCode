<?php
require 'connection_db.php';

$query_permits = "
    SELECT COLUMN_NAME 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'profiles' 
    AND TABLE_SCHEMA = 'biosigma_db'
    AND DATA_TYPE = 'tinyint'";

$permits = mysqli_query($connection, $query_permits);

if (!$permits) {
    die("Error while consulting: " . mysqli_error($connection));
}

$permit_array = [];

while ($row = mysqli_fetch_assoc($permits)) {
    $permit_array[$row['COLUMN_NAME']] = false;
}

echo json_encode($permit_array);

mysqli_close($connection);
