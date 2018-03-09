/* global wp YoastSEO */
import debounce from "lodash/debounce";

/**
 * Represents the data.
 */
class data {
	/**
	 *
	 *
	 * @param {object}
	 * @returns {void}
	 */
	constructor( wp.data, YoastSEO.app ) {
		super();
		this._wpData = wp.data;
		this._yoastSEOApp = YoastSEO.app;
		this.data = {};
	}

	/**
	 * Checks whether the current data and the Gutenberg data are the same.
	 *
	 * @param {Object} currentData The current data.
	 * @param {Object} gutenbergData The data from Gutenberg.
	 * @returns {boolean} Whether the current data and the gutenbergData is the same.
	 */
	isShallowEqual = ( currentData, gutenbergData ) => {
		if ( Object.keys( currentData ).length !== Object.keys( gutenbergData ).length ) {
			return false;
		}

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
	 * Retrieves the Gutenberg data for the passed post attribute.
	 *
	 * @param {string} attribute The post attribute you'd like to retrieve.
	 * @returns {string} The post attribute .
	 */
	getPostAttribute = ( attribute ) => {
		return this._wpData.select( "core/editor" ).getEditedPostAttribute( attribute );
	};

	/**
	 * Collects the content, title, slug and excerpt of a post from Gutenberg.
	 *
	 * @returns {{content: string, title: string, slug: string, excerpt: string}} The content, title, slug and excerpt.
	 */
	collectGutenbergData =  ( retriever ) => {
		return {
			content: retriever( "content" ),
			title: retriever( "title" ),
			slug: retriever( "slug" ),
			excerpt: retriever( "excerpt" ),
		};
	};

	/**
	 * Refreshes YoastSEO's app when the Gutenberg data is dirty.
	 *
	 * @returns {void}
	 */
	refreshYoastSEO = () => {
		let gutenbergData = collectGutenbergData( getPostAttribute );

		// Set isDirty to false if the current data and Gutenberg data are unequal.
		let isDirty = ! isShallowEqual( data, gutenbergData );

		if ( isDirty ) {
			data = gutenbergData;
			YoastSEO.app.refresh();
		}
	};

	subscriber = debounce( refreshYoastSEO, 500 );

	/**
	 * Listens to the Gutenberg data.
	 *
	 * @returns {void}
	 */
	subscribeToGutenberg = () => {
		// Fill data object on page load.
		data = collectGutenbergData( getPostAttribute );
		wp.data.subscribe(
			subscriber
		);
	};

	/**
	 * Returns the data and whether the data is dirty.
	 *
	 * @returns {Object} The data and whether the data is dirty.
	 */
	getData = () => {
		console.log( data )
		return data;
	};
}
module.exports = data;
