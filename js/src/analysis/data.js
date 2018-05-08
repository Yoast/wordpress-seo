import debounce from "lodash/debounce";
import { updateReplacementVariable } from "../redux/actions/snippetEditor";
import fillReplacementValues from "../helpers/sendReplaceVarsToStore";

/**
 * Represents the data.
 */
class Data {
	/**
	 * Sets the wp data, Yoast SEO refresh function and data object.
	 *
	 * @param {Object} wpData    The Gutenberg data API.
	 * @param {Function} refresh The YoastSEO refresh function.
	 * @param {Object} store     The YoastSEO Redux store.
	 * @returns {void}
	 */
	constructor( wpData, refresh, store ) {
		this._wpData = wpData;
		this._refresh = refresh;
		this.store = store;
		this.data = {};
		this.getPostAttribute = this.getPostAttribute.bind( this );
		this.refreshYoastSEO = this.refreshYoastSEO.bind( this );
	}

	initialize( replaceVars ) {
		// Fill data object on page load.
		this.data = this.getInitialData( replaceVars );
		fillReplacementValues( this.data, this.store );
		this.subscribeToGutenberg();
	};

	getInitialData( replaceVars ) {
		let gutenbergData = this.collectGutenbergData( this.getPostAttribute );
		return {
			...replaceVars,
			...gutenbergData,
		}
	}

	/**
	 * Sets the refresh function.
	 *
	 * @param {Function} refresh The refresh function.
	 *
	 * @returns {void}
	 */
	setRefresh( refresh ) {
		this._refresh = refresh;
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
	 * @param {Function} getPostAttribute The post attribute retrieval function.
	 * @returns {{content: string, title: string, slug: string, excerpt: string}} The content, title, slug and excerpt.
	 */
	collectGutenbergData( getPostAttribute ) {
		return {
			content: getPostAttribute( "content" ),
			title: getPostAttribute( "title" ),
			slug: getPostAttribute( "slug" ),
			excerpt: getPostAttribute( "excerpt" ),
		};
	}

	/**
	 * Updates the redux store with the changed data.
	 *
	 * @param {Object} newData The changed data.
	 *
	 * @returns {void}
	 */
	handleEditorChange( newData ) {
		// Handle title change
		if ( this.data.title !== newData.title ) {
			this.store.dispatch( updateReplacementVariable( "title", newData.title ) );
		}
		// Handle excerpt change
		if ( this.data.excerpt !== newData.excerpt ) {
			this.store.dispatch( updateReplacementVariable( "excerpt", newData.excerpt ) );
		}
	}

	/**
	 * Refreshes YoastSEO's app when the Gutenberg data is dirty.
	 *
	 * @returns {void}
	 */
	refreshYoastSEO() {
		let gutenbergData = this.collectGutenbergData( this.getPostAttribute );

		// Set isDirty to true if the current data and Gutenberg data are unequal.
		let isDirty = ! this.isShallowEqual( this.data, gutenbergData );

		if ( isDirty ) {
			this.handleEditorChange( gutenbergData );
			this.data = gutenbergData;
			this._refresh();
		}
	}

	/**
	 * Listens to the Gutenberg data.
	 *
	 * @returns {void}
	 */
	subscribeToGutenberg() {
		this.subscriber = debounce( this.refreshYoastSEO, 500 );
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
		return this.data;
	}
}
module.exports = Data;
