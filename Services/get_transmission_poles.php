<?php

include("connection.php");

/**
 * 
 */
class getPoles extends Connection
{
	
	function __construct()
	{
		$this->connectionDB();
	}

	public function getResult()
	{
		$query = "SELECT * FROM transmission_poles";
		$result = pg_query($query);
		$res = pg_fetch_all($result);

		$this->closeConnection();

		return json_encode($res);

	}
}

$json = new getPoles();
echo $json->getResult();

?>