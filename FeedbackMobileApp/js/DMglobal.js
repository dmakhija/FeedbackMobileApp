/*
File: DMglobal.js
Purpose: create/open database; document ready features
Author: Durga Makhija
Date: 
*/

//database variable - global to the application
var feedbackDb;

//error response
function onError(tx, error) {
	alert("SQL error: " +  error.message);
}

$(document).ready(function() {
	
	// create and/or open the database
	feedbackDb = openDatabase('DMFeedbackDb', '1.0', 'DM Feedback Database', 2 * 1024 * 1024);
	
	// create tables
	createTables();	
	setDefaultValues();
	//insertDefaultTypes();
	
	/*-------------------------------Add Reviews Form-------------------------------------*/

	//call toggledivision function on the change event of checkbox
	$("input[id^='is_add']").change(function () {
		 	  	toggleDivision(this);
 	});

	//calculate ratings on the fly on the add feedback page
	$("input[id^='rating']").keyup(function(){ 
		calculateRating(); 
	});	
	
	//validate Add form fields on click event of save btn
	$("#btnSave").on("click", handleAddForm);	
	
	/*-------------------------------View All Reviews Page-------------------------------------*/
	
	//on page show event, populate listview to display all reviews , sort by date descending 
	$("#dmViewFeedback").on("pageshow", function( event ) {	
		$("#typenameLabel").removeClass("error");
		getAllReviews();
	});
	
	/*-------------------------------Edit a Review Page-------------------------------------*/
	//call toggledivision function on the change event of checkbox
	$("input[id^='edit_is_add']").change(function () {
		 	  	toggleEditDivision(this);
 	});

	//calculate ratings on the fly on the edit feedback page
	$("input[id^='edit_rating']").keyup(function(){
		calculateEditedRating(); 
	});	
	
	//validate Edit form fields on click event of update btn
	$("#btnUpdate").on("click", handleEditForm);
	
	//return to reviews list page on the click event of cancel button
	$("#btnCancel").on("click", onCancelSuccess);			
	
	//delete selected feedback frm review table
	$("#btnDelete").on("click", deleteReview);	
	
	/*-------------------------------Settings Page-------------------------------------*/
	
	//on click event of clear database button, get confirmation frm user
	$("#btnClearDb").on("click", getConfirmation);	
	
	//set the default email in the localstorage when defaultEmail button on settings page is clicked
	$( "#btnSaveDefaults" ).on( "click", setDefaultEmail);	
		
	/*-------------------------------Manage types Page-------------------------------------*/
	$("#dmManageTypes").on("pageshow", function( event ) {	
		$("#dmTypeInputs").hide();
		getAllTypes();
	});
	//update type record activity
	$("#btnUpdateType").on("click", updateType);
	
	//delete type record activity
	$("#btnDeleteType").on("click", deleteType);
	
	//cancel type record activity
	$("#btnCancelType").on("click", onManageTypeSuccess);
	
	//add type record
	$("#btnAddType").on("click", addType);
		
}); // end ready


