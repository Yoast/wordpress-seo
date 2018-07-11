import * as assessments from "./js/assessments";
import * as helpers from "./js/helpers";
import * as markers from "./js/markers";
import * as string from "./js/stringProcessing";

var plugins = {
	usedKeywords: require( "./js/bundledPlugins/previouslyUsedKeywords" )
};

module.exports = {
	Assessor: require( "./js/assessor" ),
	SEOAssessor: require( "./js/seoAssessor" ),
	ContentAssessor: require( "./js/contentAssessor" ),
	App: require( "./js/app" ),
	Pluggable: require( "./js/pluggable" ),
	Researcher: require( "./js/researcher" ),
	SnippetPreview: require( "./js/snippetPreview.js" ),

	Paper: require( "./js/values/Paper" ),
	AssessmentResult: require( "./js/values/AssessmentResult" ),

	bundledPlugins: plugins,

	helpers,
	assessments,
	markers,
	string,
};
