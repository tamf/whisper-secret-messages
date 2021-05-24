var formdata = new FormData();

// const baseUrl = "https://us-central1-secret-messages-7749d.cloudfunctions.net/"; //create?secret=hi&limit=1"



// create reference to HTML form
const createForm = document.getElementById("create-form");

// add event listener to submit button
createForm.addEventListener("submit", handleFormSubmit);

function handleFormSubmit(event) {
	event.preventDefault();
    // retrieve form data
	const form = event.currentTarget;
	const formData = Object.fromEntries(new FormData(form).entries());

	// call create secret method
	createSecret(
		formData.secret, // element in form with id secret
		formData.limit,  // element in form with id limit
		formData.expiry, 
		formData.expiryUnit, 
		formData.passphrase
	);
}


function createSecret(secret, accessesLimit, expiry, expiryUnit, passphrase) {
	const encrypted = encrypt(secret, passphrase);
	const timeOfExpiry = getExpiry(expiry, expiryUnit);

	// create body for HTTP request
	const body = {
		"secret": encrypted,
		"limit": accessesLimit,
		"expiry": timeOfExpiry
	};

	// HTTP request skeleton
	const options = {
		method: 'POST',
		redirect: 'follow',
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json"
		},
		body: JSON.stringify(body)
	};

	// HTTP request 
	// "/create" - path (is this a server route?)
	//  options - infomration for the server
	fetch("/create", options)
	  .then(function(response) {
	  	return response.text();
	  })
	  .then(function(result) {
	  	console.log(result);
	  }) 
	  .catch(function(error) {
	  	console.log('error', error);
	  });
}

function deleteSecret(id) {
	// TODO
}

function fetchSecret(id) {
	// TODO
}

function encrypt(secret, passphrase) {
	// TODO
	return secret;
}

function getExpiry(expiry, expiryUnit) {
	return 1000*1000;
}

// function buildUrl(keyValues, action) {
// 	let url = `${baseUrl}/${action}?`;

// 	if (keyValues.size == 0) {
// 		return url;
// 	}

// 	for (let [key, val] of keyValues) {
// 		url = `${url}${key}=${value}&`
// 	}

// 	url = url.slice(0, -1); // remove trailing &
// 	return url;
// }