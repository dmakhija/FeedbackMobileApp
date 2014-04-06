/*
File: DMabout.js
Purpose: database related CRUD functions
Author: Durga Makhija
*/

/* Create tables */
function displayAbout() {
    try {	
        var appname = blackberry.app.name;
        var appversion = blackberry.app.version;
        var appauthor = blackberry.app.author;
        alert(appname + ": " + appversion + "\nBy: " + appauthor);
    } catch (e) {
        alert(e);
    }
}