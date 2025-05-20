<?php
include("../connection_db.php");
    $request = 'SELECT p.PERMIT_ID AS "id", p.PERMIT_NAME AS "name" FROM permit p INNER JOIN project o ON o.PROJECT_ID = p.PROJECT_ID';
    $result = mysqli_query($connection,$request);

    if($result){
        $data = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($data);
    }else {
        echo json_encode(["[ERROR]" => "There is an error in the request for project permission list"]);
    }
?>
