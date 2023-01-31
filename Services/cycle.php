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
	 		

				try{
				$result = 	pg_query( $sql2);
				$res   =  pg_fetch_all($result);
			




								
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