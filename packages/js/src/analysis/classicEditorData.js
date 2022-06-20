/* global wp */
import { actions } from "@yoast/externals/redux";
import jQuery from "jquery";
import { debounce, isUndefined, isString } from "lodash";
import analysis from "yoastseo";
import { excerptFromContent, fillReplacementVariables, mapCustomFields, mapCustomTaxonomies } from "../helpers/replacementVariableHelpers";
import * as tmceHelper from "../lib/tinymce";
import getContentLocale from "./getContentLocale";

const { removeMarks } = analysis.markers;
const {
	updateReplacementVariable,
	updateData,
	hideReplacementVariables,
	setContentImage,
	setEditorDataContent,
	setEditorDataTitle,
	setEditorDataExcerpt,
	setEditorDataImageUrl,
	setEditorDataSlug,
} = actions;

/**
 * Represents the classic editor data.
 */
export default class ClassicEditorData {
	/**
	 * Sets the wp data, Yoast SEO refresh function and data object.
	 *
	 * @param {Function} refresh   The YoastSEO refresh function.
	 * @param {Object}   store     The YoastSEO Redux store.
	 * @param {string}   tinyMceId ID of the tinyMCE editor.
	 *
	 * @returns {void}
	 */
	constructor( refresh, store, tinyMceId = "content" ) {
		this._refresh = refresh;
		this._store = store;
		this._tinyMceId = tinyMceId;
		// This will be used for the comparison whether the data is dirty.
		this._previousData = {};
		this._previousEditorData = {};
		this.updateReplacementData = this.updateReplacementData.bind( this );
		this.refreshYoastSEO = this.refreshYoastSEO.bind( this );
	}

	/**
	 * Initializes the class by filling replacement variables and subscribing to relevant elements.
	 *
	 * @param {Object}   replaceVars The replacement variables passed in the wp-seo-post-scraper args.
	 * @param {string[]} hiddenReplaceVars The replacement variables passed in the wp-seo-post-scraper args.
	 *
	 * @returns {void}
	 */
	initialize( replaceVars, hiddenReplaceVars = [] ) {
		const initialData = this.getInitialData( replaceVars );
		fillReplacementVariables( initialData, this._store );
		this._store.dispatch( hideReplacementVariables( hiddenReplaceVars ) );

		// Propagate initial data.
		this._previousEditorData.content = initialData.content;
		this._store.dispatch( setEditorDataContent( initialData.content ) );
		this._previousEditorData.contentImage = initialData.contentImage;
		this._store.dispatch( setContentImage( initialData.contentImage ) );
		this.setImageInSnippetPreview( initialData.snippetPreviewImageURL || initialData.contentImage );
		this._previousEditorData.slug = initialData.slug;
		this._store.dispatch( setEditorDataSlug( initialData.slug ) );
		this.updateReplacementData( { target: { value: initialData.title } }, "title" );
		this.updateReplacementData( { target: { value: initialData.excerpt } }, "excerpt" );
		this.updateReplacementData( { target: { value: initialData.excerpt_only } }, "excerpt_only" );

		// Subscribe.
		this.subscribeToElements();
		this.subscribeToStore();
		this.subscribeToSnippetPreviewImage();
		this.subscribeToTinyMceEditor();
		this.subscribeToSlug();
	}

	/**
	 * Initializes tiny MCE "change" event listeners for the content and content image.
	 * @returns {void}
	 */
	subscribeToTinyMceEditor() {
		/**
		 * Handles changes.
		 * @param {string|Object} content The content or the event.
		 * @returns {void}
		 */
		const handleChange = ( content ) => {
			// Use the passed content if possible. Otherwise, get the content from tiny MCE.
			if ( ! isString( content ) ) {
				content = this.getContent();
			}

			if ( this._previousEditorData.content === content ) {
				return;
			}
			this._previousEditorData.content = content;
			this._store.dispatch( setEditorDataContent( content ) );

			if ( this.featuredImageIsSet ) {
				return;
			}
			const contentImage = this.getContentImage( content );
			if ( this._previousEditorData.contentImage === contentImage ) {
				return;
			}
			this._previousEditorData.contentImage = contentImage;
			this._store.dispatch( setContentImage( contentImage ) );
			this.setImageInSnippetPreview( contentImage );
		};

		// Once tinyMCE is initialized, add the listeners.
		jQuery( document ).on( "tinymce-editor-init", ( event, editor ) => {
			if ( editor.id !== this._tinyMceId ) {
				return;
			}

			// Update on init: on terms the initial content is empty.
			handleChange( this.getContent() );

			[ "input", "change", "cut", "paste" ].forEach( eventName => editor.on( eventName, debounce( handleChange, 1000 ) ) );
		} );

		// Attachment description field.
		const attachmentDescription = document.getElementById( "attachment_content" );
		if ( attachmentDescription ) {
			// Update on init: on attachments the initial content is empty.
			handleChange( attachmentDescription.value );
			attachmentDescription.addEventListener( "input", event => handleChange( event.target.value ) );
		}
	}

	/**
	 * Initializes slug event listeners.
	 * @returns {void}
	 */
	subscribeToSlug() {
		/**
		 * Updates the slug if changed.
		 * @param {string} slug The slug.
		 * @returns {void}
		 */
		const updateSlug = slug => {
			if ( this._previousEditorData.slug !== slug ) {
				this._previousEditorData.slug = slug;
				this._store.dispatch( setEditorDataSlug( slug ) );
				this._store.dispatch( updateData( { slug } ) );
			}
		};

		// Term slug field.
		const slugField = document.getElementById( "slug" );
		if ( slugField ) {
			slugField.addEventListener( "input", event => updateSlug( event.target.value ) );
		}

		// Posts' slug screen option field.
		const postNameField = document.getElementById( "post_name" );
		if ( postNameField ) {
			postNameField.addEventListener( "input", event => updateSlug( event.target.value ) );
		}

		// Edit slug via permalink buttons.
		const slugButtons = document.getElementById( "edit-slug-buttons" );
		if ( slugButtons ) {
			const observer = new MutationObserver( ( mutationList, currentObserver ) => mutationList.forEach( mutation => {
				mutation.addedNodes.forEach( node => {
					if ( ! node?.classList?.contains( "edit-slug" ) ) {
						return;
					}
					const slug = document.getElementById( "editable-post-name-full" )?.innerText;
					if ( slug ) {
						updateSlug( slug );

						// Need to re-subscribe for some reason.
						currentObserver.disconnect();
						this.subscribeToSlug();
					}
				} );
			} ) );
			observer.observe( slugButtons, { childList: true } );
		}
	}

	/**
	 * Initialize snippet preview image functionality.
	 *
	 * @returns {void}
	 */
	subscribeToSnippetPreviewImage() {
		if ( isUndefined( wp.media ) || isUndefined( wp.media.featuredImage ) ) {
			return;
		}

		jQuery( "#postimagediv" ).on( "click", "#remove-post-thumbnail", () => {
			this.featuredImageIsSet = false;

			this.setImageInSnippetPreview( this.getContentImage( this.getContent() ) );
		} );

		const featuredImage = wp.media.featuredImage.frame();

		featuredImage.on( "select", () => {
			const newUrl = featuredImage.state().get( "selection" ).first().attributes.url;

			if ( ! newUrl ) {
				return;
			}

			this.featuredImageIsSet = true;
			this.setImageInSnippetPreview( newUrl );
		} );

		tmceHelper.addEventHandler( this._tinyMceId, [ "init" ], () => {
			const contentImage = this.getContentImage( this.getContent() );
			const url = this.getFeaturedImage() || contentImage || "";

			// Set contentImage in settings.socialPreviews.
			this._store.dispatch( setContentImage( contentImage ) );
			this.setImageInSnippetPreview( url );
		} );
	}

	/**
	 * Gets the featured image source from the DOM.
	 *
	 * @returns {string|null} The url to the featured image.
	 */
	getFeaturedImage() {
		const postThumbnail = jQuery( "#set-post-thumbnail img" ).attr( "src" );

		if ( postThumbnail ) {
			this.featuredImageIsSet = true;

			return postThumbnail;
		}

		this.featuredImageIsSet = false;

		return null;
	}

	/**
	 * Set the featured image for the snippet preview.
	 *
	 * @param {string} url The image URL.
	 *
	 * @returns {void}
	 */
	setImageInSnippetPreview( url ) {
		this._store.dispatch( setEditorDataImageUrl( url ) );
		this._store.dispatch( updateData( { snippetPreviewImageURL: url } ) );
	}

	/**
	 * Returns the image from the content.
	 * @param {string} content The content.
	 * @returns {string} The first image found in the content.
	 */
	getContentImage( content ) {
		if ( this.featuredImageIsSet ) {
			return "";
		}

		const images = analysis.languageProcessing.imageInText( content );
		let image = "";

		if ( images.length === 0 ) {
			return image;
		}

		do {
			let currentImage = images.shift();
			currentImage = jQuery( currentImage );

			const imageSource = currentImage.prop( "src" );

			if ( imageSource ) {
				image = imageSource;
			}
		} while ( "" === image && images.length > 0 );

		return image;
	}

	/**
	 * Gets the title from the document.
	 *
	 * @returns {string} The title or an empty string.
	 */
	getTitle() {
		const titleElement = document.getElementById( "title" ) || document.getElementById( "name" );
		return titleElement && titleElement.value || "";
	}

	/**
	 * Gets the excerpt from the document.
	 *
	 * @param {boolean} useFallBack Whether the fallback for content should be used.
	 *
	 * @returns {string} The excerpt.
	 */
	getExcerpt( useFallBack = true ) {
		const excerptElement = document.getElementById( "excerpt" );
		const excerptValue = excerptElement && excerptElement.value || "";
		const limit = ( getContentLocale() === "ja" ) ? 80 : 156;

		if ( excerptValue !== "" || useFallBack === false ) {
			return excerptValue;
		}

		return excerptFromContent( this.getContent(), limit );
	}

	/**
	 * Gets the slug from the document.
	 *
	 * @returns {string} The slug or an empty string.
	 */
	getSlug() {
		let slug = "";

		const newPostSlug = document.getElementById( "new-post-slug" ) || document.getElementById( "slug" );

		if ( newPostSlug ) {
			slug = newPostSlug.value;
		} else if ( document.getElementById( "editable-post-name-full" ) !== null ) {
			slug = document.getElementById( "editable-post-name-full" ).textContent;
		}

		return slug;
	}

	/**
	 * Gets the content of the document after removing marks.
	 *
	 * @returns {string} The content of the document.
	 */
	getContent() {
		return removeMarks( tmceHelper.getContentTinyMce( this._tinyMceId ) );
	}

	/**
	 * Subscribes to input elements.
	 *
	 * @returns {void}
	 */
	subscribeToElements() {
		this.subscribeToInputElement( "title", "title" );
		this.subscribeToInputElement( "excerpt", "excerpt" );
		this.subscribeToInputElement( "excerpt", "excerpt_only" );
	}

	/**
	 * Subscribes to an element via its id, and sets a callback.
	 *
	 * @param {string}  elementId       The id of the element to subscribe to.
	 * @param {string}  targetField     The name of the field the value should be sent to.
	 *
	 * @returns {void}
	 */
	subscribeToInputElement( elementId, targetField ) {
		const element = document.getElementById( elementId );

		/*
		 * On terms some elements don't exist in the DOM, such as the title element.
		 * We return early if the element was not found.
		 */
		if ( ! element ) {
			return;
		}

		element.addEventListener( "input", ( event ) => {
			this.updateReplacementData( event, targetField );
		} );
	}

	/**
	 * Sets the event target value in the data and dispatches to the store.
	 *
	 * @param {Object} event            An event object.
	 * @param {string} targetReplaceVar The replacevar the event's value belongs to.
	 *
	 * @returns {void}
	 */
	updateReplacementData( event, targetReplaceVar ) {
		let replaceValue = event.target.value;

		if ( targetReplaceVar === "excerpt" && replaceValue === "" ) {
			replaceValue = this.getExcerpt();
		}

		if ( this._previousEditorData[ targetReplaceVar ] === replaceValue ) {
			return;
		}
		this._previousEditorData[ targetReplaceVar ] = replaceValue;
		switch ( targetReplaceVar ) {
			case "title":
				this._store.dispatch( setEditorDataTitle( replaceValue ) );
				break;
			case "excerpt":
				this._store.dispatch( setEditorDataExcerpt( replaceValue ) );
				break;
		}
		this._store.dispatch( updateReplacementVariable( targetReplaceVar, replaceValue ) );
	}

	/**
	 * Checks whether the current data and the data from the updated state are the same.
	 *
	 * @param {Object} currentData The current data.
	 * @param {Object} newData     The data from the updated state.
	 * @returns {boolean}          Whether the current data and the newData is the same.
	 */
	isShallowEqual( currentData, newData ) {
		if ( Object.keys( currentData ).length !== Object.keys( newData ).length ) {
			return false;
		}

		for ( const dataPoint in currentData ) {
			if ( currentData.hasOwnProperty( dataPoint ) ) {
				if ( ! ( dataPoint in newData ) || currentData[ dataPoint ] !== newData[ dataPoint ] ) {
					return false;
				}
			}
		}
		return true;
	}

	/**
	 * Refreshes YoastSEO's app when the data is dirty.
	 *
	 * @returns {void}
	 */
	refreshYoastSEO() {
		const newData = this.getData();

		// Set isDirty to true if the current data and editor data are unequal.
		const isDirty = ! this.isShallowEqual( this._previousData, newData );

		if ( isDirty ) {
			this.handleEditorChange( newData );
			this._previousData = newData;
			if ( window.YoastSEO && window.YoastSEO.app ) {
				window.YoastSEO.app.refresh();
			}
		}
	}

	/**
	 * Updates the redux store with the changed data.
	 *
	 * @param {Object} newData The changed data.
	 *
	 * @returns {void}
	 */
	handleEditorChange( newData ) {
		// Handle excerpt change
		if ( this._previousData.excerpt !== newData.excerpt ) {
			this._store.dispatch( updateReplacementVariable( "excerpt", newData.excerpt ) );
			this._store.dispatch( updateReplacementVariable( "excerpt_only", newData.excerpt_only ) );
		}
		// Handle image change.
		if ( this._previousData.snippetPreviewImageURL !== newData.snippetPreviewImageURL ) {
			this.setImageInSnippetPreview( newData.snippetPreviewImageURL );
		}
		// Handle slug change.
		if ( this._previousData.slug !== newData.slug ) {
			this._store.dispatch( setEditorDataSlug( newData.slug ) );
		}
	}

	/**
	 * Listens to the store.
	 *
	 * @returns {void}
	 */
	subscribeToStore() {
		this.subscriber = debounce( this.refreshYoastSEO, 500 );
		this._store.subscribe( this.subscriber );
	}

	/**
	 * Gets the initial data from the replacevars and document.
	 *
	 * @param {Object} replaceVars The replaceVars object.
	 *
	 * @returns {Object} The data.
	 */
	getInitialData( replaceVars ) {
		replaceVars = mapCustomFields( replaceVars, this._store );
		replaceVars = mapCustomTaxonomies( replaceVars, this._store );

		const content = this.getContent();
		const snippetPreviewImageURL = this.getFeaturedImage();

		return {
			...replaceVars,
			title: this.getTitle(),
			excerpt: this.getExcerpt(),
			// eslint-disable-next-line
			excerpt_only: this.getExcerpt( false ),
			slug: this.getSlug(),
			content,
			snippetPreviewImageURL,
			contentImage: this.getContentImage( content ),
		};
	}

	/**
	 * Add the latest content to the data object, and return the data object.
	 *
	 * @returns {Object} The data.
	 */
	getData() {
		return {
			...this._store.getState().snippetEditor.data,
			content: this.getContent(),
			excerpt: this.getExcerpt(),
			// eslint-disable-next-line
			excerpt_only: this.getExcerpt( false ),
		};
	}
}
