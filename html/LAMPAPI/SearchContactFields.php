<?php
// SearchContactFields.php - Created by Griffin on 02/3/24
// Updated From SearchContats.php to better support the website
// Page Starts at 0.

    $CONTACTS_PER_PAGE = 10;
    $inData = getRequestInfo();

    // Check for all keys
    $keyarray = ["firstName", "lastName", "phone", "email", "userId", "page"];
    if (0 === count(array_diff($keyarray, array_keys($inData))))
    {
        $fName = "%" . $inData["firstName"] . "%";
        $lName = "%" . $inData["lastName"] . "%";
        $phone = "%" . $inData["phone"] . "%";
        $email = "%" . $inData["email"] . "%";
        $userID = $inData["userId"];
        $page = $inData["page"] * $CONTACTS_PER_PAGE;
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
		$stmt = $conn->prepare("SELECT ID,First,Last,Phone,Email FROM Contacts WHERE UserID=? AND 
        (First LIKE ? AND Last LIKE ? AND  Phone LIKE ? AND Email LIKE ?) LIMIT ?,?");
		$stmt->bind_param("sssssii", $userID, $fName, $lName, $phone, $email, $page, $CONTACTS_PER_PAGE);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
        if( $result->num_rows == 0 )
		{
			returnWithError( "No Records Found" );
		}
        else
		{
			returnWithInfo( $result->fetch_all(MYSQLI_ASSOC));
		}

		$stmt->close();
		$conn->close();
	}


    function returnWithInfo($outData)
    {
        $resultValue = '';
        $first = 1;
        foreach($outData as $contact)
        {
            if ($first != 1)
            {
                $resultValue .= ",";
            }
            else
            {
                $first = 0;
            }

            $resultValue .= '{"id":' . $contact['ID'] .','
                . '"firstName":"'. $contact['First'] .'",' 
                . '"lastName":"'. $contact['Last']. '",'
                . '"Phone":"' .$contact['Phone']. '",' 
                . '"Email":"'. $contact['Email'].'"}';
            
        }
        $retval = '{"results":[' . $resultValue . '],"error":""}';
        header('Content-type: application/json');
        echo $retval;
    }
    function returnWithError($err)
    {
        $retval = '{"results":[],"error":"' . $err . '"}';
        header('Content-type: application/json');
        echo $retval;
    }
    function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}
?>
