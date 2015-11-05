/* global YoastSEO: true, wp, wpseoPostScraperL10n, _ */
YoastSEO = ( 'undefined' === typeof YoastSEO ) ? {} : YoastSEO;
(function( $ ) {
	'use strict';

	var maxKeywords = 5;
	var keywordTabTemplate;

	var YoastMultiKeyword = function() {
		this.insertElements();

		this.bindKeywordField();
		this.bindKeywordAdd();
		this.bindScore();
		this.bindKeywordTab();
		this.bindKeywordRemove();
	};

	/**
	 * Update keyword tabs and saves this information to the hidden field.
	 *
	 * @param {number} score The score calculated by the analyzer for the current tab.
	 */
	YoastMultiKeyword.prototype.updateKeywords = function( score ) {
		var keywords;

		this.updateActiveKeywordTab( score );
		this.updateInactiveKeywords();

		keywords = $( '.wpseo_keyword_tab' ).map( function ( i, keywordTab ) {
			keywordTab = $( keywordTab ).find( '.wpseo_tablink' );

			return {
				keyword: keywordTab.data( 'keyword' ),
				score: keywordTab.data( 'score' )
			};
		} ).get();

		// Exclude empty keywords.
		keywords = _.filter( keywords, function( item ) {
			return item.keyword.length > 0;
		});

		// Save keyword information to the hidden field.
		$( '#yoast_wpseo_focuskeywords' ).val( JSON.stringify( keywords ) );
	};

	YoastMultiKeyword.prototype.insertElements = function() {
		this.addKeywordTabs();
	};

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

	YoastMultiKeyword.prototype.bindKeywordTab = function() {
		$( '.wpseo-metabox-tabs' ).on( 'click', '.wpseo_tablink', function() {
			var keyword = $( this ).data( 'keyword' );
			$( '#yoast_wpseo_focuskw' ).val( keyword ).focus();
			YoastSEO.app.refresh();
		} );
	};

	YoastMultiKeyword.prototype.bindKeywordRemove = function() {
		$( '.wpseo-metabox-tabs' ).on( 'click', '.remove-keyword', function( ev ) {
			ev.preventDefault();
			var current_tab = $( ev.currentTarget ).parent( 'li' );
			var prev_tab = current_tab.prev();
			current_tab.remove();
			if ( current_tab.hasClass( 'active' ) ) {
				prev_tab.find( '.wpseo_tablink' ).click();
			}
			this.updateKeywords();

			this.updateUI();
		}.bind( this ) );
	};

	YoastMultiKeyword.prototype.bindKeywordField = function() {
		$( '#yoast_wpseo_focuskw' ).on( 'input', function( ev ) {
			var focusKeyword = $( ev.currentTarget ).val();
			var current_tab_link = $( 'li.active > .wpseo_tablink' );
			current_tab_link.data( 'keyword', focusKeyword );
			current_tab_link.find( 'span.wpseo_keyword' ).text( focusKeyword || '...' );
			this.updateKeywords();
		}.bind( this ) );
	};

	YoastMultiKeyword.prototype.bindKeywordAdd = function() {
		$( '.wpseo-add-keyword' ).click( function() {
			if ( ! this.canAddTab() ) {
				return;
			}

			this.addKeywordTab( null, 'na', true );
		}.bind( this ) );
	};

	YoastMultiKeyword.prototype.addKeywordTabs = function() {
		var keywords = JSON.parse( $( '#yoast_wpseo_focuskeywords' ).val() || '[]' );

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

	YoastMultiKeyword.prototype.addKeywordTab = function( keyword, score, focus ) {
		// Insert a new keyword tab.
		keyword = keyword || '';
		var placeholder = keyword.length > 0 ? keyword : '...';

		var keyword_tab = keywordTabTemplate( { keyword: keyword, placeholder: placeholder, score: score } );
		$( '.wpseo-tab-add-keyword' ).before( keyword_tab );

		this.updateUI();

		// Open the newly created tab.
		if ( focus === true ) {
			$( '.wpseo_keyword_tab:last > .wpseo_tablink' ).click();
		}
	};

	/**
	 * returns a string that is used as a CSSclass, based on the numeric score
	 * @param {number} score
	 * @returns scoreRate
	 */
	YoastMultiKeyword.prototype.scoreRating = function( score ) {
		var scoreRate;
		switch ( score ) {
			case 0:
				scoreRate = 'na';
				break;
			case 4:
			case 5:
				scoreRate = 'poor';
				break;
			case 6:
			case 7:
				scoreRate = 'ok';
				break;
			case 8:
			case 9:
			case 10:
				scoreRate = 'good';
				break;
			default:
				scoreRate = 'bad';
				break;
		}
		return scoreRate;
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
		var activeTabIndex;
		var placeholder, keyword, html, templateArgs, tab;

		tab     = $( '.wpseo_keyword_tab.active' );
		keyword = $( '#yoast_wpseo_focuskw').val();

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
		var keyword, link, score, html, placeholder, templateArgs;

		tab = $( tab );

		link    = tab.find( '.wpseo_tablink' );
		keyword = link.data( 'keyword' );
		score   = this.analyzeKeyword( keyword );

		this.renderKeywordTab( keyword, score, tab );
	};

	/**
	 * Renders a keyword tab
	 *
	 * @param {string}  keyword The keyword to render.
	 * @param {number}  score The score for this given keyword.
	 * @param {Object}  tabElement A DOM Element of a tab.
	 * @param {boolean} active Whether or not this tab should be active.
	 *
	 * @returns {string} The HTML for the keyword tab.
	 */
	YoastMultiKeyword.prototype.renderKeywordTab = function( keyword, score, tabElement, active ) {
		var html, templateArgs, placeholder;

		tabElement = $( tabElement );

		placeholder = keyword.length > 0 ? keyword : '...';

		score = parseInt( score, 10 );
		score = YoastSEO.ScoreFormatter.prototype.scoreRating( score );

		templateArgs = {
			keyword: keyword,
			placeholder: placeholder,
			score: score
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
		var analyzerData, analyzer;

		// Re-use the data already present in the page.
		analyzerData = YoastSEO.app.config.callbacks.getData();
		analyzerData.i18n = YoastSEO.app.i18n;

		// Set the keyword we want to analyze instead of the on-page one.
		analyzerData.keyword = keyword;

		analyzer = new YoastSEO.Analyzer( analyzerData );
		analyzer.runQueue();
		analyzer.score();

		return analyzer.analyzeScorer.getTotalScore();
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

	$( window ).on( 'YoastSEO:ready', function() {
		keywordTabTemplate = wp.template( 'keyword_tab' );

		var multiKeyword = new YoastMultiKeyword();

		multiKeyword.updateInactiveKeywords();
	} );

	YoastSEO.multiKeyword = true;
}( jQuery ));
