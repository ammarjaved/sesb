<?php

include("connection.php");

/**
 * 
 */
class Rentis extends Connection
{
	
	function __construct()
	{
		$this->connectionDB();
	}


	public function upload()
	{
		$arr = [];

		$destination = "../assets/Images/";
		$web_des = "http://121.121.232.54:88/sesb/assets/Images/";

		

		if (isset($_FILES['before_pic1'])) {

			$before_pic1 = 	rand().$_FILES["before_pic1"]["name"];
		    $before1 	 = 	$_FILES["before_pic1"]["tmp_name"];
		    $b_1 		 = 	$web_des.$before_pic1;

		    if(move_uploaded_file($before1, $destination.$before_pic1)){

		    }
		}else{
			$b_1 = '';
		}



		if (isset($_FILES['before_pic2'])) {

			 $before_pic2 = rand().$_FILES["before_pic2"]["name"];
		    $before2 	  = $_FILES["before_pic2"]["tmp_name"];
		    $b_2 		  = $web_des.$before_pic2;

		    if(move_uploaded_file($before2, $destination.$before_pic2)){

		    }
		}else{
			$b_2 = '';
		}


	
		if (isset($_FILES['before_pic3'])) {

			$before_pic3 = 	rand().$_FILES["before_pic3"]["name"];
		    $before3 	 = 	$_FILES["before_pic3"]["tmp_name"];
		    $b_3 		 = 	$web_des.$before_pic3; 

		    if(move_uploaded_file($before3, $destination.$before_pic3)){

		    }
		}else{
			$b_3 = '';
		}
		    


		if (isset($_FILES['after_pic1'])) {

			$after_pic1 = 	rand().$_FILES["after_pic1"]["name"];
		    $after1 	= 	$_FILES["after_pic1"]["tmp_name"];
		    $a_1 		= 	$web_des.$after_pic1; 

		    if(move_uploaded_file($after1, $destination.$after_pic1)){

		    }
		}else{
			$a_1 = '';
		}

	   

		if (isset($_FILES['after_pic2'])) {

			$after_pic2 =	rand().$_FILES["after_pic2"]["name"];
		    $after2 	= 	$_FILES["after_pic2"]["tmp_name"];
		    $a_2 		= 	$web_des.$after_pic2; 

		    if(move_uploaded_file($after2, $destination.$after_pic2)){

		    }
		}else{
			$a_2 = '';
		}


		if (isset($_FILES['after_pic3'])) {

			$after_pic3 = 	rand().$_FILES["after_pic3"]["name"];
		    $after3 	= 	$_FILES["after_pic3"]["tmp_name"];
		    $a_3 		= 	$web_des.$after_pic3;

		    if(move_uploaded_file($after3, $destination.$after_pic3)){

		    }
		}else{
			$a_3 = '';
		}
	    

	    
		$segment = 	(isset($_REQUEST['segment']))   		? 	$_REQUEST['segment'] : '' ;
		$cycle   =	(isset($_REQUEST['cycle'])) 			? 	$_REQUEST['cycle'] : '' ;
		$vendor  =	(isset($_REQUEST['vendor'])) 			? 	$_REQUEST['vendor'] : '' ;
		$lat 	 =	(isset($_REQUEST['lat'])) 				? 	$_REQUEST['lat'] : '' ;
		$lon 	 = 	(isset($_REQUEST['lon'])) 				? 	$_REQUEST['lon'] : '' ;
		$cleaned = 	(isset($_REQUEST['already_cleaned'])) 	? 	$_REQUEST['already_cleaned'] : '' ;
		$status  =  (isset($_REQUEST['status'])) 			? 	$_REQUEST['status'] : '' ;


		$query = "INSERT INTO rentis (
							before_pic1, before_pic2, before_pic3, after_pic1, after_pic2, after_pic3, segment, cycle, vendor,already_cleaned,status , geom)
							 VALUES('$b_1', '$b_2', '$b_3','$a_1','$a_2','$a_3','$segment', '$cycle','$vendor','$cleaned','$status',st_geomfromtext('POINT('||$lon||' '||$lat||')',4326))";

		try{

			pg_query($query);
			$arr['status'] 	= "success";
			$arr['message']	= "uploaded successfully";

		}catch(Exception $e){
			$arr['status'] 	= "failed";
			$arr['message']	= $e->getMessage();
			
		}

	$this->closeConnection();

	return json_encode($arr);


	}

	public function update()
	{
		
		$arr = [];

		$destination = "../assets/Images/";
		$web_des = "http://121.121.232.54:88/sesb/assets/Images/";   

		if (isset($_REQUEST['id'])) {
		 	$id = $_REQUEST['id'];
		 }else{
		 	$arr['status'] 	= "failed";
			$arr['message']	= "Id is required";

			$this->closeConnection();

			return json_encode($arr);

		 }

		if (isset($_FILES['after_pic1'])) {


			$after_pic1 = 	rand().$_FILES["after_pic1"]["name"];
		    $after1 	= 	$_FILES["after_pic1"]["tmp_name"];
		    $a_1 		= 	$web_des.$after_pic1; 

		    if(move_uploaded_file($after1, $destination.$after_pic1)){

		    }
		}else{
			$a_1 = '';
		}

	   

		if (isset($_FILES['after_pic2'])) {

			$after_pic2 =	rand().$_FILES["after_pic2"]["name"];
		    $after2 	= 	$_FILES["after_pic2"]["tmp_name"];
		    $a_2 		= 	$web_des.$after_pic2; 

		    if(move_uploaded_file($after2, $destination.$after_pic2)){

		    }
		}else{
			$a_2 = '';
		}


		if (isset($_FILES['after_pic3'])) {

			$after_pic3 = 	rand().$_FILES["after_pic3"]["name"];
		    $after3 	= 	$_FILES["after_pic3"]["tmp_name"];
		    $a_3 		= 	$web_des.$after_pic3;

		    if(move_uploaded_file($after3, $destination.$after_pic3)){

		    }
		}else{
			$a_3 = '';
		}

		$status = $_REQUEST['status'];
	    

		$query = "UPDATE rentis SET after_pic1 = '$a_1', after_pic2 = '$a_2', after_pic3 = '$a_3',$status='$status' WHERE id = $id";

		try{

			pg_query($query);
			$arr['status'] 	= "success";
			$arr['message']	= "uploaded successfully";

		}catch(Exception $e){
			$arr['status'] 	= "failed";
			$arr['message']	= $e->getMessage();
			
		}

	$this->closeConnection();

	return json_encode($arr);

	}
}

$json = new Rentis();

$type = (isset($_GET['type'])) ? $_GET['type'] : 'empty';

if ($type == "insert") {
	echo $json->upload();
}elseif ($type == "update") {
	echo $json->update();
}else{
	$arr = [];
	$arr['status'] = "failed";
	$arr['message'] = "type does not define";

	echo json_encode($arr); 
}




?>