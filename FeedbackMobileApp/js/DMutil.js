/*
File: DMutil.js
Purpose: form related functions
Author: Durga Makhija
Date:
*/

/*-----------------------------------Add Reviews Page-----------------------------------------*/
function setDefaultValues()
{
	$("#dmAddForm input[type='text']").val("");
	
	//populate business tpye dropdown with default values
	insertDefaultTypes();
	
	//fetch the default email from the localstorage if any
	getDefaultEmail();
	
	//display today's date in the add form Review date
	var mydate= new Date();
	var day=mydate.getDate();
	var year=mydate.getFullYear();
	var month=mydate.getMonth()+1;
	var todayDate=year+"-"+month+"-"+day;
	$("#review_date").val(todayDate);
	
	$("#dmAddForm input[type='checkbox']").val('N');	
	$("#dmAddForm input[type='number']").val(0);
	$('textarea').val("");
}

//checks the status of checkbox on add feedback page
function toggleDivision(d){
	if ($(d).is(':checked'))
	{	
		$(d).val('Y');
		$("#rating_questions").show();
		$("#rating_questions input").addClass("required");
	}
	else
	{	
		$(d).val('N');
		$("#rating_questions").hide();
		$("#rating_questions input").removeClass("required");
		$("'#dmAddForm input[id^='rating']").val(0);
	}
}

//calculates the rating on the add feedback page
function calculateRating(){		
	var num1=$("#rating1").val();
	var num2=$("#rating2").val();
	var num3=$("#rating3").val();
	sum=Number(num1)+Number(num2)+Number(num3);
	average=sum/15;
	percent=average*100;
	$("#overall_rating").val(percent);
}

/* validates all the fields in add a feedback form */
function handleAddForm(){
	$('#dmAddForm').validate( {
			rules: {
				business_name: {
					required:true,
					rangelength:[2,30]
				},
				business_type: {
					required:true
				},
				reviewer_email: {
					required:true,
					rangelength:[5,30]
				},
				reviewer_comments:{
					rangelength:[0,50]
				},
				review_date: {
					date:true,
					required:true
				},
				rating1: {
					range:[0,5]
				},
				rating2: {
					range:[0,5]
				},
				rating3: {
					range:[0,5]
				}
			}, // end of rules
			
			messages: {
				business_name: {
					required: "Please enter the business name.",
					rangelength: "Business Name must be between 2 and 30 characters long."
				},
				business_type: {
					required: "Please select the business type."
				},
				reviewer_email: {
					required: "Reviewer email is required.",
					email: "Email entered is invalid."
				},
				reviewer_comments: {
					rangelength: "Comments must not exceed 20 characters."
				},
				review_date: {
					date: "Invalid date format.",
					required: "Review date is required."					
				},
				rating1: {
					range: "Please enter a value between 0 and 5."
				},
				rating2: {
					range: "Please enter a value between 0 and 5."
				},
				rating3: {
					range: "Please enter a value between 0 and 5."
				}
			} // end of messages					
	} ); // end form validate
	
	if($("#dmAddForm").valid())
	{
		var business_name = $("#business_name").val();
				var type_id = $("#business_type").val();
				var reviewer_email = $("#reviewer_email").val(); 
				var reviewer_comments = $("#reviewer_comments").val();
				var review_date = $("#review_date").val();
				var has_rating = $("#is_add").val(); 
				var rating1 = $("#rating1").val(); 
				var rating2 = $("#rating2").val();
				var rating3 = $("#rating3").val();
				var overallRating = $("#overall_rating").val();				
				add_dmreview(business_name, type_id, reviewer_email, reviewer_comments,review_date, has_rating, rating1, rating2, rating3, overallRating);
	}
	else
	{	
		//alert("invalid form");
	}
	return false;
} 
 
 /*-----------------------------------View All Reviews page-----------------------------------------*/
 
/*Success Response for read reviews from table*/
function ListAllReviews(res){
	var htmlStr="";
	if(res.rows.length>0)
	{
		//some records found, so fetch them			
		for(var i=0; i<res.rows.length; i++)
		{							
			htmlStr+="<li class='listviewItem' data-inline='true' data-inset='true' data-row-id="+ res.rows.item(i).id + ">"
						+ "<a href='#dmEditFeedback'>"
						+ "<h3>Business Name: " + res.rows.item(i).business_name + "</h3>"
						+ "<p><b>Reviewer Email: </b>" + res.rows.item(i).reviewer_email + "</p>"						
						+ "<p class='ui-li-aside'><b>Reviewer Date: </b>" + res.rows.item(i).review_date + "</p>"
						+ "<p><b>Comments: </b>" + res.rows.item(i).reviewer_comments + "</p>"
						+ "<p><b>Overall Rating:</b>" + res.rows.item(i).overallRating + "% " +"</p>"
						+ "</a></li>";					
		}		
		$("#dmFeedbackList").empty(); //empty the ul first
		$("#dmFeedbackList").append(htmlStr); // now append the list
		$("#dmFeedbackList").listview('refresh'); // now refresh before showing up on page
		
		// event handler for listview items
		//on the click event of a particular li element, get its id 
		$(".listviewItem").click(function () {
        var id = this.getAttribute('data-row-id');       
        
        // save selected review-id to localStorage: id is not editable
        localStorage.setItem('data-row-id', id);
        //fetch the record from review table for this id for editing
		getFeedback(id);
		});		
	}
	else
	{
		//no records found, so add new	
		$("#dmFeedbackList").hide();	//hide the ul tag
		$("#my-feedback").html("<h3>No Records found. Add a new feedback.</h3>");
	}	
}

 /*-----------------------------------Edit a Review page-----------------------------------------*/ 
 
 //populate modify page from dmreview table data
 function ShowFeedback(res){
var Record = null;
    if (res.rows.length > 0) 
    {  	// only one row expected
        Record = res.rows.item(0);
		//populate dropdown first
		edit_dmtype(Record['type_id']);
				
        // populate edit form input field
		$('#edit_business_name').val(Record['business_name']); 
		//$('#edit_business_type option:selected').val(Record['type_id']);
		$('#edit_business_type').val(Record['type_id']);
		$('#edit_reviewer_email').val(Record['reviewer_email']); 
		$('#edit_reviewer_comments').val(Record['reviewer_comments']); 
		$('#edit_review_date').val(Record['review_date']); 
		$('#edit_has_rating').val(Record['has_rating']); 
		$('#edit_rating1').val(Record['rating1']); 
		$('#edit_rating2').val(Record['rating2']); 
		$('#edit_rating3').val(Record['rating3']); 
		$('#edit_overall_rating').val(Record['overallRating']);
    }
}
 
//populates the business_type dropdown list on add feedback page with the values from dmtype table
function edit_dmtype(id){
	var sqlCheck = "SELECT * FROM dmtype";	
	feedbackDb.transaction(function (tx) {
		tx.executeSql(sqlCheck, [], 
			function(tx, res){
				if(res.rows.length = 0) 
				{	//no records found in the table, so
					//insert by default values as below							
				}
				else
				{
					//some records found in the table so,
					//populate them in the <option> element of select menu
					var len = res.rows.length;
					var code="";
					for(var i=0; i<len; i++)
					{	
						if ((i +1)== id) {
							code = code + '<option  selected="selected" value="'+res.rows.item(i).type_id+'">'+res.rows.item(i).type_name+'</option>';
						}
						else
						{
							code = code + '<option value="'+res.rows.item(i).type_id+'">'+res.rows.item(i).type_name+'</option>';
						}	
					}
					$("#edit_business_type").html(code);	
					$("#edit_business_type").selectmenu('refresh',true);				
				}
			}, onError);
	});
}
 
 //checks the status of checkbox on add feedback page
function toggleEditDivision(d){
	if ($(d).is(':checked'))
	{	
		$(d).val('Y');
		$("#edit_rating_questions").show();
		$("#edit_rating_questions input").addClass("required");
	}
	else
	{	
		$(d).val('N');
		$("#edit_rating_questions").hide();
		$("#edit_rating_questions input").removeClass("required");
	}
}

//calculates the rating on the add feedback page
function calculateEditedRating(){		
	var num1=$("#edit_rating1").val();
	var num2=$("#edit_rating2").val();
	var num3=$("#edit_rating3").val();
	sum=Number(num1)+Number(num2)+Number(num3);
	average=sum/15;
	percent=average*100;
	$("#edit_overall_rating").val(percent);
}

//can be combined as one common method
/* validates all the fields in add a feedback form */
function handleEditForm(){ 
	$('#dmEditForm').validate( {
			rules: {
				edit_business_name: {
					required:true,
					rangelength:[2,30]
				},
				edit_business_type: {
					required:true
				},
				edit_reviewer_email: {
					required:true,
					rangelength:[5,30]
				},
				edit_reviewer_comments:{
					rangelength:[0,50]
				},
				edit_review_date: {
					date:true,
					required:true
				},
				edit_rating1: {
					range:[0,5]
				},
				edit_rating2: {
					range:[0,5]
				},
				edit_rating3: {
					range:[0,5]
				}
			}, // end of rules
			
			messages: {
				edit_business_name: {
					required: "Please enter the business name.",
					rangelength: "Business Name must be between 2 and 30 characters long."
				},
				edit_business_type: {
					required: "Please select the business type."
				},
				edit_reviewer_email: {
					required: "Reviewer email is required.",
					email: "Email entered is invalid."
				},
				edit_reviewer_comments: {
					rangelength: "Comments must not exceed 20 characters."
				},
				edit_review_date: {
					date: "Invalid date format.",
					required: "Review date is required."					
				},
				edit_rating1: {
					range: "Please enter a value between 0 and 5."
				},
				edit_rating2: {
					range: "Please enter a value between 0 and 5."
				},
				edit_rating3: {
					range: "Please enter a value between 0 and 5."
				}
			} // end of messages					
	} ); // end form validate
	
	if($("#dmEditForm").valid())
	{	
		var feedbackId = localStorage.getItem('data-row-id');
		var business_name = $("#edit_business_name").val();
				var type_id = $("#edit_business_type option:selected").val();
				var reviewer_email = $("#edit_reviewer_email").val(); 
				var reviewer_comments = $("#edit_reviewer_comments").val();
				var review_date = $("#edit_review_date").val();
				var has_rating = $("#edit_is_add").val(); 
				var rating1 = $("#edit_rating1").val(); 
				var rating2 = $("#edit_rating2").val();
				var rating3 = $("#edit_rating3").val();
				var overallRating = $("#edit_overall_rating").val();
				updateReview(feedbackId, business_name, type_id, reviewer_email, reviewer_comments, review_date, has_rating, rating1, rating2, rating3, overallRating);
	}
	else
	{	
		//alert("invalid form");
	}
	return false;
}

// success response after saving the updated review in the dmreview table
function onUpdateReviewSuccess(res)
{
	// refresh an element on any page to refresh the new values
    $("#dmFeedbackList").listview('refresh');	
    // refresh the list
    getAllReviews();	
	$.mobile.changePage('#dmViewFeedback', { transition: 'slide' });	
}

 /*-----------------------------------Delete a Review - delete btn- edit page-----------------------------------------*/ 
 
 function onDeleteReviewSuccess(res)
{	
	// refresh an element on any page to refresh the new values
  	$("#dmFeedbackList").listview('refresh');	
    // refresh the list
   getAllReviews();	
	$.mobile.changePage('#dmViewFeedback', { transition: 'slide' });
} 
 /*-----------------------------------Cancel and return to view reviews page-----------------------------------------*/ 
//on cancel success 
function onCancelSuccess(res)
{	
	$("#dmFeedbackList").listview('refresh');	
    // refresh the list
    getAllReviews();	
	$.mobile.changePage('#dmViewFeedback', { transition: 'slide' });
}

  /*-----------------------------------Settings page-----------------------------------------*/ 
  
// shows confirmation dialog box before deleting the review table, drop table only if ok button is clicked.  
function getConfirmation(){
   var retVal = confirm("All review records will be deleted permanently. Continue?");
   if( retVal == true ){   
   	dropTypeTable();			
		dropReviewTable();		
		localStorage.clear();
		//recreate the tables
		createTables();
	  return true;
   }
   else{ 
      //hide
	  return false;
   }
} 

//validate and save the default email in localStorage
function setDefaultEmail()
{
	var email="";
	email = $("#defaultEmail").val();
	$("#dmSettingsForm").validate( {
		rules: {
			defaultEmail: {
				email: true
			}
		},//end of rules		
		messages: {
			defaultEmail: {
				email: "Email entered is invalid."
			}
		}//end of messages
	});	
	if($("#dmSettingsForm").valid())
	{
		//email is valid, so
		//save this email in localstorage
		localStorage.setItem("defaultEmail",email);	
		alert("default email set!");
		getDefaultEmail();	
	}
	else
	{
		//email is not valid		
	}
}

//fetch the default email from the localstorage if any
function getDefaultEmail()
{
	var email = "";
	if(localStorage.getItem("defaultEmail") != null)
	{
		//get the stored value
		email = localStorage.getItem("defaultEmail");
	}
	else
	{
		//save a default value instead of blank
			email="";
	}
	$("#reviewer_email").val(email);	
}	
/*-----------------------------------Search page-----------------------------------------*/

/*Success Response for search reviews by business name*/
function onSearchReviewsSuccess(res){
	var htmlStr="";	
	if(res.rows.length>0)
	{
		//some records found, so fetch them			
		for(var i=0; i<res.rows.length; i++)
		{						//class='searchlistviewItem'	
			htmlStr+="<li  data-inline='true' data-inset='true'  data-row-id="+ res.rows.item(i).id + ">"			
						+ "<a href='#dmEditFeedback'>"
						+ "<h3>Business Name: " + res.rows.item(i).business_name + "</h3>"					
						+ "<p><b>Reviewer Email: </b>" + res.rows.item(i).reviewer_email + "</p>"
						+ "<p class='ui-li-aside'><b>Reviewer Date: </b>" + res.rows.item(i).review_date + "</p>"
						+ "<p><b>Comments: </b>" + res.rows.item(i).reviewer_comments + "</p>"
						+ "<p><b>Overall Rating:</b>" + res.rows.item(i).overallRating + "% " +"</p>"
						+ "</a></li>";										
		}
		$("#dmSearchFeedbackList").show();	
		$("#dmSearchFeedbackList").empty(); //empty the ul first
		$("#dmSearchFeedbackList").append(htmlStr); // now append the list
		$("#dmSearchFeedbackList").listview('refresh'); // now refresh before showing up on page	
		
		// event handler for listview items
		//on the click event of a particular li element, get its id 
		$(".searchlistviewItem").click(function () {
        var id = this.getAttribute('data-row-id');  
        // save selected review-id to localStorage: id is not editable
        localStorage.setItem('data-row-id', id);
        //fetch the record from review table for this id for editing
		getFeedback(id);
		});					
	}
	else
	{
		//no matching records found, 
		$("#dmSearchFeedbackList").hide();	//hide the ul tag
		$("#search_results").html("<h3>No Matching Records found. Try another word.</h3>");
	}	
}

/* ----------------------------Manage types page----------------------------------------------*/

/*Success Response for read types from table*/
function ListAllTypes(res){
	var htmlStr="";
	if(res.rows.length>0)
	{
		//some records found, so fetch them	
		$("#TypeList").show(); // show records
		$("#dmTypeInputs").hide();		// hide input element for adding type
		for(var i=0; i<res.rows.length; i++)
		{							
			htmlStr+="<li class='typelistviewItem' data-inline='true' data-inset='true' data-row-id="+ res.rows.item(i).type_id + ">"
						+ "<a href='#'>"
						+ "<p><b>Type Id:  </b>" + res.rows.item(i).type_id + "</p>"
						+ "<p><b>Type Name: </b>" + res.rows.item(i).type_name + "</p>"	
						+ "</a></li>";					
		}	
		
		$("#dmTypeList").empty(); //empty the ul first
		$("#dmTypeList").append(htmlStr); // now append the list
		$("#dmTypeList").listview('refresh'); // now refresh before showing up on page
			
		// event handler for listview items
		//on the click event of a particular li element, get its id 
		$(".typelistviewItem").click(function () {
        var id = this.getAttribute('data-row-id');       
        
        // save selected type-id to localStorage: id is not editable
        localStorage.setItem('type-id', id); 
        //fetch the record from type table for this id for editing
		getType(id);
		});		
	}
	else
	{
		//no records found, so add new	
		$("#TypeList").hide(); // //hide the ul tag
		$("#dmTypeInputs").show();		// show input element for adding type
		$("#message").html("<h3>No Records found. Add a new type.</h3>");
	}	
}

/*-----------------------------------Edit a Type page-----------------------------------------*/ 
 
 //populate modify page from dmtype table data
function ShowType(res){ 
var Record = null;
    if (res.rows.length > 0) 
    {  	// only one row expected
        Record = res.rows.item(0);
        $("#TypeList").hide(); // //hide the ul tag division
		$("#dmTypeInputs").show();		// show input element for editng type					
        // populate edit form input field
		$('#typename').val(Record['type_name']); 	
    }
}


// success response after managing  type in the dmtype table
function onManageTypeSuccess(res)
{
	// refresh an element on any page to refresh the new values
    $("#dmTypeList").listview('refresh');	
    // refresh the list
    getAllTypes();	
	$.mobile.changePage('#dmManageTypes', { transition: 'slide' });	
}
 