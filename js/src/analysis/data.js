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

// todo: naming
let setDataPoint = ( dataPoint, data, gutenbergData ) => {
	if ( ! data[ dataPoint ] ) {
		data[ dataPoint ] = gutenbergData[ dataPoint ];
	}
	if ( data[ dataPoint ] !== gutenbergData[ dataPoint ] ) {
		data[ dataPoint ] = gutenbergData[ dataPoint ];
		console.log( data[ dataPoint ] );
	}
};

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
			slug: wp.data.select( "core/editor" ).getEditedPostAttribute( "slug" ),
		};
		setDataPoint( "content", data, gutenbergData );
		setDataPoint( "title", data, gutenbergData );
		setDataPoint( "slug", data, gutenbergData );
	} )
, 500 );

