import debounce from "lodash/debounce";

/**
 * Represents the data.
 */
class Data {
	/**
	 *
	 *
	 * @param {Object} wpData The Gutenberg data API.
	 * @param {Object} YoastSEOApp The app of YoastSEO.
	 * @returns {void}
	 */
	constructor( wpData, YoastSEOApp ) {
		this._wpData = wpData;
		this._yoastSEOApp = YoastSEOApp;
		this.data = {};
		this.subscriber = debounce( this.refreshYoastSEO, 500 );
	}

	/**
	 * Checks whether the current data and the Gutenberg data are the same.
	 *
	 * @param {Object} currentData The current data.
	 * @param {Object} gutenbergData The data from Gutenberg.
	 * @returns {boolean} Whether the current data and the gutenbergData is the same.
	 */
	isShallowEqual( currentData, gutenbergData ) {
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
	}

	/**
	 * Retrieves the Gutenberg data for the passed post attribute.
	 *
	 * @param {string} attribute The post attribute you'd like to retrieve.
	 * @returns {string} The post attribute .
	 */
	getPostAttribute( attribute ) {
		return this._wpData.select( "core/editor" ).getEditedPostAttribute( attribute );
	}

	/**
	 * Collects the content, title, slug and excerpt of a post from Gutenberg.
	 *
	 * @param {Function} retriever The data retriever function.
	 * @returns {{content: string, title: string, slug: string, excerpt: string}} The content, title, slug and excerpt.
	 */
	collectGutenbergData( retriever ) {
		return {
			content: retriever( "content" ),
			title: retriever( "title" ),
			slug: retriever( "slug" ),
			excerpt: retriever( "excerpt" ),
		};
	}

	/**
	 * Refreshes YoastSEO's app when the Gutenberg data is dirty.
	 *
	 * @returns {void}
	 */
	refreshYoastSEO() {
		let gutenbergData = this.collectGutenbergData( this.getPostAttribute );

		// Set isDirty to false if the current data and Gutenberg data are unequal.
		let isDirty = ! this.isShallowEqual( this.data, gutenbergData );

		if ( isDirty ) {
			this.data = gutenbergData;
			this._yoastSEOApp.refresh();
		}
	}

	/**
	 * Listens to the Gutenberg data.
	 *
	 * @returns {void}
	 */
	subscribeToGutenberg() {
		// Fill data object on page load.
		this.data = this.collectGutenbergData( this.getPostAttribute );
		this._wpData.subscribe(
			this.subscriber
		);
	}

	/**
	 * Returns the data and whether the data is dirty.
	 *
	 * @returns {Object} The data and whether the data is dirty.
	 */
	getData() {
		console.log( this.data );
		return this.data;
	}
}
module.exports = Data;
