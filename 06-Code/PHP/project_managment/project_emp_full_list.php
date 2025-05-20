<?php
include("../connection_db.php");
    $request = 'SELECT a.AMBIENTALPLAN_ID AS "id", a.AMBIENTALPLAN_NAME AS "name" FROM ambientalplan a INNER JOIN project o ON o.PROJECT_ID = A.PROJECT_ID';
    $result = mysqli_query($connection,$request);

    if($result){
        $data = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($data);
    }else {
        echo json_encode(["[ERROR]" => "There is an error in the request for project EMP list"]);
    }
?>
