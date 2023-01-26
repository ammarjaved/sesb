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

		$id = $_REQUEST['id'];

		$sql2="with foo as (select b.gid,b.name ,b.geom from pmu_sabah as a , sabah_transmission as b where st_intersects(a.geom,b.geom) and a.gid =$id)
SELECT json_build_object('type', 'FeatureCollection','crs',  json_build_object('type','name', 'properties', json_build_object('name', 'EPSG:4326'  )),'features', json_agg(json_build_object('type','Feature','id',gid,'geometry',ST_AsGeoJSON(geom)::json,
        'properties', json_build_object(
		'gid', gid,
		'name',name	

        )))) as geojson
        FROM (select gid,name,geom from foo
			) as tbl1";

			try{
		$result = 	pg_query( $sql2);
		$res = pg_fetch_all($result);
	}catch(Exception $e){
		$res = "failed";
	}

		$this->closeConnection();
		return  json_encode($res);

		
	}

	
	}



	$json = new getConnectedLayer();
echo $json->loadData();
?>