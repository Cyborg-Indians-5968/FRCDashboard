var dash = {
	miniRobot : document.getElementById("miniRobot"),
	connectBox : document.getElementById("robot-state-connected"),
	connectLabel : document.getElementById("connected-label"),
	disconnectBox : document.getElementById("robot-state-disconnected"),
	disconnectLabel : document.getElementById("disconnected-label"),
	unknownBox : document.getElementById("robot-state-unknown"),
	unknownLabel : document.getElementById("unknown-label"),
	b1 : document.getElementById("blueAlliance1"),
	b2 : document.getElementById("blueAlliance2"),
	b3 : document.getElementById("blueAlliance3"),
	r1 : document.getElementById("redAlliance1"),
	r2 : document.getElementById("redAlliance2"),
	r4 : document.getElementById("redAlliance3"),
	x : -1,
	y : -1
};

//Whether measured times are in teleop or auto
var isTeleop = false;

//Whether each time warning has already been said
var said90 = false;
var said60 = false;
var said45 = false;
var said30 = false;
var said15 = false;
var said10 = false;
var said5 = false;

NetworkTables.addRobotConnectionListener(onRobotConnection, true);
//onRobotConnection(true);
NetworkTables.addGlobalListener(onValueChanged, true);

function onRobotConnection(connected) {

	if (connected) {
		disconnectLabel.style.display = "none";
		unknownLabel.style.display = "none";
		connectLabel.style.display = "inline-flex";
	}
	else if (!connected) {
		disconnectLabel.style.display = "inline-flex";
		unknownLabel.style.display = "none";
		connectLabel.style.display = "none";
	}
}

function onValueChanged(key, value, isNew) {
	// Sometimes, NetworkTables will pass booleans as strings. This corrects for that.
	if (value == 'true') {
		value = true;
	} else if (value == 'false') {
		value = false;
	}

	// This switch statement chooses which UI element to update when a NetworkTables variable changes.
	switch (key) {
		case '/SmartDashboard/timeRemaining':
			// When this NetworkTables variable is true, the timer will start.
			// You shouldn't need to touch this code, but it's documented anyway in case you do.
			var s = Math.floor(value);

			// Make sure timer is reset to black when it starts
			ui.timer.style.color = '#FFFFFF';

			// Minutes (m) is equal to the total seconds divided by sixty with the decimal removed.
			var m = Math.floor(s / 60);
			// Create seconds number that will actually be displayed after minutes are subtracted
			var visualS = (s % 60);

			if(s == -1.0){
				m = 0;
				visualS = 0;
			}
			else if (s <= 30) {
				// Solid red timer when less than 30 seconds left.
				ui.timer.style.color = '#FF3030';
			}

			// Add leading zero if seconds is one digit long, for proper time formatting.
			visualS = visualS < 10 ? '0' + visualS : visualS;
			ui.timer.innerHTML = m + ':' + visualS;

			if(s == 90 && !said90 && isTeleop){
				var audio = new Audio('voice\\90seconds.mp3');
				audio.play();
				said90 = true;
			}
			else if(s == 60 && !said60 && isTeleop){
				var audio = new Audio('voice\\60seconds.mp3');
				audio.play();
				said60 = true;
			}
			else if(s == 45 && !said45 && isTeleop){
				var audio = new Audio('voice\\45seconds.mp3');
				audio.play();
				said45 = true;
			}
			else if(s == 30 && !said30 && isTeleop){
				var audio = new Audio('voice\\30seconds.mp3');
				audio.play();
				said30 = true;
			}
			else if(s == 15 && !said15 && isTeleop){
				var audio = new Audio('voice\\15seconds.mp3');
				audio.play();
				said15 = true;
			}
			else if(s == 10 && !said10 && isTeleop){
				var audio = new Audio('voice\\10seconds.mp3');
				audio.play();
				said10 = true;
			}
			else if(s == 5 && !said5 && isTeleop){
				var audio = new Audio('voice\\5seconds.mp3');
				audio.play();
				said5 = true;
			}
			else if(s == 5 && !isTeleop){
				isTeleop = true;
			}
			break;

		case '/SmartDashboard/warnings/none':
			if(value) document.getElementById("None").style.visibility="visible";
			break;
		case '/SmartDashboard/warnings/collision':
			if(value) document.getElementById("Collision").style.visibility="visible";
			break;
		case '/SmartDashboard/warnings/pneumatics':
			if(value) document.getElementById("Pneumatics").style.visibility="visible";
			break;
		case '/SmartDashboard/warnings/temperature':
			if(value) document.getElementById("Temperature").style.visibility="visible";
			break;
		case '/SmartDashboard/warnings/collision':
			if(value) document.getElementById("Collision").style.visibility="visible";
			break;
		case '/SmartDashboard/warnings/done':
			if(value) document.getElementById("Done").style.visibility="visible";
			break;

		case '/SmartDashboard/climbingRope':
			if (value == -1) climb(-1);
			else if (value == 1) climb(1);
			break;
		case '/SmartDashboard/climbHeight':
			updateClimbHeight(value);
		case '/SmartDashboard/pressure':
			updatePressure(value);
	}
}

// Automode and Warning tabs

function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

function updateClimbHeight(inches) {
	document.getElementById("climbMeter").value = inches;
	document.getElementById("climbNumber").innerHTML = inches;
}

function updatePressure(pressure) {
	document.getElementById("pressureMeter").value = pressure;
	document.getElementById("pressureNumber").innerHTML = pressure;
}

function cameraSelect() {
	document.getElementById("cameraSelection").style.visibility="hidden";
	if (document.getElementById("camera8070").checked) {
		document.getElementById("camera1").style.visibility="visible";
		document.getElementById("camera2").style.visibility="hidden";
	} else if (document.getElementById("camera8080").checked) {
		document.getElementById("camera2").style.visibility="visible";
		document.getElementById("camera1").style.visibility="hidden";
	}
}

function climb(climbing) {
	if (climbing == 1) {
		var elem = document.getElementById("climb");
	  var angle = 0;
	  var id = setInterval(frame, 5);
	  function frame() {
			angle++;
			document.getElementById("climb").style.transform = 'rotate(' + angle + 'deg)';
	  }
	} else if (climbing == -1) {
		var elem = document.getElementById("climb");
	  var angle = 0;
	  var id = setInterval(frame, 5);
	  function frame() {
			angle--;
			document.getElementById("climb").style.transform = 'rotate(' + angle + 'deg)';
	  }
	} else if (climbing == 0) {
		var elem = document.getElementById("climb");
	  var angle = 0;
	  var id = setInterval(frame, 5);
	  function frame() {
			document.getElementById("climb").style.transform = 'rotate(' + angle + 'deg)';
	  }
	}
}

function pneumatics(move) {
	var elem = document.getElementById("pneumatics");
	var yPos = 0;
	if (move == 1) {
	  var id = setInterval(frame, 5);
	  function frame() {
			if (yPos > -30) {
				yPos--;
				elem.style.transform = 'translateY(' + yPos + 'px)';
			}
	  }
	} else if (move == -1){
	  var id = setInterval(frame, 5);
	  function frame() {
			if (yPos < 30) {
				yPos++;
				elem.style.transform = 'translateY(' + yPos + 'px)';
			}
	  }
	}
}

function addListeners() {
	document.getElementById("Nothing").addEventListener("change", autoDisable);
	dash.miniRobot.addEventListener("touchmove", getTouchPosition, false);
	dash.miniRobot.addEventListener("touchend", function() {
		dash.miniRobot.style.backgroundColor = "red";
	}, false);
}

function autoDisable() {
	if(document.getElementById("Nothing").checked) {
		document.getElementById("Hopper").disabled=true; document.getElementById("Hopper").checked=false;
		document.getElementById("Dump").disabled=true; document.getElementById("Dump").checked=false;
		document.getElementById("Gear").disabled=true; document.getElementById("Gear").checked=false;
		document.getElementById("Baseline").disabled=true; document.getElementById("Baseline").checked=false;
	}
	else {
		document.getElementById("Hopper").disabled=false;
		document.getElementById("Dump").disabled=false;
		document.getElementById("Gear").disabled=false;
		document.getElementById("Baseline").disabled=false;
	}
}

function pixelsToInches(height, base) {
	//console.log("Height: " + height);
	//console.log("Width: " + base);

	// Height of field image is 620 px
	// Width of field image is 282 px

	// Height of real field is 652 in
	// Width of real field is 324 in

	// Height ratio: 1.051612903 in per px
	// Width ratio: 1.14893617 in per px
	var inchesHeight = height * 1.051612903;
	var inchesWidth = base * 1.14893617;

	console.log(inchesHeight + " inches height");
	console.log(inchesWidth + " inches width");

	//NetworkTables.putNumber("fieldX", inchesWidth);
	//NetworkTables.putNumber("fieldY", inchesHeight);
}

function checkTeleop() {
	if (isTeleop) {
		document.getElementById("auto-label").style.visibility = "hidden";
		document.getElementById("teleop-label").style.visibility = "visible";
	} else if (!isTeleop) {
		document.getElementById("teleop-label").style.visibility = "hidden";
		document.getElementById("auto-label").style.visibility = "visible";
	}
	//console.log(isTeleop);
}

function getTouchPosition(event) {
	var left = 344;
	var right = 631;
	var up = 50;
	var down = 670;

	dash.miniRobot.style.backgroundColor = "green";
	var touch = event.targetTouches[0];
	var x = touch.pageX-25;
	var y = touch.pageY-25;
	var airship1 = document.getElementById("airship1");

	if (x >= left && x <= right) { // Keep these conditionals separate so the robot can be dragged along the edge
			// Place element where the finger is
		dash.miniRobot.style.left = x + 'px';
	}
	if (y >= up && y <= down) {
		dash.miniRobot.style.top = y + 'px';
	}

	if (x > right) x = right;
	if (x < left) x = left;
	if (y < up)  y = up;
	if (y > down) y = down;

	if (document.getElementById("redFieldSmall").style.visibility=="visible") { // Matching the computer coordinates to the field coordinates
		y *= -1;
		x -= left;
		y += down;
	} else if (document.getElementById("blueFieldSmall").style.visibility=="visible") {
		x *= -1;
		x += right;
		y -= up;
	}

	if (dash.miniRobot.style.backgroundColor == "red") {
		x = -1;
		y = -1;
	}

	dash.x = x;
	dash.y = y;
	pixelsToInches(dash.y, dash.x);
	event.preventDefault();
}

function switchCam(e) { // Switch camera feeds on key press
	var blueCam = document.getElementById("camera1");
	var greenCam = document.getElementById("camera2");
	if (e.keyCode == 61) { // equals/plus button
		if (blueCam.style.visibility==="visible") {
			blueCam.style.visibility="hidden";
			greenCam.style.visibility="visible";
		} else if (greenCam.style.visibility==="visible") {
			greenCam.style.visibility="hidden";
			blueCam.style.visibility="visible";
		}
	}
}

function autoSelect() {
	var submitted;
	if (document.getElementById("submitAuto").checked) {
		var nothing = document.getElementById("Nothing");
		var hopper = document.getElementById("Hopper");
		var dump = document.getElementById("Dump");
		var gear = document.getElementById("Gear");
		var baseline = document.getElementById("Baseline");

		if (nothing.checked || hopper.checked || dump.checked || gear.checked || baseline.checked) {
			submitted = true;
			var autoModes = "";
			if (hopper.checked) autoModes += "hopper";
			if (dump.checked) autoModes += "dump";
			if (gear.checked) autoModes += "gear";
			if (baseline.checked) autoModes += "baseline";
			console.log(autoModes);
			//NetworkTables.putValue("autoModes", autoModes); // Concatenates autoModes string so Java can uses contains() to get modes
		} else {
			document.getElementById("submitAuto").checked = false;
		}
	}
		else {
		submitted = false;
		document.getElementById("Auto").reset();
	}
}

function dashboardInit() { // Called after alliance is submitted
		addListeners();

		var id = setInterval(frame, 5);
	  function frame() {
			checkTeleop();
	  }
}

function allianceSelect() {
	var blueFieldSmall = document.getElementById("blueFieldSmall");
	var redFieldSmall = document.getElementById("redFieldSmall");

	var blueFieldBig = document.getElementById("blueFieldBig");
	var redFieldBig = document.getElementById("redFieldBig");

	document.getElementById("colorSelection").style.visibility="hidden";
	if(dash.b1.checked || dash.b2.checked || dash.b3.checked) {
		blueFieldSmall.style.visibility="visible";
		blueFieldBig.style.visibility="visible";
		dash.miniRobot.src="images/minirobotBlue.png";
		dash.miniRobot.style.visibility="visible";
	}

	if(dash.r1.checked || dash.r2.checked || dash.r4.checked) {
		redFieldSmall.style.visibility="visible";
		redFieldBig.style.visibility="visible";
		dash.miniRobot.src="images/minirobotRed.png";
		dash.miniRobot.style.visibility="visible";
	}

	if(dash.b1.checked) dash.miniRobot.style.left = "415px";
	else if(dash.b2.checked)	dash.miniRobot.style.left = "492px";
	else if(dash.b3.checked)	dash.miniRobot.style.left = "575px";

	else if(dash.r1.checked) dash.miniRobot.style.left = "415px";
	else if(dash.r2.checked)	dash.miniRobot.style.left = "492px";
	else if(dash.r4.checked)	dash.miniRobot.style.left = "575px";


	document.getElementById("defaultOpen").style.pointerEvents = "auto";
	document.getElementById("nextOpen").style.pointerEvents = "auto";
	document.getElementById("defaultOpen").click();
	dashboardInit();
}
