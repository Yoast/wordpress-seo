// This needs a custom external file because the way react-select internally
// Loads dependencies is not compatible with WebPack.
window.yoast = window.yoast || {};
window.yoast.reactSelect = require( "react-select/dist/react-select.browser.cjs.js" );
window.yoast.reactSelectAsync = require( "react-select/async/dist/react-select.browser.cjs.js" );
