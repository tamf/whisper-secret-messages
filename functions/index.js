const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const DEFAULT_LIMIT = 5
const DEFAULT_EXPIRY = 60*60;
const MAX_EXPIRY = 30*24*60*60;
const DECREMENT = admin.firestore.FieldValue.increment(-1);
const BATCH_SIZE_LIMIT = 100;

/**
* Stores a new secret along with expiry and accesses left
*
* params:
*	- secret
*   - limit: max number of accesses
*   - expiresIn: number of seconds after current time at which secret will expire
*/
exports.create = functions.https.onRequest(async (req, res) => {
	if (req.method !== "POST") {
		return res.sendStatus(405);
	}

	const secret = req.body.secret;
	const limit = Number(req.body.limit) || DEFAULT_LIMIT;
	const expiresIn = Number(req.body.expiresIn) || DEFAULT_EXPIRY; // in seconds
	
	if (typeof secret !== "string" || 
			limit <= 0 || 
			expiresIn <= 0 || 
			expiresIn > MAX_EXPIRY) {
		return res.sendStatus(400);
	}

	const expiryTime = Date.now() / 1000 + expiresIn;
	// stores the secret into Firestore
	const writeResult = await admin.firestore()
  									.collection('messages')
  									.add({	
  											secret: secret, 
  											accessesLeft: limit, 
  											expiryTime: expiryTime
  										});
  
  	res.json({id: `${writeResult.id}`});
});

/**
* Fetches a secret by id. Returns 404 if secret doesn't exist or expired or access limit reached.
* Side effect: decrements accessesLeft.
*
* params:
*	- id
*/
exports.fetch = functions.https.onRequest(async (req, res) => {
    if (req.method !== "GET") {
      return res.sendStatus(405);
    }

	const id = req.query.id;

	if (typeof id !== "string") {
		return res.sendStatus(400);
	}

	const secret = await admin.firestore().collection('messages').doc(id).get();

	if (!secret || !secret.exists) {
		return res.sendStatus(404);
	}

	const data = secret.data();
	const isExpired = (Date.now() / 1000) > data.expiryTime;

	if (data.accessesLeft <= 0 || isExpired) {
		return res.sendStatus(404);
	}

	decrementAccessesLeft(id);

	res.json({secret: secret.data().secret});
});

function decrementAccessesLeft(id) {
	admin.firestore().collection('messages').doc(id).update({accessesLeft: DECREMENT})
}

/**
*
* Deletes all messages that have run out of accesses or time expired
*
*/
exports.deleteExpiredMessages = functions.https.onRequest(async (req, res) => {
  if (req.method !== "DELETE") {
    return res.sendStatus(405);
  }

  const msgs = admin.firestore().collection('messages');
  const noAccessesLeft = msgs.where('accessesLeft', '<=', 0).limit(BATCH_SIZE_LIMIT);
  const timeExpired = msgs.where('expiryTime', '<', Date.now() / 1000).limit(BATCH_SIZE_LIMIT);
  
  await deleteQueryBatch(noAccessesLeft);
  await deleteQueryBatch(timeExpired);

  res.json({result: "ok"});
});


async function deleteQueryBatch(query) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    return;
  }

  // Delete current batch of documents
  const batch = admin.firestore().batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // Repeat
  process.nextTick(() => {
    deleteQueryBatch(query);
  });
}
