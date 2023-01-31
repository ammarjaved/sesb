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
		$query = "SELECT name FROM pmu_sabah";
		$result = pg_query($query);
		$res = pg_fetch_all($result);

		$this->closeConnection();

		return json_encode($res);

	}
}

$json = new PmuId();
echo $json->getResult();

?>