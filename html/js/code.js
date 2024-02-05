const urlBase = 'http://cop4331-group25.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let contactID = 0;

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addColor()
{
	let newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	let tmp = {color:newColor,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddColor.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorAddResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
	
}

function searchColor()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";
	
	let colorList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchColors.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
	
}
function goToRegister()
{
	window.location.href = "register.html";
}
function backToLogin()
{
	window.location.href = "index.html";
}
function doRegister()
{
	let firstName = document.getElementById("enterFName").value;
	let	lastName = document.getElementById("enterLName").value;
	let login = document.getElementById("registerUsername").value;
	let password = document.getElementById("registerPassword").value;
	let tmp = {login, password, firstName, lastName};
	let jsonPayload = JSON.stringify( tmp );
	let url = urlBase + '/Register.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("registerResult").innerHTML = "Register Successful";
			}
		};
		xhr.send(jsonPayload);
		
	}
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}
}

function searchContacts()
{
	let fNameSrch = document.getElementById("fNameSearch").value;
	let lNameSrch = document.getElementById("lNameSearch").value;
	let	phoneSrch = document.getElementById("phoneNumberSearch").value;
	let emailSearch = document.getElementById("emailSearch").value;

	document.getElementById("contactSearchResult").innerHTML = "";
	
	let contactList = "";

	let tmp = {firstName: fNameSrch, lastName: lNameSrch, phone: phoneSrch, email: emailSearch, userID: userId, page: 0};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContactFields.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactSearchResult").innerHTML = xhr.responseText;
				let jsonObject = JSON.parse( xhr.responseText );
				let jsonData = jsonObject.results;

				let container = document.getElementById("contactTable");
				while (container.firstChild)
				{
					container.removeChild(container.firstChild);
				}
				// Create the table element
				let table = document.createElement("table");
				// Create the header element
				let thead = document.createElement("thead");
				let tr = document.createElement("tr");
				
				// Loop through the column names and create header cells
				let th = document.createElement("th");
				th.innerText = "First Name";
				tr.appendChild(th);
				th = document.createElement("th");
				th.innerText = "Last Name";
				tr.appendChild(th);
				th = document.createElement("th");
				th.innerText = "Phone Number";
				tr.appendChild(th);
				th = document.createElement("th");
				th.innerText = "Email";
				tr.appendChild(th);
				// jsonData.forEach(o => delete o.id)
				thead.appendChild(tr); // Append the header row to the header
				table.append(tr) // Append the header to the table
				// Loop through the JSON data and create table rows
				jsonData.forEach((item) => {
				   let tr = document.createElement("tr");
				   tr.onclick = function () {highlightOnly(this);};
				   // Get the values of the current object in the JSON data
				   let vals = Object.values(item);
				   // Loop through the values and create table cells
				   vals.forEach((elem, index) => {
					  //Skip First index
					  if (index == 0)
					  {
						tr.dataset.ID = elem;
					  } else
					  {
					  	let td = document.createElement("td");
					 	td.innerText = elem; // Set the value as the text of the table cell
						tr.appendChild(td); // Append the table cell to the table row
					  }
				   });
				   table.appendChild(tr); // Append the table row to the table
				});
				container.appendChild(table) // Append the table to the container element
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
}

// higlight and get contact ID.
function highlightOnly(Crow)
{
	// Clear Table
	let tableR = Array.from(Crow.parentElement.children);
	tableR.forEach( (elm, index) => {
		if (index != 0) {
			elm.classList.remove("highlight");
		}
	});
	Crow.classList.add("highlight");
	contactID = Crow.dataset.ID;
	console.log("Console ID:" + contactID);
}

function nextPage()
{
	let fNameSrch = document.getElementById("fNameSearch").value;
	let lNameSrch = document.getElementById("lNameSearch").value;
	let	phoneSrch = document.getElementById("phoneNumberSearch").value;
	let emailSearch = document.getElementById("emailSearch").value;

	document.getElementById("contactSearchResult").innerHTML = "";
	
	let contactList = "";

	let tmp = {firstName: fNameSrch, lastName: lNameSrch, phone: phoneSrch, email: emailSearch, userID: userId, page: 0};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContactsFields.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					contactList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						contactList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
}

function addContact()
{
	document.getElementById("contactAddResult").innerHTML = "";
	let newFirstName = document.getElementById("firstNameText").value;
	let newLastName = document.getElementById("lastNameText").value;
	let newPhoneNumber = document.getElementById("phoneNumber").value;
	let newEmail = document.getElementById("emailText").value;
	let tmp = {firstName:newFirstName, lastName:newLastName, phone:newPhoneNumber, email: newEmail, userId: userId};
	let jsonPayload = JSON.stringify( tmp );
	let url = urlBase + '/AddContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
	
}
``