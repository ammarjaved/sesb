<?php

include("connection.php");

/**
 * 
 */
class Login extends Connection
{
	
	function __construct()
	{
		$this->connectionDB();
	}



	public function loginUser()
	{
		$arr = [] ;
		$name = "";
		if (isset($_REQUEST['name'])) {
		 	$name = $_REQUEST['name'];
		}

		$password = "";
		if (isset($_REQUEST['password'])) {
		 	$password = $_REQUEST['password'];
		}

		$c_pass = sha1($password);



		if ($name != "" && $password != "") {
			
			$sql1 = "SELECT * FROM users WHERE name = '$name' and password = '$c_pass'";
			$result =  pg_query($sql1);
			$res 	=  pg_fetch_all($result);
			if ($res) {
				$arr['status'] 	= "200";
				$arr['message']	= "success";
			}
			else{
					$arr['status'] 	= "404";
					$arr['message']	= "failed";
			}

		}else{

			$arr['status'] 	= "failed";
			$arr['message']	= "all feilds are required";
		}

		$this->closeConnection();

		return json_encode($arr);
	}
}


$json = new Login();
echo $json->loginUser();


?>
