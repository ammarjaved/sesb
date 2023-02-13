<?php

include("connection.php");

/**
 * 
 */
class Register extends Connection
{
	
	function __construct()
	{
		$this->connectionDB();
	}



	public function registerUser()
	{
		$arr = [] ;
		$name = "";
		if (isset($_REQUEST['name'])) {
		 	$name = $_REQUEST['name'];
		}

		$email = "";
		if (isset($_REQUEST['email'])) {
		 	$email = $_REQUEST['email'];
		}

		$password = "";
		if (isset($_REQUEST['password'])) {
		 	$password = $_REQUEST['password'];
		}

		$c_pass = sha1($password);



		if ($name != "" && $email != "" && $password != "") {
			
			$sql1 = "SELECT * FROM users WHERE name = '$name'";
			$result =  pg_query($sql1);
			$res 	=  pg_fetch_all($result);
			if ($res) {
				$arr['status'] 	= "failed";
				$arr['message']	= "user already exists";
			}
			else{
					$sql  = "INSERT INTO users (name, email, password) VALUES ('$name', '$email', '$c_pass')";

					try{
						pg_query($sql);
						$arr['status'] 	= "success";
						$arr['message']	= "upload recored successfully";
					}catch(Exception $e){
						$arr['status'] 	= "failed";
						$arr['message']	= "something is worng";
					}
			}

		}else{

			$arr['status'] 	= "failed";
			$arr['message']	= "all feilds are required";
		}

		$this->closeConnection();

		return json_encode($arr);
	}
}


$json = new Register();
echo $json->registerUser();


?>
