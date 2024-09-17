import { __, sprintf } from "@wordpress/i18n";
import { isUndefined } from "lodash";

import MissingArgument from "../errors/missingArgument";
import { createAnchorOpeningTag } from "../helpers";
import AssessmentResult from "../values/AssessmentResult.js";

/**
 * The PreviouslyUsedKeyword plugin allows to check for previously used keywords.
 */
export default class PreviouslyUsedKeyword {
	/**
	 * Constructs a new PreviouslyUsedKeyword plugin.
	 *
	 * @param {object} app The app.
	 * @param {object} args An arguments object.
	 * @param {object} args.usedKeywords An object with keywords and ids where they are used.
	 * @param {object} args.usedKeywordsPostTypes An object with the post types of the post ids from usedKeywords.
	 * @param {string} args.searchUrl The url used to link to a search page when multiple usages of the keyword are found.
	 * @param {string} args.postUrl The url used to link to a post when 1 usage of the keyword is found.
	 *
	 * @constructor
	 */
	constructor( app, args ) {
		if ( isUndefined( app ) ) {
			throw new MissingArgument( "The previously keyword plugin requires the YoastSEO app" );
		}

		if ( isUndefined( args ) ) {
			args = {
				usedKeywords: {},
				usedKeywordsPostTypes: {},
				searchUrl: "",
				postUrl: "",
			};
		}

		this.app = app;
		this.usedKeywords = args.usedKeywords;
		this.usedKeywordsPostTypes = args.usedKeywordsPostTypes;
		this.searchUrl = args.searchUrl;
		this.postUrl = args.postUrl;
		this.urlTitle = createAnchorOpeningTag( "https://yoa.st/33x" );
		this.urlCallToAction = createAnchorOpeningTag( "https://yoa.st/33y" );
	}

	/**
	 * Registers the assessment with the assessor.
	 *
	 * @returns {void}
	 */
	registerPlugin() {
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
	}

	/**
	 * Updates the usedKeywords.
	 *
	 * @param {object} usedKeywords An object with keywords and ids where they are used.
	 * @param {object} usedKeywordsPostTypes An object with keywords and in which post types they are used.
	 * The post types correspond with the ids in the usedKeywords parameter.
	 * @returns {void}
	 */
	updateKeywordUsage( usedKeywords, usedKeywordsPostTypes ) {
		this.usedKeywords = usedKeywords;
		this.usedKeywordsPostTypes = usedKeywordsPostTypes;
	}

	/**
	 * Scores the previously used keyword assessment based on the count.
	 *
	 * @param {object} previouslyUsedKeywords The result of the previously used keywords research
	 * @param {Paper} paper The paper object to research.
	 * @returns {{text: string, score: number}} The result object with a feedback text and a score.
	 */
	scoreAssessment( previouslyUsedKeywords, paper ) {
		const count = previouslyUsedKeywords.count;
		const id = previouslyUsedKeywords.id;
		const postTypeToDisplay = previouslyUsedKeywords.postTypeToDisplay;
		let url;

		if ( count === 0 ) {
			return {
				text: sprintf(
					/* translators:
					%1$s expands to a link to an article on yoast.com,
					%2$s expands to an anchor end tag. */
					__( "%1$sPreviously used keyphrase%2$s: You've not used this keyphrase before, very good.", "wordpress-seo" ),
					this.urlTitle,
					"</a>"
				),
				score: 9,
			};
		}
		if ( count === 1 ) {
			url = `<a href='${this.postUrl.replace( "{id}", id )}' target='_blank'>`;
			return {
				/* translators: %1$s expands to an admin link where the keyphrase is already used,
				 %2$s expands to the anchor end tag, %3$s and %4$s expand to links on yoast.com. */
				text: sprintf( __(
					"%3$sPreviously used keyphrase%2$s: You've used this keyphrase %1$sonce before%2$s. %4$sDo not use your keyphrase more than once%2$s.",
					"wordpress-seo"
				),
				url,
				"</a>",
				this.urlTitle,
				this.urlCallToAction
				),
				score: 6,
			};
		}

		if ( count > 1 ) {
			if ( postTypeToDisplay ) {
				url = `<a href='${this.searchUrl.replace( "{keyword}", encodeURIComponent( paper.getKeyword() ) )}&post_type=${postTypeToDisplay}' target='_blank'>`;
			} else {
				url = `<a href='${this.searchUrl.replace( "{keyword}", encodeURIComponent( paper.getKeyword() ) )}' target='_blank'>`;
			}

			return {
				/* translators: %1$s expands to a link to the admin search page for the keyphrase,
				 %2$s expands to the anchor end tag, %3$s and %4$s expand to links to yoast.com */
				text: sprintf( __(
					"%3$sPreviously used keyphrase%2$s: You've used this keyphrase %1$smultiple times before%2$s. %4$sDo not use your keyphrase more than once%2$s.",
					"wordpress-seo"
				),
				url,
				"</a>",
				this.urlTitle,
				this.urlCallToAction
				),
				score: 1,
			};
		}
	}

	/**
	 * Researches the previously used keywords, based on the used keywords and the keyword in the paper.
	 *
	 * @param {Paper} paper The paper object to research.
	 * @returns {{id: number, count: number}} The object with the count and the id of the previously used keyword
	 */
	researchPreviouslyUsedKeywords( paper ) {
		const keyword = paper.getKeyword();
		let count = 0;
		let postTypeToDisplay = "";
		let id = 0;

		if ( ! isUndefined( this.usedKeywords[ keyword ] ) && this.usedKeywords[ keyword ].length > 0 ) {
			count = this.usedKeywords[ keyword ].length;
			if ( keyword in this.usedKeywordsPostTypes ) {
				postTypeToDisplay = this.usedKeywordsPostTypes[ keyword ][ 0 ];
			}
			id = this.usedKeywords[ keyword ][ 0 ];
		}

		return {
			id: id,
			count: count,
			postTypeToDisplay: postTypeToDisplay,
		};
	}

	/**
	 * Executes the assessment that checks whether a text uses previously used keywords.
	 *
	 * @param {Paper} paper The Paper object to assess.
	 * @returns {AssessmentResult} The assessment result containing both a score and a descriptive text.
	 */
	assess( paper ) {
		const previouslyUsedKeywords = this.researchPreviouslyUsedKeywords( paper );
		const previouslyUsedKeywordsResult = this.scoreAssessment( previouslyUsedKeywords, paper );

		const assessmentResult = new AssessmentResult();
		assessmentResult.setScore( previouslyUsedKeywordsResult.score );
		assessmentResult.setText( previouslyUsedKeywordsResult.text );

		return assessmentResult;
	}
}
