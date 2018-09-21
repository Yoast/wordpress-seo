/* global wpseoAdminL10n */
/* global ajaxurl */
/* global require */

var Jed = require( "jed" );

import {
	Paper,
	SEOAssessor,
	TaxonomyAssessor,
} from "yoastseo";

var isUndefined = require( "lodash/isUndefined" );

( function( $ ) {
	var i18n = new Jed( {
		domain: "js-text-analysis",
		locale_data: { // eslint-disable-line camelcase
			"js-text-analysis": {
				"": {},
			},
		},
	} );

	/**
	 * Constructs the recalculate score.
	 *
	 * @param {int} totalCount The total amount of items to calculate.
	 *
	 * @constructor
	 */
	var YoastRecalculateScore = function( totalCount ) {
		// Sets the total count
		this.totalCount = totalCount;
		this.oncomplete  = false;

		this.setupAssessors();

		$( "#wpseo_count_total" ).html( totalCount );

		jQuery( "#wpseo_progressbar" ).progressbar( { value: 0 } );
	};

	/**
	 * Sets up the Assessors needed for the recalculation.
	 *
	 * @returns {void}
	 */
	YoastRecalculateScore.prototype.setupAssessors = function() {
		var postAssessor = new SEOAssessor( i18n );
		var taxonomyAssessor = new TaxonomyAssessor( i18n );

		this.validAssessors = {
			post: postAssessor,
			term: taxonomyAssessor,
		};
	};

	/**
	 * Starts the recalculation
	 *
	 * @param {int} itemsToFetch     The amount of items to fetch.
	 * @param {string} fetchType      The fetch type.
	 * @param {string} idField        The ID field to extract from each item.
	 * @param {Function|bool} callback Callback when calculating has been completed.
	 *
	 * @returns {void}
	 */
	YoastRecalculateScore.prototype.start = function( itemsToFetch, fetchType, idField, callback ) {
		if ( ! this.validAssessors.hasOwnProperty( fetchType ) ) {
			throw new Error( "Unknown fetch type of " + fetchType + " given." );
		}

		this.fetchType    = fetchType;
		this.itemsToFetch = itemsToFetch;
		this.idField      = idField;
		this.oncomplete   = callback;

		this.assessor       = this.validAssessors[ fetchType ];

		this.getItemsToRecalculate( 1 );
	};

	/**
	 * Updates the progressbar
	 *
	 * @param {int} totalPosts Total amount of posts.
	 *
	 * @returns {void}
	 */
	YoastRecalculateScore.prototype.updateProgressBar = function( totalPosts ) {
		var currentValue = jQuery( "#wpseo_count" ).text();
		var newValue = parseInt( currentValue, 10 ) + totalPosts;
		var newWidth = newValue * ( 100 / this.totalCount );

		jQuery( "#wpseo_progressbar" ).progressbar( "value", newWidth );

		this.updateCountElement( newValue );
	};

	/**
	 * Updates the element with the new count value
	 *
	 * @param {int} newValue The new value for count element.
	 *
	 * @returns {void}
	 */
	YoastRecalculateScore.prototype.updateCountElement = function( newValue ) {
		jQuery( "#wpseo_count" ).html( newValue );
	};

	/**
	 * Calculate the scores
	 *
	 * @param {int}   totalItems Total amount of items.
	 * @param {array} items       The items to calculate the score for.
	 *
	 * @returns {array} The calculated scores
	 */
	YoastRecalculateScore.prototype.calculateScores = function( totalItems, items ) {
		var scores = [];
		for ( var i = 0; i < totalItems; i++ ) {
			scores.push( this.getScore( items[ i ] ) );
		}

		return scores;
	};

	/**
	 * Returns the score
	 *
	 * @param {json} item Item to get te score for.
	 *
	 * @returns {{item_id: int, score}} Object with score for item.
	 */
	YoastRecalculateScore.prototype.getScore = function( item ) {
		return {
			item_id: this.getItemID( item ), // eslint-disable-line camelcase
			taxonomy: ( item.taxonomy ) ? item.taxonomy : "",
			score: this.calculateItemScore( item ),
		};
	};

	/**
	 * Returns the item id
	 *
	 * @param {json} item Item to get the id from.
	 *
	 * @returns {int} The id from the item.
	 */
	YoastRecalculateScore.prototype.getItemID = function( item ) {
		this.itemsToFetch--;

		return item[ this.idField ];
	};

	/**
	 * Pass the post to the analyzer to calculates it's core
	 *
	 * @param {Object} item Item to calculate the score for.
	 *
	 * @returns {void}
	 */
	YoastRecalculateScore.prototype.calculateItemScore = function( item ) {
		var tempPaper = new Paper( item.text, {
			keyword: item.keyword,
			url: item.url,
			locale: wpseoAdminL10n.contentLocale,
			description: item.meta,
			title: item.pageTitle,
		} );

		var tempAssessor = this.assessor;

		tempAssessor.assess( tempPaper );

		return tempAssessor.calculateOverallScore();
	};

	/**
	 * Parse the response given by request in getItemsToRecalculate.
	 *
	 * @param {Object} response Response to parse.
	 *
	 * @returns {void}
	 */
	YoastRecalculateScore.prototype.parseResponse = function( response ) {
		if ( response !== "" && response !== null ) {
			if ( ! isUndefined( response.total_items ) ) {
				var scores = this.calculateScores( response.total_items, response.items );

				this.sendScores( scores );

				this.updateProgressBar( response.total_items );
			}

			if ( isUndefined( response.next_page ) ) {
				this.onCompleteRequest();
			} else {
				this.getItemsToRecalculate( response.next_page );
			}

			return true;
		}

		this.onCompleteRequest();
	};

	/**
	 * Run the oncomplete method when the process is done..
	 *
	 * @returns {void}
	 */
	YoastRecalculateScore.prototype.onCompleteRequest = function() {
		// When there is nothing to do.
		if ( this.oncomplete !== false ) {
			this.oncomplete();
			this.oncomplete = false;
		}
	};

	/**
	 * Sends the scores to the backend
	 *
	 * @param {array} scores Scores to send.
	 *
	 * @returns {void}
	 */
	YoastRecalculateScore.prototype.sendScores = function( scores ) {
		jQuery.post(
			ajaxurl,
			{
				action: "wpseo_update_score",
				nonce: jQuery( "#wpseo_recalculate_nonce" ).val(),
				scores: scores,
				type: this.fetchType,
			}
		);
	};

	/**
	 * Get the posts which have to be recalculated.
	 *
	 * @param {int} currentPage The current page.
	 *
	 * @returns {void}
	 */
	YoastRecalculateScore.prototype.getItemsToRecalculate = function( currentPage ) {
		jQuery.post(
			ajaxurl,
			{
				action: "wpseo_recalculate_scores",
				nonce: jQuery( "#wpseo_recalculate_nonce" ).val(),
				paged: currentPage,
				type: this.fetchType,
			},
			this.parseResponse.bind( this ),
			"json"
		);
	};

	/**
	 * Starting the recalculation process
	 *
	 * @param {object} response The response.
	 *
	 * @returns {void}
	 */
	function startRecalculate( response ) {
		var PostsToFetch = parseInt( response.posts, 10 );
		var TermsToFetch = parseInt( response.terms, 10 );

		var RecalculateScore = new YoastRecalculateScore( PostsToFetch + TermsToFetch );

		RecalculateScore.start( PostsToFetch, "post", "post_id", function() {
			RecalculateScore.start( TermsToFetch, "term", "term_id", false );
		} );
	}

	/**
	 * Initializes the event handler for the recalculate button.
	 *
	 * @returns {void}
	 */
	function init() {
		var recalculateLink = jQuery( "#wpseo_recalculate_link" );

		if ( ! isUndefined( recalculateLink ) ) {
			recalculateLink.click(
				function() {
					// Reset the count element and the progressbar
					jQuery( "#wpseo_count" ).text( 0 );

					$.post(
						ajaxurl,
						{
							action: "wpseo_recalculate_total",
							nonce: jQuery( "#wpseo_recalculate_nonce" ).val(),
						},
						startRecalculate,
						"json"
					);
				}
			);

			if ( recalculateLink.data( "open" ) ) {
				recalculateLink.trigger( "click" );
			}
		}
	}

	$( init );
}( jQuery ) );
