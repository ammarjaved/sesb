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

		$before_pic1 = rand().$_FILES["before_pic1"]["name"];
	    $before1 = $_FILES["before_pic1"]["tmp_name"];
	    

	    $before_pic2 = rand().$_FILES["before_pic2"]["name"];
	    $before2 = $_FILES["before_pic2"]["tmp_name"];

	    $before_pic3 = rand().$_FILES["before_pic3"]["name"];
	    $before3 = $_FILES["before_pic3"]["tmp_name"];

	    $after_pic1 = rand().rand().$_FILES["after_pic1"]["name"];
	    $after1 = $_FILES["after_pic1"]["tmp_name"];

	    $after_pic2 =rand().$_FILES["after_pic2"]["name"];
	    $after2 = $_FILES["after_pic2"]["tmp_name"];

	    $after_pic3 = rand().$_FILES["after_pic3"]["name"];
	    $after3 = $_FILES["after_pic3"]["tmp_name"];


	   
		
		move_uploaded_file($before1, $destination.$before_pic1);
		move_uploaded_file($before2, $destination.$before_pic2);
		move_uploaded_file($before3, $destination.$before_pic3);
		move_uploaded_file($after1, $destination.$after_pic1);
		move_uploaded_file($after2, $destination.$after_pic2);
		move_uploaded_file($after3, $destination.$after_pic3);
		$segment = $_REQUEST['segment'];
		$cycle = $_REQUEST['cycle'];
		$vendor = $_REQUEST['vendor'];
		$lat = $_REQUEST['lat'];
		$lon = $_REQUEST['lon'];
		$cleaned = $_REQUEST['already_cleaned'];

		$query = "INSERT INTO rentis (before_pic1, before_pic2, before_pic3, after_pic1, after_pic2, after_pic3, segment, cycle, vendor,already_cleaned,geom) VALUES('$web_des.$before_pic1', '$web_des.$before_pic2', '$web_des.$before_pic3','$web_des.$after_pic1','$web_des.$after_pic2','$web_des.$after_pic3','$segment', '$cycle','$vendor','$cleaned',st_geomfromtext('POINT('||$lon||' '||$lat||')',4326))";

		try{
		pg_query($query);
		$arr['status'] = "success";
		$arr['message']= "uploaded successfully";

	}catch(Exception $e){
		$arr['status'] = "failed";
			$arr['message']= $e->getMessage();
		
	}

	$this->closeConnection();

	return json_encode($arr);


	}
}

$json = new Rentis();

echo $json->upload();


?>