<?php



include("connection.php");

 
class getRentis extends Connection
{
	
	function __construct()
	{
		 $this->connectionDB();
	}



	public function  loadData(){
		$name = $_GET['name'];
		

		$sql2="SELECT json_build_object('type', 'FeatureCollection','crs',  json_build_object('type','name', 'properties', json_build_object('name', 'EPSG:4326'  )),'features', json_agg(json_build_object('type','Feature','id',id,'geometry',ST_AsGeoJSON(geom)::json,
	        'properties', json_build_object(
				'id', id,
				'segment',segment, 
				'cycle',cycle,
				'vendor',vendor,
				'geom',geom,
				'before_pic1',before_pic1,
				'before_pic2',before_pic2,
				'before_pic3',before_pic3,
				'after_pic1',after_pic1,
				'after_pic2',after_pic2,
				'after_pic3',after_pic3,
				'already_cleaned',already_cleaned
			)))) as geojson FROM (select id,segment,cycle , vendor, geom , before_pic1, before_pic2, before_pic3 , after_pic1,after_pic2,after_pic3,already_cleaned from rentis where segment = '$name') as tbl1 limit 1";


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



$json = new getRentis();
echo $json->loadData();
?>