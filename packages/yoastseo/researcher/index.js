/*
 * Public entry point for the per-language Researcher factory: `require( "yoastseo/researcher" )`.
 *
 * It is deliberately shipped as its own entry, separate from the package root (`build/index.js`). The
 * split is a conscious optimisation for consumers that load `yoastseo` as a bundler "external" — i.e. the
 * package root is provided once as a shared global (or shared chunk) instead of being bundled into every
 * consumer. (Yoast SEO for WordPress does this, exposing the root as `window.yoast.analysis`, but any
 * bundler can be configured the same way.) Each language Researcher transitively imports ~2.4 MB of
 * language data, so re-exporting this factory from the root would pull every language into whatever bundle
 * imports the root. Keeping it here lets consumers reach the factory via a stable path without
 * deep-requiring `build/...`, and load only the languages they need.
 */
module.exports = require( "../build/languageProcessing/getResearcher" ).default;
