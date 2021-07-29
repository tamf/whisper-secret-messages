## Developer set up

1. Install Node.js and Firebase CLI [link](https://firebase.google.com/docs/functions/get-started#set-up-node.js-and-the-firebase-cli)
2. Fork this repo, and clone your fork locally
3. In terminal, navigate into the repo's directory
4. Initialize Firebase `firebase init` to initialize your own Firebase project.
  - When prompted, select created project from previous step
  - When prompted, choose not to overwrite any existing files. If overwritten, simply replace them from this repo
  - You may choose to set up Hosting, Functions, Firestore, and Emulators
5. Replace the contents of your local firebase.json with that from the repo.
6. Updates to UI in `public` or serverless functions in `functions` can be tested locally through the emulator `firebase emulators:start`
