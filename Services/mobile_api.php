<?php

include("connection.php");

/**
 * 
 */
class MobileApi extends Connection
{
	
	function __construct()
	{
		$this->connectionDB();
	}

	public function getResult(){
		$arr = [];
		
		$query = $_REQUEST['query'] ;
		$type = $_REQUEST['type'];

		try{

			$result = pg_query($query);

			$arr['status'] = "success";

			if ($type == "select") {
				$res = pg_fetch_all($result);
				$arr['data']= $res;
			}else{
				$arr['data']= "uploaded successfully";
			}
			
				
		}catch(Exception $e){

			$arr['status'] = "failed";
			$arr['data']= "";
		}

		$this->closeConnection();

	return json_encode($arr);
	
	}


}

$json = new MobileApi();

echo $json->getResult();




?>