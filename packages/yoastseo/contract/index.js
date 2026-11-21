/*
 * Public entry point for the serializable Paper input contract: `require( "yoastseo/contract" )`.
 *
 * Deliberately shipped as its own entry, separate from the package root (`build/index.js`), so the
 * contract's runtime dependency (zod) is pulled in only by consumers that import the contract — never by
 * code that loads the package root as a bundler "external" (e.g. Yoast SEO for WordPress, which exposes
 * the root as a shared global). Mirrors the `yoastseo/researcher` entry. Keeping it here also gives
 * consumers a stable path without deep-requiring `build/...`.
 */
module.exports = require( "../build/contract" );
