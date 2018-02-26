/* global wp */
import debounce from "lodash/debounce";

let data = {};
let isDirty;

// todo: naming + isDirty per data point?
const setDataPoint = ( dataPoint, data, gutenbergData ) => {
	isDirty = false;
	if ( ! data[ dataPoint ] ) {
		data[ dataPoint ] = gutenbergData[ dataPoint ];
		isDirty = true;
	}
	if ( data[ dataPoint ] !== gutenbergData[ dataPoint ] ) {
		data[ dataPoint ] = gutenbergData[ dataPoint ];
		isDirty = true;
	}
	return data;
};

const getGutenbergData = () => {
	let gutenbergData = {
		content: wp.data.select( "core/editor" ).getEditedPostAttribute( "content" ),
		title: wp.data.select( "core/editor" ).getEditedPostAttribute( "title" ),
		slug: wp.data.select( "core/editor" ).getEditedPostAttribute( "slug" ),
	};
	setDataPoint( "content", data, gutenbergData );
	setDataPoint( "title", data, gutenbergData );
	setDataPoint( "slug", data, gutenbergData );
};

const subscriber = debounce( getGutenbergData, 500 );

/**
 * Listens to the Gutenberg data.
 *
 * @returns {Object} A data object containing content, title and url from Gutenberg.
 */
export const subscribeToGutenberg = function() {
	wp.data.subscribe(
		subscriber
	);
};

export const getData = () => {
	return {
		data: data,
		isDirty: isDirty,
	};
};
