/* 
 loadingScreen.js 
*/

function loadingScreenStart() {
	setTimeout(function() {
		try {
			var active = document.activeElement;
			
			if (active)
				active.blur();
		} catch(err) {
			console.log("error: " + err);
		}
	}, 0);
	
	var mask = document.createElement("div");
	
	document.getElementsByTagName("body")[0].appendChild(mask);
	mask.setAttribute("id", "loading-screen");
	mask.innerHTML = "<div class='loading-bar'><div class='loading-cell'></div></div>";
}

function loadingScreenStop() {
	var loadingScreen = document.getElementById("loading-screen");
	
	if (loadingScreen) {
		var parent = loadingScreen.parentNode;
		
		if (parent)
			parent.removeChild(loadingScreen);
	}
}










