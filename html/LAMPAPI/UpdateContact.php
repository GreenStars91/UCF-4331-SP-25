<?php
	$inData = getRequestInfo();
	
	if (array_key_exists('contactID', $inData) && array_key_exists('firstName', $inData) && array_key_exists('lastName', $inData) && array_key_exists('phone', $inData) && array_key_exists('email', $inData))
    {
        $firstName = $inData["firstName"];
		$lastName = $inData["lastName"];
		$phone = $inData["phone"];
		$email = $inData["email"];
	
		$contactID = $inData["contactID"];
    }
    else
    {
        http_response_code(400);
        returnWithError("Bad Input Formatting");
        return;
    }
	

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("UPDATE Contacts SET First=?, Last=?, Phone=?, Email=? WHERE ID=?");
		$stmt->bind_param("sssss", $firstName, $lastName, $phone, $email, $contactID);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>