/* global wp YoastSEO */
import debounce from "lodash/debounce";

let data = {};
let isDirty;

/**
 * Checks whether the current data and the Gutenberg data are the same.
 *
 * @param {Object} currentData The current data.
 * @param {Object} gutenbergData The data from Gutenberg.
 * @returns {boolean} Whether the current data and the gutenbergData is the same.
 */
const isShallowEqual = ( currentData, gutenbergData ) => {
	for( let dataPoint in currentData ) {
		if ( currentData.hasOwnProperty( dataPoint ) ) {
			if( ! ( dataPoint in gutenbergData ) || currentData[ dataPoint ] !== gutenbergData[ dataPoint ] ) {
				return false;
			}
		}
	}
	for( let dataPoint in gutenbergData ) {
		if ( gutenbergData.hasOwnProperty( dataPoint ) ) {
			if( ! ( dataPoint in currentData ) || currentData[ dataPoint ] !== gutenbergData[ dataPoint ] ) {
				return false;
			}
		}
	}
	return true;
};

/**
 * Updates the data object.
 *
 * @param {Object} data The current data.
 * @param {Object} gutenbergData The data from Gutenberg.
 * @returns {Object} The data.
 */
const updateData = ( data, gutenbergData ) => {
	// Set isDirty to false if the current data and Gutenberg data are unequal.
	isDirty = ! isShallowEqual( data, gutenbergData );

	// If there is new data from Gutenberg, overwrite the data object with the new data.
	if ( isDirty ) {
		data = gutenbergData;
	}
	return data;
};

/**
 * Gets the Gutenberg data.
 *
 * @returns {void}
 */
const getGutenbergData = () => {
	let gutenbergData = {
		content: wp.data.select( "core/editor" ).getEditedPostAttribute( "content" ),
		title: wp.data.select( "core/editor" ).getEditedPostAttribute( "title" ),
		slug: wp.data.select( "core/editor" ).getEditedPostAttribute( "slug" ),
		excerpt: wp.data.select( "core/editor" ).getEditedPostAttribute( "excerpt" ),
	};
	data = updateData( data, gutenbergData );

	if ( isDirty ) {
		YoastSEO.app.refresh();
	}
	isDirty = false;
};

const subscriber = debounce( getGutenbergData, 500 );

/**
 * Listens to the Gutenberg data.
 *
 * @returns {void}
 */
export const subscribeToGutenberg = function() {
	// Only subscribe when Gutenberg's data API is available.
	if ( wp && wp.data ) {
		// Fill data object on page load.
		data = {
			content: wp.data.select( "core/editor" ).getEditedPostAttribute( "content" ),
			title: wp.data.select( "core/editor" ).getEditedPostAttribute( "title" ),
			slug: wp.data.select( "core/editor" ).getEditedPostAttribute( "slug" ),
			excerpt: wp.data.select( "core/editor" ).getEditedPostAttribute( "excerpt" ),
		};
		wp.data.subscribe(
			subscriber
		);
	}
};

/**
 * Returns the data and whether the data is dirty.
 *
 * @returns {Object} The data and whether the data is dirty.
 */
export const getData = () => {
	return data;
};
