var formdata = new FormData();

// const baseUrl = "https://us-central1-secret-messages-7749d.cloudfunctions.net/"; //create?secret=hi&limit=1"

const DEFAULT_EXPIRY = 60 * 60; // one hour

const createForm = document.getElementById("create-form");
createForm.addEventListener("submit", handleFormSubmit);

const retrieveSecretForm = document.getElementById("retrieve-secret-form");
retrieveSecretForm.addEventListener("submit", handleRetrieveSubmit);

const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];
const fqdn = window.location.hostname;

function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = Object.fromEntries(new FormData(form).entries());

  clearDataOnClick();

  createSecret(
    formData.secret,
    formData.limit,
    formData.expiresIn,
    formData.expiryUnit,
    formData.passphrase
  );
}

function handleRetrieveSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = Object.fromEntries(new FormData(form).entries());

  clearDataOnClick();

  let secretMessage = fetchSecret(
	//   formData.passphrase, 
	  formData.secretid);
  console.log("see if code goes here!");
  console.log(secretMessage);
}


function createSecret(secret, accessesLimit, expiresIn, expiryUnit, passphrase) {
	const encrypted = encrypt(secret, passphrase);
	const expiresInSeconds = getExpiryInSeconds(expiresIn, expiryUnit);

	const body = {
		"secret": encrypted,
		"limit": accessesLimit,
		"expiresIn": expiresInSeconds
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

	return fetch("/create", options)
	  .then(response => response.text())
	  .then(function(result) {
	  	console.log(result);
	  	createShareableLink(result);
	  	return result;
	  }) 
	  .catch(function(error) {
	  	console.log('error', error);
	  });
}

function createShareableLink(json) {
  let obj = JSON.parse(json);
  let id = obj.id;
  let url = buildFetchUrl(id);
  displayShareableLink(url);
}

function buildFetchUrl(id) {
  return rootUrl + "/fetch?id=" + id;
}

function deleteSecret(id) {
  // TODO
}

function fetchSecret(id) {
  return fetch("/fetch?id=" + id)
    .then((response) => response.json())
    .then(function (data) {
      console.log(data);
      return data;
    });
}

function encrypt(secret, passphrase) {
  // TODO
  return secret;
}

function getExpiryInSeconds(expiry, expiryUnit) {
  if (!expiry) {
    return DEFAULT_EXPIRY;
  }

  switch (expiryUnit) {
    case "minutes":
      return expiry * 60;
    case "hours":
      return expiry * 60 * 60;
    case "days":
      return expiry * 24 * 60 * 60;
    default:
      return DEFAULT_EXPIRY;
  }
}

function clearDataOnClick() {
  document.getElementById("secret").value = "";
  document.getElementById("passphrase").value = "";
  document.getElementById("secretid").value = "";
  document.getElementById("limit").value = null;
  document.getElementById("expiresIn").value = null;
}

function displayShareableLink(url) {
  document.getElementById("modal-paragraph").innerHTML = "Secret id: " + url;
  modal.style.display = "block";
}

span.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
