/* global YoastSEO: true, tinyMCE */
YoastSEO = ( 'undefined' === typeof YoastSEO ) ? {} : YoastSEO;
(function() {
	'use strict';

	YoastSEO.TermScraper = function() {

	};

	/**
	 *
	 * @returns {{keyword: *, meta: *, text: *, pageTitle: *, title: *, url: *, baseUrl: *, excerpt: *, snippetTitle: *, snippetMeta: *, snippetCite: *}}
	 */
	YoastSEO.TermScraper.prototype.getData = function() {
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
	 *
	 * @param {string} inputType
	 */
	YoastSEO.TermScraper.prototype.getDataFromInput = function( inputType ) {
		var val = '';
		switch( inputType ){
			case 'keyword':
				val = document.getElementById( 'name' ).value;
				break;
			case 'meta':
				val = document.getElementById( 'description' ).value;
				break;
			case 'text':
				val = document.getElementById( 'description' ).value;
				break;
			case 'pageTitle':
				val = document.getElementById( 'description' ).value;
				break;
			case 'title':
				val = document.getElementById( 'name' ).value;
				break;
			case  'url':
				val = document.getElementById( 'slug' ).value;
				break;
			case 'baseUrl':
				val = document.getElementById( 'description' ).value;
				break;
			case 'excerpt':
				val = document.getElementById( 'description' ).value;
				break;
			case 'snippetTitle':
				val = document.getElementById( 'description' ).value;
				break;
			case 'meta':
				val = document.getElementById( 'description' ).value;
				break;
			case 'cite':
				val = document.getElementById( 'description' ).value;
				break;

		}
	};

	jQuery( document ).ready(function() {
		function init() {
			var termScraper = new YoastSEO.TermScraper();

			YoastSEO.analyzerArgs = {
				//if it must run the analyzer
				analyzer: true,
				//if it uses ajax to get data
				ajax: true,
				//if it must generate snippetpreview
				snippetPreview: true,
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
					output: 'taxonomy_analyzer_output',
					overall: 'taxonomy_overall',
					snippet: 'taxonomy_snippet'
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
					'firstParagraph',
					'keywordDoubles'],
				usedKeywords: wpseoTermScraperL10n.keyword_usage,
				searchUrl: '<a target="new" href=' + wpseoTermScraperL10n.search_url + '>',
				postUrl: '<a target="new" href=' + wpseoTermScraperL10n.post_edit_url + '>',
				callbacks: {
					getData: termScraper.getData.bind( termScraper ),
					//bindElementEvents: termScraper.bindElementEvents.bind( termScraper ),
					//updateSnippetValues: termScraper.updateSnippetValues.bind( termScraper ),
					//saveScores: termScraper.saveScores.bind( termScraper )
				}
			};

			// If there are no translations let the analyzer fallback onto the english translations.
			if (0 === wpseoTermScraperL10n.translations.length) {
				delete( YoastSEO.analyzerArgs.translations );
				return;
			}

			// Make sure the correct text domain is set for analyzer.
			var translations = wpseoTermScraperL10n.translations;
			translations.domain = 'js-text-analysis';
			translations.locale_data['js-text-analysis'] = translations.locale_data['wordpress-seo'];
			delete( translations.locale_data['wordpress-seo'] );

			YoastSEO.analyzerArgs.translations = translations;

			window.YoastSEO.app = new YoastSEO.App( YoastSEO.analyzerArgs );
		}

		jQuery( init );
	} );

}());
