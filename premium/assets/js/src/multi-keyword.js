/* global YoastSEO: true, wp, wpseoPostScraperL10n, _ */
var scoreToRating = require( "yoastseo/js/interpreters/scoreToRating" );
var indicatorsFactory = require( "yoastseo/js/config/presenter" );
var Paper = require( "yoastseo/js/values/paper" );
var _isUndefined = require( "lodash/isUndefined" );

var indicators;

window.YoastSEO = ( 'undefined' === typeof window.YoastSEO ) ? {} : window.YoastSEO;
(function( $ ) {
	'use strict';

	var maxKeywords = 5;
	var keywordTabTemplate;

	var YoastMultiKeyword = function() {};

	YoastMultiKeyword.prototype.initDOM = function() {
		window.YoastSEO.multiKeyword = true;

		keywordTabTemplate = wp.template( 'keyword_tab' );

		indicators = indicatorsFactory( YoastSEO.app.i18n );

		this.setTextInput();
		this.insertElements();

		this.bindKeywordField();
		this.bindKeywordAdd();
		this.bindScore();
		this.bindKeywordTab();
		this.bindKeywordRemove();

		this.updateInactiveKeywords();
	};

	/**
	 * Determines the default values based on the state of the loaded edit page.
	 */
	YoastMultiKeyword.prototype.setTextInput = function() {
		$( '#yoast_wpseo_focuskw_text_input' ).val( $( '#yoast_wpseo_focuskw' ).val() );
	};

	/**
	 * Update keyword tabs and saves this information to the hidden field.
	 *
	 * @param {number} score The score calculated by the analyzer for the current tab.
	 */
	YoastMultiKeyword.prototype.updateKeywords = function( score ) {
		var firstKeyword, keywords;

		this.updateActiveKeywordTab( score );
		this.updateInactiveKeywords();
		this.updateOverallScore();

		keywords = $( '.wpseo_keyword_tab' ).map( function( i, keywordTab ) {
			keywordTab = $( keywordTab ).find( '.wpseo_tablink' );

			return {
				// Convert to string to prevent errors if the keyword is "null".
				keyword: keywordTab.data( 'keyword' ) + '',
				score: keywordTab.data( 'score' )
			};
		} ).get();

		// Exclude empty keywords.
		keywords = _.filter( keywords, function( item ) {
			return item.keyword.length > 0;
		});

		if ( 0 === keywords.length ) {
			keywords.push({ keyword: '', score: 0 });
		}

		if ( keywords.length > 0 ) {
			firstKeyword = keywords.splice( 0, 1 ).shift();

			$( '#yoast_wpseo_focuskw' ).val( firstKeyword.keyword );
		}

		// Save keyword information to the hidden field.
		$( '#yoast_wpseo_focuskeywords' ).val( JSON.stringify( keywords ) );
	};

	/**
	 * Inserts multi keyword elements into the DOM
	 */
	YoastMultiKeyword.prototype.insertElements = function() {
		this.addKeywordTabs();
	};

	/**
	 * Adds an event handler when the score updates
	 */
	YoastMultiKeyword.prototype.bindScore = function() {
		$( window ).on( 'YoastSEO:numericScore', this.handleUpdatedScore.bind( this ) );
	};

	/**
	 * Handles an update of the score thrown by the post scraper.
	 *
	 * @param {jQuery.Event} ev The event triggered.
	 * @param {number}       score The scores calculated by the analyzer.
	 */
	YoastMultiKeyword.prototype.handleUpdatedScore = function( ev, score ) {
		this.updateKeywords( score );
	};

	/**
	 * Adds event handler to keyword tabs to change current keyword
	 */
	YoastMultiKeyword.prototype.bindKeywordTab = function() {
		$( '.wpseo-metabox-tabs' ).on( 'click', '.wpseo_keyword_tab > .wpseo_tablink', function() {
			// Convert to string to prevent errors if the keyword is "null".
			var keyword = $( this ).data( 'keyword' ) + '';
			$( '#yoast_wpseo_focuskw_text_input' ).val( keyword ).focus();
			YoastSEO.app.refresh();
		} );
	};

	/**
	 * Adds event handler to tab removal links
	 */
	YoastMultiKeyword.prototype.bindKeywordRemove = function() {
		$( '.wpseo-metabox-tabs' ).on( 'click', '.remove-keyword', function( ev ) {
			var previousTab, currentTab;

			ev.preventDefault();
			currentTab = $( ev.currentTarget ).parent( 'li' );
			previousTab = currentTab.prev();
			currentTab.remove();

			// If the removed tab was active we should make a different one active.
			if ( currentTab.hasClass( 'active' ) ) {
				previousTab.find( '.wpseo_tablink' ).click();
			}

			this.updateUI();
		}.bind( this ) );
	};

	/**
	 * Adds event handler to updates of the keyword field
	 */
	YoastMultiKeyword.prototype.bindKeywordField = function() {
		$( '#yoast_wpseo_focuskw_text_input' ).on( 'input', function( ev ) {
			var currentTabLink, focusKeyword;

			focusKeyword = $( ev.currentTarget ).val();
			currentTabLink = $( 'li.active > .wpseo_tablink' );
			currentTabLink.data( 'keyword', focusKeyword );
			currentTabLink.find( 'span.wpseo_keyword' ).text( focusKeyword || '...' );
		}.bind( this ) );
	};

	/**
	 * Adds event handler to the keyword add button
	 */
	YoastMultiKeyword.prototype.bindKeywordAdd = function() {
		$( '.wpseo-add-keyword' ).click( function() {
			if ( ! this.canAddTab() ) {
				return;
			}

			this.addKeywordTab( null, 'na', true );
		}.bind( this ) );
	};

	/**
	 * Adds keyword tabs to the DOM
	 */
	YoastMultiKeyword.prototype.addKeywordTabs = function() {
		var keywords = JSON.parse( $( '#yoast_wpseo_focuskeywords' ).val() || '[]' );

		keywords.unshift({
			keyword: $( '#yoast_wpseo_focuskw' ).val(),
			score:   $( '#yoast_wpseo_linkdex' ).val()
		});

		// Clear the container
		$( '#wpseo-metabox-tabs' ).find( '.wpseo_keyword_tab' ).remove();

		if ( keywords.length > 0 ) {
			for( var i in keywords ) {
				var keyword = keywords[i].keyword;
				var score = keywords[i].score;
				this.addKeywordTab( keyword, score );
			}
		}

		// On page load the first tab is always active.
		$( '.wpseo_keyword_tab' ).first().addClass( 'active' );
	};

	/**
	 * Adds a single keyword to the DOM
	 *
	 * @param {string} keyword The keyword for this tab.
	 * @param {string} score The score class for this tab.
	 * @param {boolean} focus Whether this tab should be currently focused.
	 */
	YoastMultiKeyword.prototype.addKeywordTab = function( keyword, score, focus ) {
		var placeholder, html, templateArgs;

		// Insert a new keyword tab.
		keyword = keyword || '';
		placeholder = keyword.length > 0 ? keyword : '...';

		templateArgs = {
			keyword: keyword,
			placeholder: placeholder,
			score: score
		};

		// If this is the first keyword we add we want to add the "Content:" prefix
		if ( 0 === $( '.wpseo_keyword_tab' ).length ) {
			templateArgs.prefix = wpseoPostScraperL10n.contentTab;
			templateArgs.hideRemove = true;
		}

		html = keywordTabTemplate( templateArgs );
		$( '.wpseo-tab-add-keyword' ).before( html );

		this.updateUI();

		// Open the newly created tab.
		if ( focus === true ) {
			$( '.wpseo_keyword_tab:last > .wpseo_tablink' ).click();
		}
	};

	/**
	 * Updates UI based on the current state.
	 */
	YoastMultiKeyword.prototype.updateUI = function() {
		var $addKeywordButton = $( '.wpseo-add-keyword' );

		if ( this.canAddTab() ) {
			$addKeywordButton
				.prop( 'disabled', false )
				.attr( 'aria-disabled', 'false' );
		}
		else {
			$addKeywordButton
				.prop( 'disabled', true )
				.attr( 'aria-disabled', 'true' );
		}
	};

	/**
	 * Updates active keyword tab
	 *
	 * @param {number} score Score as returned by the analyzer.
	 */
	YoastMultiKeyword.prototype.updateActiveKeywordTab = function( score ) {
		var keyword, tab;

		tab     = $( '.wpseo_keyword_tab.active' );
		keyword = $( '#yoast_wpseo_focuskw_text_input').val();

		this.renderKeywordTab( keyword, score, tab, true );
	};

	/**
	 * Updates all keywords tabs that are currently inactive.
	 */
	YoastMultiKeyword.prototype.updateInactiveKeywords = _.debounce( function() {
		var inactiveKeywords;

		inactiveKeywords = $( '.wpseo_keyword_tab:not( .active )' );

		inactiveKeywords.each( function( i, tab ) {
			this.updateKeywordTab( tab );
		}.bind( this ) );
	}, 300 );

	/**
	 * Update one keyword tab.
	 *
	 * @param {Object} tab The tab to update.
	 */
	YoastMultiKeyword.prototype.updateKeywordTab = function( tab ) {
		var keyword, link, score;

		tab = $( tab );

		link    = tab.find( '.wpseo_tablink' );
		keyword = link.data( 'keyword' ) + '';
		score   = this.analyzeKeyword( keyword );

		this.renderKeywordTab( keyword, score, tab );
	};

	/**
	 * Retrieves the indicators for a certain score and keyword
	 *
	 * @param {number} score
	 * @param {string} keyword The keyword for this score.
	 */
	YoastMultiKeyword.prototype.getIndicator = function( score, keyword ) {
		var rating;

		score /= 10;

		rating = scoreToRating( score );

		if ( '' === keyword ) {
			rating = 'feedback';
		}

		return indicators[ rating ];
	};

	/**
	 * Renders a keyword tab
	 *
	 * @param {string}  keyword The keyword to render.
	 * @param {number}  score The score for this given keyword.
	 * @param {Object}  tabElement A DOM Element of a tab.
	 * @param {boolean} [active=false] Whether or not the rendered tab should be active.
	 *
	 * @returns {string} The HTML for the keyword tab.
	 */
	YoastMultiKeyword.prototype.renderKeywordTab = function( keyword, score, tabElement, active ) {
		var html, templateArgs, placeholder;

		tabElement = $( tabElement );

		placeholder = keyword.length > 0 ? keyword : '...';

		var indicators = this.getIndicator( score, keyword );

		templateArgs = {
			keyword: keyword,
			placeholder: placeholder,
			score: indicators.className
		};

		// The first tab isn't deletable
		if ( 0 === tabElement.index() ) {
			templateArgs.hideRemove = true;
			templateArgs.prefix = wpseoPostScraperL10n.contentTab;
		}

		if ( true === active ) {
			templateArgs.active = true;
		}

		html = keywordTabTemplate( templateArgs );

		// Add an extra class if the tab should be active.
		if ( true === active ) {
			html = html.replace( 'class="wpseo_keyword_tab', 'class="wpseo_keyword_tab active' );
		}

		tabElement.replaceWith( html );
	};

	/**
	 * Analyzes a certain keyword with an ad-hoc analyzer
	 *
	 * @param {string} keyword The keyword to analyze.
	 *
	 * @return {number} Total score.
	 */
	YoastMultiKeyword.prototype.analyzeKeyword = function( keyword ) {
		var paper;
		var assessor = YoastSEO.app.assessor;
		var currentPaper;

		currentPaper = YoastSEO.app.paper;

		if ( _isUndefined( currentPaper ) ) {
			return 0;
		}

		// Re-use the data already present in the page.
		paper = new Paper( currentPaper.getText(), {
			keyword: keyword,
			description: currentPaper.getDescription(),
			title: currentPaper.getTitle(),
			url: currentPaper.getUrl(),
			locale: currentPaper.getLocale()
		} );

		assessor.assess( paper );

		return assessor.calculateOverallScore();
	};

	/**
	 * Makes sure the overall score is always correct even if we switch to different tabs.
	 */
	YoastMultiKeyword.prototype.updateOverallScore = function() {
		var score;
		var mainKeywordField, currentKeywordField;

		mainKeywordField = $( '#yoast_wpseo_focuskw' );
		currentKeywordField = $( '#yoast_wpseo_focuskw_text_input' );

		if ( mainKeywordField.val() !== currentKeywordField.val() ) {
			score = $( '#yoast_wpseo_linkdex' ).val();
			score = parseInt( score, 10 );

			score = indicators[ scoreToRating( score ) ];
			score = score.className;

			if ( '' === mainKeywordField.val() ) {
				score = 'na';
			}

			$( '.overallScore' )
				.removeClass( 'na bad ok good' )
				.addClass( score );
		}
	};

	/**
	 * Returns whether or not a new tab can be added
	 *
	 * @returns {boolean}
	 */
	YoastMultiKeyword.prototype.canAddTab = function() {
		var tabAmount;

		tabAmount = $( '.wpseo_keyword_tab' ).length;

		return tabAmount < maxKeywords;
	};

	var multiKeyword = new YoastMultiKeyword();
	$( window ).on( 'YoastSEO:ready', multiKeyword.initDOM.bind( multiKeyword ) );

	window.YoastSEO.multiKeyword = true;
}( jQuery ));
