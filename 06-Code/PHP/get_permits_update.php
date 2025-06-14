<?php
require 'connection_db.php';

$permits_groups = [
    "PROFILES_READPROJECTS" => "Proyectos",
    "PROFILES_CREATEPROJECTS" => "Proyectos",
    "PROFILES_UPDATEPROJECTS" => "Proyectos",
    "PROFILES_DELETEPROJECTS" => "Proyectos",

    "PROFILES_READAMBIENTALPLANS" => "Planes Ambientales",
    "PROFILES_CREATEAMBIENTALPLANS" => "Planes Ambientales",
    "PROFILES_UPDATEAMBIENTALPLANS" => "Planes Ambientales",
    "PROFILES_DELETEAMBIENTALPLANS" => "Planes Ambientales",

    "PROFILES_READMONITORINGS" => "Monitoreos",
    "PROFILES_WRITEMONITORINGS" => "Monitoreos",
    "PROFILES_UPDATEMONITORINGS" => "Monitoreos",
    "PROFILES_DELETEMONITORINGS" => "Monitoreos",

    "PROFILES_READACTIVITIES" => "Actividad",
    "PROFILES_CREATEACTIVITIES" => "Actividad",
    "PROFILES_UPDATEACTIVITIES" => "Actividad",
    "PROFILES_DELETEACTIVITIES" => "Actividad",

    "PROFILES_CREATEEVENTS" => "Evento",
    "PROFILES_READEVENTS" => "Evento",
    "PROFILES_UPDATEEVENTS" => "Evento",
    "PROFILES_DELETEEVENTS" => "Evento",

    "PROFILES_CREATEUSERS" => "Usuarios",
    "PROFILES_READUSERS" => "Usuarios",
    "PROFILES_UPDATEUSERS" => "Usuarios",
    "PROFILES_DELETEUSERS" => "Usuarios",

    "PROFILES_CREATEPROFILES" => "Perfiles",
    "PROFILES_UPDATEPROFILES" => "Perfiles",
    "PROFILES_READPROFILES" => "Perfiles",
    "PROFILES_DELETEPROFILES" => "Perfiles",

    "PROFILES_READACTIONS" => "Acciones",

    "PROFILES_READSUPERVISIONPERIOD" => "Periodo de Supervision",
    "PROFILES_CREATESUPERVISIONPERIOD" => "Periodo de Supervision",
    "PROFILES_DELETESUPERVISIONPERIOD" => "Periodo de Supervision",
    "PROFILES_UPDATESUPERVISIONPERIOD" => "Periodo de Supervision",

    "PROFILES_READPERMIT" => "Permisos",
    "PROFILES_CREATEPERMIT" => "Permisos",
    "PROFILES_UPDATEPERMIT" => "Permisos",
    "PROFILES_DELETEPERMIT" => "Permisos",

    "PROFILES_READREMINDER" => "Recordatorio",
    "PROFILES_CREATEREMINDER" => "Recordatorio",
    "PROFILES_DELETEREMINDER" => "Recordatorio",
    "PROFILES_UPDATEREMINDER" => "Recordatorio"
];

$user_friendly_permit_names = [
    "PROFILES_READPROJECTS" => "Ver Proyectos",
    "PROFILES_CREATEPROJECTS" => "Generar Proyectos",
    "PROFILES_UPDATEPROJECTS" => "Actualizar Proyectos",
    "PROFILES_DELETEPROJECTS" => "Eliminar Proyectos",
    "PROFILES_READAMBIENTALPLANS" => "Ver Planes Ambientales",
    "PROFILES_CREATEAMBIENTALPLANS" => "Generar Planes Ambientales",
    "PROFILES_UPDATEAMBIENTALPLANS" => "Actualizar Planes Ambientales",
    "PROFILES_DELETEAMBIENTALPLANS" => "Eliminar Planes Ambientales",
    "PROFILES_READMONITORINGS" => "Ver Monitoreos",
    "PROFILES_WRITEMONITORINGS" => "Generar Monitoreos",
    "PROFILES_UPDATEMONITORINGS" => "Actualizar Monitoreos",
    "PROFILES_DELETEMONITORINGS" => "Eliminar Monitoreos",
    "PROFILES_READACTIVITIES" => "Ver Actividad",
    "PROFILES_CREATEACTIVITIES" => "Generar Actividad",
    "PROFILES_UPDATEACTIVITIES" => "Actualizar Actividad",
    "PROFILES_DELETEACTIVITIES" => "Eliminar Actividad",
    "PROFILES_CREATEEVENTS" => "Generar Evento",
    "PROFILES_READEVENTS" => "Ver Evento",
    "PROFILES_UPDATEEVENTS" => "Actualizar Evento",
    "PROFILES_DELETEEVENTS" => "Eliminar Evento",
    "PROFILES_CREATEUSERS" => "Generar Usuarios",
    "PROFILES_READUSERS" => "Ver Usuarios",
    "PROFILES_UPDATEUSERS" => "Actualizar Usuarios",
    "PROFILES_DELETEUSERS" => "Eliminar Usuarios",
    "PROFILES_CREATEPROFILES" => "Generar Perfiles",
    "PROFILES_UPDATEPROFILES" => "Actualizar Perfiles",
    "PROFILES_READPROFILES" => "Ver Perfiles",
    "PROFILES_DELETEPROFILES" => "Eliminar Perfiles",
    "PROFILES_READACTIONS" => "Ver Acciones",
    "PROFILES_READSUPERVISIONPERIOD" => "Ver Periodo de Supervision",
    "PROFILES_CREATESUPERVISIONPERIOD" => "Generar Periodo de Supervision",
    "PROFILES_DELETESUPERVISIONPERIOD" => "Eliminar Periodo de Supervision",
    "PROFILES_UPDATESUPERVISIONPERIOD" => "Actualizar Periodo de Supervision",
    "PROFILES_READPERMIT" => "Ver Permiso",
    "PROFILES_CREATEPERMIT" => "Generar Permiso",
    "PROFILES_UPDATEPERMIT" => "Actualizar Permiso",
    "PROFILES_DELETEPERMIT" => "Eliminar Permiso",
    "PROFILES_READREMINDER" => "Ver Recordatorio",
    "PROFILES_CREATEREMINDER" => "Generar Recordatorio",
    "PROFILES_DELETEREMINDER" => "Eliminar Recordatorio",
    "PROFILES_UPDATEREMINDER" => "Actualizar Recordatorio"
];



if (isset($_POST['id'])) {
    $profile_id = mysqli_real_escape_string($connection, $_POST['id']);
    
    $query = "SELECT * FROM profiles WHERE PROFILES_ID = '$profile_id'";
    $data = mysqli_query($connection, $query);
    
    if ($data && mysqli_num_rows($data) > 0) {
        $profile_data = mysqli_fetch_assoc($data);

        $query_permits = "SELECT COLUMN_NAME 
                          FROM INFORMATION_SCHEMA.COLUMNS 
                          WHERE TABLE_NAME = 'profiles' 
                          AND TABLE_SCHEMA = 'biosigma_db'
                          AND DATA_TYPE = 'tinyint'
                          AND COLUMN_NAME != 'PROFILES_STATE'";

        $data_result = mysqli_query($connection, $query_permits);
        $permits = [];

        while ($row = mysqli_fetch_assoc($data_result)) {
            $column_name = $row['COLUMN_NAME'];
            $group = $permits_groups[$column_name] ?? 'Otros';
            $permits[$group][$column_name] = [
                'permit_name' => $user_friendly_permit_names[$column_name] ?? $column_name,
                'value' => isset($profile_data[$column_name]) && $profile_data[$column_name] == 1 
            ];
        }
        echo json_encode($permits);
    } else {
        echo json_encode([]);
    }
    }else if(isset($_POST['just_permits'])) {
            $query_permits = "SELECT COLUMN_NAME 
                            FROM INFORMATION_SCHEMA.COLUMNS 
                            WHERE TABLE_NAME = 'profiles' 
                            AND TABLE_SCHEMA = 'biosigma_db'
                            AND DATA_TYPE = 'tinyint'
                            AND COLUMN_NAME != 'PROFILES_STATE'";

            $data_result = mysqli_query($connection, $query_permits);
            $permits = [];

            while ($row = mysqli_fetch_assoc($data_result)) {
                $column_name = $row['COLUMN_NAME'];
                $group = $permits_groups[$column_name] ?? 'Otros';
                $permits[$group][$column_name] = [
                    'permit_name' => $user_friendly_permit_names[$column_name] ?? $column_name,
                    'value' => 0 
                ];
            }
            echo json_encode($permits);
    }else {
        echo json_encode([]);
    }
?>
