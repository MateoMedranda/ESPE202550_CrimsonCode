<?php
require 'connection_db.php';
$profile_data ="";
$profiles_sql = 'SELECT DISTINCT PROFILES_ID,PROFILES_NAME FROM profiles WHERE 	PROFILES_STATE ="ACTIVE"';
$profiles_list = mysqli_query($connection, $profiles_sql );

while ($row = mysqli_fetch_assoc($profiles_list)) {
$profile_data .='<option value="' . htmlspecialchars($row['PROFILES_ID']) . '">' . htmlspecialchars($row['PROFILES_NAME']) . '</option>';
}
echo $profile_data;
mysqli_close($connection);

?>