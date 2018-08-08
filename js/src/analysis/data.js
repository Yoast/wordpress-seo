import debounce from "lodash/debounce";
import {
	updateReplacementVariable,
	updateData,
} from "../redux/actions/snippetEditor";
import {
	fillReplacementVariables,
	mapCustomFields,
	mapCustomTaxonomies,
} from "../helpers/replacementVariableHelpers";


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
		this._store = store;
		this._data = {};
		this.getPostAttribute = this.getPostAttribute.bind( this );
		this.refreshYoastSEO = this.refreshYoastSEO.bind( this );
	}

	initialize( replaceVars ) {
		// Fill data object on page load.
		this._data = this.getInitialData( replaceVars );
		fillReplacementVariables( this._data, this._store );
		this.subscribeToGutenberg();
	}

	getInitialData( replaceVars ) {
		const gutenbergData = this.collectGutenbergData( this.getPostAttribute );

		// Custom_fields and custom_taxonomies are objects instead of strings, which causes console errors.
		replaceVars = mapCustomFields( replaceVars, this._store );
		replaceVars = mapCustomTaxonomies( replaceVars, this._store );

		return {
			...replaceVars,
			...gutenbergData,
		};
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
			/* Use the generated slug when the slug is empty */
			slug: getPostAttribute( "slug" ) || getPostAttribute( "generated_slug" ),
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
		if ( this._data.title !== newData.title ) {
			this._store.dispatch( updateReplacementVariable( "title", newData.title ) );
		}
		// Handle excerpt change
		if ( this._data.excerpt !== newData.excerpt ) {
			this._store.dispatch( updateReplacementVariable( "excerpt", newData.excerpt ) );
			this._store.dispatch( updateReplacementVariable( "excerpt_only", newData.excerpt ) );
		}
		// Handle slug change
		if ( this._data.slug !== newData.slug ) {
			this._store.dispatch( updateData( { slug: newData.slug } ) );
		}
	}

	/**
	 * Refreshes YoastSEO's app when the Gutenberg data is dirty.
	 *
	 * @returns {void}
	 */
	refreshYoastSEO() {
		let gutenbergData = this.collectGutenbergData( this.getPostAttribute );
		console.log( gutenbergData );

		// Set isDirty to true if the current data and Gutenberg data are unequal.
		let isDirty = ! this.isShallowEqual( this._data, gutenbergData );

		if ( isDirty ) {
			this.handleEditorChange( gutenbergData );
			this._data = gutenbergData;
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
		return this._data;
	}
}
module.exports = Data;
