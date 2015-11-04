/* global YoastSEO, wp, wpseoTermScraperL10n, ajaxurl, tinyMCE */
(function( $ ) {
	'use strict';

	var TermScraper = function() {};

	/**
	 * returns data fetched from inputfields.
	 * @returns {{keyword: *, meta: *, text: *, pageTitle: *, title: *, url: *, baseUrl: *, snippetTitle: *, snippetMeta: *, snippetCite: *}}
	 */
	TermScraper.prototype.getData = function() {
		return {
			title: this.getDataFromInput( 'title' ),
			keyword: this.getDataFromInput( 'keyword' ),
			text: this.getDataFromInput( 'text' ),
			pageTitle: this.getDataFromInput( 'pageTitle' ),
			url: this.getDataFromInput( 'url' ),
			baseUrl: this.getDataFromInput( 'baseUrl' ),
			snippetTitle: this.getDataFromInput( 'title' ),
			meta: this.getDataFromInput( 'meta' ),
			snippetMeta: this.getDataFromInput( 'meta' ),
			snippetCite: this.getDataFromInput( 'cite' )
		};
	};

	/**
	 *
	 * @param {string} inputType
	 */
	TermScraper.prototype.getDataFromInput = function( inputType ) {
		var val = '';
		var elem;
		switch( inputType ){
			case 'keyword':
				elem = document.getElementById( 'wpseo_focuskw' );
				val = elem.value;
				if ( val === '' ) {
					val = document.getElementById( 'name' ).value;
					elem.placeholder = val;
				}
				break;
			case 'meta':
				elem = document.getElementById( 'hidden_wpseo_desc' );
				if ( elem !== null ) {
					val = elem.value;
				}
				break;
			case 'text':
				val = this.getContentTinyMCE();
				break;
			case 'pageTitle':
			case 'title':
				val = document.getElementById( 'hidden_wpseo_title' ).value;
				break;
			case 'url':
			case 'cite':
				val = document.getElementById( 'slug' ).value;
				break;
			case 'baseUrl':
				val = wpseoTermScraperL10n.home_url.replace( /https?:\/\//ig, '' );
				break;

			case 'cite':
				elem = document.getElementById( 'snippet_cite' );
				if ( elem !== null ) {
					val = elem.textContent;
				}
				break;
		}
		return val;
	};

	/**
	 * gets content from the content field, if tinyMCE is initialized, use the getContent function to get the data from tinyMCE
	 * @returns {String}
	 */
	TermScraper.prototype.getContentTinyMCE = function() {
		var val = document.getElementById( 'description' ).value;
		if ( tinyMCE.editors.length !== 0 ) {
			val = tinyMCE.get( 'description' ).getContent();
		}
		return val;
	};

	/**
	 * When the snippet is updated, update the (hidden) fields on the page
	 * @param {Object} value
	 * @param {String} type
	 */
	TermScraper.prototype.setDataFromSnippet = function( value, type ) {
		switch ( type ) {
			case 'snippet_meta':
				document.getElementById( 'hidden_wpseo_desc' ).value = value;
				break;
			case 'snippet_cite':
				document.getElementById( 'slug' ).value = value;
				break;
			case 'snippet_title':
				document.getElementById( 'hidden_wpseo_title' ).value = value;
				break;
			default:
				break;
		}
	};

	/**
	 * binds elements
	 */
	TermScraper.prototype.bindElementEvents = function( app ) {
		this.snippetPreviewEventBinder ( app.snippetPreview );
		this.inputElementEventBinder( app );
		document.getElementById( 'wpseo_focuskw' ).addEventListener( 'keydown', app.snippetPreview.disableEnter );
	};

	/**
	 * binds the getinputfieldsdata to the snippetelements.
	 *
	 * @param {YoastSEO.SnippetPreview} snippetPreview The snippet preview object to bind the events on.
	 */
	TermScraper.prototype.snippetPreviewEventBinder = function( snippetPreview ) {
		var elems = [ 'snippet_meta', 'snippet_title', 'snippet_cite' ];

		for ( var i = 0; i < elems.length; i++ ) {
			this.bindSnippetEvents( document.getElementById( elems [ i ] ), snippetPreview );
		}
		var title = document.getElementById( 'snippet_title' );
		title.addEventListener( 'focus', snippetPreview.setSiteName.bind( snippetPreview ) );
		title.addEventListener( 'blur', snippetPreview.unsetSiteName.bind( snippetPreview ) );
	};

	/**
	 * binds the snippetEvents to a snippet element.
	 * @param { HTMLElement } elem snippet_meta, snippet_title, snippet_cite
	 * @param { YoastSEO.SnippetPreview } snippetPreview
	 */
	TermScraper.prototype.bindSnippetEvents = function( elem, snippetPreview ) {
		elem.addEventListener( 'keydown', snippetPreview.disableEnter.bind( snippetPreview ) );
		elem.addEventListener( 'blur', snippetPreview.checkTextLength.bind( snippetPreview ) );
		//textFeedback is given on input (when user types or pastests), but also on focus. If a string that is too long is being recalled
		//from the saved values, it gets the correct classname right away.
		elem.addEventListener( 'input', snippetPreview.textFeedback.bind( snippetPreview ) );
		elem.addEventListener( 'focus', snippetPreview.textFeedback.bind( snippetPreview ) );
		//shows edit icon by hovering over element
		elem.addEventListener( 'mouseover', snippetPreview.showEditIcon.bind( snippetPreview ) );
		//hides the edit icon onmouseout, on focus and on keyup. If user clicks or types AND moves his mouse, the edit icon could return while editting
		//by binding to these 3 events
		elem.addEventListener( 'mouseout', snippetPreview.hideEditIcon.bind( snippetPreview ) );
		elem.addEventListener( 'focus', snippetPreview.hideEditIcon.bind( snippetPreview ) );
		elem.addEventListener( 'keyup', snippetPreview.hideEditIcon.bind( snippetPreview ) );

		elem.addEventListener( 'focus', snippetPreview.getUnformattedText.bind( snippetPreview ) );
		elem.addEventListener( 'keyup', snippetPreview.setUnformattedText.bind( snippetPreview ) );
		elem.addEventListener( 'click', snippetPreview.setFocus.bind( snippetPreview ) );

		//adds the showIcon class to show the editIcon;
		elem.className = elem.className + ' showIcon' ;
	};

	/**
	 * binds the renewData function on the change of inputelements.
	 */
	TermScraper.prototype.inputElementEventBinder = function( app ) {
		var elems = [ 'name', 'description', 'slug', 'wpseo_focuskw' ];
		for (var i = 0; i < elems.length; i++) {
			var elem = document.getElementById(elems[i]);
			if (elem !== null) {
				document.getElementById(elems[i]).addEventListener('input', app.analyzeTimer.bind(app));
			}
		}

		//bind both input and change events on the editor, otherwise tinyMCE works very slow.
		tinyMCE.on( 'addEditor', function(e) {
			e.editor.on( 'input', function() {
				app.analyzeTimer.call( app );
			} );
			e.editor.on( 'change', function() {
				app.analyzeTimer.call( app );
			} );
		});
	};

	/**
	 * creates SVG for the overall score.
	 */
	TermScraper.prototype.saveScores = function( score ) {
		var tmpl = wp.template('score_svg');
		document.getElementById( YoastSEO.analyzerArgs.targets.overall ).innerHTML = tmpl();
		document.getElementById( 'hidden_wpseo_linkdex' ).value = score;
		jQuery( window ).trigger( 'YoastSEO:numericScore', score );

		this.updateKeywordTabContent( $( '#wpseo_focuskw' ).val(), score );
	};

	/**
	 * Initializes keyword tab with the correct template
	 */
	TermScraper.prototype.initKeywordTabTemplate = function() {
		var keyword, score;

		// Remove default functionality to prevent scrolling to top.
		$( '.wpseo-metabox-tabs' ).on( 'click', '.wpseo_tablink', function( ev ) {
			ev.preventDefault();
		});

		keyword = $( '#wpseo_focuskw' ).val();
		score   = $( '#hidden_wpseo_linkdex' ).val();

		this.updateKeywordTabContent( keyword, score );
	};

	/**
	 * Updates keyword tab with new content
	 */
	TermScraper.prototype.updateKeywordTabContent = function( keyword, score ) {
		var placeholder, keyword_tab;

		placeholder = keyword.length > 0 ? keyword : '...';

		score = parseInt( score, 10 );
		score = YoastSEO.ScoreFormatter.prototype.scoreRating( score );

		keyword_tab = wp.template( 'keyword_tab' )({
			keyword: keyword,
			placeholder: placeholder,
			score: score,
			hideRemove: true,
			prefix: wpseoTermScraperL10n.contentTab + ' '
		});

		$( '.wpseo_keyword_tab' ).replaceWith( keyword_tab );
	};

	/**
	 * updates the focus keyword usage if it is not in the array yet.
	 */
	TermScraper.prototype.updateKeywordUsage = function() {
		var keyword = this.value;
		if ( typeof( wpseoTermScraperL10n.keyword_usage[ keyword ] === null ) ) {
			jQuery.post(ajaxurl, {
					action: 'get_term_keyword_usage',
					post_id: jQuery('#post_ID').val(),
					keyword: keyword,
					taxonomy: wpseoTermScraperL10n.taxonomy
				}, function( data ) {
					if ( data ) {
						wpseoTermScraperL10n.keyword_usage[ keyword ] = data;
						YoastSEO.app.refresh();
					}
				}, 'json'
			);
		}
	};

	/**
	 * refreshes the app when snippet is updated.
	 */
	/**
	 * Updates the snippet values, is bound by the loader when generating the elements for the snippet.
	 * Uses the unformattedText object of the if the textFeedback function has put a string there (if text was too long).
	 * clears this after use.
	 *
	 * @param {Object} ev
	 */
	TermScraper.prototype.updateSnippetValues = function( ev ) {
		var dataFromSnippet = ev.currentTarget.textContent;
		var currentElement = ev.currentTarget.id;
		if ( typeof YoastSEO.app.snippetPreview.unformattedText[ currentElement ] !== 'undefined' ) {
			ev.currentTarget.textContent = YoastSEO.app.snippetPreview.unformattedText[ currentElement ];
		}
		this.setDataFromSnippet( dataFromSnippet, ev.currentTarget.id );
		YoastSEO.app.refresh();
	};

	/**
	 * add new descriptionfield to content, creates new element via wp_editor and appends this to the term-description-wrap
	 * this way we can use the wp tinyMCE editor on the descriptionfield.
	 */
	var tinyMCEReplacer = function() {
		var newEditor = document.getElementById( 'wp-description-wrap' );
		newEditor.style.display = 'none';
		var text = jQuery( '.term-description-wrap' ).find( 'td' ).find( 'p' );
		//empty the TD with the old description textarea
		jQuery( '.term-description-wrap' ).find( 'td' ).html( '' );
		//append the editor and the helptext
		jQuery( '.term-description-wrap' ).find( 'td' ).append( newEditor ).append( text );
		newEditor.style.display = 'block';
	};

	jQuery( document ).ready(function() {
		tinyMCEReplacer();
		var termScraper = new TermScraper();

		YoastSEO.analyzerArgs = {
			//if it must run the analyzer
			analyzer: true,
			//if it uses ajax to get data
			ajax: true,
			//if it must generate snippetpreview
			snippetPreview: true,
			//string to be added to the snippetTitle
			snippetSuffix: ' ' + wpseoTermScraperL10n.sep + ' ' + wpseoTermScraperL10n.sitename,
			//element Target Array
			elementTarget: ['content', 'yoast_wpseo_focuskw', 'yoast_wpseo_metadesc', 'excerpt', 'editable-post-name', 'editable-post-name-full'],
			//replacement target array, elements that must trigger the replace variables function.
			replaceTarget: ['yoast_wpseo_metadesc', 'excerpt', 'yoast_wpseo_title'],
			//rest target array, elements that must be reset on focus
			resetTarget: ['snippet_meta', 'snippet_title', 'snippet_cite'],
			//typeDelay is used as the timeout between stopping with typing and triggering the analyzer
			typeDelay: 300,
			//Dynamic delay makes sure the delay is increased if the analyzer takes longer than the default, to prevent slow systems.
			typeDelayStep: 100,
			maxTypeDelay: 1500,
			dynamicDelay: true,
			//used for multiple keywords (future use)
			multiKeyword: false,
			//targets for the objects
			targets: {
				output: 'wpseo_analysis',
				overall: 'taxonomy_overall',
				snippet: 'wpseo_snippet'
			},
			translations: wpseoTermScraperL10n.translations,
			queue: ['wordCount',
				'keywordDensity',
				'subHeadings',
				'stopwords',
				'fleschReading',
				'linkCount',
				'imageCount',
				'urlKeyword',
				'urlLength',
				'metaDescription',
				'pageTitleKeyword',
				'pageTitleLength',
				'firstParagraph'],
			usedKeywords: wpseoTermScraperL10n.keyword_usage,
			searchUrl: '<a target="new" href=' + wpseoTermScraperL10n.search_url + '>',
			postUrl: '<a target="new" href=' + wpseoTermScraperL10n.post_edit_url + '>',
			callbacks: {
				getData: termScraper.getData.bind( termScraper ),
				bindElementEvents: termScraper.bindElementEvents.bind( termScraper ),
				updateSnippetValues: termScraper.updateSnippetValues.bind( termScraper ),
				saveScores: termScraper.saveScores.bind( termScraper )
			}
		};

		// If there are no translations let the analyzer fallback onto the english translations.
		if (0 === wpseoTermScraperL10n.translations.length) {
			delete( YoastSEO.analyzerArgs.translations );
		} else {
			// Make sure the correct text domain is set for analyzer.
			var translations = wpseoTermScraperL10n.translations;
			translations.domain = 'js-text-analysis';
			translations.locale_data['js-text-analysis'] = translations.locale_data['wordpress-seo'];
			delete( translations.locale_data['wordpress-seo'] );

			YoastSEO.analyzerArgs.translations = translations;
		}
		window.YoastSEO.app = new YoastSEO.App( YoastSEO.analyzerArgs );
		jQuery( window ).trigger( 'YoastSEO:ready' );

		termScraper.initKeywordTabTemplate();
	} );
}( jQuery ));
