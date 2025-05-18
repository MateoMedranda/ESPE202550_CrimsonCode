<?php
require 'connection_db.php';

$query_profiles = "SELECT DISTINCT PROFILES_NAME,PROFILES_ESTATE,PROFILES_ID FROM profiles";

$profiles = mysqli_query($connection, $query_profiles);
$tabla = '';

while ($register = mysqli_fetch_assoc($profiles)) {
    $tabla .= '<tr>';
    $tabla .= '<td>' . htmlspecialchars($register['PROFILES_NAME']) . '</td>';
    $tabla .= '<td>' . htmlspecialchars($register['PROFILES_ESTATE']== 'ACTIVE' ? 'Activo' : 'Inactivo') . '</td>';
    $tabla .= '<td>
        <button  class="btn btn-sm btn-primary me-1 edit-profile"
            data-id="' . htmlspecialchars($register['PROFILES_ID']) . '"
            data-profile="' . htmlspecialchars($register['PROFILES_NAME']) . '">
            <i class="bi bi-pencil"></i> Editar
        </button>
        <button  class="btn btn-sm ' . ($register['PROFILES_ESTATE'] == 'ACTIVE' ? 'btn-danger' : 'btn-success') . ' toggle-estate"
            data-profile="' . htmlspecialchars($register['PROFILES_NAME']) . '" 
            data-estate="' . htmlspecialchars($register['PROFILES_ESTATE']) . '">
            <i class="bi ' . ($register['PROFILES_ESTATE'] == 'ACTIVE' ? 'bi-check-circle' : 'bi-x-circle') . '"></i> 
            ' . ($register['PROFILES_ESTATE'] == 'ACTIVE' ? 'Desactivar' : 'Activar') . '
        </button>
    </td>';
    $tabla .= '</tr>';
}
echo $tabla;
mysqli_close($connection);
?>