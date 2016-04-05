var plugins = {
	usedKeywords: require( "./js/bundledPlugins/previouslyUsedKeywords" )
};

var helpers = {
	scoreToRating: require( "./js/interpreters/scoreToRating" ),
};

module.exports = {
	Assessor: require( "./js/assessor" ),
	App: require( "./js/app.js" ),
	Pluggable: require( "./js/app" ),
	Researcher: require( "./js/researcher" ),
	SnippetPreview: require( "./js/snippetPreview.js" ),

	bundledPlugins: plugins,
	helpers: helpers
};
