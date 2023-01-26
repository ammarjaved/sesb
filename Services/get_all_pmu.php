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
		$query = "SELECT json_build_object('type', 'FeatureCollection','crs',  json_build_object('type','name', 'properties', json_build_object('name', 'EPSG:4326'  )),'features', json_agg(json_build_object('type','Feature','id',id,'geometry',ST_AsGeoJSON(geom)::json,
        'properties', json_build_object(
  'gid', gid,
        'id',id,
        'name',name    
        )))) as geojson
        FROM (select * from pmu	) as tbl1; ";
        
		$result = pg_query($query);
		$res = pg_fetch_all($result);

		$this->closeConnection();

		return json_encode($res);

	}
}

$json = new getPMU();
echo $json->getResult();

?>