/* global wp */
import debounce from "lodash/debounce";

let data = {};
let isDirty;

// Todo: tests

// Todo: algemener maken qua argument naming etc?
// Todo: complexity
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

// Todo: naming & single responsibility
/**
 * Updates the data object.
 *
 * @param {Object} data The current data.
 * @param {Object} gutenbergData The data from Gutenberg.
 * @returns {Object} The data.
 */
const updateData = ( data, gutenbergData ) => {
	isDirty = false;
	if ( ! data ) {
		data = gutenbergData;
		isDirty = true;
	}
	// Set isDirty to false if the current data and Gutenberg data are unequal.
	isDirty = ! isShallowEqual( data, gutenbergData );
	if ( data && isDirty ) {
		data = gutenbergData;
	}
	return data;
};

// Todo: naming & single responsibility.
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
	};
	updateData( data, gutenbergData );
};

const subscriber = debounce( getGutenbergData, 500 );

/**
 * Listens to the Gutenberg data.
 *
 * @returns {void}
 */
export const subscribeToGutenberg = function() {
	wp.data.subscribe(
		subscriber
	);
};

// Todo: Single responsibility.
/**
 * Returns the data and whether the data is dirty.
 *
 * @returns {Object} The data and whether the data is dirty.
 */
export const getData = () => {
	return {
		data: data,
		isDirty: isDirty,
	};
};
