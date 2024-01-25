<?php
// SearchContact.php - Created by Griffin on 01/24/24
    $inData = getRequestInfo();

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("SELECT ID,First,Last,Phone,Email WHERE ID=? AND (
            First=? OR Last=? OR Phone=? OR Email=?)");
		$searchData = "%" . $inData["search"] . "%";
		$stmt->bind_param("sssss", $inData["userId"], $searchData, $searchData, $searchData, $searchData);
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
?>