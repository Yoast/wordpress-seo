YoastSEO = ( "undefined" === typeof YoastSEO ) ? {} : YoastSEO;

YoastSEO.Jed = require( "Jed" );

require( "./config/config.js" );
require( "./config/scoring.js" );
require( "./analyzer.js" );
require( "./preprocessor.js" );
require( "./analyzescorer.js" );
require( "./scoreFormatter.js" );
require( "./stringhelper.js" );
YoastSEO.SnippetPreview = require( "./snippetPreview.js" );
require( "./app.js" );
require( "./pluggable.js" );
