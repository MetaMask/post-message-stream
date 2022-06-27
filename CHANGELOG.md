# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [5.0.0]
### Uncategorized
- BREAKING: Add environment validation and rename classes ([#40](https://github.com/MetaMask/post-message-stream/pull/40))
- Standardize repository (Q2 2022) ([#41](https://github.com/MetaMask/post-message-stream/pull/41))
- Add `worker_threads` streams ([#39](https://github.com/MetaMask/post-message-stream/pull/39))
- Add `child_process` streams ([#34](https://github.com/MetaMask/post-message-stream/pull/34))
- Add `StreamData` and `StreamMessage` type guard ([#37](https://github.com/MetaMask/post-message-stream/pull/37))
- @metamask/eslint-config*@^9 ([#36](https://github.com/MetaMask/post-message-stream/pull/36))
- Bump to Node 14 ([#38](https://github.com/MetaMask/post-message-stream/pull/38))
- Bump shell-quote from 1.7.2 to 1.7.3 ([#33](https://github.com/MetaMask/post-message-stream/pull/33))
- Bump cached-path-relative from 1.0.2 to 1.1.0 ([#29](https://github.com/MetaMask/post-message-stream/pull/29))
- Bump tmpl from 1.0.4 to 1.0.5 ([#27](https://github.com/MetaMask/post-message-stream/pull/27))
- Bump tar from 6.1.0 to 6.1.11 ([#26](https://github.com/MetaMask/post-message-stream/pull/26))
- Bump path-parse from 1.0.6 to 1.0.7 ([#25](https://github.com/MetaMask/post-message-stream/pull/25))
- Bump minimist from 1.2.5 to 1.2.6 ([#31](https://github.com/MetaMask/post-message-stream/pull/31))
- add targetOrigin option ([#23](https://github.com/MetaMask/post-message-stream/pull/23))
- Bump normalize-url from 4.5.0 to 4.5.1 ([#21](https://github.com/MetaMask/post-message-stream/pull/21))
- Bump ws from 7.4.5 to 7.4.6 ([#20](https://github.com/MetaMask/post-message-stream/pull/20))
- Repo standardization ([#19](https://github.com/MetaMask/post-message-stream/pull/19))

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
