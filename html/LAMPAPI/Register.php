<?php
 // Register API
 // Input requires JSON as login:str, password:str, firstName:str, and lastName:str.
 // Output returns JSON as err
    $POSTInput = json_decode(file_get_contents('php://input'), true);
    

    // Clean Up Input
    foreach ($POSTInput as &$value) {
        $value = cleanInput($value);
    }

    // Set up Variables
    $login = $POSTInput['login'];
    $psswd = $POSTInput['password'];
    $fName = $POSTInput['firstName'];
    $lName = $POSTInput['lastName'];

    $SQL_DB = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
	if( $SQL_DB->connect_error )
	{
        sendErrBack( $SQL_DB->connect_error );
	}
    else 
    {
        // Add User Into Database
        $CMD = $SQL_DB->prepare("INSERT into Users (Login, Password, FirstName, LastName) 
        VALUES (?,?,?,?)");
        $CMD->bind_param("ssss", $login, $psswd, $fName, $lName);
        $CMD->execute();
        $CMD->close();
        $SQL_DB->close();
        sendErrBack("");
    }

    // Send JSON file back which holds $err as error
    function sendErrBack( $err )
    {
        header('Content-type: application/json');
        echo '{"error":"' . $err .'"}';
    }

    function cleanInput($inVal)
    {
        $inVal = trim($inVal);
        $inVal = stripslashes($inVal);
        $inVal = strip_tags($inVal);
        return $inVal;
    }