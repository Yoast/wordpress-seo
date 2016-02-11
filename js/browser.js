YoastSEO = ( "undefined" === typeof YoastSEO ) ? {} : YoastSEO;

require( "./config/config.js" );
require( "./config/scoring.js" );
YoastSEO.Analyzer = require( "./analyzer.js" );
require( "./analyzescorer.js" );
require( "./scoreFormatter.js" );
YoastSEO.SnippetPreview = require( "./snippetPreview.js" );
require( "./app.js" );
require( "./pluggable.js" );

/**
 * Temporary access for the Yoast SEO multi keyword implementation until we publish to npm.
 *
 * @private
 */
YoastSEO.App.prototype._sanitizeKeyword = require( "../js/stringProcessing/sanitizeString.js" );

YoastSEO.Jed = require( "jed" );
