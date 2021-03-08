import { isUndefined } from "lodash-es";

import MissingArgument from "../errors/missingArgument";
import { createAnchorOpeningTag } from "../helpers/shortlinker";
import AssessmentResult from "../values/AssessmentResult.js";

/**
 * @param {object} app The app
 * @param {object} args An arguments object with usedKeywords, searchUrl, postUrl,
 * @param {object} args.usedKeywords An object with keywords and ids where they are used.
 * @param {string} args.searchUrl The url used to link to a search page when multiple usages of the keyword are found.
 * @param {string} args.postUrl The url used to link to a post when 1 usage of the keyword is found.
 * @constructor
 */
var PreviouslyUsedKeyword = function( app, args ) {
	if ( isUndefined( app ) ) {
		throw new MissingArgument( "The previously keyword plugin requires the YoastSEO app" );
	}

	if ( isUndefined( args ) ) {
		args = {
			usedKeywords: {},
			searchUrl: "",
			postUrl: "",
		};
	}

	this.app = app;
	this.usedKeywords = args.usedKeywords;
	this.searchUrl = args.searchUrl;
	this.postUrl = args.postUrl;
	this.urlTitle = createAnchorOpeningTag( "https://yoa.st/33x" );
	this.urlCallToAction = createAnchorOpeningTag( "https://yoa.st/33y" );
};

/**
 * Registers the assessment with the assessor.
 *
 * @returns {void}
 */
PreviouslyUsedKeyword.prototype.registerPlugin = function() {
	this.app.registerAssessment( "usedKeywords", {
		getResult: this.assess.bind( this ),
		/**
		 * Checks if the paper has a keyphrase, which is a prerequisite for the assessment to run.
		 *
		 * @param {Paper} paper The paper.
		 *
		 * @returns {boolean} Whether the paper has a keyphrase.
		 */
		isApplicable: function( paper ) {
			return paper.hasKeyword();
		},
	}, "previouslyUsedKeywords" );
};

/**
 * Updates the usedKeywords.
 *
 * @param {object} usedKeywords An object with keywords and ids where they are used.
 * @returns {void}
 */
PreviouslyUsedKeyword.prototype.updateKeywordUsage = function( usedKeywords ) {
	this.usedKeywords = usedKeywords;
};

/**
 * Scores the previously used keyword assessment based on the count.
 *
 * @param {object} previouslyUsedKeywords The result of the previously used keywords research
 * @param {Paper} paper The paper object to research.
 * @param {Jed} i18n The i18n object.
 * @returns {object} the scoreobject with text and score.
 */
PreviouslyUsedKeyword.prototype.scoreAssessment = function( previouslyUsedKeywords, paper, i18n ) {
	var count = previouslyUsedKeywords.count;
	var id = previouslyUsedKeywords.id;
	if ( count === 0 ) {
		return {
			text: i18n.sprintf(
				/* Translators:
				%1$s expands to a link to an article on yoast.com,
				%2$s expands to an anchor tag. */
				i18n.dgettext( "js-text-analysis", "%1$sPreviously used keyphrase%2$s: You've not used this keyphrase before, very good." ),
				this.urlTitle,
				"</a>"
			),
			score: 9,
		};
	}
	if ( count === 1 ) {
		var url = "<a href='" + this.postUrl.replace( "{id}", id ) + "' target='_blank'>";
		return {
			/* Translators: %1$s and %2$s expand to an admin link where the keyword is already used. %3$s and %4$s
			expand to links on yoast.com, %4$s expands to the anchor end tag. */
			text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "%3$sPreviously used keyphrase%5$s: " +
				"You've used this keyphrase %1$sonce before%2$s. " +
				"%4$sDo not use your keyphrase more than once%5$s." ),
			url,
			"</a>",
			this.urlTitle,
			this.urlCallToAction,
			"</a>"
			),
			score: 6,
		};
	}
	if ( count > 1 ) {
		url = "<a href='" + this.searchUrl.replace( "{keyword}", encodeURIComponent( paper.getKeyword() ) ) + "' target='_blank'>";
		return {
			/* Translators: %1$s and $3$s expand to the admin search page for the keyword, %2$d expands to the number
			of times this keyword has been used before, %4$s and %5$s expand to links to yoast.com, %6$s expands to
			the anchor end tag */
			text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "%4$sPreviously used keyphrase%6$s: " +
				"You've used this keyphrase %1$s%2$d times before%3$s. " +
				"%5$sDo not use your keyphrase more than once%6$s." ),
			url,
			count,
			"</a>",
			this.urlTitle,
			this.urlCallToAction,
			"</a>"
			),
			score: 1,
		};
	}
};

/**
 * Researches the previously used keywords, based on the used keywords and the keyword in the paper.
 *
 * @param {Paper} paper The paper object to research.
 * @returns {{id: number, count: number}} The object with the count and the id of the previously used keyword
 */
PreviouslyUsedKeyword.prototype.researchPreviouslyUsedKeywords = function( paper ) {
	var keyword = paper.getKeyword();
	var count = 0;
	var id = 0;

	if ( ! isUndefined( this.usedKeywords[ keyword ] ) ) {
		count = this.usedKeywords[ keyword ].length;
		id = this.usedKeywords[ keyword ][ 0 ];
	}

	return {
		id: id,
		count: count,
	};
};

/**
 * The assessment for the previously used keywords.
 *
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @param {object} i18n The locale object.
 * @returns {AssessmentResult} The assessment result of the assessment
 */
PreviouslyUsedKeyword.prototype.assess = function( paper, researcher, i18n ) {
	var previouslyUsedKeywords = this.researchPreviouslyUsedKeywords( paper );
	var previouslyUsedKeywordsResult = this.scoreAssessment( previouslyUsedKeywords, paper, i18n );

	var assessmentResult =  new AssessmentResult();
	assessmentResult.setScore( previouslyUsedKeywordsResult.score );
	assessmentResult.setText( previouslyUsedKeywordsResult.text );

	return assessmentResult;
};

export default PreviouslyUsedKeyword;
