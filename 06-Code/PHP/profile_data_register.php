<?php
include 'connection_db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = misqlysqli_real_escape_string($connection, $_POST['name']);
     $permisos = $_POST["permisos"]; 

    $permisosCampos = [
        "lectura_ingresos", "Insercion_ingresos", "edicion_ingresos",
        "lectura_gastos", "insercion_gastos", "edicion_gastos",
        "lectura_usuarios", "insercion_usuarios", "edicion_usuarios",
        "lectura_perfiles", "insercion_perfiles", "edicion_perfiles",
        "lectura_conceptos", "insercion_conceptos", "edicion_conceptos",
        "permiso_qr"
    ];
    

     $valores = [];
    foreach ($permisosCampos as $permiso) {
        $valores[$permiso] = in_array($permiso, $permisos) ? "TRUE" : "FALSE";
    }

    $sql = "INSERT INTO perfiles (perfil, " . implode(", ", array_keys($valores)) . ") 
            VALUES ('$nombrePerfil', " . implode(", ", $valores) . ")";
    $stmt = $connection->prepare("INSERT INTO users (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $name, $email, $password, $phone, $address);

    // Execute the statement
    if ($stmt->execute()) {
        echo "New record created successfully";
    } else {
        echo "Error: " . $stmt->error;
    }

    // Close the statement and connection
    $stmt->close();
    $connection->close();
}

?>