<?php
require 'connection_db.php';
$input = json_decode(file_get_contents("php://input"), true);
$project_id = $input['id_project'] ?? null;
$project_id = mysqli_real_escape_string($connection, $project_id);

$query_reminders = "SELECT DISTINCT r.REMINDER_ID, r.REMINDER_REGISTERDATE, r.REMINDER_TOREMEMBERDATE, r.REMINDER_CONTENT, 
                    r.REMINDER_STATE, r.REMINDER_TITLE,r.PROJECT_ID FROM reminder r 
                    WHERE r.PROJECT_ID = '$project_id' AND REMINDER_STATE = 'ACTIVE' 
                    AND r.REMINDER_TOREMEMBERDATE >= CURDATE() 
                    ORDER BY r.REMINDER_REGISTERDATE DESC";

$reminders = mysqli_query($connection, $query_reminders);
$reminders_array = [];
$group = [];
$counter = 0;

while ($register = mysqli_fetch_assoc($reminders)) {
    $group[] = [
        'REMINDER_ID' => $register['REMINDER_ID'],
        'PROJECT_ID' => $register['PROJECT_ID'],
        'REMINDER_REGISTERDATE' => $register['REMINDER_REGISTERDATE'],
        'REMINDER_TOREMEMBERDATE' => $register['REMINDER_TOREMEMBERDATE'],
        'REMINDER_CONTENT' => $register['REMINDER_CONTENT'],
        'REMINDER_STATE' => $register['REMINDER_STATE'],
        'REMINDER_TITLE' => $register['REMINDER_TITLE'],
    ];

    $counter++;
    if ($counter == 3) {
        $reminders_array[] = $group;
        $counter = 0;
        $group = [];
    }
}
if (count($group) > 0) {
    $reminders_array[] = $group;
}
echo json_encode($reminders_array);
mysqli_close($connection);
?>