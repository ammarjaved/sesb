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
		$key = $_REQUEST['key'];
		$query  = "SELECT name FROM pmu_sabah where name ilike '%{$key}%' limit 10";
		$result = pg_query($query);
		$res    = pg_fetch_all($result);

		$items  = array();

		while(($row  = pg_fetch_assoc($result))) {
		    $items[] = $row['name'];
		}

		$this->closeConnection();
		return json_encode($items);

	}
}

$json = new PmuId();
echo $json->getResult();

?>