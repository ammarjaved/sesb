<?php



include("connection.php");

 
class Cycle extends Connection
{
	
	function __construct()
	{
		 $this->connectionDB();
	}



	public function  loadData(){

		$name = $_GET['name'];
		// return $name;

		$res =[];
		$sql2="select distinct cycle from rentis where segment = '$name'";

		$sql3 = "SELECT json_build_object('type', 'FeatureCollection','crs',  json_build_object('type','name', 'properties', json_build_object('name', 'EPSG:4326'  )),'features', json_agg(json_build_object('type','Feature','id',id,'geometry',ST_AsGeoJSON(geom)::json,
	        'properties', json_build_object(
				'id', id,
				'segment',segment, 
				'cycle',cycle,
				'vendor',vendor,
				'geom',geom,
				'lenght',lenght,
				'before_pic1',before_pic1,
				'before_pic2',before_pic2,
				'before_pic3',before_pic3,
				'after_pic1',after_pic1,
				'after_pic2',after_pic2,
				'after_pic3',after_pic3,
				'already_cleaned',already_cleaned
			)))) as geojson FROM (select id,segment,cycle , vendor, geom , before_pic1, before_pic2, before_pic3 , after_pic1,after_pic2,after_pic3,already_cleaned,
				(select st_length(st_transform(geom,32650))/1000 from sabah_transmission where name = rentis.segment) as  lenght  from rentis where segment= '$name') as tbl1 ";

	 		

				try{
				$result = 	pg_query( $sql2);
				$res['cycle']   =  pg_fetch_all($result);

				$res3 = pg_query($sql3);
				$res['rentis'] = pg_fetch_all($res3);
			




								
				}catch(Exception $e){
					$res = "failed";
				}



		$this->closeConnection();
		return  json_encode($res);

		
	}
}






$json = new Cycle();

	echo $json->loadData();

?>