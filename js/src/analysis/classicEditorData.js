/* global wpseoReplaceVarsL10n */
import debounce from "lodash/debounce";
import { updateReplacementVariable } from "../redux/actions/snippetEditor";
import fillReplacementValues from "../helpers/sendReplaceVarsToStore";
import removeMarks from "yoastseo/js/markers/removeMarks";
import tmceHelper, { tmceId } from "../wp-seo-tinymce";

/**
 * Represents the classic editor data.
 */
class ClassicEditorData {
	/**
	 * Sets the wp data, Yoast SEO refresh function and data object.
	 *
	 * @param {Function} refresh The YoastSEO refresh function.
	 * @param {Object} store     The YoastSEO Redux store.
	 * @returns {void}
	 */
	constructor( refresh, store ) {
		this._refresh = refresh;
		this.store = store;
		this.data = {};
		this.updateData = this.updateData.bind( this );
	}

	/**
	 * Initializes the class by filling (and managing) data.
	 *
	 * @param {Object} replaceVars The replacement variables passed in the wp-seo-post-scraper args.
	 *
	 * @returns {void}
	 */
	initialize( replaceVars ) {
		this.data = this.getInitialData( replaceVars );
		fillReplacementValues( this.data, this.store );
		this.subscribeToElements();
	}

	/**
	 * Gets the title from the document.
	 *
	 * @returns {string} The title or an empty string.
	 */
	getTitle() {
		let titleElement = document.getElementById( "title" );
		return titleElement && titleElement.value || "";
	}

	/**
	 * Gets the excerpt from the document
	 *
	 * @return {string} The excerpt or an empty string.
	 */
	getExcerpt() {
		let excerptElement = document.getElementById( "excerpt" );
		return excerptElement && excerptElement.value || "";
	}

	getSlug() {
		let slug = "";

		let newPostSlug = document.getElementById( "new-post-slug" );

		if ( newPostSlug ) {
			slug = newPostSlug.val();
		} else if ( document.getElementById( "editable-post-name-full" ) !== null ) {
			slug = document.getElementById( "editable-post-name-full" ).textContent;
		}

		return slug;
	}

	getContent() {
		return removeMarks( tmceHelper.getContentTinyMce( tmceId ) );
	}

	subscribeToElements() {
		this.subscribeToInputElement( "title", "title" );
		this.subscribeToInputElement( "excerpt", "excerpt" );
	}

	/**
	 * Subscribes to an element via its id, and sends the changes to redux.
	 *
	 * @param {string} elementId          The id of the element to subscribe to.
	 * @param {string} targetReplaceVar   The name of the replacevar the value should be sent to.
	 */
	subscribeToInputElement( elementId, targetReplaceVar ) {
		let element = document.getElementById( elementId );
		let debouncedUpdateData = debounce( this.updateData, 500 );
		element.addEventListener( "input", ( event ) => {
			debouncedUpdateData( event, targetReplaceVar );
		} );
	}

	updateData( event, targetReplaceVar ) {
		let replaceValue = event.target.value;
		this.data[ targetReplaceVar ] = replaceValue;
		this.store.dispatch( updateReplacementVariable( targetReplaceVar, replaceValue ) );
	}

	getInitialData( replaceVars ) {
		return {
			...replaceVars,
			title: this.getTitle(),
			excerpt: this.getExcerpt(),
			slug: this.getSlug(),
			content: this.getContent(),
		}
	}

	getData() {
		return this.data;
	}
}
module.exports = ClassicEditorData;
