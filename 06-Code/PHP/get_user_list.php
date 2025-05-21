<?php
require 'connection_db.php';

$query_users = "SELECT DISTINCT u.USERS_ID,u.PROFILES_ID,u.USERS_NAME,u.USERS_SURNAME,u.USERS_PERSONAL_ID,
u.USERS_EMAIL,u.USERS_PHONENUMBER,u.USERS_STATE,p.PROFILES_NAME FROM users u JOIN profiles p
on  u.PROFILES_ID = p.PROFILES_ID AND p.PROFILES_STATE = 'ACTIVE' ";

$users = mysqli_query($connection, $query_users);

$tabla = '';

while ($register = mysqli_fetch_assoc($users)) {
    $tabla .= '<tr>';
    $tabla .= '<td>' . htmlspecialchars($register['USERS_ID']) . '</td>';
    $tabla .= '<td>' . htmlspecialchars($register['USERS_PERSONAL_ID']) . '</td>';
    $tabla .= '<td>' . htmlspecialchars($register['USERS_NAME']. ' ' .$register['USERS_SURNAME']) . '</td>';
    $tabla .= '<td>' . htmlspecialchars($register['PROFILES_NAME']) . '</td>';
    $tabla .= '<td>' . htmlspecialchars($register['USERS_EMAIL']) . '</td>';
    $tabla .= '<td>' . htmlspecialchars($register['USERS_PHONENUMBER']) . '</td>';
    $tabla .= '<td>' . htmlspecialchars($register['USERS_STATE']== 'ACTIVE' ? 'Activo' : 'Inactivo') . '</td>';
    $tabla .= '<td>
        <button  class="btn btn-sm btn-primary me-1 edit-profile"
            data-id="' . htmlspecialchars($register['USERS_ID']) . '"
            <i class="bi bi-pencil"></i> Editar
        </button>
        <button  class="btn btn-sm ' . ($register['USERS_STATE'] == 'ACTIVE' ? 'btn-danger' : 'btn-success') . ' toggle-state"
            data-id="' . htmlspecialchars($register['USERS_ID']) . '"
            data-state="' . htmlspecialchars($register['USERS_STATE']) . '">
            <i class="bi ' . ($register['USERS_STATE'] == 'ACTIVE' ? 'bi-check-circle' : 'bi-x-circle') . '"></i> 
            ' . ($register['USERS_STATE'] == 'ACTIVE' ? 'Desactivar' : 'Activar') . '
        </button>
    </td>';
    $tabla .= '</tr>';
}
echo $tabla;
mysqli_close($connection);
?>