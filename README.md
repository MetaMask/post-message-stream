# post-message-stream

Sets up a duplex object stream over window.postMessage

```js
var streamA = new PostMessageStream({
  name: 'thing one',
  target: 'thing two',
})

var streamB = new PostMessageStream({
  name: 'thing two',
  target: 'thing one',
})

streamB.on('data', (data) => console.log(data))
streamA.write(chunk)
```

### constructor arguments

```js
var messageStream = new PostMessageStream({

  // required

  // name of stream, used to differentiate
  // when multiple streams are on the same window 
  name: 'source',

  // name of target stream 
  target: 'sink',

  // optional

  // window to send the message to
  // default is `window`
  window: iframe.contentWindow,
  
})
```

## Release & Publishing

 The project follows the same release process as the other libraries in the MetaMask organization:

 1. Create a release branch
     - For a typical release, this would be based on `master`
     - To update an older maintained major version, base the release branch on the major version branch (e.g. `1.x`)
 2. Update the changelog
 3. Update version in package.json file (e.g. `yarn version --minor --no-git-tag-version`)
 4. Create a pull request targeting the base branch (e.g. master or 1.x)
 5. Code review and QA
 6. Once approved, the PR is squashed & merged
 7. The commit on the base branch is tagged
 8. The tag can be published as needed

 ## License

 This project is available under the [ISC license](./LICENSE).
