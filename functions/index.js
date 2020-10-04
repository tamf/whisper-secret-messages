const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const DEFAULT_LIMIT = 5
const DEFAULT_EXPIRY = 60*60*1000;
const MAX_EXPIRY = 30*24*60*60*1000;
const decr = admin.firestore.FieldValue.increment(-1);

/**
* Stores a new secret along with expiry and accesses left
*
* params:
*	- secret
*/
exports.create = functions.https.onRequest(async (req, res) => {
  const secret = req.query.secret;
  const limit = Number(req.query.limit) || DEFAULT_LIMIT;
  const expiry = Number(req.query.expiry) || DEFAULT_EXPIRY; // in ms

  if (limit <= 0 || expiry <= 0 || expiry > MAX_EXPIRY) return res.sendStatus(400);

  const expiryTime = Date.now() + expiry;

  const writeResult = await admin.firestore().collection('messages').add({secret: secret, accessesLeft: limit, expiryTime: expiryTime});
  res.json({id: `${writeResult.id}`});
});

/**
* Fetches a secret by id. Returns "invalid id" if secret doesn't exist or expired or access limit reached.
* Side effect: decrements accessesLeft.
*
* params:
*	- id
*/
exports.fetch = functions.https.onRequest(async (req, res) => {
  const id = req.query.id;
  const secret = await admin.firestore().collection('messages').doc(id).get();

  if (!secret || !secret.exists) return res.json({secret: "invalid id"});

  const data = secret.data();
  const isExpired = Date.now() > data.expiryTime;

  if (data.accessesLeft <= 0 || isExpired) return res.json({secret: "invalid id"});

  decrAccessesLeft(id);

  res.json({secret: secret.data().secret});
});

/**
* Deletes a secret by id.
*
* params:
*	- id
*/
exports.delete = functions.https.onRequest(async (req, res) => {
  const id = req.query.id;
  const result = admin.firestore().collection('messages').doc(id).delete();
  res.json({result: "ok"});
});

function decrAccessesLeft(id) {
	admin.firestore().collection('messages').doc(id).update({accessesLeft: decr})
}

