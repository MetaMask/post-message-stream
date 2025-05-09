# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [10.0.0]

### Changed

- **BREAKING:** Build the package as both CJS and ESM ([#168](https://github.com/MetaMask/post-message-stream/pull/168))
  - The package now uses the `exports` field in `package.json` to define the entry points for CJS and ESM.
  - It's no longer possible to import from the `dist` directory directly.
- **BREAKING:** Move Node.js-specific functionality to `@metamask/post-message-stream/node` entry point ([#168](https://github.com/MetaMask/post-message-stream/pull/168))
  - The main entry point is now compatible with Node.js and browsers.
- Bump `@metamask/utils` from `^11.0.1` to `^11.4.0` ([#169](https://github.com/MetaMask/post-message-stream/pull/169))
- Bump `elliptic` from `6.6.0` to `6.6.1` ([#160](https://github.com/MetaMask/post-message-stream/pull/160))

## [9.0.0]

### Changed

- **BREAKING:** Increase minimum Node.js version to `^18.18` ([#145](https://github.com/MetaMask/post-message-stream/pull/145))
- Bump `@metamask/utils` from `^9.0.0` to `^11.0.1` ([#144](https://github.com/MetaMask/post-message-stream/pull/144), [#148](https://github.com/MetaMask/post-message-stream/pull/148), [#153](https://github.com/MetaMask/post-message-stream/pull/153))

## [8.1.1]

### Changed

- Bump `@metamask/utils` from `^8.1.0` to `^9.0.0` ([#140](https://github.com/MetaMask/post-message-stream/pull/140))

## [8.1.0]

### Changed

- Support overriding default Duplex Stream options as constructor options. ([#131](https://github.com/MetaMask/post-message-stream/pull/131))

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

[Unreleased]: https://github.com/MetaMask/post-message-stream/compare/v10.0.0...HEAD
[10.0.0]: https://github.com/MetaMask/post-message-stream/compare/v9.0.0...v10.0.0
[9.0.0]: https://github.com/MetaMask/post-message-stream/compare/v8.1.1...v9.0.0
[8.1.1]: https://github.com/MetaMask/post-message-stream/compare/v8.1.0...v8.1.1
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
