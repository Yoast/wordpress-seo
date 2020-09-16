/* global elementor */
import { select, subscribe } from "@wordpress/data";
import { debounce } from "lodash-es";
import { string } from "yoastseo";
import { reapplyAnnotationsForSelectedBlock } from "../decorator/gutenberg";
import { excerptFromContent, fillReplacementVariables, mapCustomFields, mapCustomTaxonomies } from "../helpers/replacementVariableHelpers";
import { setContentImage } from "../redux/actions/settings";

import { updateData, updateReplacementVariable } from "../redux/actions/snippetEditor";

/**
 * Represents the data.
 */
export default class ElementorEditorData {
	/**
	 * Sets the wp data, Yoast SEO refresh function and data object.
	 *
	 * @param {Function} refresh The YoastSEO refresh function.
	 * @param {Object} store The YoastSEO Redux store.
	 *
	 * @returns {void}
	 */
	constructor( refresh, store ) {
		this._refresh = refresh;
		this._store = store;
		this._data = {};

		this.refreshYoastSEO = this.refreshYoastSEO.bind( this );
		this.getData = this.getData.bind( this );
		this.sendFormData = this.sendFormData.bind( this );

		// Methods to be able to pass as DataCollector.
		this.saveScores = () => {};
		this.getSnippetTitle = () => document.getElementById( "yoast_wpseo_title" ) && document.getElementById( "yoast_wpseo_title" ).value || "";
		this.getSnippetCite = () => wpseoScriptData.metabox.slug;
		this.getSnippetMeta = () => document.getElementById( "yoast_wpseo_metadesc" ) && document.getElementById( "yoast_wpseo_metadesc" ).value || "";
	}

	/**
	 * Initializes this data instance.
	 *
	 * @param {Object} replaceVars The replacevars.
	 *
	 * @returns {void}
	 */
	initialize( replaceVars ) {
		// Fill data object on page load.
		this._data = this.getInitialData( replaceVars );
		fillReplacementVariables( this._data, this._store );
		this.initializeForm();
		this.subscribeToElementor();
		// this.subscribeToYoastSEO();
	}

	initializeForm() {
		if ( ! this._form ) {
			this._form = document.getElementById( "yoast-form" );
			if ( ! this._form ) {
				console.warn( "Error finding the Yoast form." );
				return;
			}
		}

		// Not sure if we need this, we can just call sendFormData directly.
		this._form.addEventListener( "submit", ( event ) => {
			event.preventDefault();
			this.sendFormData();
		} );
	}

	/**
	 * Retrieves the initial data.
	 *
	 * @param {Object} replaceVars The replacevars.
	 *
	 * @returns {Object} The initial data.
	 */
	getInitialData( replaceVars ) {
		const data = this.collectData();

		// Custom_fields and custom_taxonomies are objects instead of strings, which causes console errors.
		replaceVars = mapCustomFields( replaceVars, this._store );
		replaceVars = mapCustomTaxonomies( replaceVars, this._store );

		return {
			...replaceVars,
			...data,
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
	 * Get the post's slug.
	 *
	 * @returns {string} The post's slug.
	 */
	getSlug() {
		if ( ! this._yoastEditorSelect ) {
			this._yoastEditorSelect = select( "yoast-seo/editor" );
		}

		return this._yoastEditorSelect.getSlug();
	}

	/**
	 * Collects the content, title, slug and excerpt of a post.
	 *
	 * @returns {{content: string, title: string, slug: string, excerpt: string}} The content, title, slug and excerpt.
	 */
	collectData() {
		const content = this.getContent();

		return {
			content,
			title: this.getTitle(),
			slug: this.getSlug(),
			excerpt: this.getExcerpt( true, content ),
			// eslint-disable-next-line camelcase
			excerpt_only: this.getExcerpt( false, content ),
			snippetPreviewImageURL: this.getFeaturedImage() || this.getContentImage( content ),
			contentImage: this.getContentImage( content ),
		};
	}

	/**
	 * Gets the post title.
	 *
	 * @returns {string} The post's title.
	 */
	getTitle() {
		return elementor.settings.page.model.get( "post_title" );
	}

	/**
	 * Gets the post content.
	 *
	 * @returns {string} The post's content.
	 */
	getContent() {
		if ( ! this._contentArea || this._contentArea.length === 0 ) {
			this._contentArea = elementor.$preview.contents().find( "[data-elementor-type]" );
		}

		const content = [];
		this._contentArea.find( ".elementor-widget-container" ).each( ( index, element ) => {
			content.push( element.innerHTML.trim() );
		} );

		return content.join( "" );
	}

	/**
	 * Gets the source URL for the featured image.
	 *
	 * @returns {null|string} The source URL.
	 */
	getFeaturedImage() {
		const featuredImage = elementor.settings.page.model.get( "post_featured_image" );
		if ( ! ( featuredImage && featuredImage.url && featuredImage.id ) ) {
			return "";
		}

		if ( featuredImage.url !== "" ) {
			return featuredImage.url;
		}
		if ( featuredImage.id === 0 ) {
			return null;
		}

		const mediaObj = this.getMediaById( featuredImage.id );
		if ( mediaObj ) {
			return mediaObj.source_url;
		}

		return null;
	}

	/**
	 * Returns the image from the content.
	 *
	 * @returns {string} The first image found in the content.
	 */
	getContentImage( content ) {
		const images = string.imageInText( content );
		let image = "";

		if ( images.length === 0 ) {
			return "";
		}

		do {
			const currentImage = jQuery( images.shift() );
			const imageSource = currentImage.prop( "src" );

			if ( imageSource ) {
				image = imageSource;
			}
		} while ( image === "" && images.length > 0 );

		return image;
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
		// Handle snippet preview image change.
		if ( this._data.snippetPreviewImageURL !== newData.snippetPreviewImageURL ) {
			this._store.dispatch( updateData( { snippetPreviewImageURL: newData.snippetPreviewImageURL } ) );
		}

		// Handle content image change.
		if ( this._data.contentImage !== newData.contentImage ) {
			this._store.dispatch( setContentImage( newData.contentImage ) );
		}
	}

	/**
	 * Gets the excerpt from the post.
	 *
	 * @param {boolean} useFallBack Whether the fallback for content should be used.
	 * @param {string} content The post content.
	 *
	 * @returns {string} The excerpt.
	 */
	getExcerpt( useFallBack = true, content = "" ) {
		const excerpt = elementor.settings.page.model.get( "post_excerpt" );
		if ( excerpt !== "" || useFallBack === false ) {
			return excerpt;
		}

		return excerptFromContent( content );
	}

	/**
	 * If a marker is active, find the associated assessment result and applies the marker on that result.
	 *
	 * @returns {void}
	 */
	reapplyMarkers() {
		if ( ! this._yoastEditorSelect ) {
			this._yoastEditorSelect = select( "yoast-seo/editor" );
		}

		const {
			getActiveMarker,
			getMarkerPauseStatus,
		} = this._yoastEditorSelect;

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
		const data = this.collectData();

		// Set isDirty to true if the current data and Gutenberg data are unequal.
		const isDirty = ! this.isShallowEqual( this._data, data );

		if ( isDirty ) {
			this.handleEditorChange( data );
			this._data = data;
			this._refresh();
		}
	}

	/**
	 * Checks whether new analysis results are available in the store.
	 *
	 * @returns {boolean} Whether new analysis results are available.
	 */
	areNewAnalysisResultsAvailable() {
		if ( ! this._yoastEditorSelect ) {
			this._yoastEditorSelect = select( "yoast-seo/editor" );
		}

		const readabilityResults = this._yoastEditorSelect.getReadabilityResults();
		const seoResults         = this._yoastEditorSelect.getResultsForFocusKeyword();

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
	 * Listens to the elementor data.
	 *
	 * @returns {void}
	 */
	subscribeToElementor() {
		this.subscriber = debounce( this.refreshYoastSEO, 500 );
		elementor.channels.editor.on( "status:change", this.subscriber );
		elementor.saver.on( "before:save", this.sendFormData );
	}

	sendFormData() {
		const data = jQuery( this._form ).serializeArray().reduce( ( result, { name, value } ) => {
			result[ name ] = value;

			return result;
		}, {} );
		jQuery.post( this._form.getAttribute( "action" ), data );
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

	/**
	 * When the snippet is updated, update the (hidden) fields on the page.
	 *
	 * @param {Object} value The value to set.
	 * @param {String} type  The type to set the value for.
	 *
	 * @returns {void}
	 */
	setDataFromSnippet( value, type ) {
		switch ( type ) {
			case "snippet_meta":
				document.getElementById( "yoast_wpseo_metadesc" ).value = value;
				break;
			case "snippet_cite":

				/*
				 * WordPress leaves the post name empty to signify that it should be generated from the title once the
				 * post is saved. So when we receive an auto generated slug from WordPress we should be
				 * able to not save this to the UI. This conditional makes that possible.
				 */
				if ( this.leavePostNameUntouched ) {
					this.leavePostNameUntouched = false;
					return;
				}
				if ( document.getElementById( "post_name" ) !== null ) {
					document.getElementById( "post_name" ).value = value;
				}
				if (
					document.getElementById( "editable-post-name" ) !== null &&
					document.getElementById( "editable-post-name-full" ) !== null ) {
					document.getElementById( "editable-post-name" ).textContent = value;
					document.getElementById( "editable-post-name-full" ).textContent = value;
				}
				break;
			case "snippet_title":
				document.getElementById( "yoast_wpseo_title" ).value = value;
				break;
			default:
				break;
		}
	}
}
