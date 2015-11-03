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
	};

	YoastMultiKeyword.prototype.updateKeywords = function() {
		var keywords = [];
		$( '.wpseo_keyword_tab > .wpseo_tablink' ).each( function( i, el ) {
			var keyword = $( el ).data( 'keyword' );
			var score = $( el ).data( 'score' );

			if ( keyword.length > 0 ) {
				keywords.push( { keyword: keyword, score: score });
			}
		} );

		$( '#yoast_wpseo_focuskeywords' ).val( JSON.stringify( keywords ) );
	};

	YoastMultiKeyword.prototype.insertElements = function() {
		$( '.content > .wpseo_tablink').append( ': <span class="wpseo-score-icon"><span class="screen-reader-text"></span></span><em><span class="wpseo_keyword"></span></em>' );
		this.addKeywordTabs();
	};

	YoastMultiKeyword.prototype.reloadTabs = function() {
		window.wpseo_init_tabs();

		this.bindKeywordTab();
		this.bindKeywordRemove();
	};

	YoastMultiKeyword.prototype.bindScore = function() {
		$( window ).on('YoastSEO:numericScore', function( ev, score ) {
			score = $( '#yoast_wpseo_focuskw' ).val() !== '' ? this.scoreRating( score ) : 'na';
			var activeTab = $( '.wpseo_keyword_tab.active');
			activeTab.find( '.wpseo_tablink' ).data( 'score', score );
			activeTab.find( '.wpseo-score-icon' ).attr( 'class', 'wpseo-score-icon ' + score );
			activeTab.find( '.wpseo-score-icon > .screen-reader-text').text( 'SEO score ' + score );

			this.updateKeywords();
		}.bind( this ) );
	};

	YoastMultiKeyword.prototype.bindKeywordTab = function() {
		$( '.wpseo-metabox-tabs' ).on( 'click', '.wpseo_tablink', function() {
			var keyword = $( this ).data( 'keyword' );
			$( '#yoast_wpseo_focuskw' ).val( keyword ).focus();
			YoastSEO.app.refresh();
		} );
	};

	YoastMultiKeyword.prototype.bindKeywordRemove = function() {
		$( '.remove-keyword' ).click( function( ev ) {
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
		$('.wpseo-add-keyword').click( function() {
			if ( ! this.canAddTab() ) {
				return;
			}

			this.addKeywordTab( null, 'na', true );
		}.bind( this ) );
	};

	YoastMultiKeyword.prototype.addKeywordTabs = function() {
		var keywords = JSON.parse( $( '#yoast_wpseo_focuskeywords' ).val() || '[]' );

		// strip the primary keyword from the keywords if available
		var primaryKeyword = keywords.splice( 0, 1 )[0] || { keyword: '', score: 'na' };
		this.setupGeneralTab( primaryKeyword );

		if ( keywords.length > 0 ) {
			for( var i in keywords ) {
				var keyword = keywords[i].keyword;
				var score = keywords[i].score;
				this.addKeywordTab( keyword, score );
			}
		}
	};

	YoastMultiKeyword.prototype.setupGeneralTab = function( keywordObject ) {
		var keyword = keywordObject.keyword;
		var score = keywordObject.score;

		var generalTabScore = $( '.wpseo_keyword_tab.content').find('.wpseo-score-icon');
		var generalTabLink = $( '.content > .wpseo_tablink' );

		$( '#yoast_wpseo_focuskw').val( keyword );

		generalTabLink.data( 'keyword', keyword );
		generalTabLink.find( 'span.wpseo_keyword' ).text( keyword || '...' );
		generalTabLink.data( 'score', score );

		generalTabScore.attr( 'class', 'wpseo-score-icon ' + score );
		generalTabScore.find( '.screen-reader-text').text( 'SEO score ' + score );
	};

	YoastMultiKeyword.prototype.addKeywordTab = function( keyword, score, focus ) {
		// Insert a new keyword tab.
		keyword = keyword || '';
		var placeholder = keyword.length > 0 ? keyword : '...';

		var keyword_tab = keywordTabTemplate( { keyword: keyword, placeholder: placeholder, score: score } );
		$( '.wpseo_keyword_tab:last' ).after( keyword_tab );

		// Reload to get the correct bindings.
		this.reloadTabs();

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
	 * Updates all keywords tabs that are currently inactive.
	 */
	YoastMultiKeyword.prototype.updateInactiveKeywords = function() {
		var inactiveKeywords;

		inactiveKeywords = $( '.wpseo_keyword_tab:not( .active )' );

		inactiveKeywords.each( function( i, tab ) {
			this.updateKeywordTab( tab );
		}.bind( this ) );
	};

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

		placeholder = keyword.length > 0 ? keyword : '...';

		score = parseInt( score, 10 );
		score = YoastSEO.ScoreFormatter.prototype.scoreRating( score );

		templateArgs = {
			keyword: keyword,
			placeholder: placeholder,
			score: score
		};

		// The first tab isn't deletable
		if ( 0 === tab.index() ) {
			templateArgs.hideRemove = true;
			templateArgs.prefix = wpseoPostScraperL10n.contentTab;
		}

		html = keywordTabTemplate( templateArgs );

		tab.replaceWith( html );
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

		return analyzer.analyzeScorer.__totalScore;
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

		var updateInactiveKeywords = _.debounce( multiKeyword.updateInactiveKeywords.bind( multiKeyword ), 300 );
		$( window ).on( 'YoastSEO:numericScore', updateInactiveKeywords );
	} );

	YoastSEO.multiKeyword = true;
}( jQuery ));
