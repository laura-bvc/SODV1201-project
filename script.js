
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
	}];
	
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
			$("#home_content").prepend("<h2>Please type keywords above to search for workspaces</h2>");
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
			$("#home_content").prepend("<h2>You are not logged in</h2>");
		}
		else if (params.get('search') == null)
		{
			// no search terms
			$("#home_content").children().hide();
			$("#home_content").prepend("<h2>Please type keywords above to search for workspaces</h2>");
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
			$("#button_book").before("<h2>You have not select a workspace.</h2>");
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
			$("#home_content").prepend("<h2>You must login to edit or add workspace</h2>");
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
					$("#home_content").prepend("<h2>You do not own this workspace</h2>");
				}
				else
				{
					// workspace found, user matched
				
					// display
					book_ws = workspace;
					$(".propertyBox").remove();
					
					
					let propertyBox = $("<div>").addClass("propertyBox edit_ws");
					propertyBox.append($('<div>Title: <input type="text" id="ed_title" placeholder="Enter changes" value="' + book_ws.title + '"></div>'));
					propertyBox.append('<div>Location: <input type="text" id="ed_loc" placeholder="Enter changes" value="' + book_ws.location +'"></div>');
					propertyBox.append('<div>Description: <input type="text" id="ed_desc" placeholder="Enter changes" value="' + book_ws.desc + '"></div>');
					propertyBox.append('<div>Capacity: <input type="text" id="ed_cap" placeholder="Enter changes" value="' + book_ws.capacity + '"> persons max</div>');
					propertyBox.append('<div>Amenities: <textarea rows="4" cols="60" id="ed_am" placeholder="Enter changes">' + book_ws.amenities + '</textarea></div>');
					
					let temp_str='<div>Avaliability: <input type="text" id="ed_ava" placeholder="Enter changes" size="60" value="';
					workspace.avaliability.forEach( (wkday, index, arr) => {
						temp_str+= arr_wk[wkday];
						if (index < arr.length-1) {
							temp_str += ", ";
						}
					});
					temp_str += '"></div>'
					propertyBox.append(temp_str); //Avaliability
					propertyBox.append('<button type="button" id="button_edit" class="hover" value="save">Save Changes</button>');
					propertyBox.append('<button type="button" id="button_del" class="hover" value="delete">Delete Workspace</button>');

					$(".propertiesContainer").append(propertyBox);

				}
			}
		});
		try {book_ws.ID}
		catch (err) {
			$("#home_content").children().hide();
			$("#home_content").prepend("<h2>You have not select a workspace</h2>");
		}
		}
		
		$("#button_edit").click(function(){
			// get all val() and save to workspace		
			// store booking to book_ws
			// booking: workspace ID, coworker ID, date
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
		});	
	}
	
	// index.html
	// ************* map workspace data to index.html property boxes *************
	// use data in all_workspace array to populate properties container
	else if ($(".div_index").length) {
	
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
	addPropertyBoxes();
	


	}
	
	
	// signup.html 
	// ************* store signup data to array all_users_db *************
	else if ($(".signupButton").length) {
		
	function addUser(userType) {
		
		var username;
		var email;
		var password;
		var nextURL="#";
		var userID = all_users_db.length + 1
		
		if(userType === 'coworker')
		{
			username = $("#coworkerSignupUsername").val();
			email = $("#coworkerSignupEmail").val();
			password = $("#coworkerSignupPassword").val();
			nextURL = "coworker_search.html?userid=" + userID + "&search=";
		}
		else if(userType === 'owner')
		{
			username = $("#ownerSignupUsername").val();
			email = $("#ownerSignupEmail").val();
			password = $("#ownerSignupPassword").val();
			nextURL = "ownerAllProperties.html?userid=" + userID;
		}

		//push user data to array
		all_users_db.push({
			userID: userID,
			userType: userType,
			username: username,
			email: email,
			password: password
		});
		
		window.alert("User '" + userID +"' signed up as " + userType + " sucessfully.");
		window.location.href=nextURL;
		
	}
	// function uses button click to determine 'coworker' or 'owner' userType
	// and adds userType to database
	$(".signupButton").click(function(){
		var userType = $(this).data("type");
		addUser(userType);
		
	})
	
	}
	
	// login.html 
	// ************* login functionality *************
	else if ($("#loginButton").length) {
		
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
			$("#loginMessage").text("Error! Username not found.");
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
		$(".propertiesContainer").prepend("<h2>You are not logged in</h2>");
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
		$("#home_content, .propertiesContainer").children().hide();
		return false;
	}
	$("#user").text("User ID: " + userid);
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
		$("#home_content").prepend("<h2>Your search did not yield any result</h2>");
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
			button_txt = "<button type='button' class='button_to_book hover'>Login & Book</button>";
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