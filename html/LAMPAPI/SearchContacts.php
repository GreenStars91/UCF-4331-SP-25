<?php
// SearchContact.php - Created by Griffin on 01/24/24
    $inData = getRequestInfo();

    if (array_key_exists('search', $inData) && array_key_exists('userID', $inData))
    {
        $search = $inData['search'];
        $userID = $inData['userID'];
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
		$stmt = $conn->prepare("SELECT ID,First,Last,Phone,Email WHERE UserID=? AND 
        (First LIKE ? OR Last LIKE ? OR Phone LIKE ? OR Email LIKE ?)");
		$searchData = "'%" . $search . "%'";
		$stmt->bind_param("sssss", $userID, $searchData, $searchData, $searchData, $searchData);
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

            $resultValue .= '{"id":' . $contact['ID'] 
                . '"firstName":"'. $contact['First'] .'",' 
                . '"lastName":"'. $contact['Last']. '",'
                . '"Phone":"' .$contact['Phone']. '",' 
                . '"Email":"'. $contact['Email'].'}';
            
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