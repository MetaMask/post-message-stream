# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [5.0.0]
### Added
- Add `StreamData` and `StreamMessage` types ([#37](https://github.com/MetaMask/post-message-stream/pull/37))
- Add `worker_threads` streams ([#39](https://github.com/MetaMask/post-message-stream/pull/39))
- Add `child_process` streams ([#34](https://github.com/MetaMask/post-message-stream/pull/34))

### Changed
- **BREAKING:** Bump to Node 14 ([#38](https://github.com/MetaMask/post-message-stream/pull/38))
- **BREAKING:** Add environment validation and rename classes ([#40](https://github.com/MetaMask/post-message-stream/pull/40))
- **BREAKING:** Add `targetOrigin` option for `WindowPostMessageStream` ([#23](https://github.com/MetaMask/post-message-stream/pull/23))
- Standardize repository ([#19](https://github.com/MetaMask/post-message-stream/pull/19), [#36](https://github.com/MetaMask/post-message-stream/pull/36), [#41](https://github.com/MetaMask/post-message-stream/pull/41))

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

[Unreleased]: https://github.com/MetaMask/post-message-stream/compare/v5.0.0...HEAD
[5.0.0]: https://github.com/MetaMask/post-message-stream/compare/v4.0.0...v5.0.0
[4.0.0]: https://github.com/MetaMask/post-message-stream/compare/v3.0.0...v4.0.0
[3.0.0]: https://github.com/MetaMask/post-message-stream/compare/v2.0.0...v3.0.0
[2.0.0]: https://github.com/MetaMask/post-message-stream/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/MetaMask/post-message-stream/releases/tag/v1.0.0
