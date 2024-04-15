
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

// URL Get param: search, userid, book, ws


const all_workspace = [
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
	},
		{
		"ID": 4,
		"owner": 1,
		"title": "Workspace 4",
		"location": "Downtown",
		"desc": "Great for board meeting",
		"capacity": 15,
		"amenities": "WiFi, Underground parking and street parking, Elevator",
		"avaliability": [1], //0=Sun, 1=Mon,..., 6=Sat
		"bookings": []
	},
	{
		"ID": 5,
		"owner": 2,
		"title": "Workspace 5",
		"location": "Downtown",
		"desc": "Office space",
		"capacity": 3,
		"amenities": "Wifi",
		"avaliability": [1,2,3,4,5], //0=Sun, 1=Mon,..., 6=Sat
		"bookings": []
	},
	{
		"ID": 6,
		"owner": 2,
		"title": "Workspace 6",
		"location": "Beltline",
		"desc": "Meeting room",
		"capacity": 6,
		"amenities": "Street parking",
		"avaliability": [0,2,5], //0=Sun, 1=Mon,..., 6=Sat
		"bookings": []
	},
		{
		"ID": 7,
		"owner": 1,
		"title": "Workspace 7",
		"location": "Downtown",
		"desc": "Great for board meeting",
		"capacity": 15,
		"amenities": "WiFi, Underground parking and street parking, Elevator",
		"avaliability": [1], //0=Sun, 1=Mon,..., 6=Sat
		"bookings": []
	},
	{
		"ID": 8,
		"owner": 2,
		"title": "Workspace 8",
		"location": "Downtown",
		"desc": "Office space",
		"capacity": 3,
		"amenities": "Wifi",
		"avaliability": [1,2,3,4,5], //0=Sun, 1=Mon,..., 6=Sat
		"bookings": []
	},
	{
		"ID": 9,
		"owner": 2,
		"title": "Workspace 9",
		"location": "Beltline",
		"desc": "Meeting room",
		"capacity": 6,
		"amenities": "Street parking",
		"avaliability": [0,2,5], //0=Sun, 1=Mon,..., 6=Sat
		"bookings": []
	}
	];
	
const all_users=[];

const arr_wk = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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
	}];

$(document).ready(function(){
	
// setup searchButton onclick
	if ($("#searchButton").length ) {
		$("#searchButton").click(function() {
			
			// check if user is login
				if ($(".profileSquare").length ) {
					// user loged in
					const params = new URLSearchParams(window.location.search);
					let temp_str = params.get('userid');
					window.location.href='coworker_search.html?search=' + ($(".searchBar:first")).val() + "&userid=" + temp_str;
				}
				else
				{
					//user not log in
					//get search terms and parse. redirect to search with URL param
					window.location.href='search.html?search=' + ($(".searchBar:first")).val();
				}
		});
	}

// search.html 
// ************* redirect to login with search terms *************

	if ($(".button_to_login").length) {
		
		const params = new URLSearchParams(window.location.search);
		
		// parse search terms, and display relevant workspace
		if (params.get('search') == null)
		{
			$("#home_content").children().hide();
			$("#home_content").prepend("<h3>Please type keywords above to search for workspaces</h3>");
		}
		else
		{
			// search and display workspace
			ws_search( params.get('search').toLowerCase().split(/(?:,| )+/) , null);
		
			$(".button_to_login").click(function(){
				//********save search terms
				window.location.href='login.html?search=' + ($("#div_search").text()).slice(14);
			});	
		}
	}	
	

// coworker_search.html
// ************* redirect to coworker_booking with property ID *************

	else if ($(".button_to_book").length) {
		
		const params = new URLSearchParams(window.location.search);
		let user_ID = parseInt(params.get('userid'));
		
		
		if (!disp_user(user_ID))
		{
			$("#home_content").children().hide();
			$("#home_content").prepend("<div><a href='login.html'>Login to book workspace</a></div>");
			$("#home_content").prepend("<h3>You are not logged in</h3>");
		}
		else if (params.get('search') == null)
		{
			// no search terms
			$("#home_content").children().hide();
			$("#home_content").prepend("<h3>Please type keywords above to search for workspaces</h3>");
		}
		else
		{
			// search and display workspace
			ws_search( params.get('search').toLowerCase().split(/(?:,| )+/) , user_ID);
			
			$(".button_to_book").click(function(){
				//******** pass property ID from button
				window.location.href='coworker_booking.html?book=' + $(this).val().slice(2) + '&userid=' + user_ID;
			});	
	}}
	
// coworker_booking.html
// ************* check date valid (correct avaliability, not yet booked), 
//        -> redirect to coworker_search with confirmation message. 
//        -> Save booking details *************	

	else if ($("#button_book").length) {
		
		const params = new URLSearchParams(window.location.search);
		let book_ID = parseInt(params.get('book'));
		let user_ID = parseInt(params.get('userid'));
		let book_ws;

		if (!disp_user(user_ID))
		{
			$("#home_content").children().hide();
			$("#home_content").append("<h3>You are not logged in</h3>");
			$("#home_content").append("<div><a href='login.html'>Login to book a workspace</a></div>");
		}
		else 
		{		
		$(".propertyBox").remove();
		// grab workspace data from array
		all_workspace.forEach( (workspace)=> {
			if (!isNaN(book_ID) && workspace.ID == book_ID) {
				// display
				book_ws = workspace;
				
		$("#home_content").prepend("<h3>Book this Workspace</h3>");
		
		let propertyBox = $("<div>").addClass("propertyBox booking");
		let title = $("<em>").text(book_ws.title);
		propertyBox.append( title );
		title.wrap("<div></div>");
		propertyBox.append($("<div>").text("Location: " + book_ws.location));
		propertyBox.append($("<div>").text("Description: " + book_ws.desc));
		propertyBox.append($("<div>").text("Capacity: " + book_ws.capacity));
		propertyBox.append($("<div>").text("Amenities: " + book_ws.amenities));
		let temp_str = "Avaliability: ";
			book_ws.avaliability.forEach( (wkday, index, arr) => {
				temp_str+= arr_wk[wkday];
				if (index < arr.length-1) {
					temp_str += ", ";
				}
			});
		propertyBox.append($("<div>").text(temp_str));
		propertyBox.append($("<input type='date' id='book_date'> ") );
		
		let button_txt = '<button type="button" id="button_book" class="hover">Book</button>';
		propertyBox.append($(button_txt).val("ws" + book_ws.ID));
			
		$(".propertiesContainer").append(propertyBox);
				
			}
		});
		try {book_ws.ID}
		catch (err) {
			$("#button_book").hide();
			$("#button_book").before("<h3>You have not select a workspace.</h3>");
			$("#button_book").before("<div><a href='coworker_search.html'>Go back to search for a workspace to book</a></div>");
		}
		
		$("#button_book").click(function(){
			// get date
			let bk_date = new Date($("#book_date").val());
			
			// verify that book date is valid
			let date_valid = false;
			
			if ( bk_date <= new Date() )
				window.alert("You can only book a future date");
			else {
				book_ws.avaliability.forEach( (wkday ) => {
					
					if (date_valid == false && wkday == bk_date.getUTCDay())
					{
						date_valid = true;
					}
				});
			
			}
			if (date_valid)
			{
				// store booking to book_ws
				// booking: workspace ID, coworker ID, date
				book_ws.bookings.push({"ws": book_ws.ID, "user": user_ID, "date": bk_date.getUTCFullYear() + '-' + (bk_date.getUTCMonth()+1) + '-'+ bk_date.getUTCDate()} );
				window.alert("Booking completed.\nInfo: "+JSON.stringify(book_ws.bookings[0] ) );
				window.location.href='coworker_search.html?userid=' + user_ID + '&search=';
			}
			else
			{
				window.alert("Booking date is not avaliable. Try another date." );
			}

		});	
		}  }
		
// owner_add.html
// ************* save all values to all_workspace array 
//        -> check for userid and property id in url
//        -> redirect to ownerAllProperties.html
	else if ($("#button_edit").length) {
		
		const params = new URLSearchParams(window.location.search);
		let book_ID = parseInt(params.get('ws'));
		let user_ID = parseInt(params.get('userid'));
		let book_ws;
		
		if (!disp_user(user_ID))
		{
			$("#home_content").children().hide();
			$("#home_content").prepend("<h3>You must login to edit or add workspace</h3>");
		}
		else if (isNaN(book_ID))
		{
			// ws is NaN in param, start a new one
			// get next ID, display blank List
			// save to new ws when button pressed
			book_ID = all_workspace.length;
			
			$(".propertyBox").remove();
			
			let propertyBox = $("<form>").addClass("propertyBox edit_ws");
			propertyBox.attr("id","editWS");
					
			propertyBox.append('<label for="ed_title">Title: &nbsp;&nbsp;</label><br>');
			propertyBox.append('<input type="text" id="ed_title" name="ed_title" placeholder="Enter title"><br>');
					
			propertyBox.append('<br><label for="ed_loc">Location: &nbsp;&nbsp;</label><br>');
			propertyBox.append('<input type="text" id="ed_loc" name="ed_loc" placeholder="Enter location, e.g. Downtown"><br>');
					
			propertyBox.append('<br><label for="ed_desc">Description: &nbsp;&nbsp;</label><br>');
			propertyBox.append('<input type="text" id="ed_desc" name="ed_desc" placeholder="Enter description, e.g. Good for meeting"><br>');
					
			propertyBox.append('<br><label for="ed_cap">Max capacity: &nbsp;&nbsp;</label><br>');
			propertyBox.append('<input type="text" id="ed_cap" name="ed_cap" placeholder="Enter capacity"><br>');
					
			propertyBox.append('<br><label for="ed_am">Amenities: &nbsp;&nbsp;</label><br>');
			propertyBox.append('<textarea rows="4" cols="60" id="ed_am" name="ed_am" placeholder="Enter amenities, e.g. WiFi, street parking"></textarea><br>');
					
			propertyBox.append('<br><label for="ed_ava">Avaliability: &nbsp;&nbsp;</label><br>');
			propertyBox.append('<input type="text" id="ed_ava" name="ed_ava" placeholder="Enter avaliability, e.g. Monday, Friday" size="60"><br>');
			
			propertyBox.append('<br><button type="button" id="button_new" class="hover" value="save">Save New Workspace</button>');
			$(".propertiesContainer").append(propertyBox);
			
		}
		else 
		{
		// grab workspace data from array
		all_workspace.forEach( (workspace)=> {
			if (!isNaN(book_ID) && workspace.ID == book_ID) {
				if (workspace.owner != user_ID)
				{
					// workspace not owned by user_ID
					$("#home_content").children().hide();
					$("#home_content").prepend("<h3>You do not own this workspace</h3>");
				}
				else
				{
					// workspace found, user matched
				
					// display
					book_ws = workspace;
					$(".propertyBox").remove();
					
					let propertyBox = $("<form>").addClass("propertyBox edit_ws");
					propertyBox.attr("id","editWS");
					
					propertyBox.append('<label for="ed_title">Title: &nbsp;&nbsp;</label><br>');
					propertyBox.append('<input type="text" id="ed_title" name="ed_title" placeholder="Enter changes" value="' + book_ws.title + '"><br>');
					
					propertyBox.append('<br><label for="ed_loc">Location: &nbsp;&nbsp;</label><br>');
					propertyBox.append('<input type="text" id="ed_loc" name="ed_loc" placeholder="Enter changes" value="' + book_ws.location +'"><br>');
					
					propertyBox.append('<br><label for="ed_desc">Description: &nbsp;&nbsp;</label><br>');
					propertyBox.append('<input type="text" id="ed_desc" name="ed_desc" placeholder="Enter changes" value="' + book_ws.desc + '"><br>');
					
					propertyBox.append('<br><label for="ed_cap">Max capacity: &nbsp;&nbsp;</label><br>');
					propertyBox.append('<input type="text" id="ed_cap" name="ed_cap" placeholder="Enter changes" value="' + book_ws.capacity + '"><br>');
					
					propertyBox.append('<br><label for="ed_am">Amenities: &nbsp;&nbsp;</label><br>');
					propertyBox.append('<textarea rows="4" cols="60" id="ed_am" name="ed_am" placeholder="Enter changes">' + book_ws.amenities + '</textarea><br>');
					
					propertyBox.append('<br><label for="ed_ava">Avaliability: &nbsp;&nbsp;</label><br>');
					let temp_str='<input type="text" id="ed_ava" name="ed_ava" placeholder="Enter changes" size="60" value="';
					workspace.avaliability.forEach( (wkday, index, arr) => {
						temp_str+= arr_wk[wkday];
						if (index < arr.length-1) {
							temp_str += ", ";
						}
					});
					temp_str += '"><br>'
					propertyBox.append(temp_str); //Avaliability
					propertyBox.append('<br><button type="button" id="button_edit" class="hover" value="save">Save Changes</button>');
					propertyBox.append('<button type="button" id="button_del" class="hover" value="delete">Delete Workspace</button>');

					$(".propertiesContainer").append(propertyBox);

				}
			}
		});

		}
		
		$("#editWS").validate({
			rules: {
				ed_title: {
					required: true,
					minlength: 4
				},
				ed_loc: {
					required: true
				},
				ed_desc: {
					required: true
				},
				ed_cap: {
					required: true,
					number: true,
					min: 1
				},
				ed_am:{
					required: true
				},
				ed_ava: {
					required: true
				}
			},
			message: {
				ed_title: {
					required: "Please enter a title",
					minlength: "Please enter at least 4 characters"
				},
				ed_loc: "Please enter a location",
				ed_desc: "Please enter a description",
				ed_cap: {
					required: "Please enter a capcity",
					number: "Please enter capcity as number",
					min: "Please enter capacity greater than 1"
				},
				ed_am: "Please enter amenities",
				ed_ava: "Please enter avaliability"
			}
		});
		
		$("#button_del").click(function (e) {
			e.preventDefault();
			// delete workspace from database
			let title = book_ws.title;
			let index = all_workspace.indexOf(book_ws);
			if (index > -1) 
			{ // only splice array when item is found
				all_workspace.splice(index, 1);
				window.alert("Workspace with title '" + title + "' is deleted");
				window.location.href='ownerAllProperties.html?userid=' + user_ID;
			}
		});
		
		$("#button_edit").click(function(e){
			e.preventDefault();
			// get all val() and save to workspace		
			// store booking to book_ws
			// booking: workspace ID, coworker ID, date
			let isValid = $("#editWS").valid();
			
			window.alert("button_edit clicked");

			
			if (isValid)
			{
			book_ws.title = $("#ed_title").val();
			book_ws.location = $("#ed_loc").val();
			book_ws.desc = $("#ed_desc").val();
			book_ws.capacity = parseInt($("#ed_cap").val());
			book_ws.amenities = $("#ed_am").val();
				
			let temp_arr = $("#ed_ava").val().toLowerCase().split(/(?:,| )+/);
			temp_arr.forEach( (wkday) => {
				switch (wkday) 
				{
					case "sunday":
						book_ws.avaliability.push(0);
						break;
					case "monday":
						book_ws.avaliability.push(1);
						break;
					case "tuesday":
						book_ws.avaliability.push(2);
						break;
					case "wednesday":
						book_ws.avaliability.push(3);
						break;
					case "thursday":
						book_ws.avaliability.push(4);
						break;
					case "friday":
						book_ws.avaliability.push(5);
						break;
					case "saturday":
						book_ws.avaliability.push(6);
						break;
					}
				});
				
				window.alert("Workspace '" + book_ws.title +"' details edited");
				window.location.href='ownerAllProperties.html?userid=' + user_ID;
			}
		});	

		$("#button_new").click(function(e){
			e.preventDefault();
			
			window.alert("button_new clicked");
			
			// create new ws record
			// get all val() and save to workspace		
			// store booking to book_ws
			// booking: workspace ID, coworker ID, date
			
			let isValid = $("#editWS").valid();
			
			if (isValid)
			{
			
			book_ws = 	{
				"ID": book_ID,
				"owner": user_ID,
				"title": $("#ed_title").val(),
				"location": $("#ed_loc").val(),
				"desc": $("#ed_desc").val(),
				"capacity": parseInt($("#ed_cap").val()),
				"amenities": $("#ed_am").val(),
				"avaliability": [], //0=Sun, 1=Mon,..., 6=Sat
				"bookings": []
			};
			all_workspace.push(book_ws);
			
			let temp_arr = $("#ed_ava").val().toLowerCase().split(/(?:,| )+/);
			temp_arr.forEach( (wkday) => {
				switch (wkday) 
				{
					case "sunday":
						book_ws.avaliability.push(0);
						break;
					case "monday":
						book_ws.avaliability.push(1);
						break;
					case "tuesday":
						book_ws.avaliability.push(2);
						break;
					case "wednesday":
						book_ws.avaliability.push(3);
						break;
					case "thursday":
						book_ws.avaliability.push(4);
						break;
					case "friday":
						book_ws.avaliability.push(5);
						break;
					case "saturday":
						book_ws.avaliability.push(6);
						break;
					}
				});
				
				window.alert("New workspace '" + book_ws.title +"' is added");
				//window.alert("ws="+JSON.stringify(book_ws));
				window.location.href='ownerAllProperties.html?userid=' + user_ID;
			}
		});	
	}
	
	// index.html
	// ************* map workspace data to index.html property boxes *************
	// use data in all_workspace array to populate properties container
	else if ($(".div_index").length) {
	
	function addPropertyBoxes() {
		
		const shuffled = all_workspace.sort(() => 0.5 - Math.random());
		let selected = shuffled;
		if (shuffled.length > 6)
		{
			// Max display = 6 workspace
			selected = shuffled.splice(0,6);
		}
		
		selected.forEach(function(workspace) {
			var propertyBox = $("<div>").addClass("propertyBox");
			var title = $("<em>").text(workspace.title);
			
			//var propertyImgBox = $("<div>").addClass("propertyImgBox");
			//var image = $("<div>").text("image");
			var location = $("<div>").text("Location: " + workspace.location);
			var desc = $("<div>").text("Description: " + workspace.desc);
			var capacity = $("<div>").text("Capacity: " + workspace.capacity);

			propertyBox.append( title );
			title.wrap("<div></div>");
			//propertyBox.append(propertyImgBox);
			//propertyImgBox.append(image);
			propertyBox.append(location);
			propertyBox.append(desc);
			propertyBox.append(capacity);

			$(".propertiesContainer").append(propertyBox);
			propertyBox.children().wrapAll("<a href='login.html'></a>");
		});
	}
	addPropertyBoxes();
	


	}
	
	
	// signup.html 
	// ************* store signup data to array all_users_db *************
	else if ($(".signupButton").length) {
		
		
		$("#cwSignup").validate({
			rules: {
				coworkerSignupUsername: {
					required: true,
					minlength: 4
				},
				coworkerSignupEmail: {
					required: true,
					email: true
				},
				cwPhone: {
					required: true,
					phoneUS: true
				},
				coworkerSignupPassword: {
					required: true,
					minlength: 5
				},
				confirm_cw_pwd: {
					required: true,
					minlength: 5,
					equalTo: "#coworkerSignupPassword"
				}
			},
			messages: {
				coworkerSignupUsername: {
					required: "Please enter a username",
					minlength: "Your username must consist of at least 4 characters"
				},
				coworkerSignupEmail: "Please enter a valid email address",
				
				cwPhone: "Please enter a valid phone number",
				
				coworkerSignupPassword: {
					required: "Please enter a password",
					minlength: "Your password must consist of at least 5 characters"
				},
				confirm_cw_pwd: {
					required: "Please re-type your password",
					minlength: "Your username must consist of at least 5 characters",
					equalTo: "Please enter the same password as above"
				}
			}
		});
		
		$("#ownSignup").validate({
			rules: {
				ownerSignupUsername: {
					required: true,
					minlength: 4
				},
				ownerSignupEmail: {
					required: true,
					email: true
				},
				ownerPhone: {
					required: true,
					phoneUS: true
				},
				ownerSignupPassword: {
					required: true,
					minlength: 5
				},
				confirm_owner_pwd: {
					required: true,
					minlength: 5,
					equalTo: "#ownerSignupPassword"
				}
			},
			messages: {
				ownerSignupUsername: {
					required: "Please enter a username",
					minlength: "Your username must consist of at least 4 characters"
				},
				ownerSignupEmail: "Please enter a valid email address",
				
				ownerPhone: "Please enter a valid phone number",
				
				ownerSignupPassword: {
					required: "Please enter a password",
					minlength: "Your password must consist of at least 5 characters"
				},
				confirm_owner_pwd: {
					required: "Please re-type your password",
					minlength: "Your username must consist of at least 5 characters",
					equalTo: "Please enter the same password as above"
				}
			}
		});
		
		
	function addUser(userType) {
		
		let username;
		let email;
		let password;
		let nextURL="#";
		let userID = all_users_db.length + 1
		let isValid = false;
		let phone;
		
		if(userType === 'coworker' )
		{
			username = $("#coworkerSignupUsername").val();
			email = $("#coworkerSignupEmail").val();
			phone = $("#cwPhone").val();
			password = $("#coworkerSignupPassword").val();
			
			nextURL = "coworker_search.html?userid=" + userID + "&search=";
			isValid = $("#cwSignup").valid();
		}
		else if(userType === 'owner' )
		{
			username = $("#ownerSignupUsername").val();
			email = $("#ownerSignupEmail").val();
			phone = $("#ownerPhone").val();
			password = $("#ownerSignupPassword").val();
			
			nextURL = "ownerAllProperties.html?userid=" + userID;
			isValid = $("#ownSignup").valid();
		}
		
		if (isValid)
		{

		// check the username is unique
		// push user data to array
		all_users_db.push({
			userID: userID,
			userType: userType,
			username: username,
			email: email,
			password: password
		});
		
		window.alert("User '" + username +"' signed up as " + userType + " sucessfully.");
		window.location.href=nextURL;
		}
		else 
		{
			//window.alert("Input not valid");
		}
		
	}
	// function uses button click to determine 'coworker' or 'owner' userType
	// and adds userType to database
	$(".signupButton").click(function(e){
		e.preventDefault();
		//var userType = $(this).data("type");
		addUser($(this).data("type"));
		
	})
	
	}
	
	// login.html 
	// ************* login functionality *************
	else if ($("#loginButton").length) {
		
		$("#Login").validate({
			rules: {
				loginUsername: "required",
				loginPassword: "required"
				},
			messages: {
				loginUsername: "Please enter your username",
				loginPassword: "Please enter your password"
			}
		});
		
	$("#loginButton").click(function(e) {
		e.preventDefault();
		var loginUsername = $("#loginUsername").val();
		var loginPassword = $("#loginPassword").val();
		let isValid = $("#Login").valid();
		
		if (isValid)
		{

		// find user in all_users_db
		var user = all_users_db.find(function(u){
			return u.username === loginUsername && u.password === loginPassword;
		});

		if(user)
		{
			// successful login
			$("#loginMessage").text("Login successful!");

			// redirect owner to their AllProperties page
			if(user.userType === "owner")
			{
				window.location.href = "ownerAllProperties.html?userid=" + user.userID;
			}
			// or redirect coworker to coworker_search page
			else if(user.userType === "coworker")
			{
				window.location.href = "coworker_search.html?userid=" + user.userID + "&search=";
			}
		}
		else
		{
			$("#loginMessage").text("Login info incorrect");
		}
		}
			
	})
	}

	
	// ownerAllProperties.html 
	// ************* show owner properties on login *************
	// show owner's properties
	else if ($(".propertyBoxAdd").length) {	
		
	const params = new URLSearchParams(window.location.search);
	let user_ID = parseInt(params.get('userid'));
	
	if (!disp_user(user_ID))
	{
		$(".propertiesContainer").prepend("<div><a href='login.html'>Login to see your workspaces</a></div>");
		$(".propertiesContainer").prepend("<h3>You are not logged in</h3>");
	}
	else
	{
		addOwnerPropertyBoxes();
	}
		
	// use data in all_workspace array to populate properties container
	function addOwnerPropertyBoxes() {
		// add link to add new workspace
		$(".propertyBoxAdd").children().wrapAll("<a href='owner_add.html?userid=" + user_ID + "&ws='></a>");
		
		
		// filter workspaces by owner userID
		var userWorkspaces = all_workspace.filter(function(workspace){
			return workspace.owner === user_ID;
		});

		userWorkspaces.forEach(function(workspace) {
			var propertyBox = $("<div>").addClass("propertyBox");
			var title = $("<em>").text(workspace.title);
			//var propertyImgBox = $("<div>").addClass("propertyImgBox");
			//var image = $("<div>").text("image");
			var location = $("<div>").text("Location: " + workspace.location);
			var desc = $("<div>").text("Description: " + workspace.desc);
			var capacity = $("<div>").text("Capacity: " + workspace.capacity);

			propertyBox.append(title);
			title.wrap("<div></div>");
			//propertyBox.append(propertyImgBox);
			//propertyImgBox.append(image);
			propertyBox.append(location);
			propertyBox.append(desc);
			propertyBox.append(capacity);

			$(".propertiesContainer").append(propertyBox);
			propertyBox.children().wrapAll("<a href='owner_add.html?userid=" + user_ID + "&ws=" + workspace.ID + "'></a>");
		});
	}
	
	}

});	

function disp_user(userid) {
	// check and dispay user ID
	// not verified user data because sign up data not stored between pages
	
	if(isNaN(userid) )
	{
		$("#home_content").children().hide();
		return false;
	}
	$("#user").text("User ID: " + userid);
	$(".drop_content").children().each( function() {
		let temp_str = $(this).attr('href') + userid;
		$(this).attr('href', temp_str);
	});
	return true;
}

function ws_search(search_arr, userid)
{
	// userid = null if not logged in
	// parse search terms, and display relevant workspace
	const disp_ws = [];
	
	search_arr.forEach ( (txt) => {
		all_workspace.forEach ( (ws) => {
			if ( ws.title.toLowerCase().indexOf(txt) !=-1 || ws.desc.toLowerCase().indexOf(txt) !=-1  || 
				ws.location.toLowerCase().indexOf(txt) !=-1  || ws.amenities.toLowerCase().indexOf(txt) !=-1  )
			{
				if (disp_ws.indexOf(ws) == -1)
				{
					disp_ws.push(ws);
				}
			}
		});
	});
	
	if (disp_ws.length == 0)
	{
		$("#home_content").children().hide();
		$("#home_content").prepend("<div>Try again with other terms.</div>");
		$("#home_content").prepend("<h3>Your search did not yield any result</h3>");
	}
	else 
	{
		// display search terms
		$("#div_search").text("Search Terms: " + search_arr.join(", "));
		
		// display the workspaces
		$(".propertyBox").remove();
		let button_txt = "";
		if (userid)
		{
			// userid not falsy, ie user logged in
			button_txt = "<button type='button' class='button_to_book hover'>Book</button>";
		}
		else
		{
			// userid falsy, ie user not logged in
			button_txt = "<button type='button' class='button_to_login hover'>Login & Book</button>";
		}
		
		disp_ws.forEach ( (ws) => {
			
			let propertyBox = $("<div>").addClass("propertyBox booking");
			let title = $("<em>").text(ws.title);
			propertyBox.append( title );
			title.wrap("<div></div>");
			propertyBox.append($("<div>").text("Location: " + ws.location));
			propertyBox.append($("<div>").text("Description: " + ws.desc));
			propertyBox.append($("<div>").text("Capacity: " + ws.capacity));
			propertyBox.append($("<div>").text("Amenities: " + ws.amenities));
			let temp_str = "Avaliability: ";
				ws.avaliability.forEach( (wkday, index, arr) => {
					temp_str+= arr_wk[wkday];
					if (index < arr.length-1) {
						temp_str += ", ";
					}
				});
			
			propertyBox.append($("<div>").text(temp_str));
			propertyBox.append($(button_txt).val("ws" + ws.ID));
			
			$(".propertiesContainer").append(propertyBox);

		});
		
	}
}

	
		function addPropertyBoxes() {
		all_workspace.forEach(function(workspace) {
			var propertyBox = $("<div>").addClass("propertyBox");
			var title = $("<em>").text(workspace.title);
			
			//var propertyImgBox = $("<div>").addClass("propertyImgBox");
			//var image = $("<div>").text("image");
			var location = $("<div>").text("Location: " + workspace.location);
			var desc = $("<div>").text("Description: " + workspace.desc);
			var capacity = $("<div>").text("Capacity: " + workspace.capacity);

			propertyBox.append( title );
			title.wrap("<div></div>");
			//propertyBox.append(propertyImgBox);
			//propertyImgBox.append(image);
			propertyBox.append(location);
			propertyBox.append(desc);
			propertyBox.append(capacity);

			$(".propertiesContainer").append(propertyBox);
			propertyBox.children().wrapAll("<a href='login.html'></a>");
		});
	}