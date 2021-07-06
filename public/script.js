var formdata = new FormData();

const DEFAULT_EXPIRY = 60 * 60; // one hour
const PASSPHRASE_CHARSET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@#$%^&*()?";
const PASSPHRASE_LEN = 64;
const SALT_LEN = 16;
const IV_LEN = 16;
const enc = new TextEncoder();
const url = new URL(window.location.href);
const secretIdBox = document.getElementById("secretid");
const passphraseBox = document.getElementById("passphrase");

if (secretIdBox && url.searchParams.get("id")) {
  secretIdBox.value = url.searchParams.get("id");
}

if (passphraseBox && url.searchParams.get("passphrase")) {
  passphraseBox.value = url.searchParams.get("passphrase");
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
const fqdn = window.location.host;

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

async function createSecret(
  secret,
  accessesLimit,
  expiresIn,
  expiryUnit,
  passphrase
) {
  const encrypted = await encrypt(secret, passphrase);
  const expiresInSeconds = getExpiryInSeconds(expiresIn, expiryUnit);

  const body = {
    secret: encrypted.cipherText,
    limit: accessesLimit,
    expiresIn: expiresInSeconds,
  };

  const options = {
    method: "POST",
    redirect: "follow",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  };

  return fetch("/create", options)
    .then((response) => response.text())
    .then(function (result) {
      console.log(result);
      createShareableLink(result, encrypted.passphrase);
      return result;
    })
    .catch(function (error) {
      console.log("error", error);
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

function createShareableLink(json, passphrase) {
  const obj = JSON.parse(json);
  const url = buildFetchUrl(obj.id, passphrase);
  displayShareableLink(url);
}

function buildFetchUrl(id, passphrase) {
  return fqdn + "/retrieve-secret?id=" + id + "&passphrase=" + passphrase;
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
  const salt = window.crypto.getRandomValues(new Uint8Array(SALT_LEN));
  const iv = window.crypto.getRandomValues(new Uint8Array(IV_LEN));

  const passphraseGiven = !!passphrase;

  if (!passphraseGiven) {
    passphrase = getRandomString(PASSPHRASE_LEN);
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
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-CBC", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  let encrypted = await window.crypto.subtle.encrypt(
    {
      name: "AES-CBC",
      iv: iv,
    },
    key,
    enc.encode(msg)
  );
  encrypted = new Uint8Array(encrypted);

  const cipher = new Uint8Array(IV_LEN + SALT_LEN + encrypted.length);
  cipher.set(iv, 0);
  cipher.set(salt, iv.length);
  cipher.set(encrypted, iv.length + salt.length);

  const output = {
    cipherText: btoa(String.fromCharCode.apply(null, cipher)),
    passphrase: passphraseGiven ? "" : passphrase
  };

  return output;
}

function getRandomString(length) {
  return Array.from(crypto.getRandomValues(new Uint32Array(length)))
    .map((i) => PASSPHRASE_CHARSET[i % PASSPHRASE_CHARSET.length])
    .join("");
}

async function decrypt(encrypted, passphrase) {
   encrypted = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0));
   
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
  document.getElementById("modal-paragraph").innerHTML = "  Sharing link: " + url;
}
