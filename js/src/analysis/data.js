/* global wp YoastSEO */
import debounce from "lodash/debounce";

let data = {};

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
	return true;
};

/**
 * Collects the content, title, slug and excerpt of a post from Gutenberg.
 *
 * @returns {{content: string, title: string, slug: string, excerpt: string}} The content, title, slug and excerpt.
 */
const collectGutenbergData =  () => {
	return {
		content: wp.data.select( "core/editor" ).getEditedPostAttribute( "content" ),
		title: wp.data.select( "core/editor" ).getEditedPostAttribute( "title" ),
		slug: wp.data.select( "core/editor" ).getEditedPostAttribute( "slug" ),
		excerpt: wp.data.select( "core/editor" ).getEditedPostAttribute( "excerpt" ),
	};
};

/**
 * Refreshes YoastSEO's app when the Gutenberg data is dirty.
 *
 * @returns {void}
 */
const refreshYoastSEO = () => {
	let gutenbergData = collectGutenbergData();

	// Set isDirty to false if the current data and Gutenberg data are unequal.
	let isDirty = ! isShallowEqual( data, gutenbergData );

	if ( isDirty ) {
		data = gutenbergData;
		YoastSEO.app.refresh();
	}
};

const subscriber = debounce( refreshYoastSEO, 500 );

/**
 * Listens to the Gutenberg data.
 *
 * @returns {void}
 */
export const subscribeToGutenberg = function() {
	// Only subscribe when Gutenberg's data API is available.
	if ( wp && wp.data ) {
		// Fill data object on page load.
		data = collectGutenbergData();
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
