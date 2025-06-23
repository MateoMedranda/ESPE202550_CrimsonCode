<?php 
include 'connection_db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = trim($_POST['name']);
    $surname = trim($_POST['surname']);
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);
    $profile = trim($_POST['user_profile']);
    $phone_number = trim($_POST['phone_number']);
    $email = trim($_POST['email']);
    $born_date = trim($_POST['born_date']);
    $personal_id = trim($_POST['personal_id']);
    
    $hash_password = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $connection-> prepare( "INSERT INTO users (PROFILES_ID, USERS_NAME,USERS_SURNAME,USERS_PERSONAL_ID, USERS_BORNDATE, 
    USERS_EMAIL, USERS_PHONENUMBER, USERS_USERS,USERS_PASSWORD) 
    VALUES (?,?, ?, ?, ?, ?, ?, ?, ?)");

    mysqli_stmt_bind_param($stmt, "issssssss", $profile, $name, $surname, $personal_id, $born_date,
     $email, $phone_number, $username, $hash_password);

    if ($stmt->execute()) {
        $stmt->close();
        $connection->close();
        echo "Usuario ingresado exitosamente";  
    } else {
        echo "Error";
    }
} else {
    echo "Acceso no permitido";
}
?>