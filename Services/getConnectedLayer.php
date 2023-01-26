<?php

// $id = $_GET['id'];

include("connection.php");

 
class getConnectedLayer extends Connection
{
	
	function __construct()
	{
		 $this->connectionDB();
	}

	public function  loadData(){
		$sql2="with foo as (select b.id ,b.geom from pmu as a , connectivity as b where st_intersects(a.geom,b.geom) and a.id =1)
		SELECT json_build_object('type', 'FeatureCollection','crs',  json_build_object('type','name', 'properties', json_build_object('name', 'EPSG:4326'  )),'features', json_agg(json_build_object('type','Feature','id',id,'geometry',ST_AsGeoJSON(geom)::json,
		        'properties', json_build_object(
				'id', id
        )))) as geojson
        FROM (select id,geom from foo
			) as tbl1";

		$result = 	pg_query( $sql2);
		$res = pg_fetch_all($result);

		return  json_encode($res);

		$this->closeConnection();
	}

	
	}



	$json = new getConnectedLayer();
echo $json->loadData();
?>