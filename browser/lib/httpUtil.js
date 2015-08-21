
//Utility method for sending http Ajax get requests
function httpGet(url, cb) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
			cb(JSON.parse(this.response));
		}
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

module.exports = httpGet;

