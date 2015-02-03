// The original version. Problem: assignDataTo passes `target` as value, not reference
// Thus, `JSON.parse(data)` is assigned to window.target, regardless of what the argument
// is for `target`

function getJSON(url) {
    return new Promise(function(resolve, reject) {
	var xhr = new XMLHttpRequest();
	xhr.open("get", url);
	xhr.onreadystatechange = function() {
	    if (xhr.readyState == 4 && xhr.status < 400) {
		resolve(xhr.responseText);
	    }

	};
	xhr.send();
    });
}

function assignDataTo(target, url, ctx) {
    // Asynchronously assign JSON response to `target` variable
    getJSON(url)
	.then(function(data) {
	    ctx.target = JSON.parse(data);
	}, function(error) {
		  console.log(error);
	      }
	 );
}

var target,
    url = "https://data.baltimorecity.gov/resource/n4ma-fj3m.json?$select=*&$limit=5";

// This version works, but it doesn't abstract well:
function xhrGet(url) {
  //Helper function  
  var xhr = new XMLHttpRequest();
  xhr.open("get", url);
  xhr.send();
  return xhr;
}

function assignDataTo(url) {
  return new Promise( function(resolve, reject) {
    var xhr = xhrGet(url);
    xhr.onload = function() {
      if (xhr.status == 200) {
        resolve(xhr.response);
      } else {
        reject(Error("Error getting data: " + xhr.response));
      }
    }
  })
    .then(function(data) {
       return JSON.parse(data);
    }, function(error) {
      console.error(error);
      });
}

assignDataTo(url).then(function(result) {
    target = result;
});
