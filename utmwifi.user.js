// ==UserScript==
// @name        mfs utmwifi autologin
// @namespace   http://ums.fulba.com/
// @match       https://wifi.yes.my/pas/parsed/utm1/index_desktop.html*
// @match       https://wifi.yes.my/pas/start*
// @match       https://apc.aptilo.com/apc/limit.phtml*
// @match       https://apc.aptilo.com/apc/error.phtml*
// @match       http://apc.aptilo.com/cgi-bin/restart*
// @downloadURL https://ums.fulba.com/files/utmwifi.user.js
// @description Automates 'brute-force' login process on "4G WiFi by Yes @ UTM" wifi connections
// @author      mfaizsyahmi
// @version     0.5.0_test
// @grant       none
// ==/UserScript==
/*jshint multistr: true */

/* MFS'S UTM WIFI AUTO LOGIN SCRIPT
 * Copyright(c) 2014-2015 mfaizsyahmi
 * Released under MIT License
 */

// path vars
var loginpath = '/pas/parsed/utm1/index_desktop.html',
	limitpath = '/apc/limit.phtml',
	invpath = '/apc/start',
	errpath = '/apc/error.phtml',
	restartURL = 'http://apc.aptilo.com/cgi-bin/restart';
	
// delays
// -added compatibility with non-GM extensions
var loginDelay = (typeof GM_getValue == 'undefined') ? 300 : GM_getValue('loginDelay', 300),
	backDelay = (typeof GM_getValue == 'undefined') ? 300 : GM_getValue('backDelay', 300);

// keydown handler
// used to escape the automation
var aborting;
document.onkeydown = function(evt) {
    evt = evt || window.event;
    if (evt.ctrlKey) {
        aborting = true;
    }
};

document.addEventListener("DOMContentLoaded", function(e) { 
	if (window.location.pathname == loginpath) {
		/* SCRIPT FOR THE LOGIN PAGE
		 * What it does: Closes the popup, checks the checkbox, hits the login button
		 */
		//add instruction for halting automation (hold ctrl key)
		var l = document.getElementById('light1');
		l.innerHTML += '<hr/><p>MFS AUTO LOGIN IS RUNNING. Hold down Ctrl to stop automation.</p>';
		
		setTimeout( function() {
			// close the popup
			Close1Window();
			
			// abort if ctrl key is pressed
			if (aborting) return;
			
			// check if page returns an error message
			var pageErr = document.getElementById('error-user').innerHTML;
			if (pageErr.length) { // if error message is present
				// inform user about it
				alert('MESSAGE FROM MFS AUTO LOGIN:\n\
The login page returns an error.\n\n\
Please open a new tab (important!) and try again. Hold down your Ctrl key to stop the automation, \
then check that you have typed the correct login details, and that you haven\'t exceeded the 20GB quota.');
				// don't check the checkbox here since it removes the error message, making users unaware of it.
				
			} else { // no error message
				// check the checkbox (or it'd forget your login details)
				document.getElementById('checker').checked = true;
				// equivalent to pressing the login button
				checkFields();
			}
		}, loginDelay);
	} else if (window.location.pathname == limitpath) {
		/* SCRIPT FOR THE "LIMIT REACHED" PAGE
		 * What it does: hit the back button
		 */
		var greet = [
			'mfaizsyahmi says hi! Wanna give him a hug? :3',
			'Add me on Steam! My id is "kimilil" :3',
			'Be sure to keep this script updated! :3',
			'Recommended for use with Greasemonkey on Firefox! :3',
			'"Do I provide tehnical support? NO!" --mfaizsyahmi :3',
			'Released under the MIT License. Google them! :3'
		];
		document.body.innerHTML += '<p style="color:green">>> ' + greet[Math.floor(Math.random() *( greet.length ))] + '</p>';
		setTimeout( function() { if(!aborting) {window.history.back(1);} }, backDelay);
	} else if (window.location.pathname == invpath || window.location.pathname == errpath || window.location.pathname == '/cgi-bin/restart') {
		/* SCRIPT FOR THE 'INVALID SESSION KEY' PAGE
		 * What it does : load the start page (as given by the page)
		 */
		 window.location = restartURL;
	}
});
