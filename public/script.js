var formdata = new FormData();

const baseUrl = "https://us-central1-secret-messages-7749d.cloudfunctions.net/"; //create?secret=hi&limit=1"


const postRequestOptions = {
  method: 'POST',
  redirect: 'follow'
};


function createSecret(secret, accessesLimit, expiry, expiryUnit, passphrase) {
	// const encrypted = encrypt(secret, passphrase);
	// const params = {
	// 	"secret": encrypted,
	// 	"limit": accessesLimit,
	// 	"expiry": expiry
	// };
	// const url = buildUrl()
	var requestOptions = {
	  method: 'POST',
	  redirect: 'follow'
	};

	fetch("https://us-central1-secret-messages-7749d.cloudfunctions.net/create?secret=h2i&limit=1", postRequestOptions)
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

function buildUrl(keyValues, action) {
	let url = `${baseUrl}/${action}?`;

	if (keyValues.size == 0) {
		return url;
	}

	for (let [key, val] of keyValues) {
		url = `${url}${key}=${value}&`
	}

	url = url.slice(0, -1); // remove trailing &
	return url;
}