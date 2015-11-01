/* global YoastSEO, wp, yoastMultiKeyword */
(function(){
	'use strict';

	var YoastMultiKeyword = function() {
		window.yoastMultiKeyword = this;

		this.insertElements();

		this.bindKeywordField();
		this.bindKeywordAdd();
		this.bindScore();
	};

	YoastMultiKeyword.prototype.updateKeywords = function() {
		var keywords = [];
		jQuery( '.wpseo_keyword_tab > .wpseo_tablink' ).each( function( i, el ) {
			var keyword = jQuery( el ).data( 'keyword' );
			var score = jQuery( el ).data( 'score' );

			if ( keyword.length > 0 ) {
				keywords.push( { keyword: keyword, score: score });
			}
		} );

		jQuery( '#yoast_wpseo_focuskeywords' ).val( JSON.stringify( keywords ) );
	};

	YoastMultiKeyword.prototype.insertElements = function() {
		jQuery( '.content > .wpseo_tablink').append( ': <span class="wpseo-score-icon"><span class="screen-reader-text"></span></span><em><span class="wpseo_keyword"></span></em>' );
		this.addKeywordTabs();
		this.insertAddKeywordButton();
	};

	YoastMultiKeyword.prototype.insertAddKeywordButton = function() {
		jQuery( 'li.wpseo_keyword_tab:last' ).after( wp.template( 'add_keyword_button' )() );
	};

	YoastMultiKeyword.prototype.reloadTabs = function() {
		window.wpseo_init_tabs();

		this.bindKeywordTab();
		this.bindKeywordRemove();
	};

	YoastMultiKeyword.prototype.bindScore = function() {
		jQuery( window ).on('YoastSEO:numericScore', function( ev, score ){
			score = jQuery( '#yoast_wpseo_focuskw' ).val() !== '' ? yoastMultiKeyword.scoreRating( score ) : 'na';
			var activeTab = jQuery( '.wpseo_keyword_tab.active');
			activeTab.find( '.wpseo_tablink' ).data( 'score', score );
			activeTab.find( '.wpseo-score-icon' ).attr( 'class', 'wpseo-score-icon ' + score );
			activeTab.find( '.wpseo-score-icon > .screen-reader-text').text( 'SEO score ' + score );

			yoastMultiKeyword.updateKeywords();
		} );
	}

	YoastMultiKeyword.prototype.bindKeywordTab = function() {
		jQuery( '.wpseo_keyword_tab > .wpseo_tablink' ).click( function() {
			var keyword = jQuery( this ).data( 'keyword' );
			jQuery( '#yoast_wpseo_focuskw' ).val( keyword ).focus();
			YoastSEO.app.refresh();
		} );
	};

	YoastMultiKeyword.prototype.bindKeywordRemove = function() {
		jQuery( '.remove-keyword' ).click( function( ev ) {
			ev.preventDefault();
			var current_tab = jQuery( this ).parent( 'li' );
			var prev_tab = current_tab.prev();
			current_tab.remove();
			if ( current_tab.hasClass( 'active' ) ) {
				prev_tab.find( '.wpseo_tablink' ).click();
			}
			yoastMultiKeyword.updateKeywords();
		} );
	};

	YoastMultiKeyword.prototype.bindKeywordField = function() {
		jQuery( '#yoast_wpseo_focuskw' ).on( 'input', function() {
			var focusKeyword = jQuery( this ).val();
			var current_tab_link = jQuery( 'li.active > .wpseo_tablink' );
			current_tab_link.data( 'keyword', focusKeyword );
			current_tab_link.find( 'span.wpseo_keyword' ).text( focusKeyword || '...' );
			yoastMultiKeyword.updateKeywords();
		} );
	};

	YoastMultiKeyword.prototype.bindKeywordAdd = function() {
		jQuery('.add-keyword').click( function( ev ){
			ev.preventDefault();
			jQuery( this ).blur();

			yoastMultiKeyword.addKeywordTab( null, 'na', true );
		} );
	};

	YoastMultiKeyword.prototype.addKeywordTabs = function() {
		var keywords = JSON.parse( jQuery( '#yoast_wpseo_focuskeywords' ).val() || "[]" );

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

		var generalTabScore = jQuery( '.wpseo_keyword_tab.content').find('.wpseo-score-icon');
		var generalTabLink = jQuery( '.content > .wpseo_tablink' );

		jQuery( '#yoast_wpseo_focuskw').val( keyword );

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

		var keyword_tab = wp.template( 'keyword_tab' )( { keyword: keyword, placeholder: placeholder, score: score } );
		jQuery( '.wpseo_keyword_tab:last' ).after( keyword_tab );

		// Reload to get the correct bindings.
		this.reloadTabs();

		// Open the newly created tab.
		if ( focus === true ) {
			jQuery( '.wpseo_keyword_tab:last > .wpseo_tablink' ).click();
		}
	};

	/**
	 * retuns a string that is used as a CSSclass, based on the numeric score
	 * @param score
	 * @returns scoreRate
	 */
	YoastMultiKeyword.prototype.scoreRating = function( score ) {
		var scoreRate;
		switch ( score ) {
			case 0:
				scoreRate = "na";
				break;
			case 4:
			case 5:
				scoreRate = "poor";
				break;
			case 6:
			case 7:
				scoreRate = "ok";
				break;
			case 8:
			case 9:
			case 10:
				scoreRate = "good";
				break;
			default:
				scoreRate = "bad";
				break;
		}
		return scoreRate;
	};

	jQuery( document ).ready(function() {
		new YoastMultiKeyword();
	} );
}());