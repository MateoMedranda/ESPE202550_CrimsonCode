<?php
include 'connection_db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $profile_name = misqlysqli_real_escape_string($connection, $_POST['name']);
    $profile_permits = $_POST["permits"]; 

    $permits = [
    "PROFILE_READPROJECTS" ,"PROFILE_CREATEPROJECTS" , "PROFILE_UPDATEPROJECTS" ,"PROFILE_DELETEPROJECTS",
    "PROFILE_READAMBIENTALPLANS" ,"PROFILE_CREATEAMBIENTALPLANS" ,"PROFILE_UPDATEAMBIENTALPLANS" ,"PROFILE_DELETEAMBIENTALPLANS" ,
    "PROFILE_READMONITORINGS" ,"PROFILE_WRITEMONITORINGS" ,"PROFILE_UPDATEMONITORINGS" ,"PROFILE_DELETEMONITORINGS",
    "PROFILE_CREATEACTIVITIES" ,"PROFILE_READACTIVITIES","PROFILE_UPDATEACTIVITIES" ,"PROFILE_DELETEACTIVITIES" ,
    "PROFILE_CREATEEVENTS ","PROFILE_READEVENTS"  ,"PROFILE_UPDATEEVENTS" ,"PROFILE_DELETEEVENTS" ,
    "PROFILE_CREATEUSERS" ,"PROFILE_READUSERS" ,"PROFILE_UPDATEUSERS" ,"PROFILE_DELETEUSERS",
    "PROFILE_CREATEPROFILES" ,"PROFILE_UPDATEPROFILES" , "PROFILE_READPROFILES" ,"PROFILE_DELETEPROFILES" ,
    "PROFILE_READACTIONS"  ,
    "PROFILE_READSUPERVISIONPERIOD" ,"PROFILE_CREATESUPERVISIONPERIOD" ,"PROFILE_DELETESUPERVISIONPERIOD" ,"PROFILE_UPDATESUPERVISIONPERIOD" ,
    "PROFILE_READPERMIT"   ,"PROFILE_CREATEPERMIT" ,"PROFILE_UPDATEPERMIT" ,"PROFILE_DELETEPERMIT" ,
    "PROFILE_READREMINDER" ,"PROFILE_CREATEREMINDER" , "PROFILE_DELETEREMINDER" ,"PROFILE_UPDATEREMINDER"];
        
    $values = [];
    $placeholders = [];
    $types = "s";  
    $params = [$profile_name];

    foreach ($permits as $permit) {
        $values[] = in_array($permit, $profile_permits) ? 1 : 0;  
        $placeholders[] = "?";
        $types .= "i";  
    }

    $stmt = $connection->prepare("INSERT INTO profiles (PROFILES_NAME, " . implode(", ", $permits) . ") 
            VALUES (?, " . implode(", ", $placeholders) . ")");

    if ($stmt === false) {
        die("Error en la preparación de la consulta: " . $connection->error);
    }

    $params = array_merge([$types], $params, $values);

    $stmt->bind_param(...$params);

        if ($stmt->execute()) {
            echo "New record created successfully";
        } else {
            echo "Error: " . $stmt->error;
        }

    $stmt->close();
    $connection->close();
}

?>