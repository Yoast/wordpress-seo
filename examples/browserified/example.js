var SnippetPreview = require( "../../js/snippetPreview" );
var App = require( "../../js/app" );
var PreviouslyUsedKeywords = require( "../../js/bundledPlugins/previouslyUsedKeywords.js" );
var TestPlugin = require( "./example-plugin-test.js" );
/**
 * binds the renewData function on the change of inputelements.
 */
var bindEvents = function( app ) {
	var elems = [ "content", "focusKeyword" ];
	for ( var i = 0; i < elems.length; i++ ) {
		document.getElementById( elems[ i ] ).addEventListener( "input", app.refresh.bind( app ) );
	}
};

window.onload = function() {
	var snippetPreview = new SnippetPreview({
		targetElement: document.getElementById( "snippet" )
	});

	var app = new App({
		snippetPreview: snippetPreview,
		targets: {
			output: "output",
			contentOutput: "contentOutput"
		},
		callbacks: {
			getData: function() {
				return {
					keyword: document.getElementById( "focusKeyword" ).value,
					text: document.getElementById( "content" ).value
				};
			}
		}
	});

	bindEvents( app );

	app.refresh();

	var args = {
		usedKeywords: {"keyword": [1], "test": [2, 3, 4]},
		searchUrl: "http://example.com/post?id={id}",
		postUrl: "http://example.com/search?kw={keyword}"
	};

	var testPlugin = new TestPlugin( app, args, app.i18n );

	testPlugin.addPlugin();

	var previouslyUsedKeywordsPlugin = new PreviouslyUsedKeywords(
		app, args, app.i18n
	);
	previouslyUsedKeywordsPlugin.registerPlugin();
};
