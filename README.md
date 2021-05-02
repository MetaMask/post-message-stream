# @metamask/post-message-stream

Sets up a duplex object stream over `window.postMessage`, between pages or a dedicated Web Worker and its parent window.

## Usage

### `WindowPostMessageStream`

```javascript
import { WindowPostMessageStream } from '@metamask/post-message-stream';

const streamA = new WindowPostMessageStream({
  name: 'streamA',
  target: 'streamB',
});

const streamB = new WindowPostMessageStream({
  name: 'streamB',
  target: 'streamA',
  // We use an imaginary iframe as an example, but any window object will do.
  // Omitting targetWindow defaults to the global window.
  targetWindow: iframe.contentWindow,
});

streamB.on('data', (data) => console.log(data));
streamA.write(chunk);
```

#### Gotchas

Under the hood, `WindowPostMessageStream` uses `window.addEventListener('message', (event) => ...)`.
If `event.source` is not referentially equal to the stream's `targetWindow`, all messages will be ignored.
This can happen in environments where `window` objects are proxied, such as Electron.

### `WorkerPostMessageStream` and `WorkerParentPostMessageStream`

These streams are intended for **dedicated** [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) only.
They might sort-of work with shared workers, but attempt that at your own risk.

The parent stream is initialized in the context that will create the worker.
The worker is initialized in the worker.

In the parent context:

```javascript
import { WorkerParentPostMessageStream } from '@metamask/post-message-stream';

const worker = new Worker(url);

const parentStream = new WorkerParentPostMessageStream({ worker });
parentStream.write('hello');
```

In the worker:

```javascript
import { WorkerPostMessageStream } from '@metamask/post-message-stream';

const workerStream = new WorkerPostMessageStream();
workerStream.on('data', (data) => console.log(data + ', world'));
// > 'hello, world'
```

## Development

Install using `yarn setup`, not `yarn install`.
