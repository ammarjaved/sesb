<?php

include("connection.php");

/**
 * 
 */
class getPMU extends Connection
{
	
	function __construct()
	{
		$this->connectionDB();
	}

	public function getResult()
	{
		$query = "SELECT * FROM pmu";
		$result = pg_query($query);
		$res = pg_fetch_all($result);

		$this->closeConnection();

		return json_encode($res);

	}
}

$json = new getPMU();
echo $json->getResult();

?>