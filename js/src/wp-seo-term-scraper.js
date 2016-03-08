/* global YoastSEO, wpseoTermScraperL10n, ajaxurl, tinyMCE, YoastReplaceVarPlugin, console, require */
(function( $ ) {
	'use strict';

	var snippetPreview;
	var termSlugInput;

	var mainKeywordTab;
	var KeywordTab = require( './analysis/keywordTab' );

	var TermScraper = function() {
		if ( typeof CKEDITOR === 'object' ) {
			console.warn( 'YoastSEO currently doesn\'t support ckEditor. The content analysis currently only works with the HTML editor or TinyMCE.' );
		}
	};

	/**
	 * returns data fetched from inputfields.
	 * @returns {{keyword: *, meta: *, text: *, pageTitle: *, title: *, url: *, baseUrl: *, snippetTitle: *, snippetMeta: *, snippetCite: *}}
	 */
	TermScraper.prototype.getData = function() {
		return {
			name: this.getDataFromInput( 'name' ),
			title: this.getDataFromInput( 'title' ),
			keyword: this.getDataFromInput( 'keyword' ),
			text: this.getDataFromInput( 'text' ),
			pageTitle: this.getDataFromInput( 'pageTitle' ),
			url: this.getDataFromInput( 'url' ),
			baseUrl: this.getDataFromInput( 'baseUrl' ),
			snippetTitle: this.getDataFromInput( 'title' ),
			meta: this.getDataFromInput( 'meta' ),
			snippetMeta: this.getDataFromInput( 'snippetMeta' ),
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
			case 'name':
				val = document.getElementById( 'name' ).value;
				break;
			case 'meta':
				elem = document.getElementById( 'hidden_wpseo_desc' );
				if ( elem !== null ) {
					val = elem.value;
				}
				break;
			case 'snippetMeta':
				elem = document.getElementById( 'hidden_wpseo_desc' );
				if ( elem !== null ) {
					val = elem.value;
				}
				break;
			case 'text':
				val = this.getContentTinyMCE();
				break;
			case 'pageTitle':
				val = document.getElementById( 'hidden_wpseo_title' ).value;
				break;
			case 'title':
				val = document.getElementById( 'hidden_wpseo_title' ).value;
				break;
			case 'url':
			case 'cite':
				val = document.getElementById( 'slug' ).value;
				break;
			case 'baseUrl':
				val = wpseoTermScraperL10n.base_url;
				break;
		}
		return val;
	};

	/**
	 * gets content from the content field, if tinyMCE is initialized, use the getContent function to get the data from tinyMCE
	 * If tiny is hidden, take the value from the descriptionfield, since tinyMCE isn't updated when it isn't visible.
	 * @returns {String}
	 */
	TermScraper.prototype.getContentTinyMCE = function() {
		var val = document.getElementById( 'description' ).value;
		if ( typeof tinyMCE !== 'undefined' && typeof tinyMCE.editors !== 'undefined' && tinyMCE.editors.length !== 0 && tinyMCE.get( 'description' ).hidden === false ) {
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
	 * The data passed from the snippet editor.
	 *
	 * @param {Object} data
	 * @param {string} data.title
	 * @param {string} data.urlPath
	 * @param {string} data.metaDesc
	 */
	TermScraper.prototype.saveSnippetData = function( data ) {
		this.setDataFromSnippet( data.title, 'snippet_title' );
		this.setDataFromSnippet( data.urlPath, 'snippet_cite' );
		this.setDataFromSnippet( data.metaDesc, 'snippet_meta' );
	};

	/**
	 * binds elements
	 */
	TermScraper.prototype.bindElementEvents = function( app ) {
		this.inputElementEventBinder( app );
		document.getElementById( 'wpseo_focuskw' ).addEventListener( 'keydown', app.snippetPreview.disableEnter );
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
		if( typeof tinyMCE !== 'undefined' && typeof tinyMCE.on === 'function' ) {
			//binds the input, change, cut and paste event to tinyMCE. All events are needed, because sometimes tinyMCE doesn'
			//trigger them, or takes up to ten seconds to fire an event.
			var events = [ 'input', 'change', 'cut', 'paste' ];
			tinyMCE.on( 'addEditor', function( e ) {
				for (var i = 0; i < events.length; i++ ) {
					e.editor.on( events[i], app.analyzeTimer.bind( app ) );
				}
			});
		}
	};

	/**
	 * creates SVG for the overall score.
	 */
	TermScraper.prototype.saveScores = function( score ) {
		var cssClass, alt;

		document.getElementById( 'hidden_wpseo_linkdex' ).value = score;
		jQuery( window ).trigger( 'YoastSEO:numericScore', score );

		mainKeywordTab.update( score, this.getDataFromInput( 'keyword' ) );

		cssClass = YoastSEO.app.scoreFormatter.overallScoreRating( parseInt( score, 10 ) );
		alt = YoastSEO.app.scoreFormatter.getSEOScoreText( cssClass );

		$( '.yst-traffic-light' )
			.attr( 'class', 'yst-traffic-light ' + cssClass )
			.attr( 'alt', alt );
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

		mainKeywordTab.update( score, keyword );
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
						YoastSEO.app.analyzeTimer();
					}
				}, 'json'
			);
		}
	};

	/**
	 * add new descriptionfield to content, creates new element via wp_editor and appends this to the term-description-wrap
	 * this way we can use the wp tinyMCE editor on the descriptionfield.
	 */
	var insertTinyMCE = function() {
		//gets the textNode from the original textField.
		var textNode = jQuery( '.term-description-wrap' ).find( 'td' ).find( 'textarea' ).val();

		var newEditor = document.getElementById( 'wp-description-wrap' );
		newEditor.style.display = 'none';
		var text = jQuery( '.term-description-wrap' ).find( 'td' ).find( 'p' );
		//empty the TD with the old description textarea
		jQuery( '.term-description-wrap' ).find( 'td' ).html( '' );
		//append the editor and the helptext
		jQuery( '.term-description-wrap' ).find( 'td' ).append( newEditor ).append( text );
		newEditor.style.display = 'block';
		document.getElementById('description').value = textNode;
	};

	/**
	 * Initializes the snippet preview
	 *
	 * @param {TermScraper} termScraper
	 * @returns {YoastSEO.SnippetPreview}
	 */
	function initSnippetPreview( termScraper ) {
		var data = termScraper.getData();

		var snippetPreviewArgs = {
			targetElement: document.getElementById( 'wpseo_snippet' ),
			placeholder: {
				urlPath: ''
			},
			defaultValue: {},
			baseURL: wpseoTermScraperL10n.base_url,
			callbacks: {
				saveSnippetData: termScraper.saveSnippetData.bind( termScraper )
			},
			metaDescriptionDate: wpseoTermScraperL10n.metaDescriptionDate,
			data: {
				title: data.snippetTitle,
				urlPath: data.snippetCite,
				metaDesc: data.snippetMeta
			}
		};

		var titlePlaceholder = wpseoTermScraperL10n.title_template;
		if ( titlePlaceholder === '' ) {
			titlePlaceholder = '%%title%% - %%sitename%%';
		}
		snippetPreviewArgs.placeholder.title = titlePlaceholder;
		snippetPreviewArgs.defaultValue.title = titlePlaceholder;

		var metaPlaceholder = wpseoTermScraperL10n.metadesc_template;
		if ( metaPlaceholder !== '' ) {
			snippetPreviewArgs.placeholder.metaDesc = metaPlaceholder;
			snippetPreviewArgs.defaultValue.metaDesc = metaPlaceholder;
		}

		return new YoastSEO.SnippetPreview( snippetPreviewArgs );
	}

	/**
	 * Adds a watcher on the term slug input field
	 */
	function initTermSlugWatcher() {
		termSlugInput = $( '#slug' );
		termSlugInput.on( 'change', updatedTermSlug );
	}

	/**
	 * Function to handle when the user updates the term slug
	 */
	function updatedTermSlug() {
		snippetPreview.setUrlPath( termSlugInput.val() );
	}

	jQuery( document ).ready(function() {
		var args, termScraper, translations;

		insertTinyMCE();

		// Initialize an instance of the keywordword tab.
		mainKeywordTab = new KeywordTab(
			{
				prefix: wpseoTermScraperL10n.contentTab
			}
		);
		mainKeywordTab.setElement( $('.wpseo_keyword_tab') );

		termScraper = new TermScraper();

		args = {

			// ID's of elements that need to trigger updating the analyzer.
			elementTarget: [ 'content', 'yoast_wpseo_focuskw', 'yoast_wpseo_metadesc', 'excerpt', 'editable-post-name', 'editable-post-name-full' ],

			targets: {
				output: 'wpseo_analysis',
				snippet: 'wpseo_snippet'
			},

			usedKeywords: wpseoTermScraperL10n.keyword_usage,
			searchUrl: '<a target="new" href=' + wpseoTermScraperL10n.search_url + '>',
			postUrl: '<a target="new" href=' + wpseoTermScraperL10n.post_edit_url + '>',
			callbacks: {
				getData: termScraper.getData.bind( termScraper ),
				bindElementEvents: termScraper.bindElementEvents.bind( termScraper ),
				saveScores: termScraper.saveScores.bind( termScraper ),
				saveSnippetData: termScraper.saveSnippetData.bind( termScraper )
			},
			locale: wpseoTermScraperL10n.locale
		};

		translations = wpseoTermScraperL10n.translations;
		if ( translations.length > 0 ) {
			translations.domain = 'js-text-analysis';
			translations.locale_data['js-text-analysis'] = translations.locale_data['wordpress-seo'];
			delete( translations.locale_data['wordpress-seo'] );

			args.translations = translations;
		}

		snippetPreview = initSnippetPreview( termScraper );
		args.snippetPreview = snippetPreview;

		window.YoastSEO.app = new YoastSEO.App( args );
		jQuery( window ).trigger( 'YoastSEO:ready' );

		termScraper.initKeywordTabTemplate();

		// Init Plugins.
		new YoastReplaceVarPlugin();

		// For backwards compatibility.
		YoastSEO.analyzerArgs = args;

		initTermSlugWatcher();
	} );
}( jQuery ));
