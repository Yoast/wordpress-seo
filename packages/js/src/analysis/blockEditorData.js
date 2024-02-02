/* eslint-disable complexity */
import { getBlockContent } from "@wordpress/blocks";
import { select, subscribe } from "@wordpress/data";
import { actions } from "@yoast/externals/redux";
import { debounce } from "lodash";
import { languageProcessing } from "yoastseo";
import { reapplyAnnotationsForSelectedBlock } from "../decorator/gutenberg";
import { excerptFromContent, fillReplacementVariables, mapCustomFields, mapCustomTaxonomies } from "../helpers/replacementVariableHelpers";
import getContentLocale from "./getContentLocale";

const {
	updateReplacementVariable,
	updateData,
	hideReplacementVariables,
	setContentImage,
	updateSettings,
	setEditorDataContent,
	setEditorDataTitle,
	setEditorDataExcerpt,
	setEditorDataImageUrl,
	setEditorDataSlug,
} = actions;

const $ = global.jQuery;

/**
 * Represents the data.
 */
export default class BlockEditorData {
	/**
	 * Sets the wp data, Yoast SEO refresh function and data object.
	 *
	 * @param {Function} refresh The YoastSEO refresh function.
	 * @param {Object} store     The YoastSEO Redux store.
	 * @returns {void}
	 */
	constructor( refresh, store ) {
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
	 * @param {string[]} hiddenReplaceVars The replacement variables passed in the wp-seo-post-scraper args.
	 *
	 * @returns {void}
	 */
	initialize( replaceVars, hiddenReplaceVars = [] ) {
		// Fill data object on page load.
		this._data = this.getInitialData( replaceVars );
		fillReplacementVariables( this._data, this._store );
		this._store.dispatch( hideReplacementVariables( hiddenReplaceVars ) );
		this.subscribeToGutenberg();
		this.subscribeToYoastSEO();
	}

	/**
	 * Retrieves the initial data.
	 *
	 * @param {Object} replaceVars The replacevars.
	 *
	 * @returns {Object} The initial data.
	 */
	getInitialData( replaceVars ) {
		const gutenbergData = this.collectGutenbergData();

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
	 *
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
	 * Gets the media data by id.
	 *
	 * @param {number} mediaId The media item id.
	 *
	 * @returns {Object} The media object.
	 */
	getMediaById( mediaId ) {
		if ( ! this._coreDataSelect ) {
			this._coreDataSelect = select( "core" );
		}

		return this._coreDataSelect.getMedia( mediaId );
	}

	/**
	 * Retrieves the Gutenberg data for the passed post attribute.
	 *
	 * @param {string} attribute The post attribute you'd like to retrieve.
	 *
	 * @returns {string|number} The post attribute.
	 */
	getPostAttribute( attribute ) {
		if ( ! this._coreEditorSelect ) {
			this._coreEditorSelect = select( "core/editor" );
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

		let generatedSlug = this.getPostAttribute( "generated_slug" ) || "";

		/**
		 * This should be removed when the following issue is resolved:
		 *
		 * https://github.com/WordPress/gutenberg/issues/8770
		 */
		if ( generatedSlug === "auto-draft" ) {
			generatedSlug = "";
		}

		// When no custom slug is provided we should use the generated_slug attribute.
		const slug = this.getPostAttribute( "slug" ) || generatedSlug;
		try {
			return decodeURI( slug );
		} catch ( e ) {
			return slug;
		}
	}

	/**
	 * Gets the base url from the permalink parts.
	 *
	 * @returns {string} The base url.
	 */
	getPostBaseUrl() {
		const permalinkParts = select( "core/editor" ).getPermalinkParts();
		if ( permalinkParts === null || ! permalinkParts?.prefix ) {
			// Fallback on the base url retrieved from the wpseoScriptData.
			return window.wpseoScriptData.metabox.base_url;
		}

		let baseUrl = permalinkParts.prefix;
		const isAutoDraft = select( "core/editor" ).isEditedPostNew();
		if ( isAutoDraft ) {
			// For post auto-drafts, the `baseUrl` includes the `?={ID}` that we do not want.
			try {
				const url = new URL( baseUrl );
				baseUrl = url.origin + url.pathname;
			} catch ( e ) {
				// Ignore this error.
			}
		}

		// Enforce ending with a slash because of the internal handling in the SnippetEditor component.
		if ( ! baseUrl.endsWith( "/" ) ) {
			baseUrl += "/";
		}

		return baseUrl;
	}

	/**
	 * Collects the data of a post from Gutenberg.
	 *
	 * @returns {{content: string, title: string, slug: string, excerpt: string, excerpt_only: string,
	 * 			snippetPreviewImageURL: string, contentImage: string, baseUrl: string}} The collected data.
	 */
	collectGutenbergData() {
		let content = select( "core/editor" ).getEditedPostContent();

		// Gutenberg applies the `autop` function under the hood to all Classic (core/freeform) blocks.
		// The most likely situation for these to appear in posts is through converting a post from Classic to Block editor.
		// We account for that below, but not for the (unlikely) case when a Classic block is added to a post consisting of other blocks.
		const blocks = select( "core/block-editor" ).getBlocks();
		if ( blocks.length === 1 && blocks[ 0 ].name === "core/freeform" ) {
			content = getBlockContent( blocks[ 0 ] );
		}

		const contentImage = this.calculateContentImage( content );
		const excerpt = this.getPostAttribute( "excerpt" ) || "";

		return {
			content,
			title: this.getPostAttribute( "title" ) || "",
			slug: this.getSlug(),
			excerpt: excerpt || excerptFromContent( content, getContentLocale() === "ja" ? 80 : 156 ),
			// eslint-disable-next-line camelcase
			excerpt_only: excerpt,
			snippetPreviewImageURL: this.getFeaturedImage() || contentImage,
			contentImage,
			baseUrl: this.getPostBaseUrl(),
		};
	}

	/**
	 * Gets the source URL for the featured image.
	 *
	 * @returns {null|string} The source URL.
	 */
	getFeaturedImage() {
		const featuredImage = this.getPostAttribute( "featured_media" );
		if ( featuredImage ) {
			const mediaObj = this.getMediaById( featuredImage );

			if ( mediaObj ) {
				return mediaObj.source_url;
			}
		}

		return null;
	}

	/**
	 * Returns the image from the content.
	 *
	 * @param {string} content The content.
	 *
	 * @returns {string} The first image found in the content.
	 */
	calculateContentImage( content ) {
		const images = languageProcessing.imageInText( content );

		if ( images.length === 0 ) {
			return "";
		}

		const imageElements = $.parseHTML( images.join( "" ) );

		for ( const imageElement of imageElements ) {
			if ( imageElement.src ) {
				return imageElement.src;
			}
		}

		return "";
	}

	/**
	 * Updates the redux store with the changed data.
	 *
	 * @param {Object} newData The changed data.
	 *
	 * @returns {void}
	 */
	handleEditorChange( newData ) {
		// Handle content change.
		if ( this._data.content !== newData.content ) {
			this._store.dispatch( setEditorDataContent( newData.content ) );
		}
		// Handle title change.
		if ( this._data.title !== newData.title ) {
			this._store.dispatch( setEditorDataTitle( newData.title ) );
			this._store.dispatch( updateReplacementVariable( "title", newData.title ) );
		}
		// Handle excerpt change.
		if ( this._data.excerpt !== newData.excerpt ) {
			this._store.dispatch( setEditorDataExcerpt( newData.excerpt ) );
			this._store.dispatch( updateReplacementVariable( "excerpt", newData.excerpt ) );
			this._store.dispatch( updateReplacementVariable( "excerpt_only", newData.excerpt_only ) );
		}
		// Handle slug change.
		if ( this._data.slug !== newData.slug ) {
			this._store.dispatch( setEditorDataSlug( newData.slug ) );
			this._store.dispatch( updateData( { slug: newData.slug } ) );
		}
		// Handle snippet preview image change.
		if ( this._data.snippetPreviewImageURL !== newData.snippetPreviewImageURL ) {
			this._store.dispatch( setEditorDataImageUrl( newData.snippetPreviewImageURL ) );
			this._store.dispatch( updateData( { snippetPreviewImageURL: newData.snippetPreviewImageURL } ) );
		}
		// Handle content image change.
		if ( this._data.contentImage !== newData.contentImage ) {
			this._store.dispatch( setContentImage( newData.contentImage ) );
		}
		// Handle base URL change.
		if ( this._data.baseUrl !== newData.baseUrl ) {
			this._store.dispatch( updateSettings( { baseUrl: newData.baseUrl } ) );
		}
	}

	/**
	 * If a marker is active, find the associated assessment result and applies the marker on that result.
	 *
	 * @returns {void}
	 */
	reapplyMarkers() {
		const {
			getActiveMarker,
			getMarkerPauseStatus,
		} = select( "yoast-seo/editor" );

		const activeMarker = getActiveMarker();
		const isMarkerPaused = getMarkerPauseStatus();

		if ( ! activeMarker || isMarkerPaused ) {
			return;
		}

		reapplyAnnotationsForSelectedBlock();
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
			this._data = gutenbergData;
			this._refresh();
		}
	}

	/**
	 * Checks whether new analysis results are available in the store.
	 *
	 * @returns {boolean} Whether new analysis results are available.
	 */
	areNewAnalysisResultsAvailable() {
		const yoastSeoEditorSelectors = select( "yoast-seo/editor" );
		const readabilityResults = yoastSeoEditorSelectors.getReadabilityResults();
		const seoResults = yoastSeoEditorSelectors.getResultsForFocusKeyword();

		if (
			this._previousReadabilityResults !== readabilityResults ||
			this._previousSeoResults !== seoResults
		) {
			this._previousReadabilityResults = readabilityResults;
			this._previousSeoResults = seoResults;
			return true;
		}

		return false;
	}

	/**
	 * Reapplies the markers when new analysis results are available.
	 *
	 * @returns {void}
	 */
	onNewAnalysisResultsAvailable() {
		this.reapplyMarkers();
	}

	/**
	 * Listens to the Gutenberg data.
	 *
	 * @returns {void}
	 */
	subscribeToGutenberg() {
		this.subscriber = debounce( this.refreshYoastSEO, 500 );
		subscribe( this.subscriber );
	}

	/**
	 * Listens to the analysis data.
	 *
	 * If the analysisData has changed this.onNewAnalysisResultsAvailable() is called.
	 *
	 * @returns {void}
	 */
	subscribeToYoastSEO() {
		this.yoastSubscriber = () => {
			if ( this.areNewAnalysisResultsAvailable() ) {
				this.onNewAnalysisResultsAvailable();
			}
		};
		subscribe( this.yoastSubscriber );
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
