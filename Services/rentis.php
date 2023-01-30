<?php



include("connection.php");

 
class getRentis extends Connection
{
	
	function __construct()
	{
		 $this->connectionDB();
	}



	public function  loadData($name){
		// $name = $_GET['name'];
		// return $name;

		$res =[];
		$sql2="SELECT 
			json_build_object('type', 'FeatureCollection','crs',  
				json_build_object('type','name', 'properties', 
					json_build_object('name', 'EPSG:4326'  )),'features', 
				json_agg( 
					json_build_object(
						'type','Feature','id',id,'geometry',ST_AsGeoJSON(geom)::json,
	        			'properties',
	        			 json_build_object(
	        			 	'id', id,
	        			 	'segment',segment, 
	        			 	'cycle',cycle,
	        			 	'vendor',vendor,
	        			 	 'geom',geom, 
	        			 	 	'lenght',lenght
			))))
			 as geojson FROM (
			 	select id, segment, vendor, geom, (select st_length(st_transform(geom,32650))/1000 from sabah_transmission where name = rentis.segment) as lenght,(SELECT distinct max(cycle::integer) from rentis where segment = '$name') as cycle  from rentis where segment = '$name') as tbl1 limit 1";
			$fname = explode(" -",$name);
	 		
				$sql1 = "with foo as (select max(cycle::integer) as cl,max(id) as id from rentis where segment ='$name')
							select st_length(st_transform(st_makeline(a.geom,b.geom),32650))/1000 covered_distance  from pmu_sabah a,
							(select g.* from rentis g,foo where segment ='$name' and cycle::integer=foo.cl and g.id=foo.id) b	where a.name ilike '%$fname[0]%'";

				try{
				$result = 	pg_query( $sql1);
				$res2    =  pg_fetch_all($result);
				$res['complete'] = $res2[0]['covered_distance'];


				$result2 = pg_query($sql2);
				$res['data'] = pg_fetch_all($result2);
				
				}catch(Exception $e){
					$res = "failed";
				}



		$this->closeConnection();
		return  json_encode($res);

		
	}

	public function getAllRentis()
	{

		$sql2="SELECT json_build_object('type', 'FeatureCollection','crs',  json_build_object('type','name', 'properties', json_build_object('name', 'EPSG:4326'  )),'features', json_agg(json_build_object('type','Feature','id',id,'geometry',ST_AsGeoJSON(geom)::json,
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
				(select st_length(st_transform(geom,32650))/1000 from sabah_transmission where name = rentis.segment) as  lenght  from rentis) as tbl1 ";


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
if (isset($_GET['name'])) {
	 $name = $_GET['name'];
	 // 
	echo $json->loadData($name);
}else{
	echo $json->getAllRentis();

}

?>