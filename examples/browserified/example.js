var SnippetPreview = require( "../../js/snippetPreview" );
var App = require( "../../js/app" );

window.onload = function() {
	var snippetPreview = new SnippetPreview({
		targetElement: document.getElementById( "snippet" )
	});

	var app = new App({
		snippetPreview: snippetPreview,
		targets: {
			output: "output"
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

	app.refresh();
};
