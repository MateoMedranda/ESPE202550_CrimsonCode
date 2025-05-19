<?php
include("../connection_db.php");
    $request = 'SELECT p.PROJECT_ID AS "id", p.PROJECT_NAME AS "name" , p.PROJECT_STARTDATE AS "begin_date", p.PROJECT_IMAGE AS "image" FROM project p';
    $result = mysqli_query($connection,$request);

    if($result){
        $data = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($data);
    }else {
        echo json_encode(["[ERROR]" => "There is an error in the request for project list"]);
    }
?>
