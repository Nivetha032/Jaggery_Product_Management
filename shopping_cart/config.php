<?php
$username ="root";
$password ="";
$servername ="localhost";
$db ="rila";
$conn = new mysqli($servername,$username,$password,$db);
if($conn->connect_error)
{
    die('connection failed:'. $conn->connect_error);
} 

?>