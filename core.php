<?php
header('Content-Type: application/json');
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
//print_r($_POST);
//print_r(json_decode($_POST));
echo var_dump($_POST);
?>