# whisper-secret-messages

Share text-based information securely and anonymously over the internet.

https://secret-messages-7749d.web.app/

## Contents

* [About the project](#about-the-project)
* [Dev set up](#developer-setup)
* [License](#license)
* [Contributors](#contributors)

### About the project

Using [the website](https://secret-messages-7749d.web.app/), users can enter and store text information, and receive a link to share this information securely. Only those with the link can access the information. We use end-to-end encryption -- both encryption and decryption is performed on the client, and the passphrase used for encryption is never sent to the server.

#### Security

The text information is shared using end-to-end encryption. Encryption and decryption are performed only on the client. See below for more information about the encryption used.

There are several additional security measures:
- link expiry: specify time duration after which the secret can no longer be viewed
- link accesses: specify number of accesses after which the secret can no longer be viewed
- custom passphrase: the link recipient must possess the passphrase used to encrypt the text information

These measures help protect against the case where the link is intercepted and/or the case when the link is shared using a medium that does not use forward secrecy.

#### Encryption

We use the [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) in the user's browser to do [AES](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)-CBC 256-bit encryption, and [PBKDF2](https://en.wikipedia.org/wiki/PBKDF2) SHA-256 to derive the encryption key for the user's data. The salt and initialization vector used for encryption/key derivation are randomly generated every time. We use 100,000 iterations with PBKDF2 for key derivation.

#### Backend

Once the data is encrypted in the client, the encrypted data is sent alongside the IV and salt to an endpoint managed by Google Cloud Functions. The data is then stored as a new document in Google Firestore document store. An ID is returned to the client for the purpose of retrieving the document.

When the receiving client sends the ID to the endpoint, the document corresponding to the ID will be retrieved; and the encrypted data, IV, and salt are sent to the client. 

#### Technologies used:
- [Web Crypto API / SubtleCrypto](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [Google Firebase](https://firebase.google.com/)
- [Google Firestore](https://firebase.google.com/docs/firestore): Serverless NoSQL document store
- [Google Cloud Functions](https://cloud.google.com/functions): Serverless backend functionality
- Bootstrap 5
- JavaScript
- Node.js

### Developer setup

See [Developer setup](docs/dev-setup.md).

### License

This project is licensed under the [GNU General Public License v3.0](docs/LICENSE.md).

### Contributors

Originally created by Fabian Tam and Steven Wong.

**Fabian Tam**<br>
Software Engineer<br>
[fabiantam.com](https://fabiantam.com)

**Steven Wong**<br>
UBC Computer Science Student<br>
[https://twitter.com/swongggg](https://twitter.com/swongggg)
