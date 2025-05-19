<?php
require 'connection_db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $profile_id = mysqli_real_escape_string($conn, $_POST["profile_id"]);
    $new_profile_name = mysqli_real_escape_string($conn, $_POST["name"]);
    $permits = json_decode($_POST["permits"], true);

    $all_permits = [
        "PROFILES_READPROJECTS", "PROFILES_CREATEPROJECTS", "PROFILES_UPDATEPROJECTS", "PROFILES_DELETEPROJECTS",
        "PROFILES_READAMBIENTALPLANS", "PROFILES_CREATEAMBIENTALPLANS", "PROFILES_UPDATEAMBIENTALPLANS", "PROFILES_DELETEAMBIENTALPLANS",
        "PROFILES_READMONITORINGS", "PROFILES_WRITEMONITORINGS", "PROFILES_UPDATEMONITORINGS", "PROFILES_DELETEMONITORINGS",
        "PROFILES_CREATEACTIVITIES", "PROFILES_READACTIVITIES", "PROFILES_UPDATEACTIVITIES", "PROFILES_DELETEACTIVITIES",
        "PROFILES_CREATEEVENTS", "PROFILES_READEVENTS", "PROFILES_UPDATEEVENTS", "PROFILES_DELETEEVENTS",
        "PROFILES_CREATEUSERS", "PROFILES_READUSERS", "PROFILES_UPDATEUSERS", "PROFILES_DELETEUSERS",
        "PROFILES_CREATEPROFILES", "PROFILES_UPDATEPROFILES", "PROFILES_READPROFILES", "PROFILES_DELETEPROFILES",
        "PROFILES_READACTIONS",
        "PROFILES_READSUPERVISIONPERIOD", "PROFILES_CREATESUPERVISIONPERIOD", "PROFILES_DELETESUPERVISIONPERIOD", "PROFILES_UPDATESUPERVISIONPERIOD",
        "PROFILES_READPERMIT", "PROFILES_CREATEPERMIT", "PROFILES_UPDATEPERMIT", "PROFILES_DELETEPERMIT",
        "PROFILES_READREMINDER", "PROFILES_CREATEREMINDER", "PROFILES_DELETEREMINDER", "PROFILES_UPDATEREMINDER"
    ];

    $stmt = $conn->prepare("UPDATE profiles SET PROFILES_NAME = ? WHERE PROFILE_ID = ?");
    if ($stmt === false) {
        echo "Error en la preparación de la consulta: " . $conn->error;
        exit;
    }
    $stmt->bind_param("si", $new_profile_name, $profile_id);
    if (!$stmt->execute()) {
        echo "Error al actualizar el nombre del perfil: " . $stmt->error;
        exit;
    }
    $stmt->close();

    $set_clause = [];
    $params = [];
    $types = "";

    foreach ($all_permits as $permit) {
        $value = isset($permits[$permit]) ? $permits[$permit] : 0;
        $set_clause[] = "$permit = ?";
        $params[] = $value;
        $types .= "i";
    }

    $params[] = $profile_id;
    $types .= "i";

    $sql = "UPDATE profiles SET " . implode(", ", $set_clause) . " WHERE PROFILE_ID = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        echo "Error en la preparación de la consulta de permisos: " . $conn->error;
        exit;
    }

    $stmt->bind_param($types, ...$params);

    if ($stmt->execute()) {
        echo "Perfil actualizado correctamente.";
    } else {
        echo "Error al actualizar permisos: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>
