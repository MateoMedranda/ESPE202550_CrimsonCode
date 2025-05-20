<?php
include("../connection_db.php");
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $project_name = htmlspecialchars(trim($_POST['project_name']));
    $begin_date = $_POST['project_begin_date'];
    $ubication = htmlspecialchars(trim($_POST['project_ubication']));
    $description = htmlspecialchars(trim($_POST['project_description']));
    $project_state = "En progreso";
    

    if (empty($project_name) || empty($begin_date) || empty($ubication) || empty($description)) {
        die("All required fields must be filled");
    }
    
    $safe_project_name = preg_replace('/[^A-Za-z0-9\-]/', '_', $project_name);
    
    $image_path = '';
    if (isset($_FILES['project_image']) && $_FILES['project_image']['error'] == 0) {
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
        $max_size = 10 * 1024 * 1024; 
        
        if (in_array($_FILES['project_image']['type'], $allowed_types) && 
            $_FILES['project_image']['size'] <= $max_size) {
            
            $base_dir = '../../PROJECTS' . '/' . $safe_project_name . '/';
            $image_dir = $base_dir . 'imagen_proyecto/';
            
            if (!is_dir($base_dir)) {
                mkdir($base_dir, 0755, true);
            }
            if (!is_dir($image_dir)) {
                mkdir($image_dir, 0755, true);
            }
            
            $image_extension = pathinfo($_FILES['project_image']['name'], PATHINFO_EXTENSION);
            $image_name = uniqid() . '.' . $image_extension;
            $image_path = $safe_project_name . '/imagen_proyecto/' . $image_name;
            
            if (!move_uploaded_file($_FILES['project_image']['tmp_name'], $image_dir . $image_name)) {
                die("Error uploading image");
            }
        } else {
            die("Invalid image type or size");
        }
    } else {
        die("Image is required");
    }
    
    $stmt = $connection->prepare("INSERT INTO project (PROJECT_NAME, PROJECT_STARTDATE,PROJECT_STATE,PROJECT_LOCATION, PROJECT_DESCRIPTION, PROJECT_IMAGE) VALUES (?,?, ?, ?, ?, ?)");
    if ($stmt === false) {
        die("Prepare failed: " . $connection->error);
    }
    
    $stmt->bind_param("ssssss", $project_name, $begin_date,$project_state, $ubication, $description, $image_name);
    
    if ($stmt->execute()) {
        header("Location: ../../HTML/project_managment.html"); 
        exit();
    } else {
        die("Error: " . $stmt->error);
    }
    
    $stmt->close();
}
?>