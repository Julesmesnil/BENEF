<?php
header("Access-Control-Allow-Origin: *"); 
header('content-type:application/json');      
header('Access-Control-Allow-Headers: Content-Type');  
      
$contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';

if ($contentType === "application/json") {
  //Receive the RAW post data.
  $content = trim(file_get_contents("php://input"));

  $decoded = json_decode($content, true);


//   If json_decode failed, the JSON is invalid.
//   if(is_array($decoded)) {
      $db = new PDO('mysql:host=db5005161444.hosting-data.io;dbname=dbs4318125', 'dbu1522474', 'lesoussol06092021', array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
      $req = "SELECT * FROM post";
      $stmt=$db->query($req);
      $fetch=$stmt->fetchAll(PDO::FETCH_ASSOC);
      $data = array();
          foreach($fetch as $com){         
            $temp = array();
            $temp['Titre'] = $com['title'];
            $temp['Desc'] = $com['description'];
            $temp['Adresse'] = $com['address'];
            $temp['CP'] = $com['postal'];
            $temp['Expiration'] = $com['expiration'];
            $data[] = $temp;
          }
            echo json_encode($data);

          
?>