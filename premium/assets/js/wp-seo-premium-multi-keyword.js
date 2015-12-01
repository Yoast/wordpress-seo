/* global YoastSEO: true, wp, wpseoPostScraperL10n, _ */
YoastSEO = ( 'undefined' === typeof YoastSEO ) ? {} : YoastSEO;
(function( $ ) {
	'use strict';

	var maxKeywords = 5;
	var keywordTabTemplate;

	var YoastMultiKeyword = function() {};

	YoastMultiKeyword.prototype.initDOM = function() {
		keywordTabTemplate = wp.template( 'keyword_tab' );

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
		$( '.wpseo-metabox-tabs' ).on( 'click', '.wpseo_keyword_tab > .wpseo_tablink', function() {
			// Convert to string to prevent errors if the keyword is "null".
			var keyword = $( this ).data( 'keyword' ) + '';
			$( '#yoast_wpseo_focuskw_text_input' ).val( keyword ).focus();
			YoastSEO.app.refresh();
		} );
	};

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

	YoastMultiKeyword.prototype.bindKeywordField = function() {
		$( '#yoast_wpseo_focuskw_text_input' ).on( 'input', function( ev ) {
			var currentTabLink, focusKeyword;

			focusKeyword = $( ev.currentTarget ).val();
			currentTabLink = $( 'li.active > .wpseo_tablink' );
			currentTabLink.data( 'keyword', focusKeyword );
			currentTabLink.find( 'span.wpseo_keyword' ).text( focusKeyword || '...' );
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

		if ( '' === keyword ) {
			score = 'na';
		} else {
			score = parseInt( score, 10 );
			score = YoastSEO.ScoreFormatter.prototype.overallScoreRating( score );
		}

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
		YoastSEO.app.getData();
		analyzerData = YoastSEO.app.rawData;
		analyzerData = YoastSEO.app.modifyData( analyzerData );
		analyzerData.i18n = YoastSEO.app.i18n;

		// Sanitize keyword
		keyword = YoastSEO.app.stringHelper.sanitizeKeyword( keyword );

		// Set the keyword we want to analyze instead of the on-page one.
		analyzerData.keyword = keyword;

		if ( '' === keyword ) {
			analyzerData.queue = [ 'keyWordCheck', 'wordCount', 'fleschReading', 'pageTitleLength', 'urlStopwords', 'metaDescriptionLength' ];
		}

		analyzer = new YoastSEO.Analyzer( analyzerData );
		YoastSEO.app.pluggable._addPluginTests( analyzer );
		analyzer.runQueue();
		analyzer.score();

		return analyzer.analyzeScorer.getTotalScore();
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

			score = YoastSEO.app.scoreFormatter.overallScoreRating( score );

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

	YoastSEO.multiKeyword = true;
}( jQuery ));
