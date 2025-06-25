<?php
include("../connection_db.php");

$project_id = $_POST["project_id_emp"];
$emp_name = $_POST["project_emp_name"];
$emp_description = $_POST['project_emp_description'];
    
$stmt = $connection->prepare("INSERT INTO ambientalplan (AMBIENTALPLAN_NAME, PROJECT_ID,AMBIENTALPLAN_DESCRIPTION) VALUES (?,?, ?)");
    if ($stmt === false) {
        die("Prepare failed: " . $connection->error);
    }
    
    $stmt->bind_param("sss", $emp_name, $project_id, $emp_description);
    
    if ($stmt->execute()) {
        header("Location: ../../HTML/project_page.php?project_id=".$project_id); 
        exit();
    } else {
        die("Error: " . $stmt->error);
    }
    
    $stmt->close();
?>