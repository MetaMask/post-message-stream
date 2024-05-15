# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [8.1.0]
### Uncategorized
- ci: run on nodejs versions 20.x, 22.x ([#132](https://github.com/MetaMask/post-message-stream/pull/132))
- feat: Support overriding Duplex stream options as constructor options ([#131](https://github.com/MetaMask/post-message-stream/pull/131))
- Bump ip from 2.0.0 to 2.0.1 ([#126](https://github.com/MetaMask/post-message-stream/pull/126))
- Bump @metamask/utils from 8.3.0 to 8.4.0 ([#129](https://github.com/MetaMask/post-message-stream/pull/129))
- Bump tar from 6.1.14 to 6.2.1 ([#130](https://github.com/MetaMask/post-message-stream/pull/130))
- Update security code scanner file ([#128](https://github.com/MetaMask/post-message-stream/pull/128))
- Enabling security code scanner ([#127](https://github.com/MetaMask/post-message-stream/pull/127))
- Bump @metamask/auto-changelog from 3.4.3 to 3.4.4 ([#124](https://github.com/MetaMask/post-message-stream/pull/124))
- Bump @metamask/utils from 8.2.1 to 8.3.0 ([#125](https://github.com/MetaMask/post-message-stream/pull/125))
- Bump @metamask/auto-changelog from 3.3.0 to 3.4.3 ([#122](https://github.com/MetaMask/post-message-stream/pull/122))
- Bump @metamask/utils from 8.1.0 to 8.2.1 ([#123](https://github.com/MetaMask/post-message-stream/pull/123))
- Bump browserify-sign from 4.2.1 to 4.2.2 ([#121](https://github.com/MetaMask/post-message-stream/pull/121))
- Bump @babel/traverse from 7.13.17 to 7.23.2 ([#116](https://github.com/MetaMask/post-message-stream/pull/116))

## [8.0.0]
### Changed
- **BREAKING:** Increase minimum Node.js version to `^16.20.0` ([#110](https://github.com/MetaMask/post-message-stream/pull/110))
- Update `@metamask/utils` from `^5.0.2` to `^8.0.1` ([#108](https://github.com/MetaMask/post-message-stream/pull/108))

## [7.0.0]
### Changed
- **BREAKING:** Update `readable-stream` from `2.3.3` to `3.6.2` ([#88](https://github.com/MetaMask/post-message-stream/pull/88))

## [6.2.0]
### Added
- Add `setLogger` function for logging incoming/outgoing messages ([#93](https://github.com/MetaMask/post-message-stream/pull/93))

## [6.1.2]
### Changed
- Use `addEventListener` instead of `onmessage` in WebWorkerPostMessageStream ([#83](https://github.com/MetaMask/post-message-stream/pull/83))
  - This fixes compatibility with LavaMoat.

## [6.1.1]
### Fixed
- Fixed accessing MessageEvent prototype after event lockdown ([#79](https://github.com/MetaMask/post-message-stream/pull/79))

## [6.1.0]
### Added
- Add browser runtime post message stream ([#69](https://github.com/MetaMask/post-message-stream/pull/69))

## [6.0.0]
### Changed
- **BREAKING:** Use separate entrypoint for browser environments ([#49](https://github.com/MetaMask/post-message-stream/pull/49))
  - This means `worker_threads` and `child_process` streams are no longer exposed in the browser.

## [5.1.0]
### Added
- Export `BasePostMessageStream` ([#45](https://github.com/MetaMask/post-message-stream/pull/45))

## [5.0.1]
### Security
- Fix `WindowPostMessageStream` parameter documentation ([#43](https://github.com/MetaMask/post-message-stream/pull/43))
  - The security implications of the `targetOrigin` and `targetWindow` parameters were mischaracterized in the [5.0.0] documentation.

## [5.0.0]
### Added
- Add `StreamData` and `StreamMessage` types ([#37](https://github.com/MetaMask/post-message-stream/pull/37))
- Add `worker_threads` streams ([#39](https://github.com/MetaMask/post-message-stream/pull/39))
- Add `child_process` streams ([#34](https://github.com/MetaMask/post-message-stream/pull/34))

### Changed
- **BREAKING:** Increase minimum Node.js version to `^14.0.0` ([#38](https://github.com/MetaMask/post-message-stream/pull/38))
- **BREAKING:** Adopt a uniform naming scheme for all classes ([#40](https://github.com/MetaMask/post-message-stream/pull/40))
- **BREAKING:** Throw an error when constructing a stream in the wrong environment ([#40](https://github.com/MetaMask/post-message-stream/pull/40))
  - For example, a `WebWorkerPostMessageStream` can now only be constructed in a `WebWorker`. This change may not be breaking in practice because the streams would not work in unintended environments anyway.
- **BREAKING:** Add `targetOrigin` parameter for `WindowPostMessageStream` ([#23](https://github.com/MetaMask/post-message-stream/pull/23))

## [4.0.0] - 2021-05-04
### Added
- [#9](https://github.com/MetaMask/post-message-stream.git/pull/9): Add LICENSE file
- [#6](https://github.com/MetaMask/post-message-stream.git/pull/6): Add `WorkerPostMessageStream` and `WorkerParentPostMessageStream`
- [#18](https://github.com/MetaMask/post-message-stream.git/pull/18): Add changelog

### Changed
- [#18](https://github.com/MetaMask/post-message-stream.git/pull/18): **(BREAKING)** Rename package to `@metamask/post-message-stream`
- [#6](https://github.com/MetaMask/post-message-stream.git/pull/6): **(BREAKING)** Refactor exports
  - `PostMessageStream` default export now exported under name `WindowPostMessageStream`
- [#13](https://github.com/MetaMask/post-message-stream.git/pull/13): Migrate to TypeScript, add typings

## [3.0.0] - 2017-07-13
### Changed
- **(BREAKING)** Add handshake to mitigate synchronization issues

## [2.0.0] - 2017-01-17
### Added
- `targetWindow` constructor option
- README.md

## [1.0.0] - 2016-08-11
### Added
- Initial release.

[Unreleased]: https://github.com/MetaMask/post-message-stream/compare/v8.1.0...HEAD
[8.1.0]: https://github.com/MetaMask/post-message-stream/compare/v8.0.0...v8.1.0
[8.0.0]: https://github.com/MetaMask/post-message-stream/compare/v7.0.0...v8.0.0
[7.0.0]: https://github.com/MetaMask/post-message-stream/compare/v6.2.0...v7.0.0
[6.2.0]: https://github.com/MetaMask/post-message-stream/compare/v6.1.2...v6.2.0
[6.1.2]: https://github.com/MetaMask/post-message-stream/compare/v6.1.1...v6.1.2
[6.1.1]: https://github.com/MetaMask/post-message-stream/compare/v6.1.0...v6.1.1
[6.1.0]: https://github.com/MetaMask/post-message-stream/compare/v6.0.0...v6.1.0
[6.0.0]: https://github.com/MetaMask/post-message-stream/compare/v5.1.0...v6.0.0
[5.1.0]: https://github.com/MetaMask/post-message-stream/compare/v5.0.1...v5.1.0
[5.0.1]: https://github.com/MetaMask/post-message-stream/compare/v5.0.0...v5.0.1
[5.0.0]: https://github.com/MetaMask/post-message-stream/compare/v4.0.0...v5.0.0
[4.0.0]: https://github.com/MetaMask/post-message-stream/compare/v3.0.0...v4.0.0
[3.0.0]: https://github.com/MetaMask/post-message-stream/compare/v2.0.0...v3.0.0
[2.0.0]: https://github.com/MetaMask/post-message-stream/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/MetaMask/post-message-stream/releases/tag/v1.0.0
