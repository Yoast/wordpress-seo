import debounce from "lodash/debounce";
import {
	updateReplacementVariable,
	updateData,
} from "../redux/actions/snippetEditor";
import {
	excerptFromContent,
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

	/**
	 * Initializes this Gutenberg data instance.
	 *
	 * @param {Object} replaceVars The replacevars.
	 * @returns {void}
	 */
	initialize( replaceVars ) {
		// Fill data object on page load.
		this._data = this.getInitialData( replaceVars );
		fillReplacementVariables( this._data, this._store );
		this.subscribeToGutenberg();
	}

	/**
	 * Retrieves the initial data.
	 *
	 * @param {Object} replaceVars The replacevars.
	 *
	 * @returns {Object} The initial data.
	 */
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

		for ( const dataPoint in currentData ) {
			if ( currentData.hasOwnProperty( dataPoint ) ) {
				if ( ! ( dataPoint in gutenbergData ) || currentData[ dataPoint ] !== gutenbergData[ dataPoint ] ) {
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
	 *
	 * @returns {string} The post attribute.
	 */
	getPostAttribute( attribute ) {
		if ( ! this._coreEditorSelect ) {
			this._coreEditorSelect = this._wpData.select( "core/editor" );
		}

		return this._coreEditorSelect.getEditedPostAttribute( attribute );
	}

	/**
	 * Get the post's slug.
	 *
	 * @returns {string} The post's slug.
	 */
	getSlug() {
		/**
		 * Before the post has been saved for the first time, the generated_slug is "auto-draft".
		 *
		 * Before the post is saved the post status is "auto-draft", so when this is the case the slug
		 * should be empty.
		 */
		if ( this.getPostAttribute( "status" ) === "auto-draft" ) {
			return "";
		}

		let generatedSlug = this.getPostAttribute( "generated_slug" );

		/**
		 * This should be removed when the following issue is resolved:
		 *
		 * https://github.com/WordPress/gutenberg/issues/8770
		 */
		if ( generatedSlug === "auto-draft" ) {
			generatedSlug = "";
		}

		// When no custom slug is provided we should use the generated_slug attribute.
		return this.getPostAttribute( "slug" ) || generatedSlug;
	}

	/**
	 * Collects the content, title, slug and excerpt of a post from Gutenberg.
	 *
	 * @returns {{content: string, title: string, slug: string, excerpt: string}} The content, title, slug and excerpt.
	 */
	collectGutenbergData() {
		return {
			content: this.getPostAttribute( "content" ),
			title: this.getPostAttribute( "title" ),
			slug: this.getSlug(),
			excerpt: this.getExcerpt(),
			// eslint-disable-next-line camelcase
			excerpt_only: this.getExcerpt( false ),
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
			this._store.dispatch( updateReplacementVariable( "excerpt_only", newData.excerpt_only ) );
		}
		// Handle slug change
		if ( this._data.slug !== newData.slug ) {
			this._store.dispatch( updateData( { slug: newData.slug } ) );
		}
	}

	/**
	 * Gets the excerpt from the post.
	 *
	 * @param {boolean} useFallBack Whether the fallback for content should be used.
	 *
	 * @returns {string} The excerpt.
	 */
	getExcerpt( useFallBack = true ) {
		const excerpt = this.getPostAttribute( "excerpt" );
		if ( excerpt !== "" || useFallBack === false ) {
			return excerpt;
		}

		return excerptFromContent( this.getPostAttribute( "content" ) );
	}

	/**
	 * If a marker is active, find the associated assessment result and applies the marker on that result.
	 *
	 * @returns {void}
	 */
	reapplyMarkers() {
		const {
			getActiveMarker,
			getResultById,
		} = this._wpData.select( "yoast-seo/editor" );

		const activeMarker = getActiveMarker();

		if ( ! activeMarker ) {
			return;
		}

		const markedResult = getResultById( activeMarker );

		if ( ! markedResult ) {
			return;
		}

		const marker = markedResult.getMarker();

		if ( marker ) {
			marker();
		}
	}

	/**
	 * Refreshes YoastSEO's app when the Gutenberg data is dirty.
	 *
	 * @returns {void}
	 */
	refreshYoastSEO() {
		const gutenbergData = this.collectGutenbergData();

		// Set isDirty to true if the current data and Gutenberg data are unequal.
		const isDirty = ! this.isShallowEqual( this._data, gutenbergData );

		if ( isDirty ) {
			this.handleEditorChange( gutenbergData );
			this.reapplyMarkers();
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
