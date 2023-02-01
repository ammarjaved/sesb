<?php

include("connection.php");

/**
 * 
 */
class PmuId extends Connection
{
	
	function __construct()
	{
		$this->connectionDB();
	}

	public function getResult()
	{
		$name 	=  $_REQUEST['name'];
		$query 	=  "select st_x(geom) as x,st_y(geom) as y from pmu_sabah where name = '$name'";
		$result =  pg_query($query);
		$res 	=  pg_fetch_all($result);

		$this->closeConnection();

		return json_encode($res);

	}
}

$json = new PmuId();
echo $json->getResult();

?>