/* global wpseoAdminL10n */
/* global ajaxurl */
/* global require */

var Jed = require( "jed" );
var Paper = require( "yoastseo/js/values/Paper" );
var SEOAssessor = require( "yoastseo/js/SEOAssessor" );
var TaxonomyAssessor = require( "./assessors/taxonomyAssessor" );
var isUndefined = require( "lodash/isUndefined" );

( function( $ ) {
	"use strict";

	var i18n = new Jed( {
		domain: "js-text-analysis",
		locale_data: {
			"js-text-analysis": {
				"": {},
			},
		},
	} );

	/**
	 * Constructs the recalculate score.
	 *
	 * @constructor
	 */
	var YoastRecalculateScore = function( total_count ) {
		// Sets the total count
		this.total_count = total_count;
		this.oncomplete  = false;

		this.setupAssessors();

		$( "#wpseo_count_total" ).html( total_count );

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
	 * @param {int} items_to_fetch
	 * @param {string} fetch_type
	 * @param {string} id_field
	 * @param {Function|bool} callback
	 *
	 * @returns {void}
	 */
	YoastRecalculateScore.prototype.start = function( items_to_fetch, fetch_type, id_field, callback ) {
		if ( ! this.validAssessors.hasOwnProperty( fetch_type ) ) {
			throw new Error( "Unknown fetch type of " + fetch_type + " given." );
		}

		this.fetch_type     = fetch_type;
		this.items_to_fetch = items_to_fetch;
		this.id_field       = id_field;
		this.oncomplete     = callback;

		this.assessor       = this.validAssessors[ fetch_type ];

		this.getItemsToRecalculate( 1 );
	};

	/**
	 * Updates the progressbar
	 *
	 * @param {int} total_posts
	 *
	 * @returns {void}
	 */
	YoastRecalculateScore.prototype.updateProgressBar = function( total_posts ) {
		var current_value = jQuery( "#wpseo_count" ).text();
		var new_value = parseInt( current_value, 10 ) + total_posts;
		var new_width = new_value * ( 100 / this.total_count );

		jQuery( "#wpseo_progressbar" ).progressbar( "value", new_width );

		this.updateCountElement( new_value );
	};

	/**
	 * Updates the element with the new count value
	 *
	 * @param {int} new_value
	 *
	 * @returns {void}
	 */
	YoastRecalculateScore.prototype.updateCountElement = function( new_value ) {
		jQuery( "#wpseo_count" ).html( new_value );
	};

	/**
	 * Calculate the scores
	 *
	 * @param {int}   total_items
	 * @param {array} items
	 *
	 * @returns {void}
	 */
	YoastRecalculateScore.prototype.calculateScores = function( total_items, items ) {
		var scores = [];
		for ( var i = 0; i < total_items; i++ ) {
			scores.push( this.getScore( items[ i ] ) );
		}

		return scores;
	};

	/**
	 * Returns the score
	 *
	 * @param {json} item
	 * @returns {{item_id: int, score}}
	 */
	YoastRecalculateScore.prototype.getScore = function( item ) {
		return {
			item_id: this.getItemID( item ),
			taxonomy: ( item.taxonomy ) ? item.taxonomy : "",
			score: this.calculateItemScore( item ),
		};
	};

	/**
	 * Returns the item id
	 *
	 * @param {json} item
	 * @returns {int}
	 */
	YoastRecalculateScore.prototype.getItemID = function( item ) {
		this.items_to_fetch--;

		return item[ this.id_field ];
	};

	/**
	 * Pass the post to the analyzer to calculates it's core
	 *
	 * @param {Object} item
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
	 * @param {Object} response
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

			if ( ! isUndefined( response.next_page ) ) {
				this.getItemsToRecalculate( response.next_page );
			}
			else {
				this.onCompleteRequest();
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
	 * @param {array} scores
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
				type: this.fetch_type,
			}
		);
	};

	/**
	 * Get the posts which have to be recalculated.
	 *
	 * @param {int} current_page
	 *
	 * @returns {void}
	 */
	YoastRecalculateScore.prototype.getItemsToRecalculate = function( current_page ) {
		jQuery.post(
			ajaxurl,
			{
				action: "wpseo_recalculate_scores",
				nonce: jQuery( "#wpseo_recalculate_nonce" ).val(),
				paged: current_page,
				type: this.fetch_type,
			},
			this.parseResponse.bind( this ),
			"json"
		);
	};

	/**
	 * Starting the recalculation process
	 *
	 * @param {object} response
	 *
	 * @returns {void}
	 */
	function start_recalculate( response ) {
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
		var recalculate_link = jQuery( "#wpseo_recalculate_link" );

		if ( ! isUndefined( recalculate_link ) ) {
			recalculate_link.click(
				function() {
					// Reset the count element and the progressbar
					jQuery( "#wpseo_count" ).text( 0 );

					$.post(
						ajaxurl,
						{
							action: "wpseo_recalculate_total",
							nonce: jQuery( "#wpseo_recalculate_nonce" ).val(),
						},
						start_recalculate,
						"json"
					);
				}
			);

			if ( recalculate_link.data( "open" ) ) {
				recalculate_link.trigger( "click" );
			}
		}
	}

	$( init );
}( jQuery ) );
