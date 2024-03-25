
/**
* @name: Project
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Laurainda Fan & Joey Pinaroc
**/

// users: include owner & coworker (as array)
// ->owner: user name, password, "type=owner", workspace ID array
// ->coworker: user name, password, "type=coworker", saved search, booking
// workspace: ID, owner ID, title, location, description, capacity, amenities, avaliability, bookings

// booking: workspace ID, coworker ID, date

// Search - match title, location, description, amenities by individual space delimited string


var all_workspace = [
	{
		"ID": 1,
		"owner": 1,
		"title": "Workspace 1",
		"location": "Downtown",
		"desc": "Great for board meeting",
		"capacity": 15,
		"amenities": "WiFi, Underground parking and street parking, Elevator",
		"avaliability": [1], //0=Sun, 1=Mon,..., 6=Sat
		"bookings": []
	},
	{
		"ID": 2,
		"owner": 2,
		"title": "Workspace 2",
		"location": "Downtown",
		"desc": "Office space",
		"capacity": 3,
		"amenities": "Wifi",
		"avaliability": [1,2,3,4,5], //0=Sun, 1=Mon,..., 6=Sat
		"bookings": []
	},
	{
		"ID": 3,
		"owner": 2,
		"title": "Workspace 3",
		"location": "Beltline",
		"desc": "Meeting room",
		"capacity": 6,
		"amenities": "Street parking",
		"avaliability": [0,2,5], //0=Sun, 1=Mon,..., 6=Sat
		"bookings": []
	}];
	
var all_users;

$(document).ready(function(){

// search.html 
// ************* redirect to login with search terms *************

	if ($(".button_to_login").length) {
		$(".button_to_login").click(function(){
			//********save search terms
			window.location.href='login.html?search=' + ($("#div_search").text()).slice(14);
		});	
	}

// coworker_search.html
// ************* redirect to coworker_booking with property ID *************

	else if ($(".button_to_book").length) {
		$(".button_to_book").click(function(){
			//******** pass property ID
			window.location.href='coworker_booking.html?book=' + $(this).closest('div').attr('id').slice(2);
		});	
	}
	
// coworker_booking.html
// ************* check date valid (correct avaliability, not yet booked), 
//        -> redirect to coworker_search with confirmation message. 
//        -> Save booking details *************	


});	

// index.html
// ************* map workspace data to index.html property boxes *************
$(document).ready(function() {
	// use data in all_workspace array to populate properties container
	function addPropertyBoxes() {
		all_workspace.forEach(function(workspace) {
			var propertyBox = $("<div>").addClass("propertyBox");
			var title = $("<p>").text(workspace.title);
			var propertyImgBox = $("<div>").addClass("propertyImgBox");
			var image = $("<p>").text("image");
			var location = $("<p>").text("Location: " + workspace.location);
			var desc = $("<p>").text("Description: " + workspace.desc);
			var capacity = $("<p>").text("Capacity: " + workspace.capacity);

			propertyBox.append(title);
			propertyBox.append(propertyImgBox);
			propertyImgBox.append(image);
			propertyBox.append(location);
			propertyBox.append(desc);
			propertyBox.append(capacity);

			$(".propertiesContainer").append(propertyBox);
		});
	}
	addPropertyBoxes();
})

// signup.html 
// ************* store signup data to array all_users_db *************
$(document).ready(function(){
	var all_users_db = [
		{
			userID: 1,
			userType: "coworker",
			username: "coworker1",
			password: "456456",
			email: "coworker1@123.com"
		},
		{
			userID: 2,
			userType: "owner",
			username: "testuser1",
			password: "123123",
			email: "testuser1@123.com"
		},
	];

	function addUser(userType) {
		var usernameField;
		var emailField;
		var passwordField;
		if(userType === 'coworker')
		{
			usernameField = $("#coworkerSignupUsername");
			emailField = $("#coworkerSignupEmail");
			passwordField = $("#coworkerSignupPassword");
		}
		else if(userType === 'owner')
		{
			usernameField = $("#ownerSignupUsername");
			emailField = $("#ownerSignupEmail");
			passwordField = $("#ownerSignupPassword");
		}

		var userID = all_users_db.length - 1
		var username = usernameField.val();
		var email = emailField.val();
		var password = passwordField.val();

		//push user data to array
		all_users_db.push({
			userID: userID,
			userType: userType,
			username: username,
			email: email,
			password: password
		});
	}
	// function uses button click to determine 'coworker' or 'owner' userType
	// and adds userType to database
	$(".signupButton").click(function(){
		var userType = $(this).data("type");
		addUser(userType);
	})
})

// login.html 
// ************* login functionality *************
$(document).ready(function() {
	var all_users_db = [
		{
			userID: 1,
			userType: "coworker",
			username: "coworker1",
			password: "456456",
			email: "coworker1@123.com"
		},
		{
			userID: 2,
			userType: "owner",
			username: "testuser1",
			password: "123123",
			email: "testuser1@123.com"
		},
	];

	$("#loginButton").click(function() {
		var loginUsername = $("#loginUsername").val();
		var loginPassword = $("#loginPassword").val();

		// find user in all_users_db
		var user = all_users_db.find(function(u){
			return u.username === loginUsername && u.password === loginPassword;
		})

		if(user)
		{
			// successful login
			$("#loginMessage").text("Login successful!");

			// redirect owner to their AllProperties page
			if(user.userType === "owner")
			{
				window.location.href = "ownerAllProperties.html?username=" + user.username;
			}
			// or redirect coworker to coworker_search page
			else if(user.userType === "coworker")
			{
				window.location.href = "coworker_search.html?userid=int";
			}
		}
		else
		{
			$("#loginMessage").text("Error! Username not found.");
		}
	})
})

// ownerAllProperties.html 
// ************* show owner properties on login *************
// show owner's properties
$(document).ready(function() {
	// use data in all_workspace array to populate properties container
	function addOwnerPropertyBoxes() {
		all_workspace.forEach(function(workspace) {
			var propertyBox = $("<div>").addClass("propertyBox");
			var title = $("<p>").text(workspace.title);
			var propertyImgBox = $("<div>").addClass("propertyImgBox");
			var image = $("<p>").text("image");
			var location = $("<p>").text("Location: " + workspace.location);
			var desc = $("<p>").text("Description: " + workspace.desc);
			var capacity = $("<p>").text("Capacity: " + workspace.capacity);

			propertyBox.append(title);
			propertyBox.append(propertyImgBox);
			propertyImgBox.append(image);
			propertyBox.append(location);
			propertyBox.append(desc);
			propertyBox.append(capacity);

			$(".propertiesContainer").append(propertyBox);
		});
	}
	addPropertyBoxes();
})

// redirect user to add/edit workspace
$(document).ready(function() {
	$(".propertyBoxAdd").click(function() {
		window.location.href = "owner_add.html?userid=int";
	})
})