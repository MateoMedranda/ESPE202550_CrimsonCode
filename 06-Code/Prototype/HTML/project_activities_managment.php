<?php
include("../PHP/connection_db.php");

$plan_id = $_GET["plan_id"] ?? null;

if ($plan_id === null) {
    echo json_encode(["error" => "No plan ID received"]);
    exit;
}

$request = "SELECT * FROM ambientalplan WHERE AMBIENTALPLAN_ID = $plan_id LIMIT 1";
$result = mysqli_query($connection, $request);

if ($result) {
    $data = $result->fetch_assoc();
} else {
    echo json_encode(["error" => "There is an error in the request for plan"]);
}

?>


<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="../CSS/project_activities_managment.css" rel="stylesheet">
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

    <title>SIMA | <?php echo htmlspecialchars($data["AMBIENTALPLAN_NAME"]); ?></title>

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

    <div class="navbar navbar-expand-lg navbar-light sticky-top shadow menu">
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
                    <li class="nav-item dropdown fw-bold mx-2">
                        <a class="nav-link dropdown-toggle" href="#" id="usersDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-people-fill"></i> USUARIOS
                        </a>
                        <ul class="dropdown-menu sub_menu subNav-menu" aria-labelledby="usersDropdown">
                            <li><a class="dropdown-item" href="project_User_Management.html" onclick="">
                                    <i class="bi bi-person-lines-fill"></i> Lista de usuarios</a></li>

                            <li><a class="dropdown-item" href="project_Profiles_Management.html" onclick="">
                                    <i class="bi bi-person-check-fill"></i> Gestionar Roles</a></li>
                        </ul>
                    </li>

                </ul>
            </div>
        </div>
    </div>

   <!-- Dialog to add new environmental activity -->
<dialog id="modal_add_environmental_activity" class="container m-auto bg-light rounded shadow">
    <form id="register_environmental_activity" method="post">
        <!-- Hidden inputs for plan and project IDs -->
        <input type="hidden" name="environmental_plan_id" id="environmental_plan_id">

        <fieldset class="border p-2 bg-light border-0">
            <h3 class="title">Nueva Actividad Ambiental</h3>
            <hr>
            <div class="row px-4">
                <!-- Primera fila: Código, Frecuencia, Responsable -->
                <div class="col-md-3 mb-3">
                    <label class="mb-1">Código: *</label>
                    <input name="activity_code" type="text" class="form-control shadow" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="mb-1">Frecuencia: *</label>
                    <select name="frequency" class="form-control form-select shadow" required>
                        <option value="">Seleccione</option>
                        <option value="Anual">Anual</option>
                        <option value="Mensual">Mensual</option>
                        <option value="Permanente">Permanente</option>
                        <option value="No aplica">No aplica</option>
                    </select>
                </div>
                <div class="col-md-5 mb-3">
                    <label class="mb-1">Responsable:</label>
                    <input name="responsible" type="text" class="form-control shadow">
                </div>

                <!-- Segunda fila -->
                <div class="col-md-6 mb-3">
                    <label class="mb-1">Proceso / Actividad: *</label>
                    <input name="activity_process" type="text" class="form-control shadow" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="mb-1">Impacto Ambiental: *</label>
                    <input name="environmental_impact" type="text" class="form-control shadow" required>
                </div>

                <!-- Tercera fila -->
                <div class="col-12 mb-3">
                    <label class="mb-1">Medidas: *</label>
                    <input name="mitigation_measures" type="text" class="form-control shadow" required>
                </div>
            </div>
            <hr>
            <div class="text-end px-4">
                <button type="submit" class="btn bg-success-subtle">Guardar</button>
                <button type="button" id="btn_cancel_add_activity" class="btn bg-danger-subtle">Cancelar</button>
            </div>
        </fieldset>
    </form>
</dialog>



    <!-- This is the dialog for the controlls -->
    <dialog id="modal_add_control" class="container m-auto bg-light rounded shadow">
        <form id="register_control">
            <fieldset class="p-2">
                <h3 class="titulo">Nuevo Control</h3>
                <hr>
                <div class="row px-4">
                    <div class="col-12 col-md-2">
                        <div class="row">
                            <label>Criterio*</label>
                            <select class="form-control form-select">
                                <option>Cumple</option>
                                <option>No cumple</option>
                            </select>
                        </div>

                    </div>
                    <div class="col-12 col-md-5">
                        <div class="row px-2">
                            <label>Observación*</label>
                            <input type="text" class="form-control mb-3">
                        </div>
                    </div>
                    <div class="col-12 col-md-5">
                        <div class="row px-2">
                            <label>Evidencia*</label>
                            <input type="file" class="form-control mb-3">
                        </div>
                    </div>
                </div>
               <hr>
               <button type="button" class="btn bg-success-subtle" onclick="">Guardar</button>
               <button type="button" id="btn_cancel_add_controll" class="btn bg-danger-subtle">Cancelar</button>
            </fieldset>
        </form>

        <hr>
        <h3 class="text-center">Seguimiento de cumplimiento</h3>
        <hr>
        <div class=" px-3 activities_control_container rounded letter_quicksand">
            <br>
            <div class="table-responsive">
                <table class="table table-striped table-bordered align-middle text-center">
                    <thead class="table-light">
                        <tr>
                            <th>Fecha de Control</th>
                            <th>Cumplimiento</th>
                            <th>Observación</th>
                            <th>Evidencias</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody id="tablaEgresos">
                        <!-- Dinamic Files Here -->
                    </tbody>
                </table>
            </div>
        </div>
    </dialog>

    <!-- Begin of the content about activities -->

    <div id="container" class="container mt-4">
        <div class="d-flex">
            <div class="col">
                <h2 style="color:white"><?php echo htmlspecialchars($data["AMBIENTALPLAN_NAME"]); ?></h2>

            </div>
            <div class="col text-end"><button id="addProject" class="btn_add_project btn bg-info-subtle border-black"
                    onclick="open_add_activities()"><i class="bi bi-plus-circle"></i> Agregar Actividad</button></div>
        </div>

        <fieldset class="project_activities_container rounded shadow p-2">
            <hr>
            <div class="m-0 d-flex div_filter_activities">
                <div class="col-sm-12 col-md-2 mx-2">
                    <label>Frecuencia: </label>
                    <select class="form-control mb-3 form-select" onchange="">
                        <option value="1">Mostrar Todo</option>
                        <option value="2">Permantente</option>
                        <option value="3">Anual</option>
                        <option value="3">Mensual</option>
                    </select>
                </div>
                <div class="col-sm-12 col-md-2 mx-2">
                    <label>Ordenar Por: </label>
                    <select id="ordenar" class="form-control mb-3 form-select">
                        <option value="1">Código</option>
                        <option value="2">Fecha: más reciente primero</option>
                        <option value="3">Fecha: más antigua primero</option>
                    </select>

                </div>

                <div class="col-sm-12 col-md-2 mx-2">
                    <label>Buscar:</label>
                    <div class="d-flex align-items-center"><input type="text" class="form-control"
                            placeholder="Escribe aquí"><i class="bi bi-search ms-2"></i> </div>
                </div>
            </div>
            <hr>
            <div class="table-responsive">
                <table class="table text-center table-striped rounded">
                    <thead>
                        <tr>
                            <th scope="col">Código</th>
                            <th scope="col">Proceso / Actividad</th>
                            <th scope="col">Impacto Ambiental</th>
                            <th scope="col">Medidas</th>
                            <th scope="col">Frecuencia</th>
                            <th scope="col">Actualización</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody id="table-body">
                        <tr class="align-middle">
                            <td>P1C1</td>
                            <td>Construcción de tomas, desarenadores, etc.</td>
                            <td>Degradación ambiental por desconocimiento</td>
                            <td>Mantener durante la construcción del proyecto el cumplimiento del PMA</td>
                            <td>Permanente</td>
                            <td>19-05-2025</td>
                            <td>
                                <div class="d-flex">
                                    <button class="d-flex align-items-center btn bg-success-subtle btn-sm mx-2"
                                        onClick="open_activities_control()"><i
                                            class="bi bi-clipboard-check-fill me-2"></i> Controles</button>
                                    <i class="bi bi-pencil-square icono-boton mx-2"
                                        style="color:blue; font-size: 25px; cursor:pointer;" title="Editar"
                                        onclick=""></i>
                                    <i class="bi bi-x-circle icono-boton mx-2"
                                        style="color:red; font-size: 25px; cursor:pointer;" title="Anular"
                                        onclick=""></i>

                                </div>
                            </td>
                        </tr>
                        </td>
                        </tr>
                    </tbody>
                </table>
                <hr>
                <div class="d-flex">
                    <nav>
                        <ul class="pagination shadow" id="pagination"></ul>
                    </nav>
                    <div class="mb-3 col-1 mx-3">
                        <select id="itemsPerPage" class="form-select shadow" onchange="">
                            <option value="5" selected>5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                        </select>
                    </div>
                </div>

            </div>
        </fieldset>

    </div>


</body>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO"
    crossorigin="anonymous"></script>
<script src="../JS/project_activities_managment.js"></script>
<script src="../JS/menu.js"></script>
</html>