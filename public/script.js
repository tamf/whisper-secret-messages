var formdata = new FormData();

// const baseUrl = "https://us-central1-secret-messages-7749d.cloudfunctions.net/"; //create?secret=hi&limit=1"




const createForm = document.getElementById("create-form");
createForm.addEventListener("submit", handleFormSubmit);

function handleFormSubmit(event) {
	event.preventDefault();
	const form = event.currentTarget;
	const formData = Object.fromEntries(new FormData(form).entries());

	clearDataOnClick();


	createSecret(
		formData.secret, 
		formData.limit, 
		formData.expiry, 
		formData.expiryUnit, 
		formData.passphrase
	);
}

function clearDataOnClick() {
	document.getElementById("secret").value="";
	document.getElementById("passphrase").value="";
	document.getElementById("limit").value=null;
	document.getElementById("expiry").value=null;
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