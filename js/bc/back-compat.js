/* global YoastSEO: true */
YoastSEO = ( "undefined" === typeof YoastSEO ) ? {} : YoastSEO;

YoastSEO.SnippetPreview = require( "./../snippetPreview.js" );
YoastSEO.Pluggable = require( "./../pluggable.js" );
YoastSEO.App = require( "./../app.js" );

/**
 * Temporary access for the Yoast SEO multi keyword implementation until we publish to npm.
 *
 * @private
 */
YoastSEO.App.prototype._sanitizeKeyword = require( "../stringProcessing/sanitizeString.js" );

YoastSEO.Jed = require( "jed" );
