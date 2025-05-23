<?php
include("../PHP/connection_db.php");

$project_id = $_GET["project_id"] ?? null;

if ($project_id === null) {
    echo json_encode(["error" => "No project ID received"]);
    exit;
}

$request = "SELECT * FROM project WHERE PROJECT_ID = $project_id LIMIT 1";
$result = mysqli_query($connection, $request);

if ($result) {
    $data = $result->fetch_assoc();
} else {
    echo json_encode(["error" => "There is an error in the request for project list"]);
}

$project_folder_name = preg_replace('/[^A-Za-z0-9\-]/', '_', $data["PROJECT_NAME"]);
?>


<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="../CSS/project_page.css" rel="stylesheet">
    <link href="../CSS/menu.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Quicksand:wght@300..700&display=swap"
        rel="stylesheet">
    <link rel="icon" href="../IMG/Logo.png" type="image/png">

    <title>SIMA | <?php echo htmlspecialchars($data["PROJECT_NAME"]); ?></title>

</head>

<body class="letter_quicksand">
    <header class="navbar bg-whitenavbar-expand-lg header_sistem">
        <div class="container">
            <div class="d-flex justify-content-between align-items-center w-100">
                <div class="d-flex align-items-center">
                    <img class="mx-3 d-none d-md-flex" src="../IMG/Logo.png" alt="Logo" width="80">
                    <h1 class="fs-3 my-2">SIMA</h1>
                </div>

                <!-- User - Dropdown -->
                <div class="dropdown ms-auto d-flex align-items-center text-center">
                    <i class="bi bi-bell"></i>
                    <i>&nbsp;&nbsp;&nbsp;</i>
                    <a class="d-flex align-items-center text-center text-black text-decoration-none nav-link dropdown-toggle"
                        id="PerfilDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <span id="username" class="me-2 d-none d-md-flex">Nombre Apellido</span>
                        <i class="bi bi-person-circle"></i>
                    </a>

                    <!-- Menu User -->
                    <ul class="dropdown-menu dropdown-menu-end conf_user" aria-labelledby="PerfilDropdown">
                        <li><a class="dropdown-item" href=""><i class="bi bi-person-fill"></i>Mi Perfil</a></li>
                        <li>
                            <hr class="dropdown-divider">
                        </li>
                        <li><a class="dropdown-item text-danger" href="project_login.html">Cerrar Sesión</a></li>
                    </ul>
                </div>

    </header>

    <div class="navbar navbar-expand-lg navbar-light sticky-top menu">
        <div class="container-fluid">

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuNav">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="menuNav">
                <ul class="navbar-nav mx-auto">
                    <!-- Home option always visible -->
                    <li class="nav-item opcion fw-bold mx-2">
                        <a id="home" class="nav-link" href="project_home.html" onclick="">
                            <i class="bi bi-speedometer2"></i> INICIO
                        </a>
                    </li>

                    <!-- Project option visible for admins and customers -->
                    <li class="nav-item opcion fw-bold mx-2">
                        <a id="projects" class="nav-link active" href="project_managment.html" onclick="">
                            <i class="bi bi-folder"></i> PROYECTOS
                        </a>
                    </li>

                    <!-- Opción de reportes visible según permisos -->
                    <li class="nav-item opcion fw-bold mx-2">
                        <a id="reportes" class="nav-link" href="#" onclick="">
                            <i class="bi bi-info-square"></i> REPORTES
                        </a>
                    </li>

                    <!-- Opción de categorias visible según permisos -->
                    <li class="nav-item opcion fw-bold mx-2">
                        <a id="categorias" class="nav-link" href="#" onclick="">
                            <i class="bi bi-calendar"></i> CALENDARIO
                        </a>
                    </li>

                    <!-- Dropdown de usuarios visible solo para admin -->
                    <li class="nav-item dropdown opcion fw-bold menuNav mx-2">
                        <a class="nav-link dropdown-toggle" href="#" id="usersDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-people-fill"></i> USUARIOS
                        </a>
                        <ul class="dropdown-menu menu subNav-menu" aria-labelledby="usersDropdown">
                            <li><a class="dropdown-item" href="project_Profiles_Management.html" onclick="">
                                    <i class="bi bi-person-lines-fill"></i> Lista de usuarios</a></li>

                            <li><a class="dropdown-item" href="project_User_Management.html" onclick="">
                                    <i class="bi bi-person-check-fill"></i> Gestionar Roles</a></li>
                        </ul>
                    </li>

                </ul>
            </div>
        </div>
    </div>

    <!-- Dialog to add new permission -->
    <dialog id="modal_add_project_permission" class="container m-auto bg-light rounded shadow">
        <form id="register_permission" method="post" action="../PHP/project_managment/project_permission_register.php" enctype="multipart/form-data">
            <fieldset class="border p-2 bg-light border-0">
                <h3 class="titulo">Nuevo Permiso</h3>
                <input type="hidden" id="project_id_permission" name="project_id_permission" value="<?php echo htmlspecialchars($data["PROJECT_ID"]); ?>">
                <input type="hidden" id="project_folder" name="project_folder" value="<?php echo htmlspecialchars($project_folder_name); ?>">
                <hr>
                <div class="row">
                    <div class="col-8">
                        <div class="row px-4">
                            <div class="col-3 px-2">
                                <label class="mb-0">Nombre del Permiso: *</label>
                                <input id="project_permission_name" name="project_permission_name" type="text" class="form-control mb-3 shadow">
                            </div>
                            <div class="col-9 px-2">
                                <label>Descripción: *</label>
                                <input id="project_permission_Description" name="project_permission_Description" type="text"
                                    class="form-control mb-3 shadow">
                            </div>
                        </div>
                        <div class="row px-4">
                            <div class="col-12">
                                <label>Adjuntar Archivo (pdf): *</label>
                                <input name="project_permission_file" id="project_permission_file" type="file" onchange="load_preview_file('project_permission_file','permission_file_preview')"
                                    class="form-control mb-3 shadow">
                            </div>
                        </div>
                    </div>
                    <div class="col-4 text-center">
                        <label class="text-center">Archivo seleccionado</label>
                        <div id="permission_file_preview"
                            class="mx-auto bg-black d-flex justify-content-center align-items-center shadow"
                            style="width: 300px; height: 130px; overflow: hidden;">
                        </div>

                    </div>
                </div>
                <hr>
                <button type="submit" onclick="" class="btn bg-success-subtle">Guardar</button>
                <button name="btn_cancel_add_project_permission" id="btn_cancel_add_project_permission" type="button"
                    class="btn bg-danger-subtle" onclick="">Cancelar</button>
            </fieldset>
        </form>
    </dialog>

    <!-- Dialog to update new permission -->
    <dialog id="modal_update_project_permission" class="container m-auto bg-light rounded shadow">
        <form id="update_permission" method="post" action="../PHP/project_managment/project_permission_update.php" enctype="multipart/form-data">
            <fieldset class="border p-2 bg-light border-0">
                <h3 class="title">Editar Permiso</h3>
                <input type="hidden" id="update_project_id_permission" name="update_project_id_permission" value="<?php echo htmlspecialchars($data["PROJECT_ID"]); ?>">
                <input type="hidden" id="update_project_folder" name="update_project_folder" value="<?php echo htmlspecialchars($project_folder_name); ?>">
                <input type="hidden" id="update_permission_id" name="update_permission_id" value=".">

                <hr>
                <div class="row">
                    <div class="col-8">
                        <div class="row px-4">
                            <div class="col-3 px-2">
                                <label class="mb-0">Nombre del Permiso: *</label>
                                <input id="update_project_permission_name" name="update_project_permission_name" type="text" class="form-control mb-3 shadow">
                            </div>
                            <div class="col-9 px-2">
                                <label>Descripción: *</label>
                                <input id="update_project_permission_Description" name="update_project_permission_Description" type="text"
                                    class="form-control mb-3 shadow">
                            </div>
                        </div>
                        <div class="row px-4">
                            <div class="col-12">
                                <label>Adjuntar Archivo (pdf): *</label>
                                <input name="update_project_permission_file" id="update_project_permission_file" type="file" onchange="load_preview_file('update_project_permission_file','update_permission_file_preview')"
                                    class="form-control mb-3 shadow">
                            </div>
                        </div>
                    </div>
                    <div class="col-4 text-center">
                        <label class="text-center">Archivo seleccionado</label>
                        <div id="update_permission_file_preview"
                            class="mx-auto bg-black d-flex justify-content-center align-items-center shadow"
                            style="width: 300px; height: 130px; overflow: hidden;">
                        </div>

                    </div>
                </div>
                <hr>
                <button type="submit" onclick="" class="btn bg-warning-subtle">Actualizar</button>
                <button name="btn_cancel_update_project_permission" id="btn_cancel_update_project_permission" type="button"
                    class="btn bg-danger-subtle" onclick="">Cancelar</button>
            </fieldset>
        </form>
    </dialog>
    <div class="modal fade" id="delete_permit_modal" tabindex="-1" aria-labelledby="delete_permit_modal_label" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content border-0 shadow">
      <div class="modal-header bg-danger text-white">
        <h5 class="modal-title" id="delete_permit_modal_label">¿Eliminar Permiso?</h5>
        <button type="button" class="btn-close bg-light" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>
      <div class="modal-body">
        ¿Estás seguro de que deseas eliminar este permiso? Esta acción no se puede deshacer.
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button id="confirm_delete_permit_btn" type="button" class="btn btn-danger">Eliminar</button>
      </div>
    </div>
  </div>
    </div>

    <!-- Dialog to add EMP -->
    <dialog id="modal_add_project_EMP" class="container m-auto bg-light rounded shadow">
        <form id="register_EMP" method="post" action="../PHP/project_managment/project_EMP_register.php">
            <input type="hidden" id="project_id_emp" name="project_id_emp" value="<?php echo htmlspecialchars($data["PROJECT_ID"]); ?>">
            <fieldset class="border p-2 bg-light border-0">
                <h3 class="titulo">Nuevo Plan de Manejo Ambiental</h3>
                <hr>
                <div class="row">
                    <div class="col-12">
                        <div class="row px-4">
                            <div class="col-3 px-2">
                                <label class="mb-0">Nombre del Plan: *</label>
                                <input name="project_emp_name" type="text" class="form-control mb-3 shadow">
                            </div>
                            <div class="col-9 px-2">
                                <label>Descripción: *</label>
                                <input name="project_emp_description" type="text"
                                    class="form-control mb-3 shadow">
                            </div>
                        </div>
                    </div>
                </div>
                <hr>
                <button type="submit" onclick="" class="btn bg-success-subtle">Guardar</button>
                <button name="btn_cancel_add_project_EMP" id="btn_cancel_add_project_EMP" type="button"
                    class="btn bg-danger-subtle" onclick="">Cancelar</button>
            </fieldset>
        </form>
    </dialog>

    <!-- Dialog to update EMP -->
    <dialog id="modal_update_project_EMP" class="container m-auto bg-light rounded shadow">
        <form id="update_emp_form" method="post" action="../PHP/project_managment/project_emp_update.php">
            <input type="hidden" id="update_project_id_emp" name="update_project_id_emp" value="<?php echo htmlspecialchars($data["PROJECT_ID"]); ?>">
            <input type="hidden" id="update_emp_id" name="update_emp_id" value=".">

            <fieldset class="border p-2 bg-light border-0">
                <h3 class="titulo">Editar Plan de Manejo Ambiental</h3>
                <hr>
                <div class="row">
                    <div class="col-12">
                        <div class="row px-4">
                            <div class="col-3 px-2">
                                <label class="mb-0">Nombre del Plan: *</label>
                                <input id="update_project_emp_name" name="update_project_emp_name" type="text" class="form-control mb-3 shadow">
                            </div>
                            <div class="col-9 px-2">
                                <label>Descripción: *</label>
                                <input id="update_project_emp_description" name="update_project_emp_description" type="text"
                                    class="form-control mb-3 shadow">
                            </div>
                        </div>
                    </div>
                </div>
                <hr>
                <button type="submit" class="btn bg-warning-subtle">Actualizar</button>
                <button type="button" class="btn bg-danger-subtle" id="btn_cancel_update_project_EMP">Cancelar</button>
            </fieldset>
        </form>
    </dialog>
    <div class="modal fade" id="delete_emp_modal" tabindex="-1" aria-labelledby="delete_emp_modal_label" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content border-0 shadow">
      <div class="modal-header bg-danger text-white">
        <h5 class="modal-title" id="delete_emp_modal_label">¿Eliminar Plan de Manejo Ambiental?</h5>
        <button type="button" class="btn-close bg-light" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>
      <div class="modal-body">
        ¿Estás seguro de que deseas eliminar este EMP? Esta acción no se puede deshacer.
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button id="confirm_delete_emp_btn" type="button" class="btn btn-danger">Eliminar</button>
      </div>
    </div>
  </div>
</div>


    <!-- Dialog to add new monitoring -->
    <dialog id="modal_add_project_monitoring" class="container m-auto bg-light rounded shadow">
        <form id="register_monitoring" method="post" action="../PHP/project_managment/project_monitoring_register.php" enctype="multipart/form-data">
            <fieldset class="border p-2 bg-light border-0">
                <h3 class="title">Nuevo Monitoreo</h3>
                <input type="hidden" id="project_id_monitoring" name="project_id_monitoring" value="<?php echo htmlspecialchars($data["PROJECT_ID"]); ?>">
                <input type="hidden" id="project_folder_monitoring" name="project_folder_monitoring" value="<?php echo htmlspecialchars($project_folder_name); ?>">
                <hr>
                <div class="row">
                    <div class="col-8">
                        <div class="row px-4">
                            <div class="col-3 px-2">
                                <label class="mb-0">Nombre del Monitoreo: *</label>
                                <input name="project_monitoring_name" type="text" class="form-control mb-3 shadow">
                            </div>
                            <div class="col-9 px-2">
                                <label>Descripción: *</label>
                                <input name="project_monitoring_description" type="text"
                                    class="form-control mb-3 shadow">
                            </div>
                        </div>
                        <div class="row px-4">
                            <div class="col-12 px-2">
                                <label>Observación: *</label>
                                <input name="project_monitoring_observation" type="text"
                                    class="form-control mb-3 shadow">
                            </div>
                        </div>
                        <div class="row px-4">
                            <div class="col-12">
                                <label>Adjuntar Imagen: *</label>
                                <input name="project_monitoring_image" id="project_monitoring_image" type="file"
                                    class="form-control mb-3 shadow">
                            </div>
                        </div>
                        <div class="row px-4">
                            <div class="col-12">
                                <label>Adjuntar Archivo: *</label>
                                <input name="project_monitoring_file" id="project_monitoring_file" type="file"
                                    class="form-control mb-3 shadow">
                            </div>
                        </div>
                    </div>
                    <div class="col-4 text-center">
                        <label class="text-center">Imagen seleccionada</label>
                        <div id="image_preview"
                            class=" m-auto bg-black d-flex justify-content-center align-items-center shadow"
                            style="width: 360px; height: 220px; overflow: hidden;">
                        </div>
                    </div>
                </div>
                <hr>
                <button type="submit" onclick="" class="btn bg-success-subtle">Guardar</button>
                <button name="btn_cancel_add_project_monitoring" id="btn_cancel_add_project_monitoring" type="button"
                    class="btn bg-danger-subtle" onclick="">Cancelar</button>
            </fieldset>
        </form>
    </dialog>

    <!-- Dialog to update monitoring -->
    <dialog id="modal_update_project_monitoring" class="container m-auto bg-light rounded shadow">
        <form id="update_monitoring" method="post" action="../PHP/project_managment/project_monitoring_update.php" enctype="multipart/form-data">
            <fieldset class="border p-2 bg-light border-0">
                <h3 class="title">Editar Monitoreo</h3>
                <input type="hidden" id="update_project_id_monitoring" name="update_project_id_monitoring" value="<?php echo htmlspecialchars($data["PROJECT_ID"]); ?>">
                <input type="hidden" id="update_project_folder_monitoring" name="update_project_folder_monitoring" value="<?php echo htmlspecialchars($project_folder_name); ?>">
                <input type="hidden" id="update_monitoring_id" name="update_monitoring_id">
                <hr>
                <div class="row">
                    <div class="col-8">
                        <div class="row px-4">
                            <div class="col-3 px-2">
                                <label class="mb-0">Nombre del Monitoreo: *</label>
                                <input id="update_project_monitoring_name" name="update_project_monitoring_name" type="text" class="form-control mb-3 shadow">
                            </div>
                            <div class="col-9 px-2">
                                <label>Descripción: *</label>
                                <input id="update_project_monitoring_description" name="update_project_monitoring_description" type="text"
                                    class="form-control mb-3 shadow">
                            </div>
                        </div>
                        <div class="row px-4">
                            <div class="col-12 px-2">
                                <label>Observación: *</label>
                                <input id="update_project_monitoring_observation" name="update_project_monitoring_observation" type="text"
                                    class="form-control mb-3 shadow">
                            </div>
                        </div>
                        <div class="row px-4">
                            <div class="col-12">
                                <label>Actualizar Imagen (opcional):</label>
                                <input name="update_project_monitoring_image" id="update_project_monitoring_image" type="file"
                                    class="form-control mb-3 shadow" onchange="load_preview_file('update_project_monitoring_image','update_monitoring_image_preview')">
                            </div>
                        </div>
                        <div class="row px-4">
                            <div class="col-12">
                                <label>Actualizar Archivo (opcional):</label>
                                <input name="update_project_monitoring_file" id="update_project_monitoring_file" type="file"
                                    class="form-control mb-3 shadow">
                            </div>
                        </div>
                    </div>
                    <div class="col-4 text-center">
                        <label class="text-center">Imagen actual</label>
                        <div id="update_monitoring_image_preview"
                            class="m-auto bg-black d-flex justify-content-center align-items-center shadow"
                            style="width: 360px; height: 220px; overflow: hidden;">
                        </div>
                    </div>
                </div>
                <hr>
                <button type="submit" class="btn bg-warning-subtle">Actualizar</button>
                <button type="button" class="btn bg-danger-subtle" onclick="document.getElementById('modal_update_project_monitoring').close();">Cancelar</button>
            </fieldset>
        </form>
    </dialog>
    <div class="modal fade" id="delete_monitoring_modal" tabindex="-1" aria-labelledby="delete_monitoring_modal_label" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content border-0 shadow">
      <div class="modal-header bg-danger text-white">
        <h5 class="modal-title" id="delete_monitoring_modal_label">¿Eliminar Monitoreo?</h5>
        <button type="button" class="btn-close bg-light" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>
      <div class="modal-body">
        ¿Estás seguro de que deseas eliminar este monitoreo? Esta acción no se puede deshacer.
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button id="confirm_delete_monitoring_btn" type="button" class="btn btn-danger">Eliminar</button>
      </div>
    </div>
  </div>
</div>


    <div id="container" class="container mt-4">
        <div class="text-center">
            <h1 class="title text-light"><?php echo htmlspecialchars($data["PROJECT_NAME"]); ?></h1>
        </div>
        <fieldset class="border p-4 shadow agregar bg-light rounded">
            <a href="project_managment.html"><button class="btn bg-danger-subtle border-1 border-black"><i class="bi bi-arrow-90deg-left"></i> Regresar</button></a>
            <hr>
            <div class="row">
                <div class="col-sm-12 col-md-5">
                    <p>Fecha de Inicio: <?php echo htmlspecialchars($data["PROJECT_STARTDATE"]); ?></p>
                    <hr>
                    <p>Estado: <i class="bi bi-bar-chart-fill"></i> <i style="color:green"><?php echo htmlspecialchars($data["PROJECT_STATE"]); ?></i></p>
                    <hr>
                    <p>Ubicación: <?php echo htmlspecialchars($data["PROJECT_LOCATION"]); ?></p>
                    <hr>
                    <p>Descripción: <?php echo htmlspecialchars($data["PROJECT_DESCRIPTION"]); ?></p>
                </div>
                <div class="image_container col-md-7 border-black border-1">
                    <img
                        id="thumbnail_image"
                        src="../PROJECTS/<?php echo preg_replace('/[^A-Za-z0-9\-]/', '_', $data["PROJECT_NAME"]); ?>/imagen_proyecto/<?php echo htmlspecialchars($data["PROJECT_IMAGE"]); ?>"
                        width="100%"
                        style="cursor: pointer;"
                        alt="Imagen Proyecto">
                </div>

                <!-- Modal para imagen grande -->
                <div id="image_modal" style="display:none;">
                    <div class="modal_overlay"></div>
                    <div class="modal_content">
                        <button id="modal_close_btn" aria-label="Cerrar imagen">&times;</button>
                        <img id="modal_image" src="" alt="Imagen ampliada">
                    </div>
                </div>

            </div>
            <hr>
            <div class="d-flex">
                <div class="col">
                    <h3 class="title inter-title">Permisos</h3>
                </div>
                <div class="col text-end"><button id="add_permission" class="btn_add btn bg-info-subtle border-black"
                        onclick=""><i class="bi bi-plus-circle"></i> Agregar Permiso</button></div>
            </div>
            <hr>
            <div id="project_permission_content_div" class="d-flex pt-4 pb-4">
                <div class="col-12 text-center my-1 py-1">
                    <h1><i class="bi bi-stars"></i></h1>
                    <h1><i class="bi bi-shield-exclamation"></i> Aun no hay permisos aquí</h1>
                </div>
            </div>
            <hr>
            <div class="d-flex">
                <div class="col">
                    <h3 class="title inter-title">Plan De Manejo Ambiental</h3>
                </div>
                <div class="col text-end"><button id="add_emp" class="btn_add btn bg-info-subtle border-black"
                        onclick=""><i class="bi bi-plus-circle"></i> Agregar Plan</button>
                </div>

            </div>
            <hr>
            <div id="project_emp_content_div" class="d-flex pt-4 pb-4">

                <div class="col-12 text-center my-1 py-1">
                    <h1><i class="bi bi-stars"></i></h1>
                    <h1><i class="bi bi-bar-chart-steps"></i> Aun no hay planes de manejo aquí</h1>
                </div>

            </div>
            <hr>
            <div class="d-flex">
                <div class="col">
                    <h3 class="title inter-title">Monitoreos</h3>
                </div>
                <div class="col text-end"><button id="add_monitoring" class="btn_add btn bg-info-subtle border-black"
                        onclick=""><i class="bi bi-plus-circle"></i> Agregar Monitoreo</button>
                </div>
            </div>
            <hr>
            <div id="project_monitoring_content_div" class="d-flex pt-4 pb-4">
                <div class="col-12 text-center my-1 py-1">
                    <h1><i class="bi bi-stars"></i></h1>
                    <h1><i class="bi bi-camera2"></i> Aun no hay monitoreos aquí</h1>
                </div>

            </div>
            <hr>
            <div class="d-flex">
                <div class="col">
                    <h3 class="title inter-title">Recordatorios</h3>
                </div>
                <div class="col text-end"><button id="addProject" class="btn_add btn bg-info-subtle border-black"
                        onclick=""><i class="bi bi-plus-circle"></i> Agregar Recordatorio</button>
                </div>
            </div>
            <hr>

            <br>
            <br>
            <br>

        </fieldset>
    </div>

</body>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO"
    crossorigin="anonymous"></script>
<script src="../JS/project_page.js"></script>
<script src="../JS/menu.js"></script>

</html>