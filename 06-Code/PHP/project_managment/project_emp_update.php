<?php
include("../connection_db.php");

$project_id = $_POST["update_project_id_emp"];
$emp_id = $_POST["update_emp_id"];
$name = $_POST["update_project_emp_name"];
$description = $_POST["update_project_emp_description"];

if (!$emp_id || !$project_id) {
    die("ID del Plan o del Proyecto faltante.");
}

$verify_query = "
    SELECT a.AMBIENTALPLAN_ID
    FROM ambientalplan a
    INNER JOIN project p ON a.PROJECT_ID = p.PROJECT_ID
    WHERE a.AMBIENTALPLAN_ID = ? AND a.PROJECT_ID = ?
";
$verify_stmt = $connection->prepare($verify_query);
$verify_stmt->bind_param("ii", $emp_id, $project_id);
$verify_stmt->execute();
$verify_result = $verify_stmt->get_result();

if ($verify_result->num_rows === 0) {
    die("El plan no existe o no pertenece al proyecto.");
}
$verify_stmt->close();

$update_query = "
    UPDATE ambientalplan 
    SET AMBIENTALPLAN_NAME = ?, AMBIENTALPLAN_DESCRIPTION = ? 
    WHERE AMBIENTALPLAN_ID = ?
";
$stmt = $connection->prepare($update_query);
$stmt->bind_param("ssi", $name, $description, $emp_id);

if ($stmt->execute()) {
    header("Location: ../../HTML/project_page.php?project_id=" . $project_id);
    exit();
} else {
    die("Error al actualizar: " . $stmt->error);
}

$stmt->close();
?>
