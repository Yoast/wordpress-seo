/* global YoastSEO: true, wpseoL10n, wpseoMetaboxL10n */
YoastSEO = ( 'undefined' === typeof YoastSEO ) ? {} : YoastSEO;

YoastSEO.analyzerArgs = {
	//if it must run the anlayzer
	analyzer: true,
	//if it uses ajax to get data.
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
		output: 'wpseo-pageanalysis',
		overall: 'wpseo-score',
		snippet: 'wpseosnippet'
	},
	translations: wpseoL10n,
	queue: [ 'wordCount',
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
		'keywordDoubles' ],
	usedKeywords: wpseoMetaboxL10n.keyword_usage,
	searchUrl: '<a target="new" href=' + wpseoMetaboxL10n.search_url + '>',
	postUrl: '<a target="new" href=' + wpseoMetaboxL10n.post_edit_url + '>'
};

(function() {
	'use strict';

	// If there are no translations let the analyzer fallback onto the english translations.
	if (0 === wpseoL10n.length) {
		delete( YoastSEO.analyzerArgs.translations );
		return;
	}

	// Make sure the correct text domain is set for analyzer.
	var translations = wpseoL10n;
	translations.domain = 'js-text-analysis';
	translations.locale_data['js-text-analysis'] = translations.locale_data['wordpress-seo'];
	delete( translations.locale_data['wordpress-seo'] );

	YoastSEO.analyzerArgs.translations = translations;
}());
