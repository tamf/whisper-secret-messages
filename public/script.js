var formdata = new FormData();

// const baseUrl = "https://us-central1-secret-messages-7749d.cloudfunctions.net/"; //create?secret=hi&limit=1"


const DEFAULT_EXPIRY = 60*60; // one hour

const createForm = document.getElementById("create-form");
createForm.addEventListener("submit", handleFormSubmit);

function handleFormSubmit(event) {
	event.preventDefault();
	const form = event.currentTarget;
	const formData = Object.fromEntries(new FormData(form).entries());

	createSecret(
		formData.secret, 
		formData.limit, 
		formData.expiry, 
		formData.expiryUnit, 
		formData.passphrase
	);
}


function createSecret(secret, accessesLimit, expiry, expiryUnit, passphrase) {
	const encrypted = encrypt(secret, passphrase);
	const timeOfExpiry = getExpiry(expiry, expiryUnit);

	const body = {
		"secret": encrypted,
		"limit": accessesLimit,
		"expiry": timeOfExpiry
	};

	const options = {
		method: 'POST',
		redirect: 'follow',
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json"
		},
		body: JSON.stringify(body)
	};

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
	if (!expiry) {
		return DEFAULT_EXPIRY;
	}

	switch(expiryUnit) {
	  case "minutes":
	    return expiry * 60;
	  case "hours":
	    return expiry * 60 * 60;
	  case "days":
	    return 24 * 60 *60;
	  default:
	    return DEFAULT_EXPIRY;
	}
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