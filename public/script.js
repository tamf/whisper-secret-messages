var formdata = new FormData();

const DEFAULT_EXPIRY = 60 * 60; // one hour
const PASSPHRASE_CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@#$%^&*()?";
const enc = new TextEncoder();
const urlSplit = window.location.pathname.split('=');
const secretIdBox = document.getElementById("secretid");

if (secretIdBox) {
  if (typeof urlSplit[1] !== 'undefined') {
  secretIdBox.value = urlSplit[1];
  }
}

const createForm = document.getElementById("create-form");

if (createForm) {
  createForm.addEventListener("submit", handleFormSubmit);
}

const retrieveSecretForm = document.getElementById("retrieve-secret-form");

if (retrieveSecretForm) {
  retrieveSecretForm.addEventListener("submit", handleRetrieveSubmit);
}

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

async function createSecret(secret, accessesLimit, expiresIn, expiryUnit, passphrase) {
	const encrypted = await encrypt(secret, passphrase);
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

function handleRetrieveSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = Object.fromEntries(new FormData(form).entries());

  clearDataOnClick();

  fetchSecret(
    //   formData.passphrase,
    formData.secretid
  ).then((result) => {
    console.log(result.secret);
    document.getElementById("secret-message-box").innerHTML = result.secret;
  });
}

function createShareableLink(json) {
  let obj = JSON.parse(json);
  let id = obj.id;
  let url = buildFetchUrl(id);
  displayShareableLink(url);
}

function buildFetchUrl(id) {
  return fqdn + "/retrieve-secret-id=" + id;
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

async function encrypt(msg, passphrase) {
	const salt = window.crypto.getRandomValues(new Uint8Array(16));
	const iv = window.crypto.getRandomValues(new Uint8Array(16));

	if (!passphrase) {
		passphrase = getRandomString(64);
	}

 	const keyMaterial = await window.crypto.subtle.importKey(
	    "raw",
	    enc.encode(passphrase),
	    "PBKDF2",
	    false,
	    ["deriveBits", "deriveKey"]
	);

	const key = await window.crypto.subtle.deriveKey(
	    {
	      "name": "PBKDF2",
	      salt: salt,
	      "iterations": 100000,
	      "hash": "SHA-256"
	    },
	    keyMaterial,
	    { "name": "AES-CBC", "length": 256},
	    true,
	    [ "encrypt", "decrypt" ]
  	);

	const encrypted = await window.crypto.subtle.encrypt(
		{
	    	name: "AES-CBC",
	    	iv: iv
    	},
	    key,
	    enc.encode(msg)
	);

	const encryptedBase64 = btoa(encrypted);

	return encryptedBase64;
}

function getRandomString(length) {
	return Array.from(crypto.getRandomValues(new Uint32Array(length)))
		.map((i) => PASSPHRASE_CHARSET[i % PASSPHRASE_CHARSET.length])
		.join('');
}

async function decrypt(encrypted, passphrase) {
	// TODO
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
  let secret = document.getElementById("secret");
  let passphrase = document.getElementById("passphrase");
  let secretid = document.getElementById("secretid");
  let limit = document.getElementById("limit");
  let expiresIn = document.getElementById("expiresIn");

  if (secret) {
    secret.value = "";
  }

  if (passphrase) {
    passphrase.value = "";
  }

  if (secretid) {
    secretid.value = "";
  }

  if (limit) {
    limit.value = null;
  }

  if (expiresIn) {
    expiresIn.value = null;
  }
}

function displayShareableLink(url) {
  document.getElementById("modal-paragraph").innerHTML = "  Secret id: " + url;
}


