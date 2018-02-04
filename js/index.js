 /* 
 index.js 
 */
 
 $(document).ready(function() {
	"use strict"; 

	var resultList = $("#resultList");

	var toggleButton = $("#toggleButton");

	toggleButton.on("click", function() {
		resultList.toggle(500);

		if (toggleButton.text() == "hide")
			toggleButton.text("show");
		else
			toggleButton.text("hide");
	});
	
	$("#category").on("change", function() {
		var category = $("#category").val();
		var repoFilters = $(".repoFilter");
		var normalFilters = $(".normalFilter");
		
		$.each(repoFilters, function(i, item) {
			if (category == "repositories")
				$(item).removeClass("hidden");
			else
				$(item).addClass("hidden");
		});
		
		$.each(normalFilters, function(i, item) {
			if (category == "repositories")
				$(item).addClass("hidden");
			else
				$(item).removeClass("hidden");
		});
	});
	
	$("#searchForm").on("submit", function() {
		var category = $("#category").val();
		var searchPhrase = $("#searchPhrase").val();

		if (searchPhrase) {
			$("#fieldSetMsg").hide();
			
			loadingScreenStart();

			resultList.text("Performing search...");
			
			var request = "";
			
			if (category == "repositories") {
				request = "https://api.github.com/search/repositories?q=" 
						+ encodeURIComponent(searchPhrase);
						
				var useStars = $("#useStars").val();
				var langChoice = $("#langChoice").val();
		
				if (langChoice != "All")
					request += "+language:" + encodeURIComponent(langChoice);

				if (useStars) 
					request += "&sort=stars";
			} else {
				var searchBy = $("#searchBy").val();
			
				request = "https://jsonplaceholder.typicode.com/" + category
						+ "?" + encodeURIComponent(searchBy) + "=" 
						+ encodeURIComponent(searchPhrase);
			}
			
			console.log(request);

			$.get(request)
			.then(function(r) {
				if (category == "repositories")
					displayRepositoryResults(r.items);
				else
					displayUserDataResults(r); // TODO: display results in table
				
				//loadingScreenStop();
			})
			.fail(function() {
				resultList.text("Request failed");
				loadingScreenStop();
			})
			.done(function() {
				loadingScreenStop();
			});
		} else {
			$("#fieldSetMsg").fadeIn("slow");
		}
		
		return false;
	});

	function displayRepositoryResults(results) {
		resultList.empty();
		
		var dataTable = "<table id ='dataTable'>";
		dataTable += "<thead><tr><th>Name</th><th>Owner</th><th>Description</th></tr></thead>";
		dataTable += "<tbody>";

		$.each(results, function(i, item) {
			if (i % 2 == 0)
				dataTable += "<tr class='dataRow even' onclick='window.open(\"" 
							+ item.html_url + "\", \"_blank\");'>";
			else
				dataTable += "<tr class='dataRow' onclick='window.open(\"" 
							+ item.html_url + "\", \"_blank\");'>";
			
			dataTable += "<td>" + item.name + "</td>";
			dataTable += "<td>" + item.owner.login + "</td>";
			dataTable += "<td>" + item.description + "</td>";
			dataTable += "</tr>";
		});
		
		dataTable += "</tbody></table>";
		
		resultList.append(dataTable);
	}
	
	function displayUserDataResults(results) {
		console.log(results);

		resultList.empty();
		
		var dataTable = "<table id ='dataTable'>";
		dataTable += getTableHeader(results);
		dataTable += "<tbody>";
		
		$.each(results, function(i, item) {
			dataTable += getDataRow(i, item);
		});
		
		dataTable += "</tbody></table>";
		
		resultList.append(dataTable);
	}
	
	function getTableHeader(results) {
		var tableHeader = "<thead><tr>";
		
		if (results.length > 0) {
			var item = results[0];
			
			for (var key in item)
				tableHeader += "<th>" + getColumnName(key) + "</th>";
		}
		
		tableHeader += "</tr></thead>";
		
		return tableHeader;
	}
	
	function getColumnName(header) {
		return header.charAt(0).toUpperCase() + header.slice(1);
	}
	
	function getDataRow(i, item) {
		var dataRow = "<tr class='dataRow" + (i % 2 == 0 ? " even" : "") 
						+ "' onclick='window.open(\"" 
						+ item.website + "\", \"_blank\");'>";

		for (var key in item)
			dataRow += "<td>" + getColumnValue(item[key]) + "</td>";
			
		dataRow += "</tr>";
		
		return dataRow;
	}
	
	function getColumnValue(columnVal) {
		var thisValue = "";

		if (typeof columnVal === "object") {
			for (var key in columnVal)
				thisValue += getColumnValue(columnVal[key]) + "<br/>";
		} else {
			thisValue = columnVal;
		}
		
		return thisValue;
	}
});
