/* global YoastSEO: true, tinyMCE, wp, ajaxurl, wpseoPostScraperL10n, YoastShortcodePlugin, YoastReplaceVarPlugin */
YoastSEO = ( 'undefined' === typeof YoastSEO ) ? {} : YoastSEO;
(function( $ ) {
	'use strict';

	var currentKeyword = '';

	/**
	 * wordpress scraper to gather inputfields.
	 * @constructor
	 */
	YoastSEO.PostScraper = function() {
		this.prepareSlugBinding();
	};

	/**
	 * On a new post, WordPress doesn't include the slug editor, since a post has not been given a slug yet.
	 * As soon as a title is chosen, an `after-autosave.update-post-slug` event fires that triggers an AJAX request
	 * to the server to generate a slug. On the response callback a slug editor is inserted into the page on which
	 * we can bind our Snippet Preview.
	 *
	 * On existing posts, the slug editor is already there and we can bind immediately.
	 */
	YoastSEO.PostScraper.prototype.prepareSlugBinding = function() {
		if ( document.getElementById( 'editable-post-name' ) === null ) {
			var that = this;
			jQuery( document ).on( 'after-autosave.update-post-slug', function() {
				that.bindSnippetCiteEvents( 0 );
			});
		} else {
			this.bindSlugEditor();
		}
	};

	/**
	 * When the `after-autosave.update-post-slug` event is triggered, this function checks to see if the slug editor has
	 * been inserted yet. If so, it does all of the necessary event binding. If not, it retries for a maximum of 5 seconds.
	 *
	 * @param {int} time
	 */
	YoastSEO.PostScraper.prototype.bindSnippetCiteEvents = function( time ) {
		time = time || 0;
		var slugElem = document.getElementById( 'editable-post-name' );
		var postNameElem = document.getElementById('post_name');

		if ( slugElem !== null ) {
			this.bindSlugEditor();

			// If the '#post_name' input field has not been set yet, we need to set it here with the textContent of the slugElem.
			// God knows why WordPress doesn't do this initially...
			if ( postNameElem.value === '' ) {
				postNameElem.value = slugElem.textContent;
			}

			YoastSEO.app.snippetPreview.unformattedText.snippet_cite = postNameElem.value;
			YoastSEO.app.refresh();
		} else if ( time < 5000 ) {
			time += 200;
			setTimeout( this.bindSnippetCiteEvents.bind( this, time ), 200 );
		}
	};

	/**
	 * We want to trigger an update of the snippetPreview on a slug update. Because the save button is not available yet, we need to
	 * bind an event within the scope of a clickevent of the edit button.
	 */
	YoastSEO.PostScraper.prototype.bindSlugEditor = function() {
		jQuery( '#edit-slug-box' ).on( 'click', '.edit-slug', function() {
			jQuery( '#edit-slug-buttons > button.save' ).on( 'click', function() {
				YoastSEO.app.refresh();
				YoastSEO.app.snippetPreview.unformattedText.snippet_cite = document.getElementById('post_name').value;
			} );
		} );
	};

	/**
	 * Get data from inputfields and store them in an analyzerData object. This object will be used to fill
	 * the analyzer and the snippetpreview
	 */
	YoastSEO.PostScraper.prototype.getData = function() {
		return {
			keyword: this.getDataFromInput( 'keyword' ),
			meta: this.getDataFromInput( 'meta' ),
			text: this.getDataFromInput( 'text' ),
			pageTitle: this.getDataFromInput( 'pageTitle' ),
			title: this.getDataFromInput( 'title' ),
			url: this.getDataFromInput( 'url' ),
			baseUrl: this.getDataFromInput( 'baseUrl' ),
			excerpt: this.getDataFromInput( 'excerpt' ),
			snippetTitle: this.getDataFromInput( 'snippetTitle' ),
			snippetMeta: this.getDataFromInput( 'meta' ),
			snippetCite: this.getDataFromInput( 'cite' )
		};
	};

	/**
	 * gets the values from the given input. Returns this value
	 * @param {String} inputType
	 * @returns {String}
	 */
	YoastSEO.PostScraper.prototype.getDataFromInput = function( inputType ) {
		var val = '';
		switch ( inputType ) {
			case 'text':
			case 'content':
				val = this.getContentTinyMCE();
				break;
			case 'url':
				if ( document.getElementById( 'sample-permalink' ) !== null ) {
					val = document.getElementById( 'sample-permalink' ).textContent;
				}
				break;
			case 'baseUrl':
				val = wpseoPostScraperL10n.home_url.replace( /https?:\/\//ig, '' );
				break;
			case 'cite':
			case 'post_name':
				val = document.getElementById( 'post_name' ).value;
				break;
			case 'meta':
				val = document.getElementById( 'yoast_wpseo_metadesc' ).value;
				break;
			case 'keyword':
				val = document.getElementById( 'yoast_wpseo_focuskw' ).value;
				currentKeyword = val;
				break;
			case 'title':
			case 'snippetTitle':
				val = document.getElementById( 'yoast_wpseo_title' ).value;
				break;
			case 'pageTitle':
				val = document.getElementById( 'yoast_wpseo_title' ).value;
				if ( val === '' ) {
					val = document.getElementById( 'title' ).value;
				}
				break;
			case 'excerpt':
				if ( document.getElementById( 'excerpt' ) !== null ) {
					val = document.getElementById('excerpt').value;
				}
				break;
			default:
				break;
		}
		return val;
	};

	/**
	 * When the snippet is updated, update the (hidden) fields on the page
	 * @param {Object} value
	 * @param {String} type
	 */
	YoastSEO.PostScraper.prototype.setDataFromSnippet = function( value, type ) {
		switch ( type ) {
			case 'snippet_meta':
				document.getElementById( 'yoast_wpseo_metadesc' ).value = value;
				break;
			case 'snippet_cite':
				document.getElementById( 'post_name' ).value = value;
				if ( document.getElementById( 'editable-post-name' ) !== null ) {
					document.getElementById( 'editable-post-name' ).textContent = value;
					document.getElementById( 'editable-post-name-full' ).textContent = value;
				}
				break;
			case 'snippet_title':
				document.getElementById( 'yoast_wpseo_title' ).value = value;
				break;
			default:
				break;
		}
	};

	/**
	 * gets content from the content field, if tinyMCE is initialized, use the getContent function to get the data from tinyMCE
	 * @returns {String}
	 */
	YoastSEO.PostScraper.prototype.getContentTinyMCE = function() {
		var val = document.getElementById( 'content' ).value;
		if ( tinyMCE.editors.length !== 0 ) {
			val = tinyMCE.get( 'content' ).getContent();
		}
		return val;
	};

	/**
	 * Calls the eventbinders.
	 */
	YoastSEO.PostScraper.prototype.bindElementEvents = function( app ) {
		this.snippetPreviewEventBinder( app.snippetPreview );
		this.inputElementEventBinder( app );
		document.getElementById( 'yoast_wpseo_focuskw' ).addEventListener( 'keydown', app.snippetPreview.disableEnter );
		document.getElementById( 'yoast_wpseo_focuskw' ).addEventListener( 'keyup', this.updateKeywordUsage );
	};

	/**
	 * binds the getinputfieldsdata to the snippetelements.
	 *
	 * @param {YoastSEO.SnippetPreview} snippetPreview The snippet preview object to bind the events on.
	 */
	YoastSEO.PostScraper.prototype.snippetPreviewEventBinder = function( snippetPreview ) {
		var elems = [ 'snippet_meta', 'snippet_title', 'snippet_cite' ];

		for ( var i = 0; i < elems.length; i++ ) {
			this.bindSnippetEvents( document.getElementById( elems [ i ] ), snippetPreview );
		}
		var title = document.getElementById( 'snippet_title' );
		title.addEventListener( 'focus', snippetPreview.setSiteName.bind ( snippetPreview ) );
		title.addEventListener( 'blur', snippetPreview.unsetSiteName.bind ( snippetPreview ) );
	};

	/**
	 * binds the snippetEvents to a snippet element.
	 * @param { HTMLElement } elem snippet_meta, snippet_title, snippet_cite
	 * @param { YoastSEO.SnippetPreview } snippetPreview
	 */
	YoastSEO.PostScraper.prototype.bindSnippetEvents = function( elem, snippetPreview ) {
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
	YoastSEO.PostScraper.prototype.inputElementEventBinder = function( app ) {
		var elems = [ 'excerpt', 'content', 'yoast_wpseo_focuskw', 'title' ];
		for ( var i = 0; i < elems.length; i++ ) {
			var elem = document.getElementById( elems[ i ] );
			if ( elem !== null ) {
				document.getElementById( elems[ i ] ).addEventListener( 'input', app.analyzeTimer.bind( app ) );
			}
		}

		tinyMCE.on( 'addEditor', function(e) {
			e.editor.on( 'input', function() {
				app.analyzeTimer.call( app );
			} );
		});

		document.getElementById( 'yoast_wpseo_focuskw' ).addEventListener( 'blur', this.resetQueue );
	};

	/**
	 * Resets the current queue if focus keyword is changed and not empty.
	 */
	YoastSEO.PostScraper.prototype.resetQueue = function() {
		if ( YoastSEO.app.rawData.keyword !== '' ) {
			YoastSEO.app.runAnalyzer( this.rawData );
		}
	};

	/**
	 * Updates the snippet values, is bound by the loader when generating the elements for the snippet.
	 * Uses the unformattedText object of the snippetpreview if the textFeedback function has put a string there (if text was too long).
	 * clears this after use.
	 *
	 * @param {Object} ev
	 */
	YoastSEO.PostScraper.prototype.updateSnippetValues = function( ev ) {
		var dataFromSnippet = ev.currentTarget.textContent;
		var currentElement = ev.currentTarget.id;
		if ( typeof YoastSEO.app.snippetPreview.unformattedText[ currentElement ] !== 'undefined' ) {
			ev.currentTarget.textContent = YoastSEO.app.snippetPreview.unformattedText[ currentElement ];
		}
		this.setDataFromSnippet( dataFromSnippet, ev.currentTarget.id );
		YoastSEO.app.refresh();
	};

	/**
	 * Saves the score to the linkdex.
	 * Outputs the score in the overall target.
	 *
	 * @param {String} score
	 */
	YoastSEO.PostScraper.prototype.saveScores = function( score ) {
		if ( this.isMainKeyword( currentKeyword ) ) {
			var tmpl = wp.template( 'score_svg' );
			document.getElementById( 'wpseo-score' ).innerHTML = tmpl();
			document.getElementById( 'yoast_wpseo_linkdex' ).value = score;
		}

		jQuery( window ).trigger( 'YoastSEO:numericScore', score );
	};

	/**
	 * Returns whether or not the keyword is the main keyword
	 *
	 * @param {string} keyword The keyword to check
	 *
	 * @returns {boolean}
	 */
	YoastSEO.PostScraper.prototype.isMainKeyword = function( keyword ) {
		var firstTab, mainKeyword;

		firstTab = $( '.wpseo_keyword_tab' )
			.first()
			.find( '.wpseo_tablink' );

		mainKeyword = firstTab.data( 'keyword' );

		return keyword === mainKeyword;
	};

	/**
	 * updates the focus keyword usage if it is not in the array yet.
	 */
	YoastSEO.PostScraper.prototype.updateKeywordUsage = function() {
		var keyword = this.value;
		if ( typeof( wpseoPostScraperL10n.keyword_usage[ keyword ] === null ) ) {
			jQuery.post(ajaxurl, {
					action: 'get_focus_keyword_usage',
					post_id: jQuery('#post_ID').val(),
					keyword: keyword
				}, function( data ) {
					if ( data ) {
						wpseoPostScraperL10n.keyword_usage[ keyword ] = data;
						YoastSEO.app.refresh();
					}
				}, 'json'
			);
		}
	};

	/**
	 * binds to the WordPress jQuery function to put the permalink on the page.
	 * If the response matches with permalinkstring, the snippet can be rerendered.
	 */
	jQuery( document ).on( 'ajaxComplete', function( ev, response ) {
		if ( response.responseText.match( 'Permalink:' ) !== null ) {
			YoastSEO.app.callbacks.getData();
			YoastSEO.app.runAnalyzer();
			YoastSEO.app.snippetPreview.reRender();
		}
	} );

	jQuery( document ).ready(function() {
		var wordpressScraper = new YoastSEO.PostScraper();

		YoastSEO.analyzerArgs = {
			//if it must run the analyzer
			analyzer: true,
			//if it uses ajax to get data
			ajax: true,
			//if it must generate snippetpreview
			snippetPreview: true,
			//string to be added to the snippetTitle
			snippetSuffix: ' ' + wpseoPostScraperL10n.sep + ' ' + wpseoPostScraperL10n.sitename,
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
				output: 'wpseo-pageanalysis',
				snippet: 'wpseosnippet'
			},
			translations: wpseoPostScraperL10n.translations,
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
				'firstParagraph',
				'keywordDoubles'],
			usedKeywords: wpseoPostScraperL10n.keyword_usage,
			searchUrl: '<a target="new" href=' + wpseoPostScraperL10n.search_url + '>',
			postUrl: '<a target="new" href=' + wpseoPostScraperL10n.post_edit_url + '>',
			callbacks: {
				getData: wordpressScraper.getData.bind( wordpressScraper ),
				bindElementEvents: wordpressScraper.bindElementEvents.bind( wordpressScraper ),
				updateSnippetValues: wordpressScraper.updateSnippetValues.bind( wordpressScraper ),
				saveScores: wordpressScraper.saveScores.bind( wordpressScraper )
			}
		};

		// If there are no translations let the analyzer fallback onto the english translations.
		if (0 === wpseoPostScraperL10n.translations.length) {
			delete( YoastSEO.analyzerArgs.translations );
		} else {
			// Make sure the correct text domain is set for analyzer.
			var translations = wpseoPostScraperL10n.translations;
			translations.domain = 'js-text-analysis';
			translations.locale_data['js-text-analysis'] = translations.locale_data['wordpress-seo'];
			delete( translations.locale_data['wordpress-seo'] );
			YoastSEO.analyzerArgs.translations = translations;
		}
		window.YoastSEO.app = new YoastSEO.App( YoastSEO.analyzerArgs );
		jQuery( window).trigger( 'YoastSEO:ready' );

		//Init Plugins
		window.yoastReplaceVarPlugin = new YoastReplaceVarPlugin();
		window.yoastShortcodePlugin = new YoastShortcodePlugin();
	} );
}( jQuery ));
