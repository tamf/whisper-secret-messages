# whisper-secret-messages

Share text-based information securely and anonymously over the internet.

## Contents

* [About the project](#about-the-project)
* [Dev set up](#developer-setup)
* [License](#license)
* [Contributors](#contributors)

### About the project

About

### Developer setup

Developer set up:
1. Install Node.js and Firebase CLI [link](https://firebase.google.com/docs/functions/get-started#set-up-node.js-and-the-firebase-cli)
2. Clone this repo locally
3. In terminal, navigate into the repo's directory
4. Initialize Firebase `firebase init` to initialize your own Firebase project.
  - When prompted, select created project from previous step
  - When prompted, choose not to overwrite any existing files. If overwritten, simply replace them from this repo
  - You may choose to set up Hosting, Functions, Firestore, and Emulators
5. Replace the contents of your local firebase.json with that from the repo.
6. Updates to UI in `public` or serverless functions in `functions` can be tested locally through the emulator `firebase emulators:start`

Running UI:
1. Navigate to `util` and install dependencies `npm install`
2. Run UI proxy `npm run ui-proxy`
3. Open html webpage in `public`

### License

This project is licensed under the [GNU General Public License v3.0](LICENSE.md).

### Contributors

Originally created by Fabian Tam and Steven Wong.

**Fabian Tam**<br>
Software Engineer<br>
[fabiantam.com](https://fabiantam.com)

**Steven Wong**<br>
UBC Computer Science Student<br>
[steven-s-website.web.app](https://steven-s-website.web.app)
