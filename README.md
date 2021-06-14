# whisper-secret-messages

Share text-based information securely and anonymously over the internet.

Developer set up:

1. Follow [the prerequisites for developing Firebase Functions](https://firebase.google.com/docs/functions/get-started#set-up-node.js-and-the-firebase-cli), namely installing Node.js and the Firebase CLI.
2. Clone this repo locally
3. In terminal, navigate into the repo's directory
4. Initialize Firebase `firebase init`. When prompted, choose not to overwrite any existing files. If overwritten, simply replace them from this repo. You may choose to set up Hosting, Functions, Firestore, and Emulators.
5. Changes to webpages in `public` or to functions in `index.js` can be tested locally through the emulator. `firebase emulators:start`

Running UI:
1. Navigate to `util` and install dependencies `npm install`
2. Run UI proxy `npm run ui-proxy`
3. Open html webpage in `public`
