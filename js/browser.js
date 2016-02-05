YoastSEO = ( "undefined" === typeof YoastSEO ) ? {} : YoastSEO;

require( "./config/config.js" );
require( "./config/scoring.js" );
require( "./analyzer.js" );
require( "./preprocessor.js" );
require( "./analyzescorer.js" );
require( "./scoreFormatter.js" );
YoastSEO.SnippetPreview = require( "./snippetPreview.js" );
require( "./app.js" );
require( "./pluggable.js" );

YoastSEO.Jed = require( "Jed" );
