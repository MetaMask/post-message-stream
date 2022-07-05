# @metamask/post-message-stream

A Node.js duplex stream interface over various kinds of JavaScript inter-"process" communication channels, for Node.js and the Web.
Originally the only communication channel used was `window.postMessage()`, but the package has since expanded in scope.

## Usage (Node.js)

### `ProcessParentMessageStream` and `ProcessMessageStream`

Node.js [`child_process.fork()`](https://nodejs.org/api/child_process.html#child_processforkmodulepath-args-options) streams.
The parent process creates a child process with a dedicated IPC channel using `child_process.fork()`.

In the parent process:

```javascript
import { fork } from 'child_process';
import { ProcessParentMessageStream } from '@metamask/post-message-stream';

// `modulePath` is the path to the JavaScript module that will instantiate the
// child stream.
const process = fork(modulePath);

const parentStream = new ProcessParentMessageStream({ process });
parentStream.write('hello');
```

In the child process:

```javascript
import { ProcessMessageStream } from '@metamask/post-message-stream';

// The child stream automatically "connects" to the dedicated IPC channel via
// properties on `globalThis.process`.
const childStream = new ProcessMessageStream();
childStream.on('data', (data) => console.log(data + ', world'));
// > 'hello, world'
```

### `ThreadParentMessageStream` and `ThreadMessageStream`

Node.js [`worker_threads`](https://nodejs.org/api/child_process.html#child_processforkmodulepath-args-options) streams.
The parent process creates a worker thread using `new worker_threads.Worker()`.

In the parent environment:

```javascript
import { Worker } from 'worker_threads';
import { ThreadParentMessageStream } from '@metamask/post-message-stream';

// `modulePath` is the path to the JavaScript module that will instantiate the
// child stream.
const thread = new Worker(modulePath);

const parentStream = new ThreadParentMessageStream({ thread });
parentStream.write('hello');
```

In the child thread:

```javascript
import { ThreadMessageStream } from '@metamask/post-message-stream';

// The child stream automatically "connects" to the parent via
// `worker_threads.parentPort`.
const childStream = new ThreadMessageStream();
childStream.on('data', (data) => console.log(data + ', world'));
// > 'hello, world'
```

## Usage (Web)

### `WebWorkerParentPostMessageStream` and `WebWorkerPostMessageStream`

These streams are intended for **dedicated** [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) only.
They might sort-of work with shared workers, but attempt that at your own risk.

In the parent window:

```javascript
import { WebWorkerParentPostMessageStream } from '@metamask/post-message-stream';

const worker = new Worker(url);

const parentStream = new WebWorkerParentPostMessageStream({ worker });
parentStream.write('hello');
```

In the child `WebWorker`:

```javascript
import { WebWorkerPostMessageStream } from '@metamask/post-message-stream';

const workerStream = new WebWorkerPostMessageStream();
workerStream.on('data', (data) => console.log(data + ', world'));
// > 'hello, world'
```

### `WindowPostMessageStream`

If you have two windows, A and B, that can communicate over `postMessage`, set up a stream in each.
Be sure to make use of the `targetOrigin` and `targetWindow` parameters to ensure that you are communicating with your intended subject.

In window A, with URL `https://foo.com`, trying to communicate with an iframe, `iframeB`:

```javascript
import { WindowPostMessageStream } from '@metamask/post-message-stream';

const streamA = new WindowPostMessageStream({
  name: 'streamA', // We give this stream a name that the other side can target.

  target: 'streamB', // This must match the `name` of the other side.

  // Adding `targetWindow` below already ensures that we will only _send_
  // messages to `iframeB`, but we need to specify its origin as well to ensure
  // that we only _receive_ messages from `iframeB`.
  targetOrigin: new URL(iframeB.src).origin,

  // We have to specify the content window of `iframeB` as the target, or it
  // won't receive our messages.
  targetWindow: iframeB.contentWindow,
});

streamA.write('hello');
```

In window B, running in an iframe accessible in window A:

```javascript
const streamB = new WindowPostMessageStream({
  // Notice that these values are reversed relative to window A.
  name: 'streamB',
  target: 'streamA',

  // The origin of window A. If we don't specify this, it would default to
  // `location.origin`, which won't work if the local origin is different. We
  // could pass `*`, but that's potentially unsafe.
  targetOrigin: 'https://foo.com',

  // We omit `targetWindow` here because it defaults to `window`.
});

streamB.on('data', (data) => console.log(data + ', world'));
// > 'hello, world'
```

#### Gotchas

Under the hood, `WindowPostMessageStream` uses `window.addEventListener('message', (event) => ...)`.
If `event.source` is not referentially equal to the stream's `targetWindow`, all messages will be ignored.
This can happen in environments where `window` objects are proxied, such as Electron.

## Contributing

### Setup

- Install [Node.js](https://nodejs.org) version 12
  - If you are using [nvm](https://github.com/creationix/nvm#installation) (recommended) running `nvm use` will automatically choose the right node version for you.
- Install [Yarn v1](https://yarnpkg.com/en/docs/install)
- Run `yarn setup` to install dependencies and run any requried post-install scripts
  - **Warning:** Do not use the `yarn` / `yarn install` command directly. Use `yarn setup` instead. The normal install command will skip required post-install scripts, leaving your development environment in an invalid state.

### Testing and Linting

Run `yarn test` to run the tests once. To run tests on file changes, run `yarn test:watch`.

Run `yarn lint` to run the linter, or run `yarn lint:fix` to run the linter and fix any automatically fixable issues.

### Release & Publishing

The project follows the same release process as the other libraries in the MetaMask organization. The GitHub Actions [`action-create-release-pr`](https://github.com/MetaMask/action-create-release-pr) and [`action-publish-release`](https://github.com/MetaMask/action-publish-release) are used to automate the release process; see those repositories for more information about how they work.

1. Choose a release version.

   - The release version should be chosen according to SemVer. Analyze the changes to see whether they include any breaking changes, new features, or deprecations, then choose the appropriate SemVer version. See [the SemVer specification](https://semver.org/) for more information.

2. If this release is backporting changes onto a previous release, then ensure there is a major version branch for that version (e.g. `1.x` for a `v1` backport release).

   - The major version branch should be set to the most recent release with that major version. For example, when backporting a `v1.0.2` release, you'd want to ensure there was a `1.x` branch that was set to the `v1.0.1` tag.

3. Trigger the [`workflow_dispatch`](https://docs.github.com/en/actions/reference/events-that-trigger-workflows#workflow_dispatch) event [manually](https://docs.github.com/en/actions/managing-workflow-runs/manually-running-a-workflow) for the `Create Release Pull Request` action to create the release PR.

   - For a backport release, the base branch should be the major version branch that you ensured existed in step 2. For a normal release, the base branch should be the main branch for that repository (which should be the default value).
   - This should trigger the [`action-create-release-pr`](https://github.com/MetaMask/action-create-release-pr) workflow to create the release PR.

4. Update the changelog to move each change entry into the appropriate change category ([See here](https://keepachangelog.com/en/1.0.0/#types) for the full list of change categories, and the correct ordering), and edit them to be more easily understood by users of the package.

   - Generally any changes that don't affect consumers of the package (e.g. lockfile changes or development environment changes) are omitted. Exceptions may be made for changes that might be of interest despite not having an effect upon the published package (e.g. major test improvements, security improvements, improved documentation, etc.).
   - Try to explain each change in terms that users of the package would understand (e.g. avoid referencing internal variables/concepts).
   - Consolidate related changes into one change entry if it makes it easier to explain.
   - Run `yarn auto-changelog validate --rc` to check that the changelog is correctly formatted.

5. Review and QA the release.

   - If changes are made to the base branch, the release branch will need to be updated with these changes and review/QA will need to restart again. As such, it's probably best to avoid merging other PRs into the base branch while review is underway.

6. Squash & Merge the release.

   - This should trigger the [`action-publish-release`](https://github.com/MetaMask/action-publish-release) workflow to tag the final release commit and publish the release on GitHub.

7. Publish the release on npm.

   - Be very careful to use a clean local environment to publish the release, and follow exactly the same steps used during CI.
   - Use `npm publish --dry-run` to examine the release contents to ensure the correct files are included. Compare to previous releases if necessary (e.g. using `https://unpkg.com/browse/[package name]@[package version]/`).
   - Once you are confident the release contents are correct, publish the release using `npm publish`.
