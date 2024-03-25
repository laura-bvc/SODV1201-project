
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

// URL Get param: search, userid, book

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
			ws_search( params.get('search').toLowerCase().split(/(?:,| )+/) );
		
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
			$("#home_content").prepend("<div><a href='login.html'>Login to book workspace</a></div>");
			$("#home_content").prepend("<h2>You are not logged in</h2>");
		}
		else 
		{
			// display workspace
			
			$(".button_to_book").click(function(){
				//******** pass property ID
				window.location.href='coworker_booking.html?book=' + $(this).closest('div').attr('id').slice(2) + '&userid=' + user_ID;
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
			$("#button_book").before("<h2>You are not logged in</h2>");
			$("#button_book").before("<div><a href='login.html'>Login to book workspace</a></div>");
		}
		else 
		{		
		// grab workspace data from array
		all_workspace.forEach( (workspace)=> {
			if (!isNaN(book_ID) && workspace.ID == book_ID) {
				// display
				book_ws = workspace;
				$("#button_book").before("<h2>Book this Workspace</h2>");
				$("#button_book").before("<div>" + workspace.title +"</div>");
				$("#button_book").before("<div>Location: " + workspace.location +"</div>");
				$("#button_book").before("<div>Property description: " + workspace.desc +"</div>");
				$("#button_book").before("<div>Capacity: " + workspace.capacity +" persons maximum</div>");
				$("#button_book").before("<div>Amenities: " + workspace.amenities +"</div>");
				let temp_str="";
				workspace.avaliability.forEach( (wkday, index, arr) => {
					temp_str+= arr_wk[wkday];
					if (index < arr.length-1) {
						temp_str += ", ";
					}
				});
				$("#button_book").before("<div>Avaliability: " + temp_str +"</div>");	
				$("#button_book").before("<input type='date' id='book_date'> ");
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
						date_valid = true;
				});
			
				// store booking to book_ws
				// booking: workspace ID, coworker ID, date
				book_ws.bookings.push({"ws": book_ws.ID, "user": user_ID, "date": bk_date.getUTCFullYear() + '-' + (bk_date.getUTCMonth()+1) + '-'+ bk_date.getUTCDate()} );
				window.alert("Booking completed.\nInfo: "+JSON.stringify(book_ws.bookings[0] ) );
				window.location.href='coworker_search.html?userid=' + user_ID;
			}

		});	
		}}

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
	return true;
}

function ws_search(search_arr)
{
	// parse search terms, and display relevant workspace
	const disp_ws = [];
	
	search_arr.forEach ( (txt) => {
		console.log(txt);
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
		$(".div_wksp").remove();
		
		
		disp_ws.forEach ( (ws) => {
			
			let temp_str = "";
			temp_str = "<div class='div_wksp' id='ws" + ws.ID + "'><h2>" + ws.title +
				" <input type='button' class='button_to_login' value='Login & Book'></h2>" +
				"<ul><li>Location: " + ws.location + "</li>" +
				"<ul><li>Description: " + ws.desc + "</li>" +
				"<ul><li>Capacity: " + ws.capacity + " persons max</li>" +
				"<ul><li>Amenities: " + ws.amenities + "</li></ul>" +
				"<span>Avaliability: ";
			ws.avaliability.forEach( (wkday, index, arr) => {
					temp_str+= arr_wk[wkday];
					if (index < arr.length-1) {
						temp_str += ", ";
					}
			});
			temp_str += "</span></div>"
			
			$("#home_content").append(temp_str);
		});
		
	}
}