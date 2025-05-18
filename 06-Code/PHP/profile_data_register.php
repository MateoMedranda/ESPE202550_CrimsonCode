 <?php
include 'connection_db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $profile_name = mysqli_real_escape_string($connection, $_POST['profile_name']);
    $profile_permits = $_POST["selected_permits"]; 

    $permits = [
    "PROFILES_READPROJECTS" ,"PROFILES_CREATEPROJECTS" , "PROFILES_UPDATEPROJECTS" ,"PROFILES_DELETEPROJECTS",
    "PROFILES_READAMBIENTALPLANS" ,"PROFILES_CREATEAMBIENTALPLANS" ,"PROFILES_UPDATEAMBIENTALPLANS" ,"PROFILES_DELETEAMBIENTALPLANS" ,
    "PROFILES_READMONITORINGS" ,"PROFILES_WRITEMONITORINGS" ,"PROFILES_UPDATEMONITORINGS" ,"PROFILES_DELETEMONITORINGS",
    "PROFILES_CREATEACTIVITIES" ,"PROFILES_READACTIVITIES","PROFILES_UPDATEACTIVITIES" ,"PROFILES_DELETEACTIVITIES" ,
    "PROFILES_CREATEEVENTS ","PROFILES_READEVENTS"  ,"PROFILES_UPDATEEVENTS" ,"PROFILES_DELETEEVENTS" ,
    "PROFILES_CREATEUSERS" ,"PROFILES_READUSERS" ,"PROFILES_UPDATEUSERS" ,"PROFILES_DELETEUSERS",
    "PROFILES_CREATEPROFILES" ,"PROFILES_UPDATEPROFILES" , "PROFILES_READPROFILES" ,"PROFILES_DELETEPROFILES" ,
    "PROFILES_READACTIONS"  ,
    "PROFILES_READSUPERVISIONPERIOD" ,"PROFILES_CREATESUPERVISIONPERIOD" ,"PROFILES_DELETESUPERVISIONPERIOD" ,"PROFILES_UPDATESUPERVISIONPERIOD" ,
    "PROFILES_READPERMIT"   ,"PROFILES_CREATEPERMIT" ,"PROFILES_UPDATEPERMIT" ,"PROFILES_DELETEPERMIT" ,
    "PROFILES_READREMINDER" ,"PROFILES_CREATEREMINDER" , "PROFILES_DELETEREMINDER" ,"PROFILES_UPDATEREMINDER"];
        
    $selected_permits_assoc = array_fill_keys($profile_permits, 1);

    $values = [];
    $placeholders = [];
    $types = "s";  
    $params = [$profile_name];

    foreach ($permits as $permit) {
        $value = isset($selected_permits_assoc[$permit]) ? 1 : 0;
        $values[] = $value;
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