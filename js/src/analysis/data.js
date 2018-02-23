/* global wp */
import debounce from "lodash/debounce";
let GutenbergDataCollector = {};

/**
 * Gets data from Gutenberg and stores them in an analyzerData object. This object will be used to fill
 * the analyzer and the snippet preview.
 *
 * @returns {Object} The data object.
 */
GutenbergDataCollector.prototype.getData = function() {
	return {
		content: this.getContent(),
		title: this.getTitle(),
		slug: this.getUrl(),
	};
};

/**
 * Returns the Gutenberg content.
 *
 * @returns {string} The content.
 */
GutenbergDataCollector.prototype.getContent = function() {
};

let gutenbergData;
let data = {};

/**
 * Listens to the Gutenberg data.
 *
 * @returns {Object} A data object containing content, title and url from Gutenberg.
 */
const unsubscribe = debounce(
	wp.data.subscribe( () => {
		gutenbergData = {
			content: wp.data.select( "core/editor" ).getEditedPostAttribute( "content" ),
			title: wp.data.select( "core/editor" ).getEditedPostAttribute( "title" ),
			url: wp.data.select( "core/editor" ).getEditedPostAttribute( "slug" ),
		};
		// Todo: use less if statements.
		if ( ! data.title ) {
			data.title = gutenbergData.title;
		}
		if ( data.title !== gutenbergData.title ) {
			data.title = gutenbergData.title;
			console.log( data.title );
		}
		if ( ! data.content ) {
			data.content = gutenbergData.content;
		}
		if ( data.content !== gutenbergData.content ) {
			data.content = gutenbergData.content;
			console.log( data.content );
		}
		if ( ! data.slug ) {
			data.slug = gutenbergData.slug;
		}
		if ( data.slug !== gutenbergData.slug ) {
			data.slug = gutenbergData.slug;
			console.log( data.slug );
		}
	} )
, 500 );

