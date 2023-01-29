<?php



include("connection.php");

 
class TransmissionLine extends Connection
{
	
	function __construct()
	{
		 $this->connectionDB();
	}



	public function  loadData(){
		$id = $_GET['id'];
		

		$sql2="SELECT json_build_object('type', 'FeatureCollection','crs',  json_build_object('type','name', 'properties', json_build_object('name', 'EPSG:4326'  )),'features', json_agg(json_build_object('type','Feature','id',gid,'geometry',ST_AsGeoJSON(geom)::json,
	        'properties', json_build_object('gid', gid,'name',name	
			)))) as geojson FROM (select gid,name,geom from sabah_transmission where gid = $id) as tbl1";


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



$json = new TransmissionLine();
echo $json->loadData();
?>