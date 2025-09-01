# Changelog

## 1.1.0 - 2025-08-18: Update to WP 6.8 + Next 15 + React 19 + Node 22

This major update brings significant version upgrades across the entire stack, ensuring compatibility with the latest technologies while maintaining stability and performance.

### 🚀 Major Version Updates

- **WordPress 6.8**: Updated WordPress core and related dependencies ([c0cd14c](https://github.com/superhuit-agency/superstack_test/commit/c0cd14c))
- **Node.js 22**: Upgraded to Node.js v22 with updated CI/CD configurations ([8af2282](https://github.com/superhuit-agency/superstack_test/commit/8af2282))
- **Next.js 15 + React 19**: Updated to Next.js 15 and React 19 with all package dependencies ([62b7163](https://github.com/superhuit-agency/superstack_test/commit/62b7163))

### 🐛 Compatibility Fixes

- Fixed patterns and child blocks in Gutenberg inserter after WordPress update ([a0f7f60](https://github.com/superhuit-agency/superstack_test/commit/a0f7f60))
- Resolved WordPress 6.8 compatibility issues ([1f8637b](https://github.com/superhuit-agency/superstack_test/commit/1f8637b))
- Fixed Next.js components rendering inside WordPress Editor ([0674b6a](https://github.com/superhuit-agency/superstack_test/commit/0674b6a))
- Improved inner blocks and lists styling ([91fe946](https://github.com/superhuit-agency/superstack_test/commit/91fe946))

### ✨ Enhancements

- Added cache option to fetchAPI parameters ([bba5069](https://github.com/superhuit-agency/superstack_test/commit/bba5069))
- Enhanced Vercel deployment with CLI integration ([97dc5fa](https://github.com/superhuit-agency/superstack_test/commit/97dc5fa))
- Improved block whitelisting functionality ([11c57f7](https://github.com/superhuit-agency/superstack_test/commit/11c57f7))

### 🧪 Tests

Automated tests added using the `npm run test:all` command. Jest packages were added and configured.
Github workflows were changed to enable automatic testing upon pull requests and automatic versioning upon changes on the main branch.
A first set of unit tests was made on all the _atoms_ components. More details about testing in the [dedicated documentation](./docs/automation/tests.md).

Environement variables updated to and splitted between variables and secrets for a better debug during deployment.

## 1.0.0 - 2024-05-07

_Initial release._
