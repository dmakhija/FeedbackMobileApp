/*
File: DMdatabase.js
Purpose: database related CRUD functions
Author: Durga Makhija
*/

/* Create tables */

function createTables(){
    // create the table if it doesn't exist
    var sqlCreateReview ="CREATE TABLE IF NOT EXISTS dmreview("
		+ "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"
		+ "business_name VARCHAR(30),"
		+ "type_id INTEGER(11),"
		+ "reviewer_email VARCHAR(30),"
		+ "reviewer_comments TEXT,"
		+ "review_date DATE,"
		+ "has_rating VARCHAR(1) DEFAULT 'N',"
		+ "rating1 INTEGER(11) DEFAULT 0,"
		+ "rating2 INTEGER(11) DEFAULT 0,"
		+ "rating3 INTEGER(11) DEFAULT 0,"
		+ "overallRating INTEGER(11) DEFAULT 0"
		+ ");" ; 
		
	var sqlCreateType = "CREATE TABLE IF NOT EXISTS dmtype (type_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, type_name VARCHAR(20));";	
		
	feedbackDb.transaction(function (tx){
		tx.executeSql(sqlCreateReview, [], null, onError);
		tx.executeSql(sqlCreateType, [], null, onError);
		//insertDefaultTypes();
	});
			
}

/* Remove entire table */
function dropReviewTable() { 
	var sqlDropReview = "DROP TABLE dmreview;";
    feedbackDb.transaction(function (tx) {
        tx.executeSql(sqlDropReview, [], null, onError);
    });
}
/* Remove entire table */
function dropTypeTable() { 
	var sqlDropType = "DROP TABLE dmtype;";	
    feedbackDb.transaction(function (tx) {
		tx.executeSql(sqlDropType, [], null, onError);
    });
}
//insert default type in dmtype table initially
function insertDefaultTypes(){
	var sqlCheck = "SELECT * FROM dmtype;";
	var sqlInsertType ="INSERT INTO dmtype (type_name) VALUES (?);";
	
	//first check if there is any record in this table
	feedbackDb.transaction(function (tx) {
		tx.executeSql(sqlCheck, [], 
			function(tx, res){
				if(res.rows.length == 0) 
				{	//no records found in the table, so
					//insert by default values as below
					tx.executeSql(sqlInsertType, ["Coffee Shop"], null, onError);
					tx.executeSql(sqlInsertType, ["Canadian"], null, onError);
					tx.executeSql(sqlInsertType, ["Asian"], null, onError);
					tx.executeSql(sqlInsertType, ["Other"], null, onError);
					get_dmtype();
				}
				else
				{	//some records found in the table so,
					//continue to add new records after last insert
					get_dmtype();
				}
			}, onError);
	});
}
//populates the business_type dropdown list on add feedback page with the values from dmtype table
function get_dmtype(){
	var sqlCheck = "SELECT * FROM dmtype ORDER BY type_name desc;";
	var sqlInsertType ="INSERT INTO dmtype (type_name) VALUES (?);";
	
	//first check if there is any record in this table
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
						if (i == 0) {
							code = code + '<option selected="selected" value="'+res.rows.item(i).type_id+'">'+res.rows.item(i).type_name+'</option>';
						}
						else
						{
							code = code + '<option value="'+res.rows.item(i).type_id+'">'+res.rows.item(i).type_name+'</option>';
						}	
					}
					$("#business_type").html(code);
					$("#business_type").selectmenu('refresh',true);
				}
			}, onError);
	});
}
/*-----------------------------------Add Reviews to the dmreview table-----------------------------------------*/

//add records in the dmreview table
function add_dmreview(business_name, type_id, reviewer_email, reviewer_comments,review_date, has_rating, rating1, rating2, rating3, overallRating){
		var sqlInsertReview ="INSERT INTO dmreview (business_name, type_id, reviewer_email, reviewer_comments, review_date, has_rating, rating1, rating2, rating3, overallRating) VALUES (?,?,?,?,?,?,?,?,?,?);";
	
	feedbackDb.transaction(function (tx) {
		tx.executeSql(sqlInsertReview, [business_name, type_id, reviewer_email, reviewer_comments,review_date, has_rating, rating1, rating2, rating3, overallRating], 
			function(tx, res){
				alert("New review added"); 
				location.reload(true);
				setDefaultValues();
				}, onError);
	});
}

/*-----------------------------------Read all Reviews from the dmreview table-----------------------------------------*/

/* read from test table */
function getAllReviews() {
    // fetch data from test table 
	var readReview ="SELECT * FROM dmreview ORDER BY review_date desc;";
	feedbackDb.transaction(function (tx){
		tx.executeSql(readReview, [], function(tx, res){ ListAllReviews(res);}, onError);
	});			
}
/*-----------------------------------Find a selected Review by id  from the dmreview table-----------------------------------------*/

//get the details of selected review by id  from the dmreview table for editing
function getFeedback( id ) { 
    feedbackDb.transaction(function (tx) {
        tx.executeSql("SELECT * FROM dmreview WHERE id = ?",
				[ id ],
                function (tx, res) { ShowFeedback(res) ;},
                onError);
    });
}
/*-----------------------------------Update a selected Review by id  to the dmreview table-----------------------------------------*/

//update the review deatils
function updateReview(feedbackId, business_name, type_id, reviewer_email, reviewer_comments,review_date, has_rating, rating1, rating2, rating3, overallRating)
{	
	var sqlUpdateReview = "UPDATE dmreview SET business_name ='" + business_name +"', type_id='" + type_id +"', reviewer_email='" + reviewer_email + 
							"', reviewer_comments='" + reviewer_comments + "', review_date='" + review_date + "', has_rating='" + has_rating +"', rating1=" + rating1 +
							", rating2=" + rating2 + ", rating3=" + rating3 + ", overallRating=" + overallRating + " WHERE  id=" + feedbackId;
							
		feedbackDb.transaction(function (tx) {
		tx.executeSql(sqlUpdateReview, [], function(tx,res){ onUpdateReviewSuccess(res);}, onError);		
		//alert(sqlUpdateFeedback);
	});
}
/*-----------------------------------Delete a selected Review by id  from the dmreview table-----------------------------------------*/

function deleteReview()
{
	var confirmDelete = confirm("This feedback record  will be deleted permanently. Continue?");
   if( confirmDelete == true )
   {   
		//delete record from review table
		var id = localStorage.getItem('data-row-id');			
		var sqlDelete = "DELETE FROM dmreview WHERE id = " + id + ";";
		
		feedbackDb.transaction(function (tx) {
        tx.executeSql(sqlDelete, [],
                function (tx, res) {
                    onDeleteReviewSuccess(res);
                },
                onError);
    });
	  return true;
   }
   else
   {
      //hide
	  return false;
   }
}

/*-----------------------------------Search page-----------------------------------------*/
function SearchReviews() { 	alert("searching");
	var search_term = $("#search-basic").val();
	alert(search_term);
	var sqlName="SELECT * FROM dmreview where business_name LIKE?"; 	
	feedbackDb.transaction(function (tx) 
	{
		tx.executeSql(sqlName, ["%"+search_term+"%"] , 
		function(tx,res){ onSearchReviewsSuccess(res);}, onError);		
	});	
}

/*-----------------------------------Read all Types from the dmtype table-----------------------------------------*/

/* read from type table */
function getAllTypes() { 
	var readType ="SELECT * FROM dmtype ORDER BY type_id desc;";
	feedbackDb.transaction(function (tx){
		tx.executeSql(readType, [], function(tx, res){ ListAllTypes(res);}, onError);
	});			
}
/*-----------------------------------Find a selected Type by id  from the dmtype table-----------------------------------------*/

function getType(id) { 
	var SqlStr="SELECT * FROM dmtype WHERE type_id =?";	
    feedbackDb.transaction(function (tx) {
        tx.executeSql(SqlStr,
				[id],
                function (tx, res) { ShowType(res) ;},
                onError);
    });
}

function addType()
{
	//set the input box to empty
	$("#typenameLabel").text("Add New Type Below:");
	//delete localStorage type-id key
	localStorage.removeItem("type-id");
	var typeName="";
	typeName=$("#typename").val();
	if(typeName!=null && typeName!="")
	{
		//valid input
		var sqlCheck="SELECT * FROM dmtype WHERE type_name='"+ typeName + "'";
		feedbackDb.transaction(function (tx){
		tx.executeSql(sqlCheck, [], 
			function(tx, res){ 
				var count=res.rows.length;
				if(count==0)
				{
					$("#typenameLabel").removeClass("error");
					//no such record found, is valid input, add to table
					var sqlInsert ="INSERT INTO dmtype (type_name) VALUES (?);";
					feedbackDb.transaction(function (tx) {
						tx.executeSql(sqlInsert, [typeName], function(tx,res){onManageTypeSuccess(res);},onError);
					});
				}
				else{
					//matching record already exists in the table
					//cannot duplicate data
					$("#typenameLabel").addClass("error");
					$("#typenameLabel").text("Type Already Exixts. Try New Value.!");
				}
				}, onError);
		});	
	}
	else
	{
		//invalid input
		$("#typenameLabel").text("Type Name is required!");
		$("#typenameLabel").addClass("error");
	}
	
}

function updateType()
{
	var typeId=localStorage.getItem("type-id");
	var typeName="";
	typeName=$("#typename").val();
	if(typeName!=null && typeName!="")
	{
		//save data in table
		var sqlUpdate="UPDATE dmtype SET type_name='"+typeName+"' WHERE type_id="+typeId;
		feedbackDb.transaction(function (tx) {
		tx.executeSql(sqlUpdate, [], 
			function(tx,res){ onManageTypeSuccess(res);}, onError);				
		});
	}
	else
	{
		//invalid data, show errors		
		//alert("Type Name is required!");
		$("#typenameLabel").text("Type Name is required!");
		$("#typenameLabel").addClass("error");
	}
}

/*-----------------------------------Delete a selected Review by id  from the dmreview table-----------------------------------------*/

function deleteType()
{
	var confirmDelete = confirm("This type record  will be deleted permanently. Continue?");
   if( confirmDelete == true )
   {   
		//delete record from review table
		var id = localStorage.getItem('type-id');			
		var sqlDelete = "DELETE FROM dmtype WHERE type_id = " + id + ";";
		
		feedbackDb.transaction(function (tx) {
        tx.executeSql(sqlDelete, [],
                function (tx, res) {
                    onManageTypeSuccess(res);
                },
                onError);
    });
	  return true;
   }
   else
   {
      //hide
	  return false;
   }
}



