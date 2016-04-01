/* global YoastSEO: true */
YoastSEO = ( "undefined" === typeof YoastSEO ) ? {} : YoastSEO;

YoastSEO.analyzerConfig = require( "./../config/config.js" );
YoastSEO.AnalyzerScoring = require( "./../config/scoring.js" ).AnalyzerScoring;
YoastSEO.analyzerScoreRating = require( "./../config/scoring.js" ).analyzerScoreRating;
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
